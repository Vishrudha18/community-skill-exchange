import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2>Skill Exchange</h2>

      <div>
        <Link to="/">Home</Link>

        {!token && <Link to="/register">Register</Link>}
        {!token && <Link to="/login">Login</Link>}

        {token && <Link to="/dashboard">Dashboard</Link>}
        {token && <button onClick={handleLogout}>Logout</button>}
      </div>
    </nav>
  );
}

export default Navbar;
