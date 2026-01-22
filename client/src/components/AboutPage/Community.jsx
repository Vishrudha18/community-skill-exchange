import "./Community.css";
import { useNavigate } from "react-router-dom";

const Community = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleClick = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  return (
    <section className="community fade-up">
      <h2>Who Is It For?</h2>
      <p>
        Students, professionals, mentors, and lifelong learners
        who believe in growing together.
      </p>

      <button className="community-btn" onClick={handleClick}>
        {isLoggedIn ? "Go to Dashboard" : "Join SkillExchange"}
      </button>
    </section>
  );
};

export default Community;
