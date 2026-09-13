import { FiInbox } from "react-icons/fi";
import "./EmptyState.css";

function EmptyState({
  title = "No more requests here!",
  description = "You've caught up with all your requests.",
  icon,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon || <FiInbox />}</div>

      <div className="empty-state-copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default EmptyState;
