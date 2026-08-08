import stripe from "stripe";
import { inngest } from "../inngest/index.js";

import Transaction from "../models/Transaction.js";
import Listing from "../models/Listing.js";
import User from "../models/User.js";

export const stripeWebhook = async (request, response) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                const sessionList = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                });

                const session = sessionList.data[0];
                const { transactionId, appId } = session.metadata;

                if (appId === "social-profile-marketplace" && transactionId) {
                    const transaction = await Transaction.findOneAndUpdate({ id: transactionId }, { isPaid: true }, { new: true }).lean();

                    // Send New Credentials to the purchaser using the email address
                    await inngest.send({ name: "app/purchase", data: { transaction } });

                    // Mark the listing as sold
                    await Listing.findOneAndUpdate({ id: transaction.listingId }, { status: "sold" });

                    // Add the amount to the user's earned balance
                    await User.findOneAndUpdate({ id: transaction.ownerId }, { $inc: { earned: transaction.amount } });
                }

                break;
            }

            default:
                console.log("Unhandled event type:", event.type);
        }
        response.json({ received: true });
    } catch (err) {
        console.error("Webhook processing error:", err);
        response.status(500).send("Internal Server Error");
    }
};
