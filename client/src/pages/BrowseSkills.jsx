import { useState } from "react";
import "./BrowseSkills.css";

const skillsData = [
  { name: "Web Development", category: "Technology", level: "Intermediate" },
  { name: "UI / UX Design", category: "Design", level: "Beginner" },
  { name: "Data Analysis", category: "Technology", level: "Advanced" },
  { name: "Communication Skills", category: "Personal Development", level: "Beginner" },
  { name: "Photography", category: "Creative", level: "Intermediate" },
  { name: "Music Production", category: "Creative", level: "Advanced" },
];

const BrowseSkills = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredSkills = skillsData.filter(skill => {
    const matchesSearch = skill.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      category === "All" || skill.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="browse-container">
      <h1>Browse Skills</h1>
      <p>Find skills offered by the community</p>

      <div className="filters">
        <input
          type="text"
          placeholder="Search skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Technology">Technology</option>
          <option value="Design">Design</option>
          <option value="Creative">Creative</option>
          <option value="Personal Development">Personal Development</option>
        </select>
      </div>

      <div className="skills-grid">
        {filteredSkills.length > 0 ? (
          filteredSkills.map((skill, index) => (
            <div className="skill-card" key={index}>
              <h3>{skill.name}</h3>
              <span className="category">{skill.category}</span>
              <span className="level">{skill.level}</span>
              <button>Request Skill</button>
            </div>
          ))
        ) : (
          <p className="no-results">No skills found</p>
        )}
      </div>
    </div>
  );
};

export default BrowseSkills;
