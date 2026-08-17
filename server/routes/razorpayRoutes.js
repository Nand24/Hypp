import express from "express";
import { createOrder, verifyPayment } from "../controllers/razorpayController.js";

const razorpayRouter = express.Router();

// Step 1: POST /api/create-order
razorpayRouter.post("/create-order", createOrder);

// Step 3: POST /api/verify-payment
razorpayRouter.post("/verify-payment", verifyPayment);

export default razorpayRouter;
