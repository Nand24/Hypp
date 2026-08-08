import mongoose from "../configs/mongoose.js";
const { Schema, model } = mongoose;
import { v4 as uuidv4 } from "uuid";

const MessageSchema = new Schema(
    {
        id: { type: String, default: uuidv4, index: true, unique: true },
        chatId: { type: String, required: true },
        message: { type: String, required: true },
        sender_id: { type: String, required: true },
    },
    { timestamps: true }
);

export default model("Message", MessageSchema);
