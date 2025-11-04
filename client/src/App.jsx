import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import Requests from "./pages/Requests";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard /> {/* ✅ Actual dashboard UI */}
            </PrivateRoute>
          }
        />

        <Route
          path="/marketplace"
          element={
            <PrivateRoute>
              <div className="p-4">
                <h2 className="text-center mb-4 text-primary fw-bold">
                  Marketplace 🔁
                </h2>
                <Marketplace />
              </div>
            </PrivateRoute>
          }
        />

        <Route
          path="/requests"
          element={
            <PrivateRoute>
              <Requests />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}