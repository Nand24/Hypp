import mongoose from "../configs/mongoose.js";
const { Schema, model } = mongoose;
import { v4 as uuidv4 } from "uuid";

const ListingSchema = new Schema(
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

export default model("Listing", ListingSchema);
