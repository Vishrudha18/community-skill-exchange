const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    senderName: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    type: {
      type: String,
      enum: ["text", "system"],
      default: "text",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Primary query pattern — fetch history for a session in order
messageSchema.index({ session: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);
