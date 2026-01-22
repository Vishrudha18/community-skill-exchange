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

  if (loading) {
    return <p className="match-status">Loading matches...</p>;
  }

  if (error) {
    return <p className="match-status error">{error}</p>;
  }

  return (
    <div className="match-container">
      <h1>Your Skill Matches</h1>
      <p>People who can help you learn</p>

      {matches.length === 0 ? (
        <p className="no-matches">No matches found.</p>
      ) : (
        <div className="match-grid">
          {matches.map((match) => (
            <div className="match-card" key={match._id}>
              <h3>{match.name}</h3>

              <p className="level">
                Level: <strong>{match.level}</strong>
              </p>

              <div className="teacher">
                <p><strong>Teacher:</strong></p>
                <p>{match.user.name}</p>
                <p className="email">{match.user.email}</p>
              </div>

              <button
                className="request-btn"
                disabled={isAlreadyRequested(match._id)}
                onClick={() =>
                  requestSkill(match.user._id, match._id)
                }
              >
                {isAlreadyRequested(match._id)
                  ? "Already Requested"
                  : "Request Skill"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Match;
