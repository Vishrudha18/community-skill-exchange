import { useEffect, useState, useCallback } from "react";
import "./Requests.css";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/requests/sent", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to fetch requests");
        return;
      }

      setRequests(data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchRequests();
  }, [token, fetchRequests]);

  const cancelRequest = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/requests/${id}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to cancel request");
        return;
      }

      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: "cancelled" } : req
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to cancel request");
    }
  };

  return (
    <div className="requests-page">
      <h2>My Skill Requests</h2>

      {requests.length === 0 ? (
        <p>No requests yet</p>
      ) : (
        requests.map((req) => (
          <div className="request-card" key={req._id}>
            <h3>{req.skill?.name || "Unknown Skill"}</h3>

            <p>
              Level: <b>{req.skill?.level || "N/A"}</b>
            </p>

            <span className={`badge ${req.status}`}>
              {req.status.toUpperCase()}
            </span>

            {req.status === "accepted" && (
              <p className="contact">
                Provider Email: <b>{req.provider?.email || "N/A"}</b>
              </p>
            )}

            {req.status === "pending" && (
              <button
                className="btn cancel"
                onClick={() => cancelRequest(req._id)}
              >
                Cancel Request
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MyRequests;