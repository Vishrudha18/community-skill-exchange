import "./StatsCards.css";

const StatsCards = ({ stats }) => {
  return (
    <div className="dash-stats-grid">
      <div className="dash-stat-card blue">
        <h3>{stats.offered}</h3>
        <p>Skills Offered</p>
      </div>

      <div className="dash-stat-card purple">
        <h3>{stats.wanted}</h3>
        <p>Skills Wanted</p>
      </div>

      <div className="dash-stat-card green">
        <h3>{stats.sent}</h3>
        <p>Requests Sent</p>
      </div>

      <div className="dash-stat-card orange">
        <h3>{stats.received}</h3>
        <p>Requests Received</p>
      </div>
    </div>
  );
};

export default StatsCards;
