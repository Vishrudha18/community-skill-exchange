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
import Sessions from "./features/sessions/pages/Sessions";
import SessionDetails from "./features/sessions/pages/SessionDetails";
import BookSession from "./pages/BookSession";
import LiveSession from "./pages/LiveSession";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* 🌍 PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/browse-skills" element={<BrowseSkills />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* 🔐 PROTECTED ROUTES */}
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

        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <Requests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-requests"
          element={
            <ProtectedRoute>
              <MyRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/received-requests"
          element={
            <ProtectedRoute>
              <ReceivedRequests />
            </ProtectedRoute>
          }
        />

        <Route path="/sessions" element={<Sessions />} />

        <Route path="/sessions/:id" element={<SessionDetails />} />

        <Route path="/book/:teacherId" element={<BookSession />} />

        <Route path="/live/:id" element={<LiveSession />} />
      </Routes>
    </Router>
  );
}

export default App;
