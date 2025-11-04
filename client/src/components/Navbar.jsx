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

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold fs-4" to="/">
          <span className="text-warning">⚡</span> SlotSwapper
        </Link>

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
                  <Link className="nav-link fw-semibold" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <Link className="nav-link fw-semibold" to="/marketplace">
                    Marketplace
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <Link className="nav-link fw-semibold" to="/requests">
                    Requests
                  </Link>
                </li>
                <li className="nav-item ms-3">
                  <button
                    onClick={logout}
                    className="btn btn-danger btn-sm px-3 py-1 fw-semibold"
                  >
                    Logout
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