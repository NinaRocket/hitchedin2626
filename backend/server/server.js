// backend/server/server.js  (ESM)
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// If your route files are CommonJS (`module.exports = router`) this still works:
// ESM default import will grab module.exports.
import rsvpPublic from "./routes/rsvp.js";   // public submit/list/etc.
import rsvpAdmin  from "./routes/admin.js";  // admin-only routes

dotenv.config();

const app = express();
app.use(express.json());

// CORS — lock to your site(s)
const allowed = (process.env.CLIENT_ORIGIN_LIST ||
  "https://ninajohnny4ever.com,https://www.ninajohnny4ever.com")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => cb(null, !origin || allowed.includes(origin)),
  credentials: true
}));

// Routes (NOTE: backend serves /rsvp and /admin; Vercel rewrites /api/* → this host)
app.use("/api/rsvp", rsvpPublic);
app.use("/api/admin", rsvpAdmin);


// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.get('/healthz', (_req, res) => {
  const mongoUp = mongoose.connection.readyState === 1; // 1 = connected
  res.status(mongoUp ? 200 : 500).json({ ok: mongoUp });
});

// --- MongoDB ---
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!mongoUri) {
  console.warn("⚠️  No MONGODB_URI/MONGO_URI set; skipping DB connect.");
} else {
  mongoose.connect(mongoUri)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB error:", err));
}
mongoose.connection.on("error", err => console.error("❌ MongoDB connection error:", err));

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`API listening on ${PORT}`));
