const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getSessionMessages,
  markSessionMessagesRead,
} = require("../controllers/messageController");

// GET message history for a session
router.get("/:sessionId", authMiddleware, getSessionMessages);

// PATCH mark all messages in a session as read
router.patch("/:sessionId/read", authMiddleware, markSessionMessagesRead);

module.exports = router;
