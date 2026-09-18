import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Requests.css";
import RequestCard from "../components/requests/RequestCard";

function ReceivedRequests({ onCountChange }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/requests/received", {
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
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchRequests();
    }
  }, [token, fetchRequests]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(requests.length);
    }
  }, [requests, onCountChange]);

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
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update request");
        return;
      }

      setRequests((prev) =>
        prev.map((req) =>
          req._id === id
            ? {
                ...req,
                status: action === "accept" ? "accepted" : "rejected",
                session: action === "accept" ? data.session : req.session,
              }
            : req,
        ),
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update request");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewSession = (request) => {
    if (!request.session?._id) {
      alert("Session information is not available yet.");
      return;
    }

    navigate(`/sessions/${request.session._id}`);
  };

  return (
    <>
      <h2>Received Requests</h2>

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No requests received</p>
      ) : (
        requests.map((req) => (
          <RequestCard
            key={req._id}
            request={req}
            type="received"
            updating={updatingId === req._id}
            onAccept={() => updateStatus(req._id, "accept")}
            onReject={() => updateStatus(req._id, "reject")}
            onViewSession={() => handleViewSession(req)}
          />
        ))
      )}
    </>
  );
}

export default ReceivedRequests;
