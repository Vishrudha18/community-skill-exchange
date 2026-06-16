import React from "react";
import "./StarRating.css";

const StarRating = ({
  rating = 0,
  setRating,
  interactive = false,
  size = 24,
}) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? "filled" : ""}`}
          style={{
            fontSize: `${size}px`,
            cursor: interactive ? "pointer" : "default",
          }}
          onClick={() => {
            if (interactive && setRating) {
              setRating(star);
            }
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;