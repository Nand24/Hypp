import { clerkClient } from "@clerk/express";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        const auth = typeof req.auth === 'function' ? await req.auth() : req.auth;
        const userId = auth?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: Please log in to proceed" });
        }

        // Just-In-Time Auto-Sync: Ensure user exists in MongoDB on access
        let existingUser = await User.findOne({ id: userId });
        if (!existingUser) {
            try {
                const clerkUser = await clerkClient.users.getUser(userId);
                const email = clerkUser?.emailAddresses?.[0]?.emailAddress || "";
                const name = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") || "User";
                const image = clerkUser?.imageUrl || "";

                if (email) {
                    await User.create({ id: userId, email, name, image });
                    console.log(`[AutoSync] Created missing user ${userId} in MongoDB on API call.`);
                }
            } catch (err) {
                console.error("[AutoSync] Error syncing user on request:", err.message);
            }
        }

        let hasPremiumPlan = false;
        try {
            if (typeof auth?.has === 'function') {
                hasPremiumPlan = auth.has({ permission: 'premium' }) || auth.has({ role: 'premium' });
            }
        } catch (planErr) {
            // Plan check fallback if permissions/roles not configured in Clerk
        }
        req.plan = hasPremiumPlan ? 'premium' : 'free';

        return next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({ message: error.code || error.message || "Authentication failed" });
    }
};

export const protectAdmin = async (req, res, next) => {
    try {
        const auth = typeof req.auth === 'function' ? await req.auth() : req.auth;
        const userId = auth?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: Admin access required" });
        }

        const user = await clerkClient.users.getUser(userId);
        const userEmail = user?.emailAddresses?.[0]?.emailAddress;

        const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());
        const isAdmin = userEmail && adminEmails.includes(userEmail.toLowerCase());

        if (!isAdmin) {
            return res.status(403).json({ message: "Forbidden: You do not have admin permissions" });
        }

        return next();
    } catch (error) {
        console.error("ProtectAdmin error:", error);
        return res.status(401).json({ message: error.code || error.message || "Admin authentication failed" });
    }
};
