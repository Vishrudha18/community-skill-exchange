import { FiSend, FiInbox, FiFilter, FiChevronDown } from "react-icons/fi";
import "./RequestHeader.css";

function RequestHeader({ type = "my" }) {
  const isMy = type === "my";

  const icon = isMy ? <FiSend /> : <FiInbox />;
  const title = isMy ? "My Requests" : "Received Requests";
  const description = isMy
    ? "Requests you have sent to other community members."
    : "Requests other community members have sent to you.";

  return (
    <div className="request-header-bar">
      <div className="request-header-left">
        <div className="request-header-icon">{icon}</div>

        <div className="request-header-copy">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      <div className="status-filter">
        <FiFilter className="status-filter-icon" />
        <span>All Status</span>
        <FiChevronDown className="status-filter-chevron" />
      </div>
    </div>
  );
}

export default RequestHeader;
