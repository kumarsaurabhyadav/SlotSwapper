import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { disconnectSocket } from "../services/socket";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    disconnectSocket();
    navigate("/");
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (token) {
      // If logged in, go to dashboard
      navigate("/dashboard");
    } else {
      // If not logged in, go to login page
      navigate("/");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm sticky-top" style={{ 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      backdropFilter: "blur(10px)"
    }}>
      <div className="container">
        {/* Brand */}
        <div 
          className="navbar-brand fw-bold fs-4" 
          onClick={handleLogoClick}
          style={{ color: "white", cursor: "pointer", userSelect: "none" }}
        >
          <span className="text-warning">⚡</span> SlotSwapper
        </div>

        {/* Toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {token ? (
              <>
                <li className="nav-item mx-2">
                  <Link className="nav-link fw-semibold" to="/dashboard" style={{ color: "rgba(255,255,255,0.9)" }}>
                    <i className="bi bi-calendar3 me-1"></i>Dashboard
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <Link className="nav-link fw-semibold" to="/marketplace" style={{ color: "rgba(255,255,255,0.9)" }}>
                    <i className="bi bi-shop me-1"></i>Marketplace
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <Link className="nav-link fw-semibold" to="/requests" style={{ color: "rgba(255,255,255,0.9)" }}>
                    <i className="bi bi-bell me-1"></i>Requests
                  </Link>
                </li>
                <li className="nav-item ms-3">
                  <button
                    onClick={logout}
                    className="btn btn-light btn-sm px-3 py-1 fw-semibold btn-smooth"
                    style={{ color: "#667eea" }}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item mx-2">
                  <Link className="nav-link fw-semibold" to="/">
                    Login
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <Link className="nav-link fw-semibold" to="/signup">
                    Signup
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}