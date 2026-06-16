import StarRating from "./StarRating";
import "./ReviewCard.css";

const ReviewCard = ({ review }) => {
  return (
    <div className="review-card">
      <div className="review-header">
        <h4>{review.reviewer?.name || "Anonymous"}</h4>

        <StarRating
          rating={review.rating}
          interactive={false}
          size={18}
        />
      </div>

      {review.comment && (
        <p className="review-comment">{review.comment}</p>
      )}

      <small className="review-date">
        {new Date(review.createdAt).toLocaleDateString()}
      </small>
    </div>
  );
};

export default ReviewCard;