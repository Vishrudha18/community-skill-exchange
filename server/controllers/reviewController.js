const Review = require("../models/Review");
const Session = require("../models/Session");
const User = require("../models/User");

/* ===========================
   Helper: Update User Rating
=========================== */
const updateUserRating = async (userId) => {
  const reviews = await Review.find({ reviewee: userId });

  const reviewCount = reviews.length;

  const averageRating =
    reviewCount === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount;

  await User.findByIdAndUpdate(userId, {
    averageRating: Number(averageRating.toFixed(1)),
    reviewCount,
  });
};

/* ===========================
   CREATE REVIEW
=========================== */
exports.createReview = async (req, res) => {
  try {
    const { sessionId, rating, comment } = req.body;

    if (!sessionId || !rating) {
      return res.status(400).json({
        message: "Session and rating are required",
      });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    if (session.status !== "completed") {
      return res.status(400).json({
        message: "Reviews are only allowed after session completion",
      });
    }

    const userId = req.user.id;

    const isTeacher =
      session.teacher.toString() === userId;

    const isLearner =
      session.learner.toString() === userId;

    if (!isTeacher && !isLearner) {
      return res.status(403).json({
        message: "You are not part of this session",
      });
    }

    const reviewee = isTeacher
      ? session.learner
      : session.teacher;

    if (reviewee.toString() === userId) {
      return res.status(400).json({
        message: "You cannot review yourself",
      });
    }

    const alreadyReviewed = await Review.findOne({
      session: sessionId,
      reviewer: userId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You have already reviewed this session",
      });
    }

    const review = await Review.create({
      session: sessionId,
      reviewer: userId,
      reviewee,
      rating,
      comment,
    });

    if (!session.reviewedBy.includes(userId)) {
  session.reviewedBy.push(userId);
  await session.save();
}

    await updateUserRating(reviewee);

    res.status(201).json(review);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create review",
    });
  }
};

/* ===========================
   GET SESSION REVIEWS
=========================== */
exports.getSessionReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      session: req.params.sessionId,
    })
      .populate("reviewer", "name averageRating")
      .populate("reviewee", "name averageRating");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch session reviews",
    });
  }
};

/* ===========================
   GET USER REVIEWS
=========================== */
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      reviewee: req.params.userId,
    })
      .populate("reviewer", "name")
      .populate("session")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user reviews",
    });
  }
};

/* ===========================
   GET MY REVIEWS
=========================== */
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      reviewer: req.user.id,
    })
      .populate("reviewee", "name averageRating reviewCount")
      .populate("session");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch your reviews",
    });
  }
};

/* ===========================
   CHECK SESSION REVIEW
=========================== */
exports.checkSessionReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      session: req.params.sessionId,
      reviewer: req.user.id,
    });

    res.json({
      reviewed: !!review,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to check review status",
    });
  }
};