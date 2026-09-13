const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
    },

    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SkillRequest",
    },

    title: {
      type: String,
      default: "Skill Learning Session",
    },

    description: String,

    // Schedule
    scheduledAt: Date,
    duration: Number,

    // Availability System
    day: String,
    slotStart: String,
    slotEnd: String,

    // NEW: Actual meeting timestamps
    startedAt: {
      type: Date,
      default: null,
    },

    endedAt: {
      type: Date,
      default: null,
    },

    // NEW: Track who has joined
    teacherJoined: {
      type: Boolean,
      default: false,
    },

    learnerJoined: {
      type: Boolean,
      default: false,
    },

    meetingType: {
      type: String,
      enum: ["audio", "video", "document"],
      default: "video",
    },

    meetingLink: String,

    type: {
      type: String,
      enum: ["request", "booking"],
      default: "request",
    },

    reviewedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: ["scheduled", "live", "completed", "cancelled", "missed"],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Session", sessionSchema);