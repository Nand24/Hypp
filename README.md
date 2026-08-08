# hypp. — Premier Social Media Account Marketplace

<p align="center">
  <img src="client/src/assets/logo.svg" alt="hypp logo" width="180"/>
</p>

<p align="center">
  <b>A secure, full-stack MERN marketplace platform for buying and selling verified social media accounts with AI-powered valuations, Govt ID (KYC) verification, and 48-hour escrow protection.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite 7" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Node.js-Express_5-339933?logo=nodedotjs&logoColor=white" alt="Node.js Express" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/AI-Gemini_2.0_Flash-4285F4?logo=googlegemini&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Authentication-Clerk-6C47FF?logo=clerk&logoColor=white" alt="Clerk Auth" />
  <img src="https://img.shields.io/badge/Payments-Razorpay_INR-0C2340?logo=razorpay&logoColor=white" alt="Razorpay" />
</p>

---

## 🌟 Overview

**hypp.** is an enterprise-grade MERN (MongoDB, Express, React, Node.js) web application designed for social media account buyers, creators, and digital entrepreneurs. It provides a safe, transparent ecosystem to list, discover, negotiate, and acquire established social media profiles (YouTube, Instagram, TikTok, Twitter, Pinterest, Twitch, and Snapchat) localized for the Indian market with **INR (`₹`)** currency, guaranteed **48-Hour Escrow Protection**, **AI Valuation Engine**, and **Seller KYC Identity Verification**.

---

## ✨ Key Features

### 🤖 AI-Powered Intelligence (Gemini 2.0 Flash)
- **AI Account Valuation Engine**: Analyzes platform metrics, follower count, engagement rate %, monthly impressions, and niche to compute fair market price ranges in **₹ (INR)**.
- **AI Risk Audit Score**: Calculates risk ratings (Low, Medium, High) to flag bot accounts or low-engagement profiles before purchase.
- **AI Description Generator**: One-click AI copywriter for sellers to generate compelling, high-converting listing descriptions.
- **AI Health Audit Badge**: Glassmorphism audit card on listing pages highlighting estimated fair value and engagement conversion health.

### 🛡️ Security & Escrow Enhancements
- **48-Hour Inspection Window**: Escrow funds are held safely for 48 hours post-purchase, allowing buyers to verify login credentials and email transfers.
- **Buyer Approve & Release System**: Buyers can manually click **Approve & Release Funds** in *My Orders* to instantly transfer funds to the seller's balance upon successful takeover.
- **Dispute & Fraud Reporting**: Buyers can register an escrow dispute if credentials are invalid, freezing payouts pending support review.
- **Seller Identity Verification (KYC)**: Sellers verify identity via Government IDs (**Aadhaar 12-digit / PAN 10-char**) to receive a **`Verified Seller ✓`** badge.
- **Automated Metrics Verifier**: Auto-validates account follower metrics to assign a **`Verified Account ✓`** tag.
- **Owner Self-Purchase Prevention**: Server-enforced checks preventing listing owners from purchasing their own assets.

### 🛒 Buyer & Creator Marketplace
- **Indian Market Localization**: Built-in support for **INR (`₹`)** pricing, Razorpay payment flows (UPI, Netbanking, Cards, Wallets), and Brevo SMTP transactional emails.
- **Advanced Filtering**: Filter accounts by platform, follower count, engagement rate, monthly views, niche, country, and monetization status.
- **Screenshot Proof & Analytics**: Interactive image carousels and verified analytics proof uploads.

### 💬 Real-Time Messaging & Escrow Payouts
- **Live Buyer-Seller Chat**: Real-time communication powered by **WebSockets (`ws`)** with REST fallbacks.
- **Direct Payout Withdrawals**: Sellers manage earnings and submit direct bank withdrawal requests once escrow holds complete.

---

## 🛠️ Tech Stack & Architecture

### **Frontend (`/client`)**
| Technology | Description |
| :--- | :--- |
| **React 19** | UI Library for dynamic components |
| **Vite 7** | Fast frontend build tooling & dev server |
| **Tailwind CSS v4** | Utility-first styling engine with `@tailwindcss/vite` |
| **Redux Toolkit** | Centralized global state management |
| **React Router DOM v7** | Client-side Single Page Application routing |
| **Clerk React** | User authentication UI components & hooks |
| **Lucide React** | Modern UI icon set |
| **React Hot Toast** | Toast notification feedback |

### **Backend (`/server`)**
| Technology | Description |
| :--- | :--- |
| **Node.js & Express 5** | RESTful API server framework |
| **MongoDB & Mongoose 7** | NoSQL database & ODM modeling |
| **Google Gemini AI SDK** | `@google/genai` 2.0 Flash AI for valuation & copy generation |
| **WebSockets (`ws`)** | Real-time bidirectional chat communication |
| **Clerk Express** | Express authentication middleware & token validation |
| **Razorpay SDK** | Order creation & payment HMAC signature verification |
| **ImageKit & Multer** | Cloud media storage & multipart image uploading |
| **Inngest** | Event-driven background job orchestration |
| **Nodemailer & Brevo** | Instant transactional SMTP email delivery |

---

## ⚙️ Environment Variables Setup

### 1. Server Environment (`server/.env`)
```env
NODE_ENV="development"
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hypp
GEMINI_API_KEY=your_gemini_api_key
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
SENDER_EMAIL=your_email@gmail.com
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
INNGEST_EVENT_KEY=your_inngest_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

### 2. Client Environment (`client/.env`)
```env
VITE_BASEURL="http://localhost:3000"
VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."
VITE_CURRENCY="₹"
```

---

## 🚀 Quickstart & Local Running

```bash
# Clone repository
git clone https://github.com/Nand24/Hypp.git
cd Hypp

# Install dependencies
cd client && npm install
cd ../server && npm install

# Run backend (Terminal 1)
cd server
npm run server

# Run frontend (Terminal 2)
cd client
npm run dev
```

---

## 📜 License

This project is open-source under the **ISC License**.
