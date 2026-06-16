import { useState } from "react";
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

      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId,
          rating,
          comment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to submit review");
        return;
      }

      alert("Review submitted successfully!");

      setRating(0);
      setComment("");

      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Leave a Review</h3>

      <StarRating
        rating={rating}
        setRating={setRating}
        interactive={true}
      />

      <textarea
        placeholder="Write your feedback..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;