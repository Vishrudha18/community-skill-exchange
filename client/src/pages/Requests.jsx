import { useState } from "react";
import MyRequests from "./MyRequests";
import ReceivedRequests from "./ReceivedRequests";
import "./Requests.css";

const Requests = () => {
  const [activeTab, setActiveTab] = useState("sent");

  return (
    <div className="requests-page">
      <h1>Skill Requests</h1>

      <div className="tabs">
        <button
          className={activeTab === "sent" ? "tab active" : "tab"}
          onClick={() => setActiveTab("sent")}
        >
          My Requests
        </button>

        <button
          className={activeTab === "received" ? "tab active" : "tab"}
          onClick={() => setActiveTab("received")}
        >
          Received Requests
        </button>
      </div>

      {activeTab === "sent" && <MyRequests />}
      {activeTab === "received" && <ReceivedRequests />}
    </div>
  );
};

export default Requests;
