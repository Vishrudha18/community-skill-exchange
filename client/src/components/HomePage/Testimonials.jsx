import "./Testimonials.css";

const testimonials = [
  {
    name: "Arjun Kumar",
    skill: "Web Development",
    feedback:
      "I learned full-stack development by teaching Java. This platform truly values skill over money.",
  },
  {
    name: "Priya Sharma",
    skill: "UI/UX Design",
    feedback:
      "The community is supportive and genuine. SkillExchange helped me improve my design skills confidently.",
  },
  {
    name: "Rahul Verma",
    skill: "Communication Skills",
    feedback:
      "Teaching and learning simultaneously made my confidence grow. Highly recommended!",
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials">
      <h2 className="section-title">What Our Users Say</h2>
      <p className="section-subtitle">
        Real experiences from our growing community
      </p>

      <div className="testimonial-grid">
        {testimonials.map((item, index) => (
          <div className="testimonial-card" key={index}>
            <p className="feedback">“{item.feedback}”</p>
            <h4>{item.name}</h4>
            <span>{item.skill}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
