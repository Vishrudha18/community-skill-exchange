const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createRequest,
  getReceivedRequests,
  getSentRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  getRequestCount,
} = require("../controllers/requestController");

/* CREATE */
router.post("/", authMiddleware, createRequest);

/* FETCH */
router.get("/received", authMiddleware, getReceivedRequests);
router.get("/sent", authMiddleware, getSentRequests);

/* ACTIONS */
router.put("/:id/accept", authMiddleware, acceptRequest);
router.put("/:id/reject", authMiddleware, rejectRequest);
router.put("/:id/cancel", authMiddleware, cancelRequest);

/* COUNT */
router.get("/count", authMiddleware, getRequestCount);

module.exports = router;