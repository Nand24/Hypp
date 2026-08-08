import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://pranavsharma2595_db_user:eKYbvV7Y1ajimWcx@practice.t8ir1ri.mongodb.net/social";

const ListingSchema = new mongoose.Schema(
    {
        id: { type: String, default: uuidv4, index: true, unique: true },
        ownerId: { type: String, required: true },
        title: { type: String, required: true },
        platform: { type: String, enum: ["youtube","instagram","tiktok","facebook","twitter","linkedin","pinterest","snapchat","twitch","discord"] },
        username: { type: String },
        followers_count: { type: Number },
        engagement_rate: { type: Number },
        monthly_views: { type: Number },
        niche: { type: String },
        price: { type: Number },
        description: { type: String },
        verified: { type: Boolean, default: false },
        monetized: { type: Boolean, default: false },
        country: { type: String },
        age_range: { type: String },
        status: { type: String, enum: ["active","ban","sold","deleted","inactive"], default: "active" },
        featured: { type: Boolean, default: false },
        images: { type: [String], default: [] },
        platformAssured: { type: Boolean, default: false },
        isCredentialSubmitted: { type: Boolean, default: false },
        isCredentialVerified: { type: Boolean, default: false },
        isCredentialChanged: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const UserSchema = new mongoose.Schema(
    {
        id: { type: String, required: true, unique: true },
        email: { type: String, required: true },
        name: { type: String, required: true },
        image: { type: String },
        earned: { type: Number, default: 0 },
        withdrawn: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Listing = mongoose.models.Listing || mongoose.model("Listing", ListingSchema);
const User = mongoose.models.User || mongoose.model("User", UserSchema);

const demoUsers = [
    {
        id: "user_demo_1",
        email: "alex.tech@hypp.com",
        name: "Alex Vance",
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop"
    },
    {
        id: "user_demo_2",
        email: "sophia.travel@hypp.com",
        name: "Sophia Martinez",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop"
    },
    {
        id: "user_demo_3",
        email: "david.fit@hypp.com",
        name: "David Miller",
        image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop"
    }
];

const demoListings = [
    {
        id: "listing_1",
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
        id: "listing_2",
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
        id: "listing_3",
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
        id: "listing_4",
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
        id: "listing_5",
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

async function seed() {
    try {
        console.log("Connecting to MongoDB:", MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB successfully!");

        // Seed Users
        for (const u of demoUsers) {
            await User.findOneAndUpdate({ id: u.id }, u, { upsert: true, new: true });
        }
        console.log("Seeded demo users into MongoDB!");

        // Seed Listings
        for (const l of demoListings) {
            await Listing.findOneAndUpdate({ id: l.id }, l, { upsert: true, new: true });
        }
        console.log("Seeded demo listings into MongoDB successfully!");

        const count = await Listing.countDocuments({ status: "active" });
        console.log(`Total active listings in database now: ${count}`);

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
}

seed();
