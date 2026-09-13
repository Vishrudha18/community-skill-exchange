import StarRating from "./StarRating";
import "./ReviewCard.css";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

const ReviewCard = ({ review }) => {
  const reviewerName = review.reviewer?.name || "Anonymous";

  return (
    <div className="review-card">
      <div className="review-card-glow" aria-hidden="true" />

      <div className="review-header">
        <div className="review-reviewer">
          <div className="review-avatar">
            {reviewerName !== "Anonymous" ? getInitials(reviewerName) : "?"}
          </div>
          <div>
            <h4>{reviewerName}</h4>
            <small className="review-date">
              {new Date(review.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </small>
          </div>
        </div>

        <StarRating rating={review.rating} interactive={false} size={18} />
      </div>

      {review.comment && <p className="review-comment">{review.comment}</p>}
    </div>
  );
};

export default ReviewCard;
