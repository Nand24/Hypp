import mongoose from "mongoose";
import "dotenv/config";

const MONGO_URI = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

export const connectDB = async () => {
    if (!MONGO_URI) throw new Error("MONGODB_URI environment variable not set");
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
};

export default mongoose;
