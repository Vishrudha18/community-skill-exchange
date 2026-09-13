import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiMail,
  FiSearch,
  FiZap,
} from "react-icons/fi";
import "./Match.css";

const Match = () => {
  const [matches, setMatches] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [requestingId, setRequestingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [requestError, setRequestError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const matchRes = await fetch("http://localhost:5000/api/match", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const matchData = await matchRes.json();

        if (!matchRes.ok) {
          throw new Error(matchData.message || "Failed to fetch matches");
        }

        const sentRes = await fetch("http://localhost:5000/api/requests/sent", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const sentData = await sentRes.json();

        if (!sentRes.ok) {
          throw new Error("Failed to fetch sent requests");
        }

        setMatches(matchData.matches);
        setSentRequests(sentData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const isAlreadyRequested = (skillId) =>
    sentRequests.some((req) => req.skill?._id === skillId);

  const requestSkill = async (providerId, skillId) => {
    if (requestingId) return;

    try {
      setRequestingId(skillId);
      setRequestError("");
      setSuccessMessage("");

      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          providerId,
          skillId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      setSentRequests((prev) => [...prev, data]);

      setSuccessMessage("Skill request sent successfully.");

      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    } catch (err) {
      setRequestError(err.message);
    } finally {
      setRequestingId(null);
    }
  };

  const getInitial = (name) => {
    if (!name) return "?";

    return name.trim().charAt(0).toUpperCase();
  };

  const renderSkeleton = () => (
    <div className="match-page">
      <section className="match-hero">
        <div className="hero-eyebrow">
          <FiZap />
          <span>Smart Skill Matching</span>
        </div>

        <h1>
          Find people who can
          <span> help you grow.</span>
        </h1>

        <p>
          Discover community members who can help you learn the skills you're
          looking for.
        </p>
      </section>

      <div className="match-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="match-card skeleton-card" key={i}>
            <div className="skeleton-card-top">
              <div className="skeleton skeleton-icon" />

              <div className="skeleton-heading">
                <div className="skeleton skeleton-line skeleton-line--title" />
                <div className="skeleton skeleton-line skeleton-line--sub" />
              </div>
            </div>

            <div className="skeleton skeleton-row" />
            <div className="skeleton skeleton-btn" />
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return renderSkeleton();
  }

  if (error) {
    return (
      <div className="match-page">
        <div className="match-status-card error">
          <div className="status-card-icon">
            <FiSearch />
          </div>

          <h2>Unable to find matches</h2>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="match-page">
      <section className="match-hero">
        <div className="hero-eyebrow">
          <FiZap />
          <span>Smart Skill Matching</span>
        </div>

        <h1>
          Find people who can
          <span> help you grow.</span>
        </h1>

        <p>
          Discover community members who can help you learn the skills you're
          looking for.
        </p>

        {matches.length > 0 && (
          <div className="match-summary">
            <div className="summary-icon">
              <FiSearch />
            </div>

            <div>
              <strong>{matches.length}</strong>

              <span>
                {matches.length === 1
                  ? " skill match found"
                  : " skill matches found"}
              </span>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="request-success">
            <FiCheckCircle />
            <span>{successMessage}</span>
          </div>
        )}

        {requestError && (
          <div className="request-error">
            <span>{requestError}</span>

            <button type="button" onClick={() => setRequestError("")}>
              Dismiss
            </button>
          </div>
        )}
      </section>

      {matches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FiSearch />
          </div>

          <div className="empty-state-content">
            <span className="empty-state-label">No matches yet</span>

            <h2>No Skill Matches Found</h2>

            <p>
              Try browsing more skills or update your profile to discover new
              matches.
            </p>

            <button
              type="button"
              className="browse-skills-btn"
              onClick={() => (window.location.href = "/skills")}
            >
              <span>Browse Skills</span>
              <FiArrowRight />
            </button>
          </div>
        </div>
      ) : (
        <div className="match-grid">
          {matches.map((match) => {
            const requested = isAlreadyRequested(match._id);
            const requesting = requestingId === match._id;

            return (
              <article className="match-card" key={match._id}>
                <div className="card-header">
                  <div className="skill-icon">{getInitial(match.name)}</div>

                  <div className="card-heading">
                    <div className="skill-label">Skill match</div>

                    <h3>{match.name}</h3>

                    <div className="teacher-preview">
                      <div className="teacher-avatar">
                        {getInitial(match.user?.name)}
                      </div>

                      <div className="teacher-details">
                        <span className="teacher-caption">Can teach you</span>

                        <span className="teacher-name">
                          {match.user?.name || "Community member"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="status-badge">
                    <span className="status-dot" />
                    Available
                  </span>
                </div>

                <div className="match-divider" />

                <div className="info-row">
                  <div className="info-item">
                    <span className="info-label">Skill level</span>

                    <strong>{match.level}</strong>
                  </div>

                  <div className="info-item info-item--email">
                    <span className="info-label">Contact</span>

                    <span className="email">
                      <FiMail />
                      {match.user?.email}
                    </span>
                  </div>
                </div>

                {requested ? (
                  <div className="request-complete">
                    <div className="request-complete-main">
                      <div className="request-complete-icon">
                        <FiCheck />
                      </div>

                      <div>
                        <strong>Request Sent</strong>

                        <span>Waiting for a response</span>
                      </div>
                    </div>

                    <FiCheckCircle className="request-complete-check" />
                  </div>
                ) : (
                  <button
                    className={`request-btn ${requesting ? "requesting" : ""}`}
                    disabled={requesting}
                    onClick={() => requestSkill(match.user._id, match._id)}
                  >
                    {requesting ? (
                      <>
                        <span className="request-spinner" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Request Skill</span>
                        <FiArrowRight />
                      </>
                    )}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Match;
