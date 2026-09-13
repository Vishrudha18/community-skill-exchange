import { useEffect, useState, useCallback } from "react";
import "./Requests.css";
import RequestCard from "../components/requests/RequestCard";

function MyRequests({ onCountChange }) {
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

  useEffect(() => {
    if (onCountChange) onCountChange(requests.length);
  }, [requests, onCountChange]);

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
  <>
    <h2>My Skill Requests</h2>

    {requests.length === 0 ? (
      <p>No requests yet</p>
    ) : (
      requests.map((req) => (
        <RequestCard
          key={req._id}
          request={req}
          type="sent"
          onCancel={() => cancelRequest(req._id)}
        />
      ))
    )}
  </>
);
}

export default MyRequests; 