import "./HowItWorks.css";

const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <h2 className="section-title">How It Works</h2>
      <p className="section-subtitle">
        Learn or teach skills in just a few simple steps
      </p>

      <div className="steps-container">
        <div className="step-card">
          <div className="step-number">1</div>
          <h3>Create Your Profile</h3>
          <p>
            Sign up and create your profile by adding the skills you can offer
            or want to learn.
          </p>
        </div>

        <div className="step-card">
          <div className="step-number">2</div>
          <h3>Find a Skill Match</h3>
          <p>
            Browse skills or get matched with people who complement your
            learning needs.
          </p>
        </div>

        <div className="step-card">
          <div className="step-number">3</div>
          <h3>Start the Exchange</h3>
          <p>
            Connect, learn, teach, and grow together through community-powered
            skill exchange.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
