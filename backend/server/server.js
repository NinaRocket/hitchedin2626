const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const rsvpRoutes = require("./routes/rsvp");

dotenv.config();
const app = express();

import cors from 'cors';
const allowed = ['https://ninajohnny4ever.com'];
app.use(cors({
  origin: (origin, cb) => cb(null, !origin || allowed.includes(origin)),
  credentials: true
}));


app.use(express.json());
app.use(express.static(path.join(__dirname, "../client"))); // Serve static frontend

// Routes
app.use("/rsvp", rsvpRoutes);

const rsvpPublic = require("./routes/rsvp");   // public submit
const rsvpAdmin  = require("./routes/admin");  // admin list/delete
app.use("/rsvp", rsvpPublic);
app.use("/admin", rsvpAdmin);

mongoose.connection.on("connected", () => {
  console.log("✅ Connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

// MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Serve index.html on root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log('API on', PORT));
