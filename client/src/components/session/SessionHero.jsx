import {
  FiCalendar,
  FiCheck,
  FiRadio,
  FiXCircle,
  FiAlertTriangle,
  FiStar,
  FiUser,
} from "react-icons/fi";
import "./SessionHero.css";

// Maps a session status to its label / icon / color class.
const STATUS_CONFIG = {
  scheduled: { label: "Scheduled", icon: FiCalendar, className: "scheduled" },
  live: { label: "Live Now", icon: FiRadio, className: "live" },
  completed: { label: "Completed", icon: FiCheck, className: "completed" },
  cancelled: { label: "Cancelled", icon: FiXCircle, className: "cancelled" },
  missed: { label: "Missed", icon: FiAlertTriangle, className: "missed" },
};

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

// Pulls a participant object out of the session without assuming a
// specific schema — supports teacher/learner, provider/requester, or a
// generic participants array, whichever the API actually returns.
function resolveParticipant(session, roleKeys, fallbackRole) {
  for (const key of roleKeys) {
    if (session?.[key]) {
      return { ...session[key], _role: session[key].role || fallbackRole };
    }
  }

  if (Array.isArray(session?.participants)) {
    const match = session.participants.find((p) =>
      roleKeys.includes(p?.role?.toLowerCase())
    );
    if (match) return { ...match, _role: match.role || fallbackRole };
  }

  return null;
}

function ParticipantCard({ person, roleLabel }) {
  if (!person) return null;

  const name = person.name || person.fullName || person.username || "Unknown";
  const title = person.title || person.headline || person.role;

  return (
    <div className="hero-organizer">
      <span className="hero-organizer-label">{roleLabel}</span>

      <div className="hero-organizer-info">
        {person.avatarUrl || person.photo ? (
          <img
            className="hero-avatar"
            src={person.avatarUrl || person.photo}
            alt={name}
          />
        ) : (
          <div className="hero-avatar">
            {name !== "Unknown" ? getInitials(name) : <FiUser />}
          </div>
        )}
        <div>
          <p className="hero-organizer-name">{name}</p>
          {title && <p className="hero-organizer-role">{title}</p>}
        </div>
      </div>

      {person.rating != null && (
        <div className="hero-rating">
          <FiStar className="hero-star" />
          <span>{person.rating}</span>
          {person.reviewCount != null && (
            <span className="hero-review-count">
              ({person.reviewCount} reviews)
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * SessionHero
 * Pure presentational component — receives the already-fetched `session`
 * object as a prop. No API calls, no state mutation of session data.
 * Drop this in place of the old ".session-header" markup:
 *
 *   <SessionHero session={session} />
 */
function SessionHero({ session }) {
  if (!session) return null;

  const statusKey = (session.status || "scheduled").toLowerCase();
  const status = STATUS_CONFIG[statusKey] || STATUS_CONFIG.scheduled;
  const StatusIcon = status.icon;

  const title =
    session.title ||
    session.name ||
    (session.skill?.name ? `${session.skill.name} Session` : "Learning Session");

  const description =
    session.description ||
    (session.skill?.name
      ? `A focused learning session on ${session.skill.name}.`
      : "Session details and information.");

  const provider = resolveParticipant(
    session,
    ["provider", "teacher", "tutor", "mentor"],
    "Provider"
  );

  const learner = resolveParticipant(
    session,
    ["requester", "learner", "student"],
    "Learner"
  );

  return (
    <div className="hero-card">
      <div className="hero-glow" aria-hidden="true" />

      <div className="hero-top">
        <div className={`hero-icon-box ${status.className}`}>
          <StatusIcon />
        </div>

        <div className="hero-main">
          <span className={`hero-status-badge ${status.className}`}>
            <StatusIcon className="hero-status-icon" />
            {status.label}
          </span>

          <h1 className="hero-title">{title}</h1>

          <p className="hero-description">{description}</p>
        </div>

        <ParticipantCard person={provider} roleLabel="Provider" />
        <ParticipantCard person={learner} roleLabel="Learner" />
      </div>
    </div>
  );
}

export default SessionHero;
