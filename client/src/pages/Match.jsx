import { useEffect, useState } from "react";
import "./Match.css";

const Match = () => {
  const [matches, setMatches] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        // Fetch matches
        const matchRes = await fetch("http://localhost:5000/api/match", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const matchData = await matchRes.json();
        if (!matchRes.ok) {
          throw new Error(matchData.message || "Failed to fetch matches");
        }

        // Fetch sent requests (for duplicate prevention)
        const sentRes = await fetch(
          "http://localhost:5000/api/requests/sent",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
  }, [token]); // ✅ token added → warning solved

  // Check if request already sent
  const isAlreadyRequested = (skillId) =>
    sentRequests.some((req) => req.skill._id === skillId);

  // Send request
  const requestSkill = async (providerId, skillId) => {
    try {
      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ providerId, skillId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      // Update UI instantly
      setSentRequests((prev) => [...prev, data]);
    } catch (err) {
      alert(err.message);
    }
  };

  const getInitial = (name) => {
  if (!name) return "?";
  return name.trim().charAt(0).toUpperCase();
};

  const renderSkeleton = () => (
    <div className="match-page">
      <section className="match-hero">
        <h1>Find Your Perfect Skill Match</h1>
        <p>Discover community members who can help you learn the skills you're looking for.</p>
      </section>

      <div className="match-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="match-card skeleton-card" key={i}>
            <div className="skeleton skeleton-icon" />
            <div className="skeleton skeleton-line skeleton-line--title" />
            <div className="skeleton skeleton-line skeleton-line--sub" />
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
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="match-page">
      <section className="match-hero">
        <h1>Find Your Perfect Skill Match</h1>
        <p>Discover community members who can help you learn the skills you're looking for.</p>
      </section>


      {matches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <h2>No Skill Matches Found</h2>
          <p>Try browsing more skills or update your profile to discover new matches.</p>
          <button
            type="button"
            className="browse-skills-btn"
            onClick={() => (window.location.href = "/skills")}
          >
            Browse Skills
          </button>
        </div>
      ) : (
        <div className="match-grid">
          {matches.map((match) => (
            <div className="match-card" key={match._id}>
              <div className="card-header">
                <div className="skill-icon">{getInitial(match.name)}</div>
                <div className="card-heading">
                  <h3>{match.name}</h3>
                  <p className="with-teacher">With: {match.user.name}</p>
                </div>
                <span className="status-badge">
                  <span className="status-dot" />
                  Available
                </span>
              </div>

              <div className="info-row">
                <span className="info-left">
                  Level: <strong>{match.level}</strong>
                </span>
                <span className="info-right email">{match.user.email}</span>
              </div>

              <button
                className="request-btn"
                disabled={isAlreadyRequested(match._id)}
                onClick={() => requestSkill(match.user._id, match._id)}
              >
                {isAlreadyRequested(match._id) ? "Requested" : "Request Skill"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Match;
