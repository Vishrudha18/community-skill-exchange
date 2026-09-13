import { FiActivity, FiCalendar, FiRadio, FiCheck, FiXCircle, FiAlertTriangle } from "react-icons/fi";
import "./SessionStatus.css";

const STATUS_CONFIG = {
  scheduled: {
    label: "Scheduled",
    icon: FiCalendar,
    className: "scheduled",
    description:
      "This session is scheduled. You can join the session at the scheduled time.",
  },
  live: {
    label: "Live",
    icon: FiRadio,
    className: "live",
    description: "This session is live right now. Join now to take part.",
  },
  completed: {
    label: "Completed",
    icon: FiCheck,
    className: "completed",
    description: "This session has been completed successfully.",
  },
  cancelled: {
    label: "Cancelled",
    icon: FiXCircle,
    className: "cancelled",
    description: "This session has been cancelled.",
  },
  missed: {
    label: "Missed",
    icon: FiAlertTriangle,
    className: "missed",
    description: "This session was missed and did not take place.",
  },
};

/**
 * SessionStatus
 * Pure presentational component — receives the already-fetched `session`
 * object as a prop. No API calls, no state, no business logic.
 *
 *   <SessionStatus session={session} />
 */
function SessionStatus({ session }) {
  if (!session) return null;

  const statusKey = (session.status || "scheduled").toLowerCase();
  const status = STATUS_CONFIG[statusKey] || STATUS_CONFIG.scheduled;

  return (
    <div className="status-card">
      <div className="status-card-header">
        <span className="status-card-icon-box">
          <FiActivity />
        </span>
        <h4>Session Status</h4>
      </div>

      <span className={`status-pill ${status.className}`}>
        {status.label}
      </span>

      <p className="status-card-text">{status.description}</p>
    </div>
  );
}

export default SessionStatus;
