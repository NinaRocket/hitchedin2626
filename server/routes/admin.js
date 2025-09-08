const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Rsvp = require("../models/Rsvp");

// GET /admin?password=...
router.get("/", async (req, res) => {
  const { password } = req.query;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const rsvps = await Rsvp.find().sort({ timestamp: -1 }); // you already store timestamp
    res.json(rsvps);
  } catch (err) {
    console.error("Error fetching RSVPs:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /admin/:id?password=...
router.delete("/:id", async (req, res) => {
  const { password } = req.query;
  const { id } = req.params;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid RSVP id" });
  }

  try {
    const deleted = await Rsvp.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "RSVP not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error("Error deleting RSVP:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
