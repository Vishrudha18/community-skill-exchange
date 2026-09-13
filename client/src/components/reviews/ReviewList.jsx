import { useEffect, useState } from "react";
import axios from "axios";
import ReviewCard from "./ReviewCard";

const ReviewList = ({ userId }) => {
const [reviews, setReviews] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
const fetchReviews = async () => {
try {
const res = await axios.get(
`http://localhost:5000/api/reviews/user/${userId}`
);

    setReviews(res.data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

if (!userId) {
  setLoading(false);
  return;
}

fetchReviews();

}, [userId]);

if (loading) {
return <p>Loading reviews...</p>;
}

if (reviews.length === 0) {
return <p>No reviews yet.</p>;
}

return ( <div>
{reviews.map((review) => ( <ReviewCard
       key={review._id}
       review={review}
     />
))} </div>
);
};

export default ReviewList;
