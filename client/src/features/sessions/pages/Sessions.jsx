import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Sessions.css";

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get("/api/sessions/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setSessions(res.data);
  } catch (err) {
    console.error(err);
  }
};

  return (
  <div className="sessions-container">
    <h2 className="sessions-title">My Sessions</h2>

    {/* ✅ EMPTY STATE */}
    {sessions.length === 0 ? (
      <div className="empty-state">
  <div className="empty-card">
    
    <div className="empty-icon">📚</div>

    <h3>No sessions yet</h3>
    <p>
      Start your learning journey by creating or accepting a session.
    </p>

    <button
      className="browse-btn"
      onClick={() => navigate("/browse-skills")}
    >
      🔍 Browse Skills
    </button>

  </div>
</div>
    ) : (
      <div className="sessions-grid">
        {sessions.map((session) => (
          <div key={session._id} className="session-card">

            <div className="session-header">
              <h3>{session.skill?.name}</h3>
              <span className={`status ${session.status}`}>
                {session.status}
              </span>
            </div>

            <p className="session-user">
              With: {session.teacher?.name === user?.name
                ? session.learner?.name 
                : session.teacher?.name}
            </p>

            <p className="session-time">
              {session.scheduledAt
                ? new Date(session.scheduledAt).toLocaleString()
                : "Not scheduled"}
            </p>

            <button
              className="view-btn"
              onClick={() => navigate(`/sessions/${session._id}`)}
            >
              View Details →
            </button>

          </div>
        ))}
      </div>
    )}
  </div>
);
}

export default Sessions;