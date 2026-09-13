import React, { useState } from "react";
import axios from "axios";
import "./Register.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    skillsOffered: "",
    skillsWanted: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        skillsOffered: formData.skillsOffered
          .split(",")
          .map(skill => skill.trim()),
        skillsWanted: formData.skillsWanted
          .split(",")
          .map(skill => skill.trim())
      }
    );

    console.log("REGISTER RESPONSE:", response.data);

    // 🔑 SAFE TOKEN CHECK
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      navigate("/login");
    } else {
      setError("Token not received from server");
    }

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    setError(
      err.response?.data?.message ||
      err.message ||
      "Registration failed"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="register-page">
  <div className="register-left">
    <h1 className="brand-title">SkillExchange</h1>

    <div className="hero-word">
      <span>Share.</span>
      <span>Learn.</span>
      <span>Connect.</span>
    </div>

    <p className="hero-text">
      Join a community where people teach skills,
      learn from others, and grow together.
    </p>
  </div>

  <div className="register-right">
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>Create Account 🚀</h2>

      <p className="register-subtitle">
        Start your learning journey today
      </p>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="skillsOffered"
        placeholder="Skills You Offer"
        onChange={handleChange}
      />

      <input
        type="text"
        name="skillsWanted"
        placeholder="Skills You Want To Learn"
        onChange={handleChange}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Creating Account..." : "Create Account"}
      </button>

      <div className="register-footer">
        Already have an account?
        <span onClick={() => navigate("/login")}>
          Login
        </span>
      </div>
    </form>
  </div>
</div>
  );
}

export default Register;
