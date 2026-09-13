import { FiSend, FiInbox } from "react-icons/fi";
import "./RequestStats.css";

function RequestStats({ myRequests = [], receivedRequests = [] }) {
  const myRequestsCount = myRequests.length;
  const receivedRequestsCount = receivedRequests.length;

  return (
    <div className="hero-stats">
      <div className="request-stat-card request-stat-card--blue">
        <div className="request-stat-icon">
          <FiSend />
        </div>
        <div className="request-stat-text">
          <span className="request-stat-number">{myRequestsCount}</span>
          <span className="request-stat-label">My Requests</span>
          <span className="request-stat-sublabel">Sent by you</span>
        </div>
      </div>

      <div className="request-stat-card request-stat-card--purple">
        <div className="request-stat-icon">
          <FiInbox />
        </div>
        <div className="request-stat-text">
          <span className="request-stat-number">{receivedRequestsCount}</span>
          <span className="request-stat-label">Received Requests</span>
          <span className="request-stat-sublabel">From community</span>
        </div>
      </div>
    </div>
  );
}

export default RequestStats;

