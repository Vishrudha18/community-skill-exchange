import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.user.name);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );
      localStorage.setItem(
        "userId",
        res.data.user._id
      );

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed"
      );
    }
  };

  return (
    <div className="login-container">

      {/* LEFT SIDE */}
      <div className="login-brand">
        <div className="brand-content">
          <div className="skill-logo">
        <span>Skill</span>Exchange
          </div>

          <div className="hero-word">
  <span>Learn.</span>
  <span>Teach.</span>
  <span>Grow.</span>
</div>

          <p>
            Connect with learners and mentors
            around the world through community
            driven skill sharing.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <form
        className="login-form"
        onSubmit={handleSubmit}
      >
        <div className="form-wrapper">

          <h3>Welcome Back 👋</h3>

          <p className="login-subtitle">
            Continue your learning journey
          </p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button type="submit">
            Login
          </button>

          <div className="login-footer">
            Don't have an account?{" "}
            <span
              onClick={() =>
                navigate("/register")
              }
            >
              Register
            </span>
          </div>

        </div>
      </form>

    </div>
  );
}

export default Login;