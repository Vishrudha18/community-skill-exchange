import { useState } from "react";
import {
  FiRepeat,
  FiSend,
  FiInbox,
  FiArrowUpRight,
} from "react-icons/fi";
import MyRequests from "./MyRequests";
import ReceivedRequests from "./ReceivedRequests";
import "./Requests.css";

function Requests() {
  const [activeTab, setActiveTab] = useState("received");
  const [myCount, setMyCount] = useState(0);
  const [receivedCount, setReceivedCount] = useState(0);

  return (
    <div className="requests-page">
      {/* Background Effects */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>

      {/* Hero */}
      <section className="requests-hero">
        <div className="hero-left">
          <div className="hero-icon">
            <FiRepeat />
          </div>

          <div className="hero-copy">
            <h1>Skill Exchange Requests</h1>

            <p>
              Manage all incoming requests and keep track of your learning
              collaborations.
            </p>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-card stat-card--blue">
            <div className="stat-icon">
              <FiSend />
            </div>
            <div className="stat-text">
              <span className="stat-number">{myCount}</span>
              <span className="stat-label">My Requests</span>
              <span className="stat-sublabel">Sent by you</span>
            </div>
          </div>

          <div className="stat-card stat-card--purple">
            <div className="stat-icon">
              <FiInbox />
            </div>
            <div className="stat-text">
              <span className="stat-number">{receivedCount}</span>
              <span className="stat-label">Received Requests</span>
              <span className="stat-sublabel">From community</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="tabs-wrapper">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "my" ? "active" : ""}`}
            onClick={() => setActiveTab("my")}
          >
            <FiArrowUpRight />
            My Requests
          </button>

          <button
            className={`tab ${activeTab === "received" ? "active" : ""}`}
            onClick={() => setActiveTab("received")}
          >
            <FiInbox />
            Received Requests
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="requests-content">
        <div style={{ display: activeTab === "my" ? "block" : "none" }}>
          <MyRequests onCountChange={setMyCount} />
        </div>

        <div style={{ display: activeTab === "received" ? "block" : "none" }}>
          <ReceivedRequests onCountChange={setReceivedCount} />
        </div>
      </div>
    </div>
  );
}

export default Requests;
