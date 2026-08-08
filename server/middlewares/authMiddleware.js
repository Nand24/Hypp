import { clerkClient } from "@clerk/express";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        const { userId, has } = await req.auth();

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
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

        const hasPremiumPlan = await has({ plan: 'premium' });
        req.plan = hasPremiumPlan ? 'premium' : 'free';

        return next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error.code || error.message });
    }
};

export const protectAdmin = async (req, res, next) => {
    try {
        const user = await clerkClient.users.getUser(await req.auth().userId);

        const isAdmin = process.env.ADMIN_EMAILS.split(",").includes(user.emailAddresses[0].emailAddress);

        if (!isAdmin) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        return next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error.code || error.message });
    }
};
