import "./PopularSkills.css";

const skills = [
  {
    title: "Web Development",
    category: "Technology",
    users: 120,
  },
  {
    title: "UI / UX Design",
    category: "Design",
    users: 85,
  },
  {
    title: "Data Analysis",
    category: "Technology",
    users: 70,
  },
  {
    title: "Communication Skills",
    category: "Personal Development",
    users: 95,
  },
  {
    title: "Photography",
    category: "Creative",
    users: 60,
  },
  {
    title: "Music Production",
    category: "Creative",
    users: 40,
  },
];

const PopularSkills = () => {
  return (
    <section className="popular-skills">
      <h2 className="section-title">Popular Skills</h2>
      <p className="section-subtitle">
        Explore the most exchanged skills in our community
      </p>

      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div className="skill-card" key={index}>
            <h3>{skill.title}</h3>
            <p className="category">{skill.category}</p>
            <p className="users">
              👥 {skill.users}+ members
            </p>
            <button className="explore-btn">Explore</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularSkills;
