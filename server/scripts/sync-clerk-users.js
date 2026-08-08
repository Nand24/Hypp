import dotenv from "dotenv";
dotenv.config();
import { clerkClient } from "@clerk/express";
import { connectDB } from "../configs/mongoose.js";
import User from "../models/User.js";

async function syncAllClerkUsers() {
    try {
        console.log("Connecting to MongoDB...");
        await connectDB();

        console.log("Fetching users from Clerk Backend API...");
        const response = await clerkClient.users.getUserList({ limit: 100 });
        const clerkUsers = Array.isArray(response) ? response : (response.data || []);

        console.log(`Found ${clerkUsers.length} user(s) in Clerk.`);

        if (clerkUsers.length === 0) {
            console.log("No users found in your Clerk project.");
            process.exit(0);
        }

        let syncedCount = 0;
        for (const clerkUser of clerkUsers) {
            const id = clerkUser.id;
            const email = clerkUser.emailAddresses?.[0]?.emailAddress || "";
            const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || "User";
            const image = clerkUser.imageUrl || "";

            if (!email) {
                console.warn(`[Skip] User ${id} has no primary email address.`);
                continue;
            }

            await User.findOneAndUpdate(
                { id },
                { email, name, image },
                { upsert: true, new: true }
            );
            syncedCount++;
            console.log(`[Synced] ${name} (${email}) -> MongoDB ID: ${id}`);
        }

        console.log(`\nSuccessfully synced ${syncedCount} user(s) from Clerk into MongoDB!`);
        process.exit(0);
    } catch (err) {
        console.error("Error syncing users from Clerk:", err);
        process.exit(1);
    }
}

syncAllClerkUsers();
