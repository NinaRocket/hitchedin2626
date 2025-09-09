const express = require("express");
// const router = express.Router();
const Rsvp = require("../models/Rsvp");
import { Router } from "express";
const router = Router();

router.post("/", async (req, res) => {
    console.log("Received RSVP:", req.body);
  const { name, attending, guest, guestCount, notes } = req.body;


  try {
    const newRsvp = new Rsvp({ name, attending, guest, guestCount, notes });
    await newRsvp.save();
    res.status(200).json({ message: "RSVP saved successfully!" });
  } catch (err) {
    console.error("Error saving RSVP:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/admin", async (req, res) => {
  const password = req.query.password;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const rsvps = await Rsvp.find().sort({ timestamp: -1 }); // most recent first
    res.status(200).json(rsvps);
  } catch (err) {
    console.error("Error fetching RSVPs:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// ADMIN DELETE: DELETE /rsvp/:id?password=...
router.delete("/admin/:id", async (req, res) => {
  const { id } = req.params;
  const password = req.query.password;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    console.log("Attempting delete:", { id });
    const deleted = await Rsvp.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "RSVP not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error("Error deleting RSVP:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});


module.exports = router;
