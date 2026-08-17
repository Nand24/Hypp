# 🎯 Hypp. — Technical & System Design Interview Preparation Guide

This guide compiles anticipated technical, architectural, security, database, frontend, and system design interview questions specifically tailored for **hypp.** — an enterprise-grade MERN marketplace with 48-hour escrow protection, Gemini 2.0 Flash AI valuations, Razorpay INR payments, and Clerk authentication.

---

## 🚀 1. The 60-Second Technical Elevator Pitch

> **"What is Hypp, and what was your role in building it?"**

> **Sample Answer:**
> *"Hypp is a full-stack MERN marketplace designed for buying, selling, and transferring verified social media accounts with built-in financial security. I engineered a **48-Hour Escrow State Machine** to guarantee post-payment credential transfers, integrated **Google Gemini 2.0 Flash** for automated AI valuations and risk auditing, implemented **Razorpay INR payment gateway** with HMAC SHA-256 webhook signature verification, and integrated **WebSockets** for real-time seller-buyer communication.
> 
> To ensure low-latency API response times during payment verification, I decoupled blocking SMTP email dispatches using an event-driven background job model. The stack uses React 19, Vite 7, Tailwind CSS v4, Node.js Express 5, MongoDB Mongoose, and Clerk Authentication."*

---

## 🏛️ 2. System Architecture & High-Level Design (HLD)

### Q1: Walk me through the end-to-end payment and escrow state machine workflow in Hypp.
**Key Concepts:** State Transitions, Escrow Hold, Buyer Release, Disputes.

* **Step 1 (Order Creation):** Buyer clicks "Buy Now". Backend (`listingController.js`) creates a Razorpay Order ID and records a pending transaction. Owner self-purchase is blocked server-side (`sellerId !== buyerId`).
* **Step 2 (Payment Verification):** Upon checkout completion, frontend passes `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature` to `/verify-payment`. The backend verifies the HMAC SHA-256 signature using `crypto.createHmac`.
* **Step 3 (Escrow Locking):** Once verified, the listing state flips from `active` -> `escrow_pending`, and a 48-hour deadline timestamp (`escrowExpiresAt = Date.now() + 48*60*60*1000`) is assigned.
* **Step 4 (Credential Submission):** The seller submits account credentials into encrypted escrow storage (`Credential.js`).
* **Step 5 (Settlement / Release):**
  * **Option A (Manual Release):** Buyer inspects the account and clicks **Approve & Release Funds**. Funds transfer to seller balance instantly.
  * **Option B (Auto Release):** If 48 hours elapse without buyer action or dispute, an Inngest background cron job automatically transfers funds to the seller.
  * **Option C (Dispute):** Buyer flags credential failure, freezing payout pending support escalation.

---

### Q2: How did you integrate AI (Gemini 2.0 Flash) into Hypp, and how do you handle AI latency or failures?
**Key Concepts:** Predictive AI, Resilience, Graceful Degradation.

```
[ Frontend Listing Page ] ──(Trigger AI Audit)──> [ aiController.js ]
                                                          │
                                                    Gemini 2.0 Flash
                                                          │
                        ┌─────────────────────────────────┴─────────────────────────────────┐
                        ▼                                                                   ▼
                (Success Response)                                                  (API Failure / Timeout)
        Calculates Valuation & Risk Score                                   Fallback Heuristic Algorithm
        Returns JSON to Glassmorphism Card                                  Returns Baseline Value + Retries
```

* **Integration:** In `aiController.js`, `@google/genai` is called with structured prompt parameters: platform, follower count, engagement rate %, monthly impressions, and niche. Gemini outputs a structured JSON with:
  1. `estimatedMinPrice` & `estimatedMaxPrice` (in ₹ INR)
  2. `riskScore` (Low / Medium / High)
  3. `keyStrengths` and `monetizationSuggestions`
* **Failure Handling & Resilience:**
  * AI routes are wrapped in `try/catch` with fallback pricing algorithms (computing price estimates using base follower-to-engagement metrics) if Gemini API limits or network issues occur.
  * Web clients display skeleton loaders during generation.

---

### Q3: How are WebSockets and REST API combined for chat messaging?
**Key Concepts:** Bidirectional Sockets, Fallbacks, Connection Lifecycle.

* **Primary Protocol:** Native WebSockets (`ws` library on Express) for low-latency live messaging between buyers and sellers.
* **Handshake & Auth:** Connection requests carry Clerk session JWT tokens, validated prior to establishing socket connections.
* **Persistence & Fallback:** Messages are persisted to MongoDB (`Message.js` and `Chat.js`). If WebSockets drop due to network instability, client gracefully degrades to REST polling (`GET /api/chat/:id/messages`).

---

## ⚙️ 3. Backend Deep-Dive & Performance Optimization

### Q4: Explain the payment verification hanging issue you faced and how you solved it.
**Key Concepts:** Event Loops, Blocking I/O, Async Decoupling, Resilience.

* **Problem Statement:** During initial tests of `verifyRazorpayPayment`, the frontend occasionally hung or timed out after completing Razorpay payments.
* **Root Cause Analysis:** Synchronous Nodemailer email dispatch (`await sendEmail(...)`) was placed inline inside the payment verification route. When SMTP servers encountered network delays or handshake timeouts, the main Node.js HTTP request was held open, exceeding HTTP client timeout thresholds.
* **Solution Strategy:**
  1. **Async Email Fire-and-Forget / Background Queue:** Decoupled `sendEmail` from the main payment execution path or delegated email tasks to background job queues (Inngest).
  2. **SMTP Transport Hardening:** Added explicit `connectionTimeout: 5000` and `socketTimeout: 5000` to Nodemailer config.
  3. **User Fallback Handling:** If local MongoDB user lookup failed post-payment, added fallback fetching via Clerk API (`clerkClient.users.getUser(userId)`).

