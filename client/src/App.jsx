import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import Requests from "./pages/Requests";
import { connectSocket, disconnectSocket } from "./services/socket";
import { getUserId } from "./utils/auth";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
}

export default function App() {
  useEffect(() => {
    // Connect Socket.io when user is logged in
    const userId = getUserId();
    if (userId) {
      connectSocket(userId);
    }

    // Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, []);

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
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/marketplace"
          element={
            <PrivateRoute>
              <Marketplace />
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