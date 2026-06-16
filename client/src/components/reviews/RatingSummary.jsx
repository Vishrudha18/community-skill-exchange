import StarRating from "./StarRating";
import "./RatingSummary.css";

const RatingSummary = ({ averageRating = 0, reviewCount = 0 }) => {
  return (
    <div className="rating-summary">
      <StarRating
        rating={averageRating}
        interactive={false}
        size={20}
      />

      <span className="rating-value">
        {averageRating.toFixed(1)}
      </span>

      <span className="review-count">
        ({reviewCount} {reviewCount === 1 ? "Review" : "Reviews"})
      </span>
    </div>
  );
};

export default RatingSummary;