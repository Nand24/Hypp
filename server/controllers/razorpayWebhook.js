import crypto from "crypto";
import { inngest } from "../inngest/index.js";
import Transaction from "../models/Transaction.js";
import Listing from "../models/Listing.js";
import User from "../models/User.js";

export const razorpayWebhook = async (request, response) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const signature = request.headers["x-razorpay-signature"];

        if (webhookSecret) {
            const expectedSignature = crypto
                .createHmac("sha256", webhookSecret)
                .update(request.body)
                .digest("hex");

            if (expectedSignature !== signature) {
                return response.status(400).send("Invalid Webhook Signature");
            }
        }

        // Parse raw body string or JSON payload
        const payload = typeof request.body === "string" ? JSON.parse(request.body) : request.body;
        const { event, payload: eventPayload } = payload;

        if (event === "payment.captured" || event === "order.paid") {
            const paymentEntity = eventPayload?.payment?.entity || eventPayload?.order?.entity;
            const notes = paymentEntity?.notes || {};
            const transactionId = notes.transactionId;

            if (transactionId) {
                const transaction = await Transaction.findOneAndUpdate(
                    { id: transactionId },
                    { isPaid: true },
                    { new: true }
                ).lean();

                if (transaction) {
                    // Trigger Inngest background function to email credentials
                    await inngest.send({ name: "app/purchase", data: { transaction } });

                    // Mark listing as sold
                    await Listing.findOneAndUpdate({ id: transaction.listingId }, { status: "sold" });

                    // Add earned amount to seller balance
                    await User.findOneAndUpdate({ id: transaction.ownerId }, { $inc: { earned: transaction.amount } });
                }
            }
        }

        return response.json({ status: "ok" });
    } catch (err) {
        console.error("Razorpay webhook error:", err);
        return response.status(500).send("Internal Server Error");
    }
};
