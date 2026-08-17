import crypto from "crypto";
import Razorpay from "razorpay";

// Helper to get initialized Razorpay instance
const getRazorpayInstance = () => {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret || key_id.includes("---") || key_secret.includes("---")) {
        throw new Error("Razorpay credentials (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) are missing or invalid in environment variables.");
    }

    return new Razorpay({
        key_id,
        key_secret,
    });
};

/**
 * STEP 1: BACKEND - Create Order
 * Endpoint: POST /api/create-order
 * Request: { amount (paise), currency, receipt }
 * Minimum amount: 100 paise
 * Return: { order_id, amount, currency, key_id }
 */
export const createOrder = async (req, res) => {
    try {
        const { amount, currency = "INR", receipt } = req.body;

        // Validate amount >= 100 paise
        if (amount === undefined || amount === null || isNaN(amount) || Number(amount) < 100) {
            return res.status(400).json({
                success: false,
                message: "Amount is required and must be at least 100 paise (₹1)",
            });
        }

        let razorpay;
        try {
            razorpay = getRazorpayInstance();
        } catch (authError) {
            return res.status(401).json({
                success: false,
                message: authError.message,
            });
        }

        const options = {
            amount: Math.round(Number(amount)),
            currency: currency || "INR",
            receipt: receipt || `rcpt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            key_id: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("Razorpay order creation error:", error);
        return res.status(500).json({
            success: false,
            message: error.description || error.message || "Failed to create Razorpay order",
        });
    }
};

/**
 * STEP 3: BACKEND - Verify Signature
 * Endpoint: POST /api/verify-payment
 * Request: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 * Compare generated signature with razorpay_signature
 */
export const verifyPayment = async (req, res) => {
    try {
        const razorpay_order_id = req.body.razorpay_order_id || req.body.order_id;
        const razorpay_payment_id = req.body.razorpay_payment_id || req.body.payment_id;
        const razorpay_signature = req.body.razorpay_signature || req.body.signature;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required",
            });
        }

        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            return res.status(500).json({
                success: false,
                message: "Server configuration error: RAZORPAY_KEY_SECRET missing",
            });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            return res.status(200).json({
                success: true,
                message: "Payment verified successfully",
                order_id: razorpay_order_id,
                payment_id: razorpay_payment_id,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature",
            });
        }
    } catch (error) {
        console.error("Razorpay signature verification error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Payment verification failed",
        });
    }
};
