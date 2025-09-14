import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import "./styles/App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Keep token in sync with localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Protected route: only logged-in users can access Home */}
        <Route path="/" element={token ? <Home setToken={setToken} /> : <Navigate to="/login" />} />

        {/* Login + Signup */}
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup />} />

        {/* Fallback: redirect to login */}
        <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
