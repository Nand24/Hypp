import mongoose from "../configs/mongoose.js";
const { Schema, model } = mongoose;

const UserSchema = new Schema(
    {
        id: { type: String, index: true, unique: true },
        email: { type: String, required: true },
        name: { type: String },
        image: { type: String },
        earned: { type: Number, default: 0 },
        withdrawn: { type: Number, default: 0 },
        kycVerified: { type: Boolean, default: false },
        kycStatus: { type: String, enum: ["unverified", "pending", "verified"], default: "unverified" },
        kycDocumentType: { type: String, default: "" },
        kycNumber: { type: String, default: "" },
    },
    { timestamps: true }
);

export default model("User", UserSchema);
