import { useNavigate } from "react-router-dom";
import "./HeroSection.css";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Exchange Skills. <span>Grow Together.</span>
        </h1>

        <p>
          Learn new skills or teach what you know — without money, just
          community-powered learning.
        </p>

        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => navigate("/register")}>
            Get Started
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate("/browse")}
          >
            Browse Skills
          </button>
        </div>
      </div>

      <div className="hero-visual">
        <div className="circle"></div>
        <div className="circle delay"></div>
      </div>
    </section>
  );
};

export default HeroSection;
