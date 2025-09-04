const express = require("express");
const router = express.Router();
const Rsvp = require("../models/Rsvp");

router.post("/", async (req, res) => {
    console.log("Received RSVP:", req.body);
  const { name, attending, guest, guestCount, notes, password } = req.body;

  // if (password !== process.env.RSVP_PASSWORD) {
  //   return res.status(401).json({ error: "Invalid password" });
  // }

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


module.exports = router;
