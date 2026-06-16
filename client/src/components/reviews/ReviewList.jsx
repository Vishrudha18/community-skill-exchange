import { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";

const ReviewList = ({ userId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/reviews/user/${userId}`
        );

        const data = await res.json();

        if (res.ok) {
          setReviews(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchReviews();
    }
  }, [userId]);

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  if (reviews.length === 0) {
    return <p>No reviews yet.</p>;
  }

  return (
    <div>
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;