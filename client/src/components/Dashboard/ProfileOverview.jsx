import { useEffect, useState, useCallback } from "react";
import "./ProfileOverview.css";

const ProfileOverview = () => {
  const [profile, setProfile] = useState(null);
  const [offeredSkills, setOfferedSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // =========================
  // FETCH PROFILE INFO
  // =========================
  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/profile",
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

      setProfile(data);
    } catch (error) {
      console.error("Failed to load profile");
    }
  }, [token]);

  // =========================
  // FETCH OFFERED SKILLS
  // =========================
  const fetchOfferedSkills = useCallback(async () => {
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

      setOfferedSkills(data);
    } catch (error) {
      console.error("Failed to load skills");
    }
  }, [token]);

  useEffect(() => {
    const loadData = async () => {
      await fetchProfile();
      await fetchOfferedSkills();
      setLoading(false);
    };

    loadData();
  }, [fetchProfile, fetchOfferedSkills]);

  if (loading) {
    return <div className="profile-card skeleton"></div>;
  }

  return (
    <section className="profile-card">
      <h2>Profile Overview</h2>

      <div className="profile-info">
        <p><strong>Name:</strong> {profile?.name}</p>
        <p><strong>Email:</strong> {profile?.email}</p>
        <p><strong>Role:</strong> {profile?.role || "Member"}</p>
      </div>

      <div className="skills-section">
        <div>
          <h4>Skills Offered</h4>

          {offeredSkills.length === 0 ? (
            <span className="empty">No offered skills yet</span>
          ) : (
            offeredSkills.map(skill => (
              <span key={skill._id} className="skill-pill offer">
                {skill.name}
              </span>
            ))
          )}
        </div>

        <div>
          <h4>Skills Wanted</h4>

          {profile?.skillsWanted?.length === 0 ? (
            <span className="empty">No learning goals yet</span>
          ) : (
            profile?.skillsWanted?.map((skill, i) => (
              <span key={i} className="skill-pill learn">
                {skill}
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfileOverview;
