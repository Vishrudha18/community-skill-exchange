const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    session: {   // ✅ USE ONLY THIS
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

    fileName: String,
    fileUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);