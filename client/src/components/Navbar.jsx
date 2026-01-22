import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [pendingCount, setPendingCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    if (!token) return;

    const fetchCount = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/requests/count",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setPendingCount(data.count || 0);
      } catch (error) {
        console.error("Failed to fetch request count");
      }
    };

    fetchCount();
  }, [token]);

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <span>Skill</span>Exchange
      </div>

      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Home</NavLink>

        {token && <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Dashboard</NavLink>}
        {token && <NavLink to="/match" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Match</NavLink>}

        {token && (
          <NavLink to="/requests" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Requests
            {pendingCount > 0 && (
              <span className="notif-badge">{pendingCount}</span>
            )}
          </NavLink>
        )}

        {!token && (
          <NavLink to="/register" className="btn-login">
            Register
          </NavLink>
        )}

        {!token && (
          <NavLink to="/login" className="btn-login">
            Login
          </NavLink>
        )}

        <NavLink to="/about" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>About</NavLink>

        {token && (
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        )}

      </div>
    </nav>
  );
}

export default Navbar;
