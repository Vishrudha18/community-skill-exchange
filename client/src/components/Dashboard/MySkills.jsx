import { useEffect, useState, useCallback } from "react";
import "./MySkills.css";

const MySkills = ({ onSkillsUpdate }) => {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    level: "",
    type: "offer",
  });

  const token = localStorage.getItem("token");

  // 🔥 Fetch My Offered Skills
  const fetchMySkills = useCallback(async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/skills/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data.message);
        return;
      }

      setSkills(data);

      // 🔥 Notify Profile Overview
      if (onSkillsUpdate) {
        onSkillsUpdate(data);
      }

    } catch (error) {
      console.error("Failed to fetch my skills:", error);
    }
  }, [token, onSkillsUpdate]);

  useEffect(() => {
    fetchMySkills();
  }, [fetchMySkills]);

  // 🔥 Add Skill
  const addSkill = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:5000/api/skills",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        alert(data.message);
        return;
      }

      setForm({ name: "", category: "", level: "", type: "offer" });

      // 🔥 Refresh skills after add
      fetchMySkills();

    } catch (error) {
      console.error("Add skill error:", error);
    }
  };

  // 🔥 Delete Skill
  const deleteSkill = async (id) => {
    try {
      await fetch(
        `http://localhost:5000/api/skills/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔥 Refresh after delete
      fetchMySkills();

    } catch (error) {
      console.error("Delete skill error:", error);
    }
  };

  return (
    <section className="my">
      <h2>My Skills</h2>

      <form className="skill-form" onSubmit={addSkill}>
        <input
          placeholder="Skill name"
          value={form.name}
          required
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Category"
          value={form.category}
          required
          onChange={e => setForm({ ...form, category: e.target.value })}
        />

        <select
          value={form.level}
          required
          onChange={e => setForm({ ...form, level: e.target.value })}
        >
          <option value="">Level</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        <button>Add Skill</button>
      </form>

      <div className="skills-list">
        {skills.length === 0 ? (
          <p className="empty">No offered skills yet</p>
        ) : (
          skills.map(skill => (
            <div className="skill-item" key={skill._id}>
              <div>
                <h4>{skill.name}</h4>
                <p>{skill.category} • {skill.level}</p>
              </div>

              <button
                className="delete"
                onClick={() => deleteSkill(skill._id)}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default MySkills;
