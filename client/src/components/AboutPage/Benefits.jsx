import "./Benefits.css";

const Benefits = () => {
  return (
    <section className="benefits fade-up">
      <h2>Benefits of SkillExchange</h2>

      <div className="benefits-grid">
        <div className="benefit-card">
          <h3>For Learners</h3>
          <ul>
            <li>Access diverse skills from real people</li>
            <li>Learn at your own pace</li>
            <li>No financial barriers</li>
            <li>Build practical knowledge</li>
          </ul>
        </div>

        <div className="benefit-card">
          <h3>For Skill Providers</h3>
          <ul>
            <li>Share expertise meaningfully</li>
            <li>Build reputation and credibility</li>
            <li>Connect with global learners</li>
            <li>Grow as a mentor</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
