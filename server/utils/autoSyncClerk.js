import { clerkClient } from "@clerk/express";
import User from "../models/User.js";

/**
 * Automatically syncs all Clerk users to MongoDB in the background.
 * Runs on server startup so you NEVER need manual scripts.
 */
export const autoSyncClerkUsers = async () => {
    try {
        console.log("[AutoSync] Syncing Clerk users with MongoDB...");
        const response = await clerkClient.users.getUserList({ limit: 100 });
        const clerkUsers = Array.isArray(response) ? response : (response.data || []);

        let count = 0;
        for (const clerkUser of clerkUsers) {
            const id = clerkUser.id;
            const email = clerkUser.emailAddresses?.[0]?.emailAddress || "";
            const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || "User";
            const image = clerkUser.imageUrl || "";

            if (email) {
                await User.findOneAndUpdate(
                    { id },
                    { email, name, image },
                    { upsert: true }
                );
                count++;
            }
        }
        console.log(`[AutoSync] Successfully synced ${count} Clerk user(s) into MongoDB.`);
    } catch (err) {
        console.error("[AutoSync Error]:", err.message);
    }
};
