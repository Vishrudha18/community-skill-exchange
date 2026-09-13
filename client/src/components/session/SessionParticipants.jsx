import { FiUsers, FiMail, FiUser as FiUserIcon, FiStar } from "react-icons/fi";
import "./SessionParticipants.css";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

function ParticipantRow({ person, roleLabel, isCurrentUser, badgeClass }) {
  if (!person) return null;

  const name = person.name || person.fullName || "Unknown";
  const title = person.title || person.headline;
  const isOnline = person.online ?? person.isOnline;
  const badgeText = isCurrentUser ? "You" : roleLabel;

  return (
    <div className="participant-row">
      <div className="participant-left">
        <div className="participant-avatar-wrap">
          {person.avatarUrl || person.photo ? (
            <img
              className="participant-avatar"
              src={person.avatarUrl || person.photo}
              alt={name}
            />
          ) : (
            <div className="participant-avatar">{getInitials(name)}</div>
          )}
          {isOnline && <span className="participant-online-dot" />}
        </div>

        <div className="participant-details">
          <div className="participant-name-row">
            <h4>{name}</h4>
            <span
              className={`participant-badge ${
                isCurrentUser ? "you" : badgeClass
              }`}
            >
              {badgeText}
            </span>
          </div>

          {title && <p className="participant-title">{title}</p>}

          {person.rating != null && (
            <div className="participant-rating">
              <FiStar className="participant-star" />
              <span>{person.rating}</span>
              {person.reviewCount != null && (
                <span className="participant-review-count">
                  ({person.reviewCount} reviews)
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="participant-actions">
        <button
          type="button"
          className="participant-icon-btn"
          aria-label={`Email ${name}`}
        >
          <FiMail />
        </button>
        <button
          type="button"
          className="participant-icon-btn"
          aria-label={`View ${name}'s profile`}
        >
          <FiUserIcon />
        </button>
      </div>
    </div>
  );
}

/**
 * SessionParticipants
 * Pure presentational component — receives the already-fetched `session`
 * object plus the already-computed isTeacher/isLearner booleans as props.
 * No API calls, no state, no business logic.
 *
 *   <SessionParticipants session={session} isTeacher={isTeacher} isLearner={isLearner} />
 */
function SessionParticipants({ session, isTeacher, isLearner }) {
  if (!session) return null;

  return (
    <div className="participants-card">
      <div className="participants-header">
        <span className="participants-icon-box">
          <FiUsers />
        </span>
        <h3>Participants</h3>
      </div>

      <div className="participants-list">
        <ParticipantRow
          person={session.teacher}
          roleLabel="Teacher"
          isCurrentUser={isTeacher}
          badgeClass="teacher"
        />
        <ParticipantRow
          person={session.learner}
          roleLabel="Learner"
          isCurrentUser={isLearner}
          badgeClass="learner"
        />
      </div>
    </div>
  );
}

export default SessionParticipants;
