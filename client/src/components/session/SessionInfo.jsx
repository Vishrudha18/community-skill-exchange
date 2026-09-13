import { FiCalendar, FiClock, FiBookOpen, FiUser, FiUsers } from "react-icons/fi";
import "./SessionInfo.css";

/**
 * SessionInfo
 * Pure presentational component — receives the already-fetched `session`
 * object as a prop. No API calls, no state, no business logic.
 * Drop this in place of the old ".session-info" markup:
 *
 *   <SessionInfo session={session} />
 */
function SessionInfo({ session }) {
  if (!session) return null;

  const scheduledDate = session.scheduledAt
    ? new Date(session.scheduledAt).toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not scheduled";

  const scheduledTime = session.scheduledAt
    ? new Date(session.scheduledAt).toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

  const cards = [
    {
      key: "skill",
      icon: FiBookOpen,
      label: "Skill",
      value: session.skill?.name || "—",
      className: "skill",
    },
    {
      key: "date",
      icon: FiCalendar,
      label: "Scheduled Date",
      value: scheduledDate,
      className: "date",
    },
    {
      key: "time",
      icon: FiClock,
      label: "Time",
      value: scheduledTime,
      className: "time",
    },
    {
      key: "teacher",
      icon: FiUser,
      label: "Teacher",
      value: session.teacher?.name || "—",
      className: "teacher",
    },
    {
      key: "learner",
      icon: FiUsers,
      label: "Learner",
      value: session.learner?.name || "—",
      className: "learner",
    },
  ];

  return (
    <div className="session-info-grid">
      {cards.map(({ key, icon: Icon, label, value, className }) => (
        <div className={`info-card ${className}`} key={key}>
          <div className={`info-icon-box ${className}`}>
            <Icon />
          </div>
          <div className="info-text">
            <span className="info-label">{label}</span>
            <span className="info-value">{value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SessionInfo;
