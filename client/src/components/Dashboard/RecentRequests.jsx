import { useEffect, useState } from "react";
import "./RecentRequests.css";

const RecentRequests = () => {
  const [timeline, setTimeline] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const sentRes = await fetch(
          "http://localhost:5000/api/requests/sent",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const receivedRes = await fetch(
          "http://localhost:5000/api/requests/received",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const sent = await sentRes.json();
        const received = await receivedRes.json();

        const combined = [
          ...sent.map(r => ({ ...r, direction: "sent" })),
          ...received.map(r => ({ ...r, direction: "received" })),
        ];

        combined.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        setTimeline(combined.slice(0, 6));
      } catch (err) {
        console.error("Failed to load recent requests");
      }
    };

    fetchTimeline();
  }, [token]);

  return (
    <div className="timeline-container">
      <h2>Recent Requests</h2>

      {timeline.length === 0 ? (
        <p className="empty">No recent activity</p>
      ) : (
        <div className="timeline">
          {timeline.map(item => (
            <div className="timeline-item" key={item._id}>
              <div className="dot" />

              <div className="content">
                <h4>{item.skill?.name}</h4>

                <p className="meta">
                  {item.direction === "sent"
                  ? <>You requested <b>{item.provider.name}</b></>
                  : <>Request from <b>{item.requester.name}</b></>}
                </p>


                <span className={`status ${item.status}`}>
                  {item.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentRequests;
