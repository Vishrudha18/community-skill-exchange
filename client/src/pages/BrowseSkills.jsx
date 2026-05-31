import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BrowseSkills.css";

const BrowseSkills = () => {
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState([]);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // =====================================
  // Debounce Search (300ms)
  // =====================================
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // =====================================
  // Fetch Skills (Public)
  // =====================================
  useEffect(() => {
    const fetchSkills = async () => {;
      try {
        const res = await fetch("http://localhost:5000/api/skills", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (!res.ok) {
          console.error(data.message);
          return;
        }

        let skillsData = data;

        // 🔥 Group skills by name
        const grouped = {};

        skillsData.forEach((skill) => {
          if (!grouped[skill.name]) {
            grouped[skill.name] = {
              ...skill,
              count: 1,
              users: [skill.user],
            };
          } else {
            grouped[skill.name].count += 1;
            grouped[skill.name].users.push(skill.user);
          }
        });

        const groupedArray = Object.values(grouped);

        setSkills(groupedArray);
        setFilteredSkills(groupedArray);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [token, user]);

  // =====================================
  // Fetch Sent Requests
  // =====================================
  useEffect(() => {
    if (!token) return;

    const fetchSentRequests = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/requests/sent",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) return;

        const requestedSkillIds = data.map((req) => req.skill?._id);
        setSentRequests(requestedSkillIds);
      } catch (error) {
        console.error("Error fetching sent requests:", error);
      }
    };

    fetchSentRequests();
  }, [token]);

  // =====================================
  // Send Request
  // =====================================
  const handleSendRequest = async (skill) => {
    try {
      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          skillId: skill._id,
          providerId: skill.user?._id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to send request");
        return;
      }

      setSentRequests((prev) => [...prev, skill._id]);
      alert("Request sent successfully!");
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  // =====================================
  // Search + Filter
  // =====================================
  useEffect(() => {
    let result = skills;

    if (debouncedSearch.trim()) {
      const term = debouncedSearch.toLowerCase();
      result = result.filter(
        (skill) =>
          skill.name?.toLowerCase().includes(term) ||
          skill.category?.toLowerCase().includes(term)
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((skill) => skill.type === typeFilter);
    }

    setFilteredSkills(result);
  }, [debouncedSearch, typeFilter, skills]);

  return (
    <div className="browse-page">
      {/* HERO */}
      <div className="browse-hero">
        <h1>Browse Skills</h1>
        <p>Explore skills shared by the community</p>
      </div>

      {/* FILTERS */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="offer">Offered</option>
        </select>
      </div>

      {/* SKILLS SECTION */}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : filteredSkills.length === 0 ? (
        <div className="empty-state">
          <div className="empty-card">
            <h2>No Skills Found</h2>

            {!token ? (
              <>
                <p>Be the first to join the SkillExchange community.</p>
                <button onClick={() => navigate("/register")}>
                  Join the Community
                </button>
              </>
            ) : (
              <>
                <p>No skills from other users yet.</p>
                <button onClick={() => navigate("/dashboard")}>
                  Add Your Skills
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="skills-grid">
          {filteredSkills.map((skill) => (
            <div className="skill-card" key={skill._id}>
              <h3>{skill.name}</h3>

              <p className="skill-count">
                {skill.count} {skill.count > 1 ? "Users" : "User"} sharing
                this
              </p>

              <p>
                Level: <strong>{skill.level}</strong>
              </p>

              <span className={`type-badge ${skill.type}`}>
                {skill.type === "offer"
                  ? "Skill Offered"
                  : "Skill Wanted"}
              </span>

              <p>{skill.category}</p>

              <p className="owner">
                Shared by: <strong>{skill.user?.name}</strong>
              </p>

              {/* BUTTON LOGIC */}
              {!token ? (
                <button onClick={() => navigate("/register")}>
                  Join to Connect
                </button>
              ) : sentRequests.includes(skill._id) ? (
                <button className="sent-btn" disabled>
                  Request Sent
                </button>
              ) : (
                <button
                  className="connect-btn"
                  onClick={() => handleSendRequest(skill)}
                >
                  Send Request
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseSkills;
