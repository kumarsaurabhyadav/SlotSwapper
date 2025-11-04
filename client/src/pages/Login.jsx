import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      alert("Welcome back! 👋");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: "linear-gradient(135deg, #b4cfebff 0%, #742fe2ff 100%)",
      }}
    >
      <div
        className="card shadow-lg border-0 p-4"
        style={{ width: "400px", borderRadius: "16px" }}
      >
        <h2 className="text-center mb-4 text-primary fw-bold">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <small className="text-muted">
            Don’t have an account?{" "}
            <span
              role="button"
              className="text-decoration-none fw-bold text-primary"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </small>
        </div>
      </div>
    </div>
  );
}