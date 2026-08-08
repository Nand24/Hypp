# Hypp — MERN Conversion

This repository has been converted to a standard MERN stack layout:

- `client/` — React (Vite) frontend
- `server/` — Express + Mongoose backend

Getting started

1. Copy example env files and update values:

   - `server/.env` — set `MONGODB_URI`, Clerk, Stripe, SMTP values
   - `client/.env` — set `VITE_BASEURL` to your server URL (default: `http://localhost:3000`)

2. Install dependencies and run both apps:

```bash
# from repo root
npm install
npm run dev
```

Or run server alone:

```bash
cd server
npm install
npm run server
```

Smoke tests

```bash
cd server
npm run smoke
```

Notes

- Server now uses Mongoose models in `server/models`.
- Inngest event handlers were migrated to use Mongoose.
- Keep `server/.env` secure — do not commit secrets.

If you want, I can:
- Add Dockerfiles for local dev
- Wire CI scripts to run tests
- Regenerate lockfiles and confirm dependency installs
