import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SessionDetails.css";
import "../../../components/session/SessionReview.css";
import { FiStar, FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import ReviewForm from "../../../components/reviews/ReviewForm";
import ReviewCard from "../../../components/reviews/ReviewCard";
import SessionHero from "../../../components/session/SessionHero";
import SessionInfo from "../../../components/session/SessionInfo";
import SessionParticipants from "../../../components/session/SessionParticipants";
import SessionStatus from "../../../components/session/SessionStatus";
import SessionNotes from "../../../components/session/SessionNotes";
import SessionDocuments from "../../../components/session/SessionDocuments";
import SessionSchedule, { ScheduleWaiting } from "../../../components/session/SessionSchedule";
import SessionActions from "../../../components/session/SessionActions";

function SessionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [reviews, setReviews] = useState([]);

  const userId = localStorage.getItem("userId");
  const isTeacher = session?.teacher?._id === userId;
  const isLearner = session?.learner?._id === userId;
  // 🔥 Fetch session
  const fetchSession = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`/api/sessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSession(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  const checkReviewStatus = useCallback(async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `/api/reviews/check/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setReviewed(res.data.reviewed);
  } catch (err) {
    console.error(err);
  }
}, [id]);

const fetchReviews = useCallback(async () => {
  try {
    const res = await axios.get(
      `/api/reviews/session/${id}`
    );

    setReviews(res.data);
  } catch (err) {
    console.error(err);
  }
}, [id]);

useEffect(() => {
  fetchSession();
  checkReviewStatus();
  fetchReviews();
}, [
  fetchSession,
  checkReviewStatus,
  fetchReviews,
]);

  // 🔥 Schedule
  const handleSchedule = async () => {
    try {
      const token = localStorage.getItem("token");
      const scheduledAt = new Date(`${date}T${time}`);

      await axios.put(
  `/api/sessions/${id}/schedule`,
  { scheduledAt },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      fetchSession();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Cancel
  const handleCancel = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `/api/sessions/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchSession();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Start Meeting (teacher only, scheduled -> live)
  const handleStartMeeting = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `/api/sessions/${id}/live`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`/live/${id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to start meeting");
    }
  };

  // 🔥 End Meeting (teacher only, live -> completed)
  const handleEndSession = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `/api/sessions/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchSession();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to end session");
    }
  };

  if (!session) return <p>Loading...</p>;

  const showStartMeeting =
    isTeacher && session.status === "scheduled" && !!session.scheduledAt;

  return (
    <div className="session-wrapper">
      <div className="session-card">

        <button
          type="button"
          className="back-link"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft />
          Back to Sessions
        </button>

        <div className="page-header">
          <h1>
            Session <span className="gradient-text">Details</span>
          </h1>
          <p>View and manage your learning session</p>
        </div>

        {/* HEADER */}
        <SessionHero session={session} />
        
        {/* INFO */}
        <SessionInfo session={session} />

        {/* PARTICIPANTS */}
        <SessionParticipants
          session={session}
          isTeacher={isTeacher}
          isLearner={isLearner}
        />

        {session.status === "missed" && (
  <div className="missed-box">
    ⚠️ This session was missed because the
    meeting was not started within 30 minutes
    of the scheduled time.
  </div>
)}

        {/* ✅ ONLY SHOW SCHEDULE IF NOT SCHEDULED */}
        {!session.scheduledAt &&
  isTeacher &&
  session.type !== "booking" && (
          <SessionSchedule
            date={date}
            time={time}
            setDate={setDate}
            setTime={setTime}
            onSchedule={handleSchedule}
          />
        )}

        {!session.scheduledAt && !isTeacher && <ScheduleWaiting />}

        {/* STATUS + NOTES */}
        <div className="status-notes-grid">
          <SessionStatus session={session} />
          <SessionNotes session={session} />
        </div>

        {/* CLASS MATERIALS */}
        <SessionDocuments sessionId={session._id} isTeacher={isTeacher}/>

        {/* ACTIONS */}
        <SessionActions
          session={session}
          isTeacher={isTeacher}
          showStartMeeting={showStartMeeting}
          onStartMeeting={handleStartMeeting}
          onEndSession={handleEndSession}
          onCancel={handleCancel}
          onJoin={() => navigate(`/live/${session._id}`)}
        />

        {session.status === "completed" && (
  <div className="review-section-card">
    <div className="review-section-header">
      <span className="review-section-icon-box">
        <FiStar />
      </span>
      <h3>Session Review</h3>
    </div>

    {/* Learner can review */}
    {!reviewed &&
  isLearner && (
        <ReviewForm
          sessionId={session._id}
          onReviewSubmitted={() => {
            checkReviewStatus();
            fetchSession();
            fetchReviews();
          }}
        />
      )}

    {/* Already reviewed */}
    {reviewed &&
  isLearner && (
        <div className="review-already-badge">
          <FiCheckCircle />
          You have already reviewed this session.
        </div>
      )}

    {/* Show reviews to both users */}
    {reviews.length > 0 && (
      <div className="reviews-list">
        <h4 className="reviews-list-title">
          <FiStar />
          Reviews
        </h4>

        {reviews.map((review) => (
          <ReviewCard
            key={review._id}
            review={review}
          />
        ))}
      </div>
    )}
  </div>
)}

      </div>
    </div>
  );
}

export default SessionDetails;