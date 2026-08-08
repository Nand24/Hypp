import fs from "fs";
import imagekit from "../configs/imagekit.js";
import Stripe from "stripe";
import { inngest } from "../inngest/index.js";

import Listing from "../models/Listing.js";
import User from "../models/User.js";
import Credential from "../models/Credential.js";
import Transaction from "../models/Transaction.js";
import Withdrawal from "../models/Withdrawal.js";

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

// Controller For Getting All Public Listing
export const getAllPublicListing = async (req, res) => {
    try {
        const listings = await Listing.find({ status: "active" }).sort({ createdAt: -1 }).lean();

        if (!listings || listings.length === 0) {
            return res.json({ listings: [] });
        }

        // attach owner details
        const ownerIds = [...new Set(listings.map((l) => l.ownerId))];
        const owners = await User.find({ id: { $in: ownerIds } }).select("id email name image").lean();
        const ownerMap = Object.fromEntries(owners.map((o) => [o.id, o]));
        const listingsWithOwner = listings.map((l) => ({ ...l, owner: ownerMap[l.ownerId] || null }));

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

        if (credential.length === 0 || !listingId) {
            return res.status(400).json({ message: "Missing Feilds" });
        }


        const listing = await Listing.findOne({ id: listingId, ownerId: userId });

        if (!listing) {
            return res.status(404).json({ message: "Listing not found or you are not the owner" });
        }


        await Credential.create({ listingId, originalCredential: credential });
        await Listing.findOneAndUpdate({ id: listingId }, { isCredentialSubmitted: true });

        return res.json({ message: "Credential added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

export const purchaseAccount = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { listingId } = req.params;
        const { origin } = req.headers;

        const listing = await Listing.findOne({ id: listingId, status: "active" });

        if (!listing) {
            return res.status(404).json({ message: "Listing not found or not active" });
        }

        if (listing.ownerId === userId) {
            return res.status(400).json({ message: "You can't purchase your own listing" });
        }


        const transaction = await Transaction.create({ listingId, ownerId: listing.ownerId, userId, amount: listing.price });

        // Stripe Payment Link
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        const line_items = [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: `Purchasing Account @${listing.username} of ${listing.platform} platform`,
                    },
                    unit_amount: Math.floor(transaction.amount) * 100,
                },
                quantity: 1,
            },
        ];

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-orders`,
            cancel_url: `${origin}/marketplace`,
            line_items: line_items,
            mode: "payment",
            metadata: {
                transactionId: transaction.id,
                appId: "social-profile-marketplace",
            },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Expires in 30 minutes
        });

        return res.json({ paymentLink: session.url });
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
