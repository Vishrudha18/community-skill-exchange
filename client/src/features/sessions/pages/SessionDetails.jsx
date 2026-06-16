import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SessionDetails.css";
import ReviewForm from "../../../components/reviews/ReviewForm";

function SessionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reviewed, setReviewed] = useState(false);

  const userId = localStorage.getItem("userId");
  const isTeacher = session?.teacher?._id === userId;

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

useEffect(() => {
  fetchSession();
  checkReviewStatus();
}, [fetchSession, checkReviewStatus]);

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

  if (!session) return <p>Loading...</p>;

  return (
    <div className="session-wrapper">
      <div className="session-card">

        {/* HEADER */}
        <div className="session-header">
          <h2>{session.title}</h2>

          <p className="countdown">
  {session.status === "scheduled" && "📅 Scheduled"}
  {session.status === "live" && "🔴 Live Now"}
  {session.status === "completed" && "✅ Session Completed"}
  {session.status === "cancelled" && "❌ Cancelled"}
</p>

          <div className="status-box">
            <span className={`status ${session.status}`}>
              {session.status}
            </span>

            {session.status === "live" && (
  <span className="live-badge">🔴 LIVE</span>
)}
          </div>
        </div>

        {/* INFO */}
        <div className="session-info">
          <p><span>Skill</span> {session.skill?.name}</p>

          <p>
            <span>Scheduled</span>{" "}
            {session.scheduledAt
              ? new Date(session.scheduledAt).toLocaleString()
              : "Not scheduled"}
          </p>

          <p>
  <span>Teacher:</span> {session.teacher?.name}
</p>

<p>
  <span>Learner:</span> {session.learner?.name}
</p>

        </div>

        {/* ✅ ONLY SHOW SCHEDULE IF NOT SCHEDULED */}
        {!session.scheduledAt &&
  isTeacher &&
  session.type !== "booking" && (
          <div className="schedule-box">
            <h4>Schedule Session</h4>

            <div className="inputs">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <button className="primary-btn" onClick={handleSchedule}>
              Save Schedule
            </button>
          </div>
        )}

        {!session.scheduledAt && !isTeacher && (
          <p className="waiting-text">
            Waiting for teacher to schedule...
          </p>
        )}

        {/* ACTIONS */}
        <div className="actions">
          {session.status !== "completed" &&
 session.status !== "cancelled" && (
  <button
  className="join-btn"
  disabled={session.status !== "live"}
  onClick={() => navigate(`/live/${session._id}`)}
>
  {session.status === "live"
    ? "Join Session"
    : "Waiting for Teacher to Start"}
</button>
)}

{isTeacher && session.status === "live" && (
  <button className="end-btn">
    End Session
  </button>
)}

          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>

        {session.status === "completed" && (
  <div className="review-section">
    <h3>Session Review</h3>

    {reviewed ? (
      <p>✅ You have already reviewed this session.</p>
    ) : (
      <ReviewForm
        sessionId={session._id}
        onReviewSubmitted={() => {
  checkReviewStatus();
  fetchSession();
}}
      />
    )}
  </div>
)}

      </div>
    </div>
  );
}

export default SessionDetails;