import Listing from "../models/Listing.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import Credential from "../models/Credential.js";
import Withdrawal from "../models/Withdrawal.js";

// Controller for checking if user is admin
export const isAdmin = async (req, res) => {
    try {
        return res.json({ isAdmin: true });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.code || error.message });
    }
};

// Controller for getting dashboard data
export const getDashboard = async (req, res) => {
    try {
        const totalListings = await Listing.countDocuments({});

        const transactions = await Transaction.find({ isPaid: true }).select("amount").lean();

        const totalRevenue = transactions.reduce((total, transaction) => total + (transaction.amount || 0), 0);

        const activeListings = await Listing.countDocuments({ status: "active" });

        const totalUser = await Listing.countDocuments({});

        const recentListings = await Listing.find().sort({ createdAt: -1 }).limit(5).lean();

        // attach owners
        const ownerIds = [...new Set(recentListings.map((l) => l.ownerId))];
        const owners = await User.find({ id: { $in: ownerIds } }).select("id email name image").lean();
        const ownerMap = Object.fromEntries(owners.map((o) => [o.id, o]));
        const recentListingsWithOwner = recentListings.map((l) => ({ ...l, owner: ownerMap[l.ownerId] || null }));

        return res.json({ dashboardData: { totalListings, totalRevenue, activeListings, totalUser, recentListings: recentListingsWithOwner } });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.code || error.message });
    }
};

// Controller for getting all listings
export const getAllListings = async (req, res) => {
    try {
        const listings = await Listing.find().sort({ createdAt: -1 }).lean();

        if (!listings || listings.length === 0) return res.json({ listings: [] });

        const ownerIds = [...new Set(listings.map((l) => l.ownerId))];
        const owners = await User.find({ id: { $in: ownerIds } }).select("id email name image").lean();
        const ownerMap = Object.fromEntries(owners.map((o) => [o.id, o]));
        const listingsWithOwner = listings.map((l) => ({ ...l, owner: ownerMap[l.ownerId] || null }));

        return res.json({ listings: listingsWithOwner });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.code || error.message });
    }
};

// Change listing status
export const changeStatus = async (req, res) => {
    try {
        const { listingId } = req.params;
        const { status } = req.body;

        const listing = await Listing.findOne({ id: listingId });
        if (!listing) return res.status(404).json({ message: "Listing not found" });
        await Listing.findOneAndUpdate({ id: listingId }, { status });

        return res.json({ message: "Listing status updated" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.code || error.message });
    }
};

// Controller for getting all unverified listings with credentials submitted
export const getAllUnverifiedListings = async (req, res) => {
    try {
        const listings = await Listing.find({ isCredentialSubmitted: true, isCredentialVerified: false, status: { $ne: "deleted" } }).sort({ createdAt: -1 }).lean();
        if (!listings || listings.length === 0) return res.json({ listings: [] });
        return res.json({ listings });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.code || error.message });
    }
};

// Controller for getting credential
export const getCredential = async (req, res) => {
    try {
        const { listingId } = req.params;

        const credential = await Credential.findOne({ listingId }).lean();

        if (!credential) {
            return res.status(404).json({ message: "Credential not found" });
        }

        return res.json({ credential });
    } catch (error) {
        res.status(400).json({ message: error.code || error.message });
        console.log(error);
    }
};

// Mark credential as verified
export const markCredentialVerified = async (req, res) => {
    try {
        const { listingId } = req.params;

        await Listing.findOneAndUpdate({ id: listingId }, { isCredentialVerified: true });

        return res.json({ message: "Credential marked as verified" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.code || error.message });
    }
};

// Get all un-changed listings
export const getAllUnChangedListings = async (req, res) => {
    try {
        const listings = await Listing.find({ isCredentialVerified: true, isCredentialChanged: false, status: { $ne: "deleted" } }).sort({ createdAt: -1 }).lean();
        if (!listings || listings.length === 0) return res.json({ listings: [] });
        return res.json({ listings });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.code || error.message });
    }
};

// Change credential for verified listing
export const changeCredential = async (req, res) => {
    try {
        const { listingId } = req.params;
        const { newCredential, credentialId } = req.body;

        await Credential.findOneAndUpdate({ id: credentialId, listingId }, { updatedCredential: newCredential });
        await Listing.findOneAndUpdate({ id: listingId }, { isCredentialChanged: true });

        return res.json({ message: "Credential changed successfully" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.code || error.message });
    }
};

// Get all transactions
export const getAllTransactions = async (req, res) => {
    try {
        let transactions = await Transaction.find({ isPaid: true }).sort({ createdAt: -1 }).lean();

        if (!transactions || transactions.length === 0) return res.json({ transactions: [] });

        const listingIds = [...new Set(transactions.map((t) => t.listingId))];
        const listings = await Listing.find({ id: { $in: listingIds } }).lean();
        const listingMap = Object.fromEntries(listings.map((l) => [l.id, l]));

        // attach owner to listing
        const ownerIds = [...new Set(listings.map((l) => l.ownerId))];
        const owners = await User.find({ id: { $in: ownerIds } }).select("id email name image").lean();
        const ownerMap = Object.fromEntries(owners.map((o) => [o.id, o]));
        Object.values(listingMap).forEach((lst) => {
            lst.owner = ownerMap[lst.ownerId] || null;
        });

        // Get Customer Details for each transaction and add it to the transaction object
        const customerIds = [...new Set(transactions.map((t) => t.userId))];
        const customers = await User.find({ id: { $in: customerIds } }).select("id email name image").lean();
        const customerMap = Object.fromEntries(customers.map((c) => [c.id, c]));

        transactions = transactions.map((t) => {
            const tx = { ...t };
            tx.listing = listingMap[t.listingId] || null;
            if (tx.listing) tx.listing.customer = customerMap[t.userId] || null;
            return tx;
        });

        return res.json({ transactions });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.code || error.message });
    }
};


// Controller For Getting  All Withdraw Requests
export const getAllWithdrawRequests = async (req, res) => {
    try {
        const requests = await Withdrawal.find().sort({ createdAt: 1 }).lean();
        if (!requests || requests.length === 0) return res.json({ requests: [] });

        const userIds = [...new Set(requests.map((r) => r.userId))];
        const users = await User.find({ id: { $in: userIds } }).select("id email name image").lean();
        const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

        const requestsWithUser = requests.map((r) => ({ ...r, user: userMap[r.userId] || null }));
        return res.json({ requests: requestsWithUser });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.code || error.message });
    }
};

// Controller for marking withdrawal as paid
export const markWithdrawalAsPaid = async (req, res) => {
    try {
        const { id } = req.params;

        const withdrawal = await Withdrawal.findOne({ id }).lean();
        if (!withdrawal) return res.status(404).json({ message: "Withdrawal not found" });
        if (withdrawal.isWithdrawn) return res.status(400).json({ message: "Withdrawal already marked as paid" });
        await Withdrawal.findOneAndUpdate({ id }, { isWithdrawn: true });

        return res.json({ message: "Withdrawal marked as paid" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.code || error.message });
    }
};