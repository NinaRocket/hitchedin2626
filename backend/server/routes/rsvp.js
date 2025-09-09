// backend/server/routes/rsvp.js  (ESM)
import { Router } from "express";

// Robust import: supports either `export default Rsvp` or `export const Rsvp = ...`
import * as RsvpModel from "../models/Rsvp.js";
const Rsvp = RsvpModel.default ?? RsvpModel.Rsvp;

const router = Router();

/**
 * POST /rsvp  (create)
 */
router.post("/", async (req, res) => {
  console.log("Received RSVP:", req.body);
  const { name, attending, guest, guestCount, notes } = req.body;

  try {
    const newRsvp = await Rsvp.create({ name, attending, guest, guestCount, notes });
    res.status(201).json({ message: "RSVP saved successfully!", id: newRsvp._id });
  } catch (err) {
    console.error("Error saving RSVP:", err);
    res.status(400).json({ error: "Invalid RSVP data" });
  }
});

/**
 * GET /rsvp/admin?password=...
 * Lists RSVPs (newest first)
 */
router.get("/admin", async (req, res) => {
  const { password } = req.query;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // If your schema uses { timestamps: true }, use createdAt. Otherwise keep `timestamp`.
    const items = await Rsvp.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("Error fetching RSVPs:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * DELETE /rsvp/admin/:id?password=...
 */
router.delete("/admin/:id", async (req, res) => {
  const { id } = req.params;
  const { password } = req.query;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const deleted = await Rsvp.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "RSVP not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error("Error deleting RSVP:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

export default router;
