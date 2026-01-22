import "./Benefits.css";

const benefits = [
  {
    title: "No Money Involved",
    description:
      "Exchange skills freely without any monetary transactions. Learn by sharing what you know.",
    icon: "💸",
  },
  {
    title: "Community Driven",
    description:
      "Connect with like-minded learners and mentors in a trusted community.",
    icon: "🤝",
  },
  {
    title: "Learn Anytime",
    description:
      "Exchange skills online or offline based on your availability and comfort.",
    icon: "⏰",
  },
  {
    title: "Trusted & Secure",
    description:
      "Ratings, reviews, and secure authentication ensure a safe learning environment.",
    icon: "🔒",
  },
];

const Benefits = () => {
  return (
    <section className="benefits">
      <h2 className="section-title">Why Choose SkillExchange?</h2>
      <p className="section-subtitle">
        Experience a smarter way to learn and teach skills
      </p>

      <div className="benefits-grid">
        {benefits.map((benefit, index) => (
          <div className="benefit-card" key={index}>
            <div className="benefit-icon">{benefit.icon}</div>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;
