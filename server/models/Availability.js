const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  day: {
    type: String, // "Monday", "Tuesday"
    required: true,
  },
  slots: [
    {
      startTime: String, // "10:00"
      endTime: String,   // "11:00"
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Availability", availabilitySchema);