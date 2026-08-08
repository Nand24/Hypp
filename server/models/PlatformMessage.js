import mongoose from "../configs/mongoose.js";
const { Schema, model } = mongoose;
import { v4 as uuidv4 } from "uuid";

const PlatformMessageSchema = new Schema(
    {
        id: { type: String, default: uuidv4, index: true, unique: true },
        chatId: { type: String, required: true },
        message: { type: String, required: true },
        sender_id: { type: String, default: "platform" },
    },
    { timestamps: true }
);

export default model("PlatformMessage", PlatformMessageSchema);
