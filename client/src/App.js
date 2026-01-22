import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Match from "./pages/Match";
import BrowseSkills from "./pages/BrowseSkills";
import Requests from "./pages/Requests";
import MyRequests from "./pages/MyRequests";
import ReceivedRequests from "./pages/ReceivedRequests";
import About from "./pages/About";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        <Route 
        path="/dashboard"
        element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
      />
        <Route
        path="/match"
        element={
        <ProtectedRoute>
          <Match />
        </ProtectedRoute>
      }
      />
      <Route path="/browse" element={<BrowseSkills />} />
      <Route 
      path="/requests"
      element={
      <ProtectedRoute>
        <Requests />
      </ProtectedRoute>
      }
      />

      <Route path="/my-requests" element={<MyRequests />} />
      <Route path="/received-requests" element={<ReceivedRequests />} />
      <Route path="/about" element={<About />} />

      </Routes>
    </Router>
  );
}

export default App;
