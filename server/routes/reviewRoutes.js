const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createReview,
  getSessionReviews,
  getUserReviews,
  getMyReviews,
  checkSessionReview,
} = require("../controllers/reviewController");

// Create a review
router.post("/", authMiddleware, createReview);

// Get reviews for a session
router.get("/session/:sessionId", getSessionReviews);

// Get reviews for a user
router.get("/user/:userId", getUserReviews);

// Get reviews written by logged-in user
router.get("/my", authMiddleware, getMyReviews);

// Check if logged-in user has reviewed a session
router.get("/check/:sessionId", authMiddleware, checkSessionReview);

module.exports = router;