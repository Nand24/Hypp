import mongoose from "../configs/mongoose.js";
const { Schema, model } = mongoose;
import { v4 as uuidv4 } from "uuid";

const ChatSchema = new Schema(
    {
        id: { type: String, default: uuidv4, index: true, unique: true },
        chatUserId: { type: String, required: true },
        ownerUserId: { type: String, required: true },
        listingId: { type: String, required: true },
        messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
        platformMessages: [{ type: Schema.Types.ObjectId, ref: "PlatformMessage" }],
        active: { type: Boolean, default: true },
        lastMessage: { type: String, default: "" },
        isLastMessageRead: { type: Boolean, default: true },
        lastMessageSenderId: { type: String, default: "" },
        isTokenAmountPaid: { type: Boolean, default: false },
    },
    { timestamps: true }
);

ChatSchema.index({ chatUserId: 1, ownerUserId: 1, listingId: 1 }, { unique: true });

export default model("Chat", ChatSchema);
