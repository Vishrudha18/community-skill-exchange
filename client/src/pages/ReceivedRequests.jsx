import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "./Requests.css";

const ReceivedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await fetch(
        "http://localhost:5000/api/requests/received",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setRequests(data);
      setLoading(false);
    };

    fetchRequests();
  }, [token]);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      toast.success(`Request ${status}`);

      setRequests(prev =>
        prev.map(r =>
          r._id === id ? { ...r, status } : r
        )
      );
    } catch {
      toast.error("Action failed");
    }
  };

  if (loading) {
    return (
      <>
        <div className="skeleton"></div>
        <div className="skeleton"></div>
      </>
    );
  }

  return (
    <>
      {requests.length === 0 ? (
        <p>No requests received</p>
      ) : (
        requests.map(req => (
          <div className="request-card" key={req._id}>
            <h3>{req.skill.name}</h3>
            <p>Level: {req.skill.level}</p>
            <p>
              From: <strong>{req.requester.name}</strong>
            </p>

            <span className={`badge ${req.status}`}>
              {req.status === "pending" && "⏳ Pending"}
              {req.status === "accepted" && "✅ Accepted"}
              {req.status === "rejected" && "❌ Rejected"}
            </span>

            {req.status === "pending" && (
              <div className="actions">
                <button
                  className="accept"
                  onClick={() => updateStatus(req._id, "accepted")}
                >
                  Accept
                </button>
                <button
                  className="reject"
                  onClick={() => updateStatus(req._id, "rejected")}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </>
  );
};

export default ReceivedRequests;
