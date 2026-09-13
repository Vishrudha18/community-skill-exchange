import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Sessions.css";

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

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

  /* ==============================
     SESSION COUNTS
  ============================== */

  const completedCount = sessions.filter(
    (session) => session.status === "completed"
  ).length;

  const inProgressCount = sessions.filter(
    (session) => session.status === "live"
  ).length;

  const upcomingCount = sessions.filter(
    (session) => session.status === "scheduled"
  ).length;

  /* ==============================
     FILTER SESSIONS
  ============================== */

  const filteredSessions = sessions.filter((session) => {
    if (activeTab === "completed") {
      return session.status === "completed";
    }

    if (activeTab === "in-progress") {
      return session.status === "live";
    }

    if (activeTab === "upcoming") {
      return session.status === "scheduled";
    }

    return true;
  });

  /* ==============================
     STATUS DETAILS
  ============================== */

  const getStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return "Completed";

      case "live":
        return "In Progress";

      case "scheduled":
        return "Upcoming";

      case "cancelled":
        return "Cancelled";

      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "✓";

      case "live":
        return "◉";

      case "scheduled":
        return "○";

      case "cancelled":
        return "×";

      default:
        return "•";
    }
  };

  /* ==============================
     SESSION DATE
  ============================== */

  const formatDate = (date) => {
    if (!date) return "Not scheduled";

    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "Not scheduled";

    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ==============================
     SESSION MESSAGE
  ============================== */

  const getSessionMessage = (session) => {
    if (session.status === "completed") {
      return "Session Completed";
    }

    if (session.status === "live") {
      return "Meeting in Progress";
    }

    if (session.scheduledAt) {
      return "Upcoming Session";
    }

    if (session.teacher?._id === user?._id) {
      return "Action Required: Schedule Meeting";
    }

    return "Waiting for Teacher to Schedule";
  };

  return (
    <div className="sessions-container">
      <div className="sessions-wrapper">

        {/* ==============================
            PAGE HEADER
        ============================== */}

        <div className="sessions-page-header">
          <h1>My Sessions</h1>

          <p>
            Track and manage all your learning and teaching sessions in one
            place.
          </p>
        </div>

        {/* ==============================
            STATS
        ============================== */}

        <div className="session-stats">

          {/* Total */}
          <div className="stat-card">
            <div className="stat-icon total-icon">
              <span>▣</span>
            </div>

            <div className="stat-content">
              <span className="stat-label">Total Sessions</span>
              <strong>{sessions.length}</strong>
              <span className="stat-description">All time sessions</span>
            </div>
          </div>

          {/* Completed */}
          <div className="stat-card">
            <div className="stat-icon completed-icon">
              <span>✓</span>
            </div>

            <div className="stat-content">
              <span className="stat-label">Completed</span>
              <strong>{completedCount}</strong>
              <span className="stat-description">Sessions completed</span>
            </div>
          </div>

          {/* In Progress */}
          <div className="stat-card">
            <div className="stat-icon progress-icon">
              <span>◷</span>
            </div>

            <div className="stat-content">
              <span className="stat-label">In Progress</span>
              <strong>{inProgressCount}</strong>
              <span className="stat-description">Active sessions</span>
            </div>
          </div>

          {/* Upcoming */}
          <div className="stat-card">
            <div className="stat-icon upcoming-icon">
              <span>▣</span>
            </div>

            <div className="stat-content">
              <span className="stat-label">Upcoming</span>
              <strong>{upcomingCount}</strong>
              <span className="stat-description">Scheduled sessions</span>
            </div>
          </div>

        </div>

        {/* ==============================
            TABS
        ============================== */}

        {sessions.length > 0 && (
          <div className="session-tabs">

            <button
              className={activeTab === "all" ? "active" : ""}
              onClick={() => setActiveTab("all")}
            >
              All Sessions
            </button>

            <button
              className={activeTab === "completed" ? "active" : ""}
              onClick={() => setActiveTab("completed")}
            >
              Completed
            </button>

            <button
              className={activeTab === "in-progress" ? "active" : ""}
              onClick={() => setActiveTab("in-progress")}
            >
              In Progress
            </button>

            <button
              className={activeTab === "upcoming" ? "active" : ""}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming
            </button>

          </div>
        )}

        {/* ==============================
            EMPTY STATE
        ============================== */}

        {sessions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-card">

              <div className="empty-icon">
                <span>▣</span>
              </div>

              <h3>No sessions found</h3>

              <p>
                You don't have any sessions yet.
              </p>

              <button
                className="browse-btn"
                onClick={() => navigate("/browse-skills")}
              >
                Browse Skills
                <span>→</span>
              </button>

            </div>
          </div>
        ) : filteredSessions.length === 0 ? (
          /* ==============================
             FILTER EMPTY STATE
          ============================== */

          <div className="empty-state filtered-empty">
            <div className="empty-card">

              <div className="empty-icon">
                <span>○</span>
              </div>

              <h3>No sessions found</h3>

              <p>
                There are no sessions in this category yet.
              </p>

            </div>
          </div>
        ) : (
          /* ==============================
             SESSION GRID
          ============================== */

          <div className="sessions-grid">

            {filteredSessions.map((session) => {

              const partner =
                session.teacher?.name === user?.name
                  ? session.learner?.name
                  : session.teacher?.name;

              return (
                <div
                  key={session._id}
                  className="session-card"
                >

                  {/* CARD TOP */}
                  <div className="session-card-top">

                    <div className="skill-icon">
                      {session.skill?.name
                        ?.substring(0, 2)
                        .toUpperCase() || "SK"}
                    </div>

                    <div className="skill-info">
                      <h3>
                        {session.skill?.name || "Skill Session"}
                      </h3>

                      <p>
                        With: {partner || "User"}
                      </p>
                    </div>

                    <span
                      className={`status-badge ${session.status}`}
                    >
                      <span className="status-dot">
                        {getStatusIcon(session.status)}
                      </span>

                      {getStatusLabel(session.status)}
                    </span>

                  </div>

                  {/* DIVIDER */}
                  <div className="card-divider" />

                  {/* DATE / TIME */}
                  <div className="session-meta">

                    <div className="meta-item">
                      <span className="meta-icon">▣</span>

                      <span>
                        {formatDate(session.scheduledAt)}
                      </span>
                    </div>

                    <div className="meta-separator" />

                    <div className="meta-item">
                      <span className="meta-icon">◷</span>

                      <span>
                        {formatTime(session.scheduledAt)}
                      </span>
                    </div>

                  </div>

                  {/* SESSION STATUS */}
                  <div
                    className={`session-status-line ${session.status}`}
                  >
                    <span className="status-check">
                      {getStatusIcon(session.status)}
                    </span>

                    <span>
                      {getSessionMessage(session)}
                    </span>
                  </div>

                  {/* ACTION */}
                  <button
                    className="view-btn"
                    onClick={() =>
                      navigate(`/sessions/${session._id}`)
                    }
                  >
                    <span>View Details</span>
                    <span className="arrow">→</span>
                  </button>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

export default Sessions;