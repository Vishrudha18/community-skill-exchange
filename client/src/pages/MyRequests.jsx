import { useEffect, useState } from "react";
import "./Requests.css";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/requests/sent", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error(err));
  }, [token]); // ✅ token added → warning solved

  const getStatusBadge = (status) => {
    if (status === "pending") return "badge pending";
    if (status === "accepted") return "badge accepted";
    return "badge rejected";
  };

  return (
    <div className="requests-page">
      <h2>My Skill Requests</h2>

      {requests.length === 0 ? (
        <p>No requests yet</p>
      ) : (
        requests.map((req) => (
          <div className="request-card" key={req._id}>
            <h3>{req.skill.name}</h3>
            <p>Level: {req.skill.level}</p>

            <span className={getStatusBadge(req.status)}>
              {req.status.toUpperCase()}
            </span>

            {req.status === "accepted" && (
              <p className="contact">
                Provider Email: <b>{req.provider.email}</b>
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MyRequests;
