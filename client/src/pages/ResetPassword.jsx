import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useToastContext } from "../context/ToastContext";

export default function ResetPassword() {
  const toast = useToastContext();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      toast.error("Invalid reset link");
      navigate("/forgot-password");
    }
  }, [searchParams, navigate, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    try {
      setLoading(true);
      await API.post("/auth/reset-password", {
        token,
        newPassword: form.password,
      });

      toast.success("Password reset successful! You can now login.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error resetting password");
    } finally {
      setLoading(false);
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
        style={{ width: "450px", borderRadius: "16px" }}
      >
        <h2 className="text-center mb-4 text-primary fw-bold">
          Reset Password 🔑
        </h2>

        <p className="text-muted text-center mb-4">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">New Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Enter new password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
              minLength={6}
            />
            <small className="text-muted">
              Password must be at least 6 characters long
            </small>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Confirm Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold mb-3"
            disabled={loading || !token}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Resetting...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>Reset Password
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <Link to="/" className="text-decoration-none small text-primary">
            <i className="bi bi-arrow-left me-1"></i>Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