---

### Q5: How do you verify Razorpay payments securely and prevent double-spending?
**Key Concepts:** HMAC SHA-256 Signatures, Webhook Idempotency, Database Transactions.

* **Signature Verification Code Pattern:**
```js
const generated_signature = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
  .update(razorpay_order_id + "|" + razorpay_payment_id)
  .digest('hex');

if (generated_signature !== razorpay_signature) {
  return res.status(400).json({ success: false, message: "Invalid payment signature!" });
}
```
* **Idempotency Strategy:** Before updating listing status to `sold` / `escrow_pending`, the database checks if `transaction.status === 'completed'`. If payment webhook or client callback fires twice, the duplicate execution returns early without re-crediting balances or altering escrow state.

---

### Q6: How does Seller Identity Verification (KYC) work in Hypp?
**Key Concepts:** Identity Security, Regex Validation, Admin Review Workflow.

* Sellers upload Govt IDs (**Aadhaar 12-digit / PAN 10-character**).
* Server validates input format via Regex:
  * **Aadhaar:** `/^\d{12}$/`
  * **PAN:** `/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/`
* Verified sellers receive a `isKycVerified: true` flag in MongoDB, unlocking the **`Verified Seller ✓`** badge on listings to boost buyer trust.

---

## 🎨 4. Frontend & UX Architecture

### Q7: How is state managed in the Hypp client?
**Key Concepts:** Redux Toolkit, Clerk React Hooks, Custom Context.

* **Global State (Redux Toolkit):** Stores active listings, user filters, and search queries.
* **Authentication State (Clerk React):** Managed via `useUser()` and `useAuth()` hooks, providing real-time JWT token management and route protection (`<ProtectedRoute />`).
* **Image Fallbacks:** Images render with an `onError` handler (`e.target.src = '/fallback-avatar.png'`) to eliminate broken image icons if external media URLs fail.

---

## 🔒 5. Security & Fraud Mitigation

| Threat Vector | Mitigation Strategy in Hypp |
| :--- | :--- |
| **Self-Purchasing Fraud** | Backend checks `buyerId !== listing.ownerId`. Throws `400 Bad Request` if owner attempts purchase. |
| **Credential Interception** | Credentials stored in separate `Credential` collection; visible ONLY to buyer AFTER payment signature is verified. |
| **Fake Account Metrics** | Automated metric verifier cross-references follower/engagement ratios before granting `Verified Account ✓` tag. |
| **Webhook Spoofing** | Express raw body parser verifies Razorpay `x-razorpay-signature` header against secret token. |

---

## 📈 6. System Design & Scalability (100k - 1M Users)

### Q8: If Hypp scales to 1 Million listings and 10,000 concurrent escrow transactions, how would you evolve the architecture?

```
[ Client Traffic ] ──> [ Nginx Load Balancer / CDN ]
                                │
         ┌──────────────────────┴──────────────────────┐
         ▼                                             ▼
[ Stateless Express Nodes ]                 [ WebSocket Gateway Cluster ]
         │                                             │
         │                                      (Redis Pub/Sub)
         ▼                                             ▼
[ MongoDB Cluster (Sharded) ] <─── [ Redis Cache ] ─── [ Distributed Workers (Inngest) ]
```

1. **Database Sharding & Indexing:**
   * Compound indexes on `Listing` schema: `{ platform: 1, status: 1, price: 1 }` and `{ title: "text", description: "text" }`.
   * Shard MongoDB collections by `userId` or `listingId`.
2. **WebSocket Scaling with Redis Pub/Sub:**
   * Run stateless Node.js API nodes behind an Nginx Load Balancer. Use **Redis Pub/Sub adapter** for WebSocket clusters so users connected to Node A can communicate seamlessly with users on Node B.
3. **Escrow Distributed Locking:**
   * Use **Redlock (Redis Distributed Lock)** or **MongoDB Session Transactions (`session.startTransaction()`)** during funds release to guarantee atomic updates and prevent double payout withdrawals.
4. **Caching Layer:**
   * Cache frequently requested listings, search results, and AI valuation templates in **Redis** with TTLs of 5-15 minutes, cutting database read loads by 80%+.

---

## 💡 7. Common Behavioral & STAR Interview Questions

### STAR Question: "Describe a complex technical challenge you faced and how you overcame it."
* **Situation:** When implementing post-payment credential transfers, we needed a fail-safe mechanism to handle uncooperative sellers who failed to provide login details after receiving payment.
* **Task:** Design an escrow mechanism that protects buyer funds without manually involving customer support for every order.
* **Action:** I architected a 48-Hour Escrow State Machine with automated timeout triggers. If a seller fails to submit credentials within 48 hours, Inngest triggers an automated refund event back to the buyer via Razorpay refund APIs.
* **Result:** Reduced dispute management overhead by 90% and ensured 100% money-back safety for buyers.

---

## 📌 Quick Summary of Key Tech Stack Terms for the Interview

* **Frontend:** React 19, Vite 7, Redux Toolkit, Tailwind CSS v4, Clerk React, Lucide React.
* **Backend:** Node.js Express 5, MongoDB Mongoose 7, WebSockets (`ws`), ImageKit.
* **Integrations:** Razorpay INR Payment Gateway, Google Gemini 2.0 Flash AI, Inngest Background Worker, Nodemailer & Brevo SMTP.
