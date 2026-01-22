import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand */}
        <div className="footer-brand">
          <h3>
            <span>Skill</span>Exchange
          </h3>
          <p>
            A community-driven platform to learn, teach, and grow together
            through skill exchange.
          </p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li>Home</li>
            <li>Browse Skills</li>
            <li>How It Works</li>
            <li>About</li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li>Help Center</li>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} SkillExchange. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
