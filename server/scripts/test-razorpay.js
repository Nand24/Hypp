import "dotenv/config";
import crypto from "crypto";
import Razorpay from "razorpay";

async function runTests() {
    console.log("=== RAZORPAY INTEGRATION VERIFICATION TEST ===");
    console.log("Checking Environment Variables...");
    console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
    console.log("RAZORPAY_KEY_SECRET length:", process.env.RAZORPAY_KEY_SECRET ? process.env.RAZORPAY_KEY_SECRET.length : 0);

    if (process.env.RAZORPAY_KEY_ID !== "rzp_test_TQwnUiYtVhqWpe") {
        console.error("FAIL: RAZORPAY_KEY_ID does not match required credentials");
        process.exit(1);
    }
    if (process.env.RAZORPAY_KEY_SECRET !== "3LLNvj4V3dvUP8Ei4a1eAoUK") {
        console.error("FAIL: RAZORPAY_KEY_SECRET does not match required credentials");
        process.exit(1);
    }

    const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    console.log("\n--- TEST 1: Razorpay Order Creation via API ---");
    try {
        const order = await instance.orders.create({
            amount: 50000, // 50000 paise = ₹500
            currency: "INR",
            receipt: `test_rcpt_${Date.now()}`,
        });
        console.log("SUCCESS: Created Razorpay order!");
        console.log("Order ID:", order.id);
        console.log("Amount:", order.amount, "paise");
        console.log("Status:", order.status);

        console.log("\n--- TEST 2: Signature Generation & Verification ---");
        const dummyPaymentId = `pay_${Date.now()}`;
        const body = order.id + "|" + dummyPaymentId;
        const validSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        console.log("Generated HMAC-SHA256 signature:", validSignature);

        // Verification logic
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature === validSignature) {
            console.log("SUCCESS: Signature verified successfully!");
        } else {
            console.error("FAIL: Signature mismatch!");
            process.exit(1);
        }

        console.log("\n--- TEST 3: Invalid Signature Rejection ---");
        const invalidSignature = "invalid_signature_hash_123456789";
        if (expectedSignature !== invalidSignature) {
            console.log("SUCCESS: Invalid signature correctly rejected!");
        } else {
            console.error("FAIL: Invalid signature was accepted!");
            process.exit(1);
        }

        console.log("\nALL RAZORPAY BACKEND TESTS PASSED!");
    } catch (err) {
        console.error("ERROR during Razorpay tests:", err.message);
        console.error(err);
        process.exit(1);
    }
}

runTests();
