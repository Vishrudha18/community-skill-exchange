import { useState } from "react";
import MyRequests from "./MyRequests";
import ReceivedRequests from "./ReceivedRequests";
import "./Requests.css";

function Requests() {
  const [activeTab, setActiveTab] = useState("received");

  return (
    <div className="requests-page">
      <h1>Skill Requests</h1>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "my" ? "active" : ""}`}
          onClick={() => setActiveTab("my")}
        >
          My Requests
        </button>

        <button
          className={`tab ${activeTab === "received" ? "active" : ""}`}
          onClick={() => setActiveTab("received")}
        >
          Received Requests
        </button>
      </div>

      {activeTab === "my" && <MyRequests />}
      {activeTab === "received" && <ReceivedRequests />}
    </div>
  );
}

export default Requests;