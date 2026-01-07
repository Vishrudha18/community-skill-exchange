import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";



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
      </Routes>
    </Router>
  );
}

export default App;
