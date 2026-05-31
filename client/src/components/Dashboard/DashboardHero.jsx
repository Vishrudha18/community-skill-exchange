import "./DashboardHero.css";

const DashboardHero = ({ name }) => {
  return (
    <section className="dashboard-hero">
      <h1>
        Welcome back, <span>{name}</span> 👋
      </h1>
      <p>
        Manage your skills, track requests, and connect with learners & mentors.
      </p>

      <div className="hero-actions">
        <a href="/match" className="hero-btn primary">
          Find Matches
        </a>
        <a href="/requests" className="hero-btn secondary">
          View Requests
        </a>
      </div>
    </section>
  );
};

export default DashboardHero;
