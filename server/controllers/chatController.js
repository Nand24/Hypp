import Listing from "../models/Listing.js";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import PlatformMessage from "../models/PlatformMessage.js";
import User from "../models/User.js";

// Controller for getting chat ( creating if not exist )
export const getChat = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { listingId, chatId } = req.body;

        const listing = await Listing.findOne({ id: listingId }).lean();

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        //  Find Existing Chat

        let existingChat = null;
        if (chatId) {
            existingChat = await Chat.findOne({ id: chatId, $or: [{ chatUserId: userId }, { ownerUserId: userId }] }).lean();
        } else {
            existingChat = await Chat.findOne({ listingId, chatUserId: userId, ownerUserId: listing.ownerId }).lean();
        }

        if (existingChat) {
            const messages = await Message.find({ chatId: existingChat.id }).sort({ createdAt: 1 }).lean();
            const platformMessages = await PlatformMessage.find({ chatId: existingChat.id }).sort({ createdAt: 1 }).lean();
            const ownerUser = await User.findOne({ id: existingChat.ownerUserId }).lean();
            const chatUser = await User.findOne({ id: existingChat.chatUserId }).lean();
            const listingData = await Listing.findOne({ id: existingChat.listingId }).lean();

            const fullChat = { ...existingChat, listing: listingData || null, ownerUser, chatUser, messages, platformMessages };

            res.json({ chat: fullChat });

            if (existingChat.isLastMessageRead === false && messages && messages.length > 0) {
                const lastMessage = messages[messages.length - 1];
                const isLastMessageSendByMe = lastMessage.sender_id === userId;
                if (!isLastMessageSendByMe) {
                    await Chat.findOneAndUpdate({ id: existingChat.id }, { isLastMessageRead: true });
                }
            }

            return null;
        }

        const newChat = await Chat.create({ listingId, chatUserId: userId, ownerUserId: listing.ownerId });
        const chatWithData = await Chat.findOne({ id: newChat.id }).lean();
        const ownerUser = await User.findOne({ id: chatWithData.ownerUserId }).lean();
        const chatUser = await User.findOne({ id: chatWithData.chatUserId }).lean();
        const listingData = await Listing.findOne({ id: chatWithData.listingId }).lean();

        return res.json({ chat: { ...chatWithData, ownerUser, chatUser, listing: listingData } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

// Controller For Getting All Chats For User
export const getAllUserChats = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const chats = await Chat.find({ $or: [{ chatUserId: userId }, { ownerUserId: userId }] }).sort({ updatedAt: -1 }).lean();
        if (!chats || chats.length === 0) return res.json({ chats: [] });

        const listingIds = [...new Set(chats.map((c) => c.listingId))];
        const listings = await Listing.find({ id: { $in: listingIds } }).lean();
        const listingMap = Object.fromEntries(listings.map((l) => [l.id, l]));

        const userIds = [...new Set(chats.flatMap((c) => [c.ownerUserId, c.chatUserId]))];
        const users = await User.find({ id: { $in: userIds } }).select("id email name image").lean();
        const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

        const enriched = chats.map((c) => ({ ...c, listing: listingMap[c.listingId] || null, ownerUser: userMap[c.ownerUserId] || null, chatUser: userMap[c.chatUserId] || null }));

        return res.json({ chats: enriched });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

// Controller For adding Message to Chat
export const sendChatMessage = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { chatId, message } = req.body;
        const chat = await Chat.findOne({ id: chatId, $or: [{ chatUserId: userId }, { ownerUserId: userId }] }).lean();
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        const listing = await Listing.findOne({ id: chat.listingId }).lean();
        if (!listing || listing.status !== "active") return res.status(400).json({ message: `Listing is ${listing?.status || 'not found'}` });

        const newMessage = await Message.create({ message, sender_id: userId, chatId, createdAt: new Date() });

        await Chat.findOneAndUpdate({ id: chatId }, { $push: { messages: newMessage._id }, $set: { lastMessage: newMessage.message, isLastMessageRead: false, lastMessageSenderId: userId } });

        res.json({ message: "Message Sent", newMessage });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};
