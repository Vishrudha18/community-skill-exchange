import {
  FiMail,
  FiBookOpen,
  FiTrendingUp,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";
import "./RequestCard.css";

function RequestCard({
  request,
  type,
  onAccept,
  onReject,
  onCancel,
  onViewSession,
  updating = false,
}) {
  const skill = request.skill || {};
  const provider = request.provider || {};
  const requester = request.requester || {};

  const person = type === "sent" ? provider : requester;

  const name = person.name || "Unknown User";
  const email = person.email || "Not Available";

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const status = request.status || "pending";

  return (
    <div className="premium-request-card">
      {/* User */}
      <div className="request-user-section">
        <div className="request-avatar">
          <span>{initials}</span>
        </div>

        <div className="request-user-info">
          <h3>{name}</h3>

          <p className="role-pill">
            {type === "sent" ? "Skill Provider" : "Skill Requester"}
          </p>
        </div>
      </div>

      {/* Request Details */}
      <div className="request-details">
        <div className="detail-box">
          <div className="detail-icon">
            <FiBookOpen />
          </div>

          <div>
            <span>Skill</span>
            <h4>{skill.name || "N/A"}</h4>
          </div>
        </div>

        <div className="detail-box">
          <div className="detail-icon">
            <FiTrendingUp />
          </div>

          <div>
            <span>Level</span>
            <h4>{skill.level || "N/A"}</h4>
          </div>
        </div>

        <div className="detail-box full">
          <div className="detail-icon">
            <FiMail />
          </div>

          <div>
            <span>Email</span>
            <h4>{email}</h4>
          </div>
        </div>
      </div>

      {/* Actions / Status */}
      <div className="request-actions-panel">
        <span className={`badge badge-${status}`}>
          {status === "pending" && <FiClock />}
          {status === "accepted" && <FiCheckCircle />}
          {status === "rejected" && <FiXCircle />}

          {status.toUpperCase()}
        </span>

        {/* Sent + Pending */}
        {type === "sent" && status === "pending" && (
          <button className="btn cancel" onClick={onCancel}>
            <FiXCircle />
            Cancel Request
          </button>
        )}

        {/* Received + Pending */}
        {type === "received" && status === "pending" && (
          <div className="action-buttons">
            <button
              className="btn accept"
              disabled={updating}
              onClick={onAccept}
            >
              <FiCheckCircle />
              Accept
            </button>

            <button
              className="btn reject"
              disabled={updating}
              onClick={onReject}
            >
              <FiXCircle />
              Reject
            </button>
          </div>
        )}

        {/* Accepted */}
        {status === "accepted" && (
          <div className="accepted-state">
            <div className="accepted-message">
              <div className="accepted-icon">
                <FiCheckCircle />
              </div>

              <div className="accepted-text">
                <strong>Request Accepted</strong>
                <span>Collaboration is active</span>
              </div>
            </div>

            <button
              className="accepted-session-btn"
              type="button"
              onClick={onViewSession}
            >
              View Session
              <FiArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestCard;
