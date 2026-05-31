import { useEffect, useState, useCallback } from "react";
import "./Requests.css";

function ReceivedRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/requests/received",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to fetch requests");
        return;
      }

      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchRequests();
  }, [token, fetchRequests]);

  const updateStatus = async (id, action) => {
    try {
      setUpdatingId(id);

      const res = await fetch(
        `http://localhost:5000/api/requests/${id}/${action}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update request");
        return;
      }

      setRequests((prev) =>
        prev.map((req) =>
          req._id === id
            ? { ...req, status: action === "accept" ? "accepted" : "rejected" }
            : req
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update request");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="requests-page">
      <h2>Received Requests</h2>

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No requests received</p>
      ) : (
        requests.map((req) => (
          <div className="request-card" key={req._id}>
            <div className="request-info">
              <h3>{req.skill?.name || "Unknown Skill"}</h3>
              <p>Level: {req.skill?.level || "N/A"}</p>
              <p>From: {req.requester?.name || "Unknown"}</p>
              <p>Email: {req.requester?.email || "N/A"}</p>
            </div>

            <div className="request-actions">
              {req.status === "pending" ? (
                <>
                  <button
                    className="btn accept"
                    disabled={updatingId === req._id}
                    onClick={() => updateStatus(req._id, "accept")}
                  >
                    Accept
                  </button>

                  <button
                    className="btn reject"
                    disabled={updatingId === req._id}
                    onClick={() => updateStatus(req._id, "reject")}
                  >
                    Reject
                  </button>
                </>
              ) : (
                <span className={`badge ${req.status}`}>
                  {req.status.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ReceivedRequests;