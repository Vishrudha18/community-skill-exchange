import { useNavigate } from "react-router-dom";
import "./CTASection.css";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="cta-section">
      <h2>Ready to Share Your Skills?</h2>
      <p>
        Join a growing community where learning and teaching go hand in hand.
      </p>

      <button className="cta-btn" onClick={() => navigate("/register")}>
        Join the Community
      </button>
    </section>
  );
};

export default CTASection;
