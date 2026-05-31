const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  learner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill" },
  request: { type: mongoose.Schema.Types.ObjectId, ref: "SkillRequest" },

  title: { type: String, default: "Skill Learning Session" },
  description: String,

  // 📅 EXISTING
  scheduledAt: Date,
  duration: Number,

  // 🆕 ADD THIS (FOR AVAILABILITY SYSTEM)
  day: String,
  slotStart: String,
  slotEnd: String,

  meetingType: {
    type: String,
    enum: ["audio", "video", "document"],
    default: "video",
  },

  meetingLink: String,

  type: {
  type: String,
  enum: ["request", "booking"],
  default: "request"
},

  status: {
    type: String,
    enum: ["scheduled", "live", "completed", "cancelled"],
    default: "scheduled",
  },
}, { timestamps: true });

module.exports = mongoose.model("Session", sessionSchema);