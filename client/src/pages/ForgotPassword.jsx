import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useToastContext } from "../context/ToastContext";

export default function ForgotPassword() {
  const toast = useToastContext();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await API.post("/auth/forgot-password", { email });
      
      setEmailSent(true);
      // In development, show token (remove in production)
      if (data.resetToken) {
        setResetToken(data.resetToken);
        toast.info("Reset token generated (check console for production)");
        console.log("Reset Token:", data.resetToken);
        console.log("Reset Link:", data.resetLink);
      } else {
        toast.success(data.message || "If email exists, reset link has been sent");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Error sending reset email");
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
          Forgot Password 🔐
        </h2>

        {!emailSent ? (
          <>
            <p className="text-muted text-center mb-4">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label fw-semibold">Email Address</label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold mb-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="bi bi-envelope me-2"></i>Send Reset Link
                  </>
                )}
              </button>
            </form>

            <div className="text-center">
              <Link to="/" className="text-decoration-none small text-primary">
                <i className="bi bi-arrow-left me-1"></i>Back to Login
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center">
            <i className="bi bi-check-circle text-success" style={{ fontSize: "3rem" }}></i>
            <h5 className="mt-3 mb-2">Check Your Email</h5>
            <p className="text-muted mb-3">
              If an account exists with this email, we've sent a password reset link.
            </p>
            
            {/* Development Only - Show Token */}
            {resetToken && (
              <div className="alert alert-info mb-3">
                <small>
                  <strong>Development Mode:</strong> Reset token generated
                  <br />
                  <code style={{ fontSize: "0.75rem", wordBreak: "break-all" }}>
                    {resetToken}
                  </code>
                  <br />
                  <Link 
                    to={`/reset-password?token=${resetToken}`}
                    className="btn btn-sm btn-primary mt-2"
                  >
                    Go to Reset Password
                  </Link>
                </small>
              </div>
            )}

            <div className="d-flex gap-2 justify-content-center">
              <Link to="/" className="btn btn-outline-primary btn-sm">
                <i className="bi bi-arrow-left me-1"></i>Back to Login
              </Link>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                  setResetToken("");
                }}
              >
                Send Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

