import crypto from "crypto";
import imagekit from "../configs/imagekit.js";
import Razorpay from "razorpay";
import { inngest } from "../inngest/index.js";
import sendEmail from "../configs/nodemailer.js";
import { clerkClient } from "@clerk/express";

import Listing from "../models/Listing.js";
import User from "../models/User.js";
import Credential from "../models/Credential.js";
import Transaction from "../models/Transaction.js";
import Withdrawal from "../models/Withdrawal.js";
import { verifyAccountMetrics } from "../utils/accountVerifier.js";

// Controller For Adding Listing to Database
export const addListing = async (req, res) => {
    try {
        const { userId } = await req.auth();

        if (req.plan !== "premium") {
            const listingCount = await Listing.countDocuments({ ownerId: userId });
            if (listingCount >= 5) {
                return res.status(400).json({ message: "you have reached the free listing limit" });
            }
        }

        const accountDetails = JSON.parse(req.body.accountDetails);

        accountDetails.followers_count = parseFloat(accountDetails.followers_count);
        accountDetails.engagement_rate = parseFloat(accountDetails.engagement_rate);
        accountDetails.monthly_views = parseFloat(accountDetails.monthly_views);
        accountDetails.price = parseFloat(accountDetails.price);
        accountDetails.platform = accountDetails.platform.toLowerCase();
        accountDetails.niche = accountDetails.niche.toLowerCase();

        accountDetails.username.startsWith("@") ? accountDetails.username = accountDetails.username.slice(1) : null;

        const uploadImages = req.files.map(async (file) => {
            const imgBuffer = fs.createReadStream(file.path);

            const response = await imagekit.files.upload({
                file: imgBuffer,
                fileName: `${Date.now()}.png`,
                folder: "social-marketplace",
                transformation: { pre: "w-1280,h-auto" },
            });

            return response.url;
        });

        // Wait for all uploads to complete
        const images = await Promise.all(uploadImages);

        const listing = await Listing.create({
            ownerId: userId,
            images,
            ...accountDetails,
        });

        return res.status(201).json({ message: "Account Listed successfully", listing });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

const demoListingsSeed = [
    {
        id: "listing_demo_1",
        ownerId: "user_demo_1",
        title: "Tech YouTube Channel with 120k Subscribers",
        platform: "youtube",
        username: "TechSavvyAlex",
        followers_count: 120000,
        engagement_rate: 4.8,
        monthly_views: 850000,
        niche: "tech",
        price: 7500,
        description: "Established tech review channel with high organic engagement, active Partner Program, and steady monthly AdSense revenue.",
        verified: true,
        monetized: true,
        country: "USA",
        age_range: "18-34",
        status: "active",
        featured: true,
        images: [
            "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&auto=format&fit=crop"
        ],
        platformAssured: true,
        isCredentialSubmitted: true,
        isCredentialVerified: true,
        isCredentialChanged: true
    },
    {
        id: "listing_demo_2",
        ownerId: "user_demo_2",
        title: "Travel Instagram Page with 50k Followers",
        platform: "instagram",
        username: "wanderlust.sophia",
        followers_count: 50000,
        engagement_rate: 3.5,
        monthly_views: 210000,
        niche: "travel",
        price: 2800,
        description: "Beautifully curated travel page with a highly active audience in North America and Western Europe. Great brand sponsor potential.",
        verified: true,
        monetized: false,
        country: "Canada",
        age_range: "25-44",
        status: "active",
        featured: true,
        images: [
            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop"
        ],
        platformAssured: true,
        isCredentialSubmitted: true,
        isCredentialVerified: true,
        isCredentialChanged: true
    },
    {
        id: "listing_demo_3",
        ownerId: "user_demo_3",
        title: "Fitness TikTok Account with 300k Followers",
        platform: "tiktok",
        username: "fitwithdavid",
        followers_count: 300000,
        engagement_rate: 5.2,
        monthly_views: 2500000,
        niche: "fitness",
        price: 11500,
        description: "Viral workout & nutrition TikTok with massive reach. Creator Fund enabled with recurring brand sponsorship inquiries.",
        verified: true,
        monetized: true,
        country: "UK",
        age_range: "18-34",
        status: "active",
        featured: true,
        images: [
            "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop"
        ],
        platformAssured: true,
        isCredentialSubmitted: true,
        isCredentialVerified: true,
        isCredentialChanged: true
    },
    {
        id: "listing_demo_4",
        ownerId: "user_demo_1",
        title: "Fashion Pinterest Board with 90k Monthly Impressions",
        platform: "pinterest",
        username: "stylebyalex",
        followers_count: 18500,
        engagement_rate: 4.1,
        monthly_views: 90000,
        niche: "fashion",
        price: 1250,
        description: "Highly active fashion and outfit inspiration Pinterest account with high outbound click-through rates for affiliate marketing.",
        verified: false,
        monetized: false,
        country: "USA",
        age_range: "25-54",
        status: "active",
        featured: false,
        images: [
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop"
        ],
        platformAssured: false,
        isCredentialSubmitted: true,
        isCredentialVerified: true,
        isCredentialChanged: true
    },
    {
        id: "listing_demo_5",
        ownerId: "user_demo_2",
        title: "Crypto & Finance Twitter (X) Account with 45k Followers",
        platform: "twitter",
        username: "cryptovision",
        followers_count: 45000,
        engagement_rate: 4.5,
        monthly_views: 1200000,
        niche: "finance",
        price: 3600,
        description: "Engaged Web3 and financial market discussion account. Verified Gold Checkmark badge eligible with active audience.",
        verified: true,
        monetized: true,
        country: "USA",
        age_range: "25-44",
        status: "active",
        featured: false,
        images: [
            "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&auto=format&fit=crop"
        ],
        platformAssured: true,
        isCredentialSubmitted: true,
        isCredentialVerified: true,
        isCredentialChanged: true
    }
];

// Controller For Getting All Public Listing
export const getAllPublicListing = async (req, res) => {
    try {
        let listings = await Listing.find({ status: "active" }).sort({ createdAt: -1 }).lean();

        if (!listings || listings.length === 0) {
            try {
                await Listing.insertMany(demoListingsSeed);
                listings = await Listing.find({ status: "active" }).sort({ createdAt: -1 }).lean();
            } catch (seedErr) {
                console.log("Auto seed error:", seedErr);
            }
        }

        // attach owner details
        const ownerIds = [...new Set(listings.map((l) => l.ownerId))];
        const owners = await User.find({ id: { $in: ownerIds } }).select("id email name image").lean();
        const ownerMap = Object.fromEntries(owners.map((o) => [o.id, o]));
        const listingsWithOwner = listings.map((l) => ({
            ...l,
            owner: ownerMap[l.ownerId] || { name: "Verified Seller", email: "seller@hypp.com", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop" }
        }));

        return res.json({ listings: listingsWithOwner });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

// Controller For Getting All User Listing
export const getAllUserListing = async (req, res) => {
    try {
        const { userId } = await req.auth();

        // get all listings except deleted
        const listings = await Listing.find({ ownerId: userId, status: { $ne: "deleted" } }).sort({ createdAt: -1 }).lean();

        const user = await User.findOne({ id: userId }).lean();

        const balance = {
            earned: user?.earned || 0,
            withdrawn: user?.withdrawn || 0,
            available: (user?.earned || 0) - (user?.withdrawn || 0),
        };

        if (!listings || listings.length === 0) {
            return res.json({ listings: [], balance });
        }

        return res.json({ listings, balance });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

// Controller For Updating Listing in Database
export const updateListing = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const accountDetails = JSON.parse(req.body.accountDetails);

        if (req.files.length + accountDetails.images.length > 5) {
            return res.status(400).json({ message: "You can only upload up to 5 images" });
        }

        accountDetails.followers_count = parseFloat(accountDetails.followers_count);
        accountDetails.engagement_rate = parseFloat(accountDetails.engagement_rate);
        accountDetails.monthly_views = parseFloat(accountDetails.monthly_views);
        accountDetails.price = parseFloat(accountDetails.price);
        accountDetails.platform = accountDetails.platform.toLowerCase();
        accountDetails.niche = accountDetails.niche.toLowerCase();

        accountDetails.username.startsWith("@") ? accountDetails.username = accountDetails.username.slice(1) : null;

        const listing = await Listing.findOneAndUpdate({ id: accountDetails.id, ownerId: userId }, accountDetails, { new: true });

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        if (listing.status === "sold") {
            return res.status(400).json({ message: "you can't update sold listing" });
        }

        if (req.files.length > 0) {
            const uploadImages = req.files.map(async (file) => {
                const imgBuffer = fs.createReadStream(file.path);
                const response = await imagekit.files.upload({
                    file: imgBuffer,
                    fileName: `${Date.now()}.png`,
                    folder: "social-marketplace",
                    transformation: { pre: "w-1280,h-auto" },
                });
                return response.url;
            });

            // Wait for all uploads to complete
            const images = await Promise.all(uploadImages);

            const listing = await Listing.findOneAndUpdate(
                { id: accountDetails.id, ownerId: userId },
                {
                    ownerId: userId,
                    ...accountDetails,
                    images: [...accountDetails.images, ...images],
                },
                { new: true }
            );

            return res.json({ message: "Account Updated successfully", listing });
        }

        return res.json({ message: "Account Updated successfully", listing });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

export const toggleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = await req.auth();

        const listing = await Listing.findOne({ id, ownerId: userId });

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        if (listing.status === "active" || listing.status === "inactive") {
            await Listing.findOneAndUpdate({ id, ownerId: userId }, { status: listing.status === "active" ? "inactive" : "active" });
        } else if (listing.status === "ban") {
            return res.status(400).json({ message: "Your listing is banned" });
        } else if (listing.status === "sold") {
            return res.status(400).json({ message: "Your listing is sold" });
        }

        return res.json({ message: "Listing status updated successfully", listing });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

// Controller For Deleting Listing
export const deleteUserListing = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { listingId } = req.params;

        const listing = await Listing.findOne({ id: listingId, ownerId: userId }).lean();

        if (listing) {
            const owner = await User.findOne({ id: listing.ownerId }).lean();
            listing.owner = owner || null;
        }

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        if (listing.status === "sold") {
            return res.status(400).json({ message: "sold listing can't be deleted" });
        }

        // If password has been changed, send the new password to the owner
        if (listing.isCredentialChanged) {
            await inngest.send({
                name: "app/listing-deleted",
                data: { listing, listingId },
            });
        }

        await Listing.findOneAndUpdate({ id: listingId }, { status: "deleted" });

        return res.json({ message: "Listing deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

export const addCredential = async (req, res) => {
    try {
        const { userId } = await req.auth();

        const { listingId, credential } = req.body;

        if (!credential || credential.length === 0 || !listingId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const listing = await Listing.findOne({ id: listingId, ownerId: userId });

        if (!listing) {
            return res.status(404).json({ message: "Listing not found or you are not the owner" });
        }

        let existingCred = await Credential.findOne({ listingId });
        if (existingCred) {
            existingCred.originalCredential = credential;
            existingCred.updatedCredential = credential;
            await existingCred.save();
        } else {
            await Credential.create({ listingId, originalCredential: credential, updatedCredential: credential });
        }

        await Listing.findOneAndUpdate({ id: listingId }, { isCredentialSubmitted: true });

        // Check if there is a pending transaction waiting for credentials
        const pendingTransaction = await Transaction.findOne({ listingId, isPaid: true, escrowStatus: "awaiting_credentials" });
        if (pendingTransaction) {
            const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
            pendingTransaction.escrowStatus = "held";
            pendingTransaction.inspectionWindowExpiresAt = expiresAt;
            await pendingTransaction.save();

            // Send notification email to buyer asynchronously
            (async () => {
                try {
                    let customerEmail = (await User.findOne({ id: pendingTransaction.userId }).lean())?.email;
                    if (!customerEmail && pendingTransaction.userId) {
                        try {
                            const cUser = await clerkClient.users.getUser(pendingTransaction.userId);
                            customerEmail = cUser?.emailAddresses?.[0]?.emailAddress;
                        } catch (e) {}
                    }
                    if (customerEmail) {
                        const credHtml = credential.map((c) => `<p><b>${c.name}:</b> <code>${c.value}</code></p>`).join('');
                        await sendEmail({
                            to: customerEmail,
                            subject: `Credentials Available for @${listing.username}`,
                            html: `<h2>The seller has submitted credentials for @${listing.username}!</h2>
                                   <p>Here are your account credentials:</p>${credHtml}
                                   <p>Your 48-hour inspection window is now active. Log in and verify the account in your orders dashboard.</p>`
                        });
                    }
                } catch (emailErr) {
                    console.error("Error sending credential delivery email to buyer:", emailErr.message);
                }
            })();
        }

        return res.json({ message: "Credentials submitted successfully! Escrow updated." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

export const purchaseAccount = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { listingId } = req.params;

        const listing = await Listing.findOne({ id: listingId, status: "active" });

        if (!listing) {
            return res.status(404).json({ message: "Listing not found or not active" });
        }

        if (listing.ownerId === userId) {
            return res.status(400).json({ message: "You can't purchase your own listing" });
        }

        const transaction = await Transaction.create({ listingId, ownerId: listing.ownerId, userId, amount: listing.price });

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_ID.includes("---")) {
            return res.status(400).json({ message: "Razorpay keys are missing or invalid. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env" });
        }

        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const currency = req.query.currency || process.env.CURRENCY || "INR";

        // Razorpay Order Creation
        const options = {
            amount: Math.round(transaction.amount * 100),
            currency: currency,
            receipt: `rcpt_${transaction.id.slice(0, 15)}`,
            notes: {
                transactionId: transaction.id,
                listingId: listing.id,
                userId,
            },
        };

        const order = await razorpayInstance.orders.create(options);

        return res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            transactionId: transaction.id,
            title: `Purchasing Account @${listing.username} (${listing.platform})`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

export const verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, transactionId } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            const currentTx = await Transaction.findOne({ id: transactionId });
            const listingInfo = await Listing.findOne({ id: currentTx?.listingId });
            let credential = await Credential.findOne({ listingId: listingInfo?.id });

            const hasPreSubmittedCreds = credential && credential.originalCredential && credential.originalCredential.length > 0;

            const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
            const sellerDeadline = new Date(Date.now() + 48 * 60 * 60 * 1000);

            const transaction = await Transaction.findOneAndUpdate(
                { id: transactionId },
                {
                    isPaid: true,
                    escrowStatus: hasPreSubmittedCreds ? "held" : "awaiting_credentials",
                    sellerDeadline: hasPreSubmittedCreds ? null : sellerDeadline,
                    inspectionWindowExpiresAt: hasPreSubmittedCreds ? expiresAt : null
                },
                { new: true }
            ).lean();

            if (transaction) {
                await Listing.findOneAndUpdate(
                    { id: transaction.listingId },
                    {
                        status: "sold",
                        isCredentialSubmitted: hasPreSubmittedCreds,
                        isCredentialVerified: hasPreSubmittedCreds,
                        isCredentialChanged: hasPreSubmittedCreds
                    }
                );

                // Asynchronously dispatch email notifications in background to avoid blocking API response
                (async () => {
                    try {
                        let customerEmail = (await User.findOne({ id: transaction.userId }).lean())?.email;
                        let sellerEmail = (await User.findOne({ id: transaction.ownerId }).lean())?.email;

                        if (!customerEmail && transaction.userId) {
                            try {
                                const cUser = await clerkClient.users.getUser(transaction.userId);
                                customerEmail = cUser?.emailAddresses?.[0]?.emailAddress;
                            } catch (e) {}
                        }
                        if (!sellerEmail && transaction.ownerId) {
                            try {
                                const sUser = await clerkClient.users.getUser(transaction.ownerId);
                                sellerEmail = sUser?.emailAddresses?.[0]?.emailAddress;
                            } catch (e) {}
                        }

                        if (hasPreSubmittedCreds) {
                            await inngest.send({ name: "app/purchase", data: { transaction } }).catch(() => {});
                            if (customerEmail) {
                                const creds = credential.updatedCredential?.length > 0 ? credential.updatedCredential : credential.originalCredential;
                                const credHtml = creds?.map((c) => `<p><b>${c.name}:</b> <code>${c.value}</code></p>`).join('') || '';
                                await sendEmail({
                                    to: customerEmail,
                                    subject: `Your Credentials for @${listingInfo?.username || 'account'}`,
                                    html: `<h2>Thank you for purchasing @${listingInfo?.username || 'account'} on ${listingInfo?.platform || 'Hypp'}!</h2><p>Here are your account credentials:</p>${credHtml}`
                                });
                            }
                        } else {
                            if (sellerEmail) {
                                await sendEmail({
                                    to: sellerEmail,
                                    subject: `⚡ ACTION REQUIRED: Buyer Paid for @${listingInfo?.username}!`,
                                    html: `<h2>Congratulations! Your listing @${listingInfo?.username} has been purchased.</h2>
                                           <p>The buyer's payment of ₹${transaction.amount} is currently secured in Hypp Escrow.</p>
                                           <p><b>Please log in to your Hypp dashboard and submit the account credentials within 48 hours to initiate release of your funds.</b></p>`
                                });
                            }
                            if (customerEmail) {
                                await sendEmail({
                                    to: customerEmail,
                                    subject: `Payment Received into Escrow for @${listingInfo?.username}`,
                                    html: `<h2>Your payment of ₹${transaction.amount} is locked safely in Hypp Escrow.</h2>
                                           <p>The seller has been notified to submit credentials for @${listingInfo?.username} within 48 hours. You will receive an email as soon as credentials are submitted!</p>`
                                });
                            }
                        }
                    } catch (bgEmailErr) {
                        console.error("[verifyRazorpayPayment] Async email error:", bgEmailErr.message);
                    }
                })();
            }

            return res.json({ success: true, message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

export const markFeatured = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = await req.auth();

        if (req.plan !== "premium") {
            return res.status(400).json({ message: "Premium plan required" });
        }

        // Unset all other featured listings
        await Listing.updateMany({ ownerId: userId }, { $set: { featured: false } });

        // Mark the listing as featured
        await Listing.findOneAndUpdate({ id }, { featured: true });

        return res.json({ message: "Listing marked as featured" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

export const getAllUserOrders = async (req, res) => {
    try {
        const { userId } = await req.auth();

        let orders = await Transaction.find({ userId, isPaid: true }).lean();

        // attach listing details
        const listingIds = [...new Set(orders.map((o) => o.listingId))];
        const listings = await Listing.find({ id: { $in: listingIds } }).lean();
        const listingMap = Object.fromEntries(listings.map((l) => [l.id, l]));
        orders = orders.map((o) => ({ ...o, listing: listingMap[o.listingId] || null }));

        if (!orders || orders.length === 0) {
            return res.json({ orders: [] });
        }

        // Attach the credential to each order

        const credentials = await Credential.find({ listingId: { $in: orders.map((order) => order.listingId) } }).lean();

        const ordersWithCredentials = orders.map((order) => {
            const credential = credentials.find((cred) => cred.listingId === order.listingId);
            return { ...order, credential };
        });

        return res.json({ orders: ordersWithCredentials });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

export const withdrawAmount = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { amount, account } = req.body;

        const user = await User.findOne({ id: userId }).lean();

        const balance = (user?.earned || 0) - (user?.withdrawn || 0);

        if (amount > balance) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const withdrawal = await Withdrawal.create({ userId, amount, account });

        await User.findOneAndUpdate({ id: userId }, { $inc: { withdrawn: amount } });

        return res.json({ message: "Applied for withdrawal", withdrawal });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

// Release Escrow Funds to Seller (Buyer action or auto-release)
export const releaseEscrowFunds = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { transactionId } = req.body;

        const transaction = await Transaction.findOne({ id: transactionId, userId, isPaid: true });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        if (transaction.escrowStatus === "released") {
            return res.status(400).json({ message: "Funds already released to seller" });
        }

        transaction.escrowStatus = "released";
        await transaction.save();

        // Increment seller earned balance upon release
        await User.findOneAndUpdate({ id: transaction.ownerId }, { $inc: { earned: transaction.amount } });

        return res.json({ success: true, message: "Funds released to seller balance successfully!", transaction });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

// Dispute Escrow Transaction (Buyer action)
export const disputeEscrowTransaction = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { transactionId, reason } = req.body;

        const transaction = await Transaction.findOne({ id: transactionId, userId, isPaid: true });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        if (transaction.escrowStatus === "released") {
            return res.status(400).json({ message: "Cannot dispute after funds have been released" });
        }

        transaction.escrowStatus = "disputed";
        transaction.disputeReason = reason || "Buyer reported issue with credentials or transfer";
        await transaction.save();

        return res.json({ success: true, message: "Escrow dispute registered. Support team notified.", transaction });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

// Seller KYC Verification Submission (Aadhaar / PAN check)
export const submitSellerKYC = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { documentType, documentNumber } = req.body;

        if (!documentType || !documentNumber) {
            return res.status(400).json({ message: "Document type and document number are required" });
        }

        // Auto verify valid format for Aadhaar (12 digits) or PAN (10 chars)
        const isAadhaar = documentType === "aadhaar" && /^\d{12}$/.test(documentNumber.trim());
        const isPAN = documentType === "pan" && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(documentNumber.trim());

        const isVerified = isAadhaar || isPAN;

        const user = await User.findOneAndUpdate(
            { id: userId },
            {
                kycDocumentType: documentType,
                kycNumber: documentNumber,
                kycStatus: isVerified ? "verified" : "pending",
                kycVerified: isVerified
            },
            { new: true }
        );

        return res.json({
            success: true,
            message: isVerified ? "KYC Identity Verified successfully!" : "KYC submitted and under verification review.",
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

// Get Seller KYC Status
export const getSellerKYCStatus = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const user = await User.findOne({ id: userId }).lean();
        return res.json({
            success: true,
            kycVerified: !!user?.kycVerified,
            kycStatus: user?.kycStatus || "unverified"
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
