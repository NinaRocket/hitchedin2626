// backend/server/models/Rsvp.js  (ESM)
import mongoose from "mongoose";

const RsvpSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {type: String, required: true},
    attending: { type: Boolean, default: false },
    guest: { type: String, default: "" },
    guestCount: { type: Number, default: 0 },
    notes: { type: String, default: "" }
  },
  { timestamps: true } // adds createdAt / updatedAt
);

// One model, default export
const Rsvp = mongoose.model("Rsvp", RsvpSchema);
export default Rsvp;
// (optional) also provide a named export for flexibility
export { Rsvp };
