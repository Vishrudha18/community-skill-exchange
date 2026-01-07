import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading...</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Dashboard</h1>

      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <h3>Skills Offered</h3>
      <ul>
        {user.skillsOffered.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>

      <h3>Skills Wanted</h3>
      <ul>
        {user.skillsWanted.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>

      <p style={{ color: "green" }}>✅ JWT protected dashboard</p>
    </div>
  );
}

export default Dashboard;
