import { FiZap, FiPlay, FiVideo, FiSquare, FiXCircle } from "react-icons/fi";
import "./SessionActions.css";

/**
 * SessionActions
 * Pure presentational component for the action-buttons card
 * (Start Meeting / Join Session / End Session / Cancel).
 * All logic, handlers, and conditions stay in the parent — this
 * component only receives booleans/callbacks and renders the UI.
 *
 *   <SessionActions
 *     session={session}
 *     isTeacher={isTeacher}
 *     showStartMeeting={showStartMeeting}
 *     onStartMeeting={handleStartMeeting}
 *     onEndSession={handleEndSession}
 *     onCancel={handleCancel}
 *     onJoin={() => navigate(`/live/${session._id}`)}
 *   />
 */
function SessionActions({
  session,
  isTeacher,
  showStartMeeting,
  onStartMeeting,
  onEndSession,
  onCancel,
  onJoin,
}) {
  const showJoin =
    !showStartMeeting &&
    session.status !== "completed" &&
    session.status !== "cancelled" &&
    session.status !== "missed";

  return (
    <div className="actions-card">
      <div className="actions-card-header">
        <span className="actions-icon-box">
          <FiZap />
        </span>
        <h4>Actions</h4>
      </div>

      <div className="actions-grid">
        {showStartMeeting && (
          <button className="action-btn start-btn" onClick={onStartMeeting}>
            <FiPlay />
            Start Meeting
          </button>
        )}

        {showJoin && (
          <button
            className="action-btn join-btn"
            disabled={session.status !== "live"}
            onClick={onJoin}
          >
            <FiVideo />
            {session.status === "live"
              ? "Join Session"
              : "Waiting for Teacher to Start"}
          </button>
        )}

        {isTeacher && session.status === "live" && (
          <button className="action-btn end-btn" onClick={onEndSession}>
            <FiSquare />
            End Session
          </button>
        )}

        <button className="action-btn cancel-btn" onClick={onCancel}>
          <FiXCircle />
          Cancel Session
        </button>
      </div>
    </div>
  );
}

export default SessionActions;
