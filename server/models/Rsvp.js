const mongoose = require("mongoose");

const RsvpSchema = new mongoose.Schema({
  name: { type: String, required: true },
  attending: { type: String, required: true },
  guest: { type: String },
  meal: { type: String },
  notes: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Rsvp", RsvpSchema);
