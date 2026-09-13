import { useState } from "react";
import axios from "axios";
import { FiMessageSquare, FiSend, FiLoader } from "react-icons/fi";
import StarRating from "./StarRating";
import "./ReviewForm.css";

const ReviewForm = ({ sessionId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/reviews",
        {
          sessionId,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Review submitted successfully!");

      setRating(0);
      setComment("");

      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="review-form-card" onSubmit={handleSubmit}>
      <div className="review-form-glow" aria-hidden="true" />

      <div className="review-form-header">
        <span className="review-form-icon-box">
          <FiMessageSquare />
        </span>
        <div>
          <h3>Leave a Review</h3>
          <p className="review-form-subtitle">
            Share your experience with this session
          </p>
        </div>
      </div>

      <div className="review-form-field">
        <span className="review-form-label">Your Rating</span>
        <StarRating rating={rating} setRating={setRating} interactive={true} />
      </div>

      <div className="review-form-field">
        <span className="review-form-label">Your Feedback</span>
        <textarea
          className="review-form-textarea"
          placeholder="Write your feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />
      </div>

      <button
        type="submit"
        className="review-form-submit-btn"
        disabled={loading}
      >
        {loading ? (
          <>
            <FiLoader className="review-form-spin" />
            Submitting...
          </>
        ) : (
          <>
            <FiSend />
            Submit Review
          </>
        )}
      </button>
    </form>
  );
};

export default ReviewForm;
