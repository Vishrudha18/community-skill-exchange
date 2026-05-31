import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SessionDetails.css";

function SessionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [timeLeft, setTimeLeft] = useState("Loading...");
  const [isLive, setIsLive] = useState(false);

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

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // 🔥 TIMER
  useEffect(() => {
  if (!session?.scheduledAt) return;

  const interval = setInterval(() => {
    const now = new Date();
    const start = new Date(session.scheduledAt);

    const durationMinutes = session.duration || 60;
    const end = new Date(start.getTime() + durationMinutes * 60000);

    if (now < start) {
      const diff = Math.floor((start - now) / 1000);
      const mins = Math.floor(diff / 60);
      const secs = diff % 60;

      setTimeLeft(`Starts in ${mins}m ${secs}s`);
      setIsLive(false);

    } else if (now >= start && now <= end) {
      setTimeLeft("Live Now");
      setIsLive(true);

    } else {
      setTimeLeft("Session Ended");
      setIsLive(false);
    }
  }, 1000);

  return () => clearInterval(interval);

}, [session]);

  // 🔥 Schedule
  const handleSchedule = async () => {
    try {
      const token = localStorage.getItem("token");
      const scheduledAt = new Date(`${date}T${time}`);

      await axios.put(
        `/api/sessions/${id}/schedule`,
        { scheduledAt, duration },
        { headers: { Authorization: `Bearer ${token}` } }
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

          <p className={`countdown ${isLive ? "live-text" : ""}`}>
            {isLive ? "🔴 LIVE NOW" : `⏳ ${timeLeft}`}
          </p>

          <div className="status-box">
            <span className={`status ${session.status}`}>
              {session.status}
            </span>

            {isLive && <span className="live-badge">🔴 LIVE</span>}
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

          {/* ✅ SHOW DURATION */}
          {session.duration && (
            <p>
              <span>Duration</span> {session.duration} mins
            </p>
          )}
        </div>

        {/* ✅ ONLY SHOW SCHEDULE IF NOT SCHEDULED */}
        {!session.scheduledAt && isTeacher && session.type !== "booking" (
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

              <input
                type="number"
                placeholder="Duration (minutes)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
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
          {session.status === "scheduled" && timeLeft !== "Session Ended" && (
            <button
              className="join-btn"
              disabled={!isLive}
              onClick={() => navigate(`/live/${session._id}`)}
            >
              {isLive ? "Join Now" : "Session Not Live"}
            </button>
          )}

          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}

export default SessionDetails;