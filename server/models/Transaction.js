import mongoose from "../configs/mongoose.js";
const { Schema, model } = mongoose;
import { v4 as uuidv4 } from "uuid";

const TransactionSchema = new Schema(
    {
        id: { type: String, default: uuidv4, index: true, unique: true },
        listingId: { type: String, required: true },
        ownerId: { type: String, required: true },
        userId: { type: String, required: true },
        amount: { type: Number, required: true },
        isPaid: { type: Boolean, default: false },
        escrowStatus: { type: String, enum: ["held", "released", "disputed"], default: "held" },
        inspectionWindowExpiresAt: { type: Date },
        disputeReason: { type: String, default: "" },
    },
    { timestamps: true }
);

export default model("Transaction", TransactionSchema);
