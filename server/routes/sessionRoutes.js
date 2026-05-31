const express = require("express");
const router = express.Router();

const {
  getMySessions,
  getSessionById,
  scheduleSession,
  cancelSession,
  bookSession, // ✅ NEW
  getBookedSlots,
} = require("../controllers/sessionController");

const authMiddleware = require("../middleware/authMiddleware");

// ✅ EXISTING
router.get("/my", authMiddleware, getMySessions);
router.get("/:id", authMiddleware, getSessionById);
router.put("/:id/schedule", authMiddleware, scheduleSession);
router.put("/:id/cancel", authMiddleware, cancelSession);

// ✅ NEW BOOKING ROUTE
router.post("/book", authMiddleware, bookSession);
router.get("/booked-slots", getBookedSlots);

module.exports = router;