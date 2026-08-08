import mongoose from "../configs/mongoose.js";
const { Schema, model } = mongoose;
import { v4 as uuidv4 } from "uuid";

const WithdrawalSchema = new Schema(
    {
        id: { type: String, default: uuidv4, index: true, unique: true },
        userId: { type: String, required: true },
        amount: { type: Number, required: true },
        account: { type: [Schema.Types.Mixed], default: [] },
        isWithdrawn: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default model("Withdrawal", WithdrawalSchema);
