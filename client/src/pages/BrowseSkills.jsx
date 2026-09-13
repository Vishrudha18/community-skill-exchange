import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BrowseSkills.css";
import RatingSummary from "../components/reviews/RatingSummary";
import {
  FaJava,
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaNodeJs,
  FaPython,
  FaGitAlt,
  FaCode,
} from "react-icons/fa";
import { SiJavascript, SiMongodb, SiFlutter } from "react-icons/si";
import { TbBrandCpp } from "react-icons/tb";

// =====================================
// Skill Name -> Icon Map (keyword-based)
// =====================================
const SKILL_ICON_KEYWORDS = [
  { keywords: ["react native", "reactjs", "react.js", "react js", "react"], icon: FaReact },
  { keywords: ["node.js", "nodejs", "node js", "node"], icon: FaNodeJs },
  { keywords: ["mongodb", "mongo"], icon: SiMongodb },
  { keywords: ["javascript", "js"], icon: SiJavascript },
  { keywords: ["html5", "html"], icon: FaHtml5 },
  { keywords: ["css3", "css"], icon: FaCss3Alt },
  { keywords: ["java"], icon: FaJava },
  { keywords: ["python"], icon: FaPython },
  { keywords: ["flutter"], icon: SiFlutter },
  { keywords: ["c++", "cpp"], icon: TbBrandCpp },
  { keywords: ["git"], icon: FaGitAlt },
];

const getSkillIcon = (skillName) => {
  if (!skillName) return FaCode;
  const key = skillName.trim().toLowerCase();

  for (const entry of SKILL_ICON_KEYWORDS) {
    if (entry.keywords.some((keyword) => key.includes(keyword))) {
      return entry.icon;
    }
  }

  return FaCode;
};

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
        <span className="hero-badge">
          <span className="hero-badge-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          Discover. Learn. Share.
        </span>

        <div className="hero-heading-row">
          <span className="hero-icon-tile" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
          </span>

          <h1 className="hero-heading">
            Browse <span className="hero-heading-accent">Skills</span>
          </h1>
        </div>

        <p className="hero-subtext">Explore skills shared by the community</p>
      </div>

      {/* FILTERS */}
      <div className="filters">
        <div className="search-field">
          <span className="search-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-select-wrapper">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="offer">Offered</option>
          </select>
        </div>

        <button type="button" className="view-toggle-btn" aria-label="Toggle view">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </button>
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
        <>
          <div className="skills-grid">
            {filteredSkills.map((skill) => (
              <div className="skill-card" key={skill._id}>

                {/* Top */}
                <div className="card-top">
                  <div className="skill-identity">
                    <div className="skill-icon" aria-hidden="true">
                      {(() => {
                        const SkillIcon = getSkillIcon(skill.name);
                        return <SkillIcon />;
                      })()}
                    </div>

                    <div className="skill-identity-text">
                      <h3>{skill.name}</h3>
                      <p className="skill-count">
                        <span className="skill-count-icon" aria-hidden="true">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </span>
                        {skill.count} {skill.count > 1 ? "Users" : "User"} sharing this
                      </p>
                    </div>
                  </div>

                  <span className="skill-badge">
                    <span className="skill-badge-dot" aria-hidden="true"></span>
                    Skill Offered
                  </span>
                </div>

                {/* Pills */}
                <div className="card-pills">
                  <span className="pill pill-level">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3v18h18" />
                      <path d="M18.7 8 14 12.7l-3-3L7 14" />
                    </svg>
                    {skill.level}
                  </span>

                  <span className="pill pill-category">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    {skill.category}
                  </span>
                </div>

                {/* Divider */}
                <div className="divider"></div>

                {/* Owner */}
                <div className="owner-section">
                  <div className="owner-avatar">
                    {skill.user?.name?.charAt(0)}
                  </div>

                  <div className="owner-meta">
                    <small>Shared by</small>
                    <h4>{skill.user?.name}</h4>
                  </div>
                </div>

                {/* Rating */}
                <div className="rating-area">
                  {skill.user?.reviewCount > 0 ? (
                    <RatingSummary
                      averageRating={skill.user.averageRating}
                      reviewCount={skill.user.reviewCount}
                    />
                  ) : (
                    <p className="no-rating">No reviews yet</p>
                  )}
                </div>

                {/* Button */}
                {!token ? (
                  <button
                    className="connect-btn"
                    onClick={() => navigate("/register")}
                  >
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
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Send Request
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* BOTTOM CTA */}
          <div className="bottom-cta">
            <div className="bottom-cta-left">
              <div className="bottom-cta-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
                </svg>
              </div>

              <div className="bottom-cta-text">
                <h3>Can't find what you're looking for?</h3>
                <p>Be the one to share it with the community.</p>
              </div>
            </div>

            <button
              type="button"
              className="bottom-cta-btn"
              onClick={() => navigate("/dashboard")}
            >
              Add Your Skills
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BrowseSkills;
