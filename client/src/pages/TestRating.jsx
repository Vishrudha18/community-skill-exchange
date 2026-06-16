import { useState } from "react";
import ReviewForm from "../components/reviews/ReviewForm";
import ReviewCard from "../components/reviews/ReviewCard";
import ReviewList from "../components/reviews/ReviewList";
import RatingSummary from "../components/reviews/RatingSummary";const TestRating = () => {

  const [refresh, setRefresh] = useState(false);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Review Form Test</h1>

      <ReviewForm
        sessionId="6a2f90d98581a306d92ab5fb"
        onReviewSubmitted={() => setRefresh(!refresh)}
      />

      <ReviewCard
  review={{
    reviewer: {
      name: "User One",
    },
    rating: 5,
    comment: "Excellent teaching experience!",
    createdAt: new Date(),
  }}
/>
<ReviewList userId="6990173cca66d8ef5bf9e572" />

<RatingSummary
  averageRating={5}
  reviewCount={2}
/>
    </div>
  );
};

export default TestRating;