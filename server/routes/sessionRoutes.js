const express = require("express");
const router = express.Router();

const {
  getMySessions,
  getSessionById,
  bookSession,
  scheduleSession,
  cancelSession,
  completeSession,
  markSessionLive,
  getBookedSlots,
} = require("../controllers/sessionController");

const authMiddleware = require("../middleware/authMiddleware");

// ✅ EXISTING
router.get("/my", authMiddleware, getMySessions);

// 🔧 must come before "/:id" — otherwise Express treats "booked-slots" as an id
router.get("/booked-slots", getBookedSlots);

router.get("/:id", authMiddleware, getSessionById);
router.put("/:id/schedule", authMiddleware, scheduleSession);
router.put("/:id/live", authMiddleware, markSessionLive);
router.put("/:id/cancel", authMiddleware, cancelSession);
router.put("/:id/complete", authMiddleware, completeSession);

// ✅ NEW BOOKING ROUTE
router.post("/book", authMiddleware, bookSession);

module.exports = router;