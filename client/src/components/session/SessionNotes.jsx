import { FiFileText } from "react-icons/fi";
import "./SessionNotes.css";

/**
 * SessionNotes
 * Pure presentational component — receives the already-fetched `session`
 * object as a prop. No API calls, no state, no business logic.
 *
 * Uses session.notes if your API provides it; otherwise falls back to a
 * generic message so the card never assumes a field that doesn't exist.
 *
 *   <SessionNotes session={session} />
 */
function SessionNotes({ session }) {
  if (!session) return null;

  const notes =
    session.notes ||
    "Please come prepared with any questions related to this session.";

  return (
    <div className="notes-card">
      <div className="notes-card-header">
        <span className="notes-card-icon-box">
          <FiFileText />
        </span>
        <h4>Session Notes</h4>
      </div>

      <p className="notes-card-text">{notes}</p>
    </div>
  );
}

export default SessionNotes;
