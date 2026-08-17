import "dotenv/config";
import crypto from "crypto";
import express from "express";
import http from "http";
import razorpayRouter from "../routes/razorpayRoutes.js";

async function testEndpoints() {
    console.log("=== RAZORPAY HTTP ENDPOINT VERIFICATION TEST ===");

    const app = express();
    app.use(express.json());
    app.use("/api", razorpayRouter);

    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    console.log(`Test server running at ${baseUrl}`);

    try {
        // Test 1: POST /api/create-order with valid amount (50,000 paise)
        console.log("\n--- TEST 1: POST /api/create-order (Valid amount 50000 paise) ---");
        const res1 = await fetch(`${baseUrl}/api/create-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: 50000, currency: "INR", receipt: "rcpt_test_1" }),
        });
        const data1 = await res1.json();
        console.log("Status:", res1.status);
        console.log("Response:", data1);

        if (res1.status !== 200 || !data1.success || !data1.order_id) {
            throw new Error("TEST 1 FAILED: Expected 200 and order_id");
        }
        console.log("PASS: Order created with ID:", data1.order_id);

        // Test 2: POST /api/create-order with invalid amount (< 100 paise)
        console.log("\n--- TEST 2: POST /api/create-order (Invalid amount 50 paise) ---");
        const res2 = await fetch(`${baseUrl}/api/create-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: 50 }),
        });
        const data2 = await res2.json();
        console.log("Status:", res2.status);
        console.log("Response:", data2);

        if (res2.status !== 400 || data2.success !== false) {
            throw new Error("TEST 2 FAILED: Expected 400 Bad Request for amount < 100 paise");
        }
        console.log("PASS: Invalid amount rejected with 400!");

        // Test 3: POST /api/verify-payment with missing parameters
        console.log("\n--- TEST 3: POST /api/verify-payment (Missing fields) ---");
        const res3 = await fetch(`${baseUrl}/api/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ razorpay_order_id: data1.order_id }),
        });
        const data3 = await res3.json();
        console.log("Status:", res3.status);
        console.log("Response:", data3);

        if (res3.status !== 400 || data3.success !== false) {
            throw new Error("TEST 3 FAILED: Expected 400 Bad Request for missing fields");
        }
        console.log("PASS: Missing fields rejected with 400!");

        // Test 4: POST /api/verify-payment with invalid signature
        console.log("\n--- TEST 4: POST /api/verify-payment (Invalid signature) ---");
        const res4 = await fetch(`${baseUrl}/api/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                razorpay_order_id: data1.order_id,
                razorpay_payment_id: "pay_test_123",
                razorpay_signature: "bad_signature_hash",
            }),
        });
        const data4 = await res4.json();
        console.log("Status:", res4.status);
        console.log("Response:", data4);

        if (res4.status !== 400 || data4.success !== false) {
            throw new Error("TEST 4 FAILED: Expected 400 Bad Request for signature mismatch");
        }
        console.log("PASS: Invalid signature rejected with 400!");

        // Test 5: POST /api/verify-payment with valid signature
        console.log("\n--- TEST 5: POST /api/verify-payment (Valid signature) ---");
        const testPaymentId = "pay_test_123456";
        const bodyStr = data1.order_id + "|" + testPaymentId;
        const validSig = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(bodyStr)
            .digest("hex");

        const res5 = await fetch(`${baseUrl}/api/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                razorpay_order_id: data1.order_id,
                razorpay_payment_id: testPaymentId,
                razorpay_signature: validSig,
            }),
        });
        const data5 = await res5.json();
        console.log("Status:", res5.status);
        console.log("Response:", data5);

        if (res5.status !== 200 || !data5.success) {
            throw new Error("TEST 5 FAILED: Expected 200 for valid payment signature");
        }
        console.log("PASS: Valid signature verified with 200 success!");

        console.log("\nALL HTTP ENDPOINT VERIFICATION TESTS PASSED SUCCESSFULLY!");
    } catch (err) {
        console.error("HTTP Endpoint Test Failed:", err);
        process.exit(1);
    } finally {
        server.close();
    }
}

testEndpoints();
