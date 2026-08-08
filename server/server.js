import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import { connectDB } from "./configs/mongoose.js";
import { autoSyncClerkUsers } from "./utils/autoSyncClerk.js";
import adminRouter from "./routes/adminRoutes.js";
import listingRouter from "./routes/listingRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import { razorpayWebhook } from "./controllers/razorpayWebhook.js";

const app = express();

// Connect to MongoDB & Auto Sync Clerk Users
connectDB()
	.then(() => autoSyncClerkUsers())
	.catch((err) => console.error("Failed to connect to MongoDB:", err));

// Razorpay Webhooks Route
app.use('/api/razorpay', express.raw({type: 'application/json'}), razorpayWebhook)

// Middlewares
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("Server is live!"));

// Webhooks
app.use("/api/inngest", serve({ client: inngest, functions }));

// Routes
app.use("/api/admin", adminRouter);
app.use("/api/listing", listingRouter);
app.use("/api/chat", chatRouter);
app.use("/api/ai", aiRouter);

const PORT = process.env.PORT || 3000;

export default app;

if (process.env.VERCEL !== "1") {
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
