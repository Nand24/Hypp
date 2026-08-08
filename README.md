# hypp. — Premier Social Media Account Marketplace

<p align="center">
  <img src="client/src/assets/logo.svg" alt="hypp logo" width="180"/>
</p>

<p align="center">
  <b>A secure, full-stack MERN marketplace platform for buying and selling verified social media accounts with automated escrow protection.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite 7" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Node.js-Express_5-339933?logo=nodedotjs&logoColor=white" alt="Node.js Express" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Authentication-Clerk-6C47FF?logo=clerk&logoColor=white" alt="Clerk Auth" />
  <img src="https://img.shields.io/badge/Payments-Stripe-008CDD?logo=stripe&logoColor=white" alt="Stripe" />
</p>

---

## 🌟 Overview

**hypp.** is an enterprise-grade MERN (MongoDB, Express, React, Node.js) web application designed for social media account buyers, creators, and digital entrepreneurs. It provides a safe, transparent ecosystem to list, discover, negotiate, and acquire established social media profiles (YouTube, Instagram, TikTok, Twitter, Pinterest, Twitch, and Snapchat) with guaranteed escrow protection and automated credential verification.

---

## ✨ Key Features

### 🛒 Buyer & Creator Marketplace
- **Verified Listings**: Filter accounts by platform, follower count, engagement rate, monthly views, niche, country, and monetization status.
- **Audience Metrics & Proof**: Interactive screenshot carousels and verified analytics proof.
- **Search & Advanced Filtering**: Search listings by keyword, niche tags, or category.

### 🔒 Escrow & Safe Credential Exchange
- **Stripe Checkout Integration**: Secure card payment handling with automated payment links.
- **Credential Protection Workflow**: Two-step credential verification ensuring account details are validated before funds are released to sellers.
- **Seller Payouts & Withdrawals**: Account earnings management with bank withdrawal requests.

### 💬 Real-Time Messaging
- **Live Buyer-Seller Chat**: Real-time communication powered by **WebSockets (`ws`)** and REST fallbacks.
- **Direct Inquiry**: Instant chat initiation directly tied to individual listing IDs.

### ⚡ Background Jobs & Webhook Automation (Inngest)
- **User Synchronization**: Synchronizes Clerk user creation, profile updates, and account deletions directly to MongoDB.
- **Payment Verification**: Asynchronous Stripe event processing for order fulfillment.
- **Email Notifications**: Automated transactional emails (order confirmations, credential release updates) powered by **Nodemailer**.

### 🛡️ Security & Authentication
- **Clerk Authentication**: JWT-based session security and social sign-ins.
- **Role-Based Access Control**: Separate permissions for general users and site administrators.

---

## 🛠️ Tech Stack & Architecture

### **Frontend (`/client`)**
| Technology | Description |
| :--- | :--- |
| **React 19** | UI Library for dynamic components |
| **Vite 7** | Next-generation fast frontend tooling |
| **Tailwind CSS v4** | Utility-first styling engine with `@tailwindcss/vite` |
| **Redux Toolkit** | Centralized global state management (Listings, Chat) |
| **React Router DOM v7** | Client-side Single Page Application (SPA) routing |
| **Clerk React** | User authentication UI components & hook wrappers |
| **Lucide React** | Modern icon set |
| **React Hot Toast** | Toast notification feedback |

### **Backend (`/server`)**
| Technology | Description |
| :--- | :--- |
| **Node.js & Express 5** | RESTful API server framework |
| **MongoDB & Mongoose 7** | NoSQL database & ODM modeling |
| **WebSockets (`ws`)** | Real-time bidirectional chat communication |
| **Clerk Express** | Express authentication middleware & token validation |
| **Stripe SDK** | Checkout session & payment link creation |
| **ImageKit & Multer** | Cloud media storage & multipart image uploading |
| **Inngest** | Event-driven background job orchestration & webhooks |
| **Nodemailer** | SMTP transactional email service |

---

## 📁 Repository Structure

```
Hypp/
├── client/                     # Frontend (React 19 + Vite)
│   ├── public/                 # Static assets & favicon.svg
│   ├── src/
│   │   ├── app/                # Redux Toolkit store & slices
│   │   ├── assets/             # Branding icons & dummy data
│   │   ├── components/         # Reusable UI components (Navbar, Hero, Cards, Features, CTA, Footer)
│   │   ├── configs/            # Axios instance configuration
│   │   ├── pages/              # SPA Pages (Home, Marketplace, ListingDetails, Messages, MyListings, MyOrders)
│   │   ├── index.css           # Global Tailwind CSS v4 styles
│   │   └── main.jsx            # React root mount & providers
│   ├── netlify.toml            # Netlify deployment & SPA rewrite rules
│   ├── package.json
│   └── vite.config.js          # Vite configuration with Tailwind plugin
│
├── server/                     # Backend API (Express 5 + Mongoose)
│   ├── configs/                # MongoDB, ImageKit, & Stripe configurations
│   ├── controllers/            # Business logic (admin, chat, listing controllers)
│   ├── inngest/                # Inngest functions & webhook event handlers
│   ├── middlewares/            # Clerk auth & upload middlewares
│   ├── models/                 # Mongoose schemas (User, Listing, Chat, Message, Order, Credential, Withdrawal)
│   ├── routes/                 # Express API route modules
│   ├── scripts/                # Database smoke tests & verification scripts
│   ├── package.json
│   └── server.js               # Entry point (Express app & WebSocket server)
│
├── netlify.toml                # Monorepo build configuration
└── README.md
```

---

## ⚙️ Environment Variables Setup

### 1. Server Environment (`server/.env`)
Create a `.env` file in the `server` directory:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hypp
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
STRIPE_SECRET_KEY=sk_test_...
IMAGEKIT_PUBLIC_KEY=public_...
IMAGEKIT_PRIVATE_KEY=private_...
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
INNGEST_EVENT_KEY=your_inngest_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

### 2. Client Environment (`client/.env`)
Create a `.env` file in the `client` directory:

```env
VITE_BASEURL="https://hypp.onrender.com"  # Or http://localhost:3000 for local development
VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."
VITE_CURRENCY="$"
```

---

## 🚀 Quickstart & Local Installation

### Prerequisites
- Node.js `v18.x` or higher
- MongoDB cluster or local instance

### Step 1: Clone the repository
```bash
git clone https://github.com/Nand24/Hypp.git
cd Hypp
```

### Step 2: Install dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### Step 3: Run local development servers
To start both the client and server concurrently from the root directory:
```bash
npm run dev
```

Or run them individually in separate terminals:

```bash
# Terminal 1: Backend Server
cd server
npm run server

# Terminal 2: Frontend Client
cd client
npm run dev
```

---

## 🌐 Live Deployments

- **Backend API**: Hosted on Render (`https://hypp.onrender.com`)
- **Frontend App**: Deployed on Netlify with automated continuous deployment from GitHub `main` branch.

---

## 📜 License

This project is open-source under the **ISC License**.
