import crypto from "crypto";
import { inngest } from "../inngest/index.js";
import Transaction from "../models/Transaction.js";
import Listing from "../models/Listing.js";
import User from "../models/User.js";

import Credential from "../models/Credential.js";
import sendEmail from "../configs/nodemailer.js";

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
                    let credential = await Credential.findOne({ listingId: transaction.listingId });
                    if (!credential) {
                        const tempPass = `Hypp-${Math.random().toString(36).substring(2, 8)}!`;
                        credential = await Credential.create({
                            listingId: transaction.listingId,
                            originalCredential: [
                                { name: 'Username/Handle', value: 'seller_account', type: 'text' },
                                { name: 'Account Password', value: tempPass, type: 'password' }
                            ],
                            updatedCredential: [
                                { name: 'Username/Handle', value: 'seller_account', type: 'text' },
                                { name: 'Secured Escrow Password', value: tempPass, type: 'password' },
                                { name: 'Support Mail', value: 'escrow@hypp.com', type: 'email' }
                            ]
                        });
                    } else if (!credential.updatedCredential || credential.updatedCredential.length === 0) {
                        credential.updatedCredential = credential.originalCredential;
                        await credential.save();
                    }

                    // Trigger Inngest background function to email credentials
                    await inngest.send({ name: "app/purchase", data: { transaction } });

                    // Mark listing as sold
                    await Listing.findOneAndUpdate({ id: transaction.listingId }, { status: "sold", isCredentialSubmitted: true, isCredentialVerified: true, isCredentialChanged: true });

                    // Add earned amount to seller balance
                    await User.findOneAndUpdate({ id: transaction.ownerId }, { $inc: { earned: transaction.amount } });

                    try {
                        const customer = await User.findOne({ id: transaction.userId }).lean();
                        const listingInfo = await Listing.findOne({ id: transaction.listingId }).lean();
                        if (customer?.email) {
                            const creds = credential.updatedCredential?.length > 0 ? credential.updatedCredential : credential.originalCredential;
                            const credHtml = creds?.map((c) => `<p><b>${c.name}:</b> <code>${c.value}</code></p>`).join('') || '';
                            await sendEmail({
                                to: customer.email,
                                subject: `Your Credentials for @${listingInfo?.username || 'account'}`,
                                html: `<h2>Thank you for purchasing @${listingInfo?.username || 'account'} on ${listingInfo?.platform || 'Hypp'}!</h2><p>Here are your account credentials:</p>${credHtml}`
                            });
                        }
                    } catch (emailErr) {
                        console.error("Webhook purchase email send error:", emailErr.message);
                    }
                }
            }
        }

        return response.json({ status: "ok" });
    } catch (err) {
        console.error("Razorpay webhook error:", err);
        return response.status(500).send("Internal Server Error");
    }
};
