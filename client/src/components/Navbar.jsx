import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "./Navbar.css";
import NotificationBell from "./Navbar/NotificationBell";

import {
  FaHome,
  FaSearch,
  FaExchangeAlt,
  FaSignOutAlt,
  FaClipboardList,
  FaCalendarAlt,
  FaTachometerAlt,
} from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-logo" onClick={() => navigate("/")}>
        <span>Skill</span>Exchange
      </div>

      {/* Hamburger */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* CENTER LINKS */}
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>

        {/* 🌍 PUBLIC LINKS (NOT LOGGED IN) */}
        {!token && (
          <>
            <NavLink to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
              <FaHome /> Home
            </NavLink>

            <NavLink to="/browse-skills" className="nav-link" onClick={() => setMenuOpen(false)}>
              <FaSearch /> Browse
            </NavLink>
          </>
        )}

        {/* 🔐 PRIVATE LINKS (LOGGED IN) */}
        {token && (
          <>
            <NavLink to="/home" className="nav-link" onClick={() => setMenuOpen(false)}>
              <FaHome /> Home
            </NavLink>

            <NavLink to="/browse-skills" className="nav-link" onClick={() => setMenuOpen(false)}>
              <FaSearch /> Browse
            </NavLink>

            <NavLink to="/match" className="nav-link" onClick={() => setMenuOpen(false)}>
              <FaExchangeAlt /> Match
            </NavLink>
          </>
        )}

        {/* 📱 MOBILE SECTION */}
        {token && (
          <div className="mobile-only">
            <div className="mobile-divider" />

            <NavLink to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>
              <FaTachometerAlt /> Dashboard
            </NavLink>

            <NavLink to="/requests" className="nav-link" onClick={() => setMenuOpen(false)}>
              <FaClipboardList /> Requests
            </NavLink>

            <NavLink to="/sessions" className="nav-link" onClick={() => setMenuOpen(false)}>
              <FaCalendarAlt /> Sessions
            </NavLink>

            <button className="nav-link logout" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}

        {!token && (
          <div className="mobile-only">
            <NavLink to="/login" className="btn-login" onClick={() => setMenuOpen(false)}>
              Login
            </NavLink>
            <NavLink to="/register" className="btn-register" onClick={() => setMenuOpen(false)}>
              Register
            </NavLink>
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="nav-right">
        {token ? (
          <>
            <NotificationBell />

            <div
              className="profile"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              ref={dropdownRef}
            >
              <div className="avatar">
                {user?.name?.charAt(0) || "U"}
              </div>

              {dropdownOpen && (
                <div className="dropdown">
                  <p className="dropdown-user">{user?.name || "User"}</p>

                  <NavLink to="/dashboard" className="dropdown-item">
                    <FaTachometerAlt /> Dashboard
                  </NavLink>

                  <NavLink to="/requests" className="dropdown-item">
                    <FaClipboardList /> Requests
                  </NavLink>

                  <NavLink to="/sessions" className="dropdown-item">
                    <FaCalendarAlt /> Sessions
                  </NavLink>

                  <div className="dropdown-divider" />

                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <NavLink to="/login" className="btn-login">Login</NavLink>
            <NavLink to="/register" className="btn-register">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;