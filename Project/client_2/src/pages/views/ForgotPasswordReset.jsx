import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./ForgotPassword.css";

export default function ForgotPasswordReset() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId = "" } = location.state || {};

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [resetting, setResetting] = useState(false);

  function validatePassword(pwd) {
    return (
      pwd.length >= 8 &&
      /[A-Z]/.test(pwd) &&
      /[a-z]/.test(pwd) &&
      /[0-9]/.test(pwd) &&
      /[^A-Za-z0-9]/.test(pwd)
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!validatePassword(newPassword)) {
      setError(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setResetting(true);
    setTimeout(() => {
      setResetting(false);
      alert("Password reset successful! Please log in.");
      navigate("/");
    }, 1500);
  }

  return (
    <div className="forgot-bg">
      <img src="/grz_logo.jpg" alt="Logo" className="forgot-top-left-img" />
      <img
        src="/cnt_logo.jpg"
        alt="Contact Us"
        className="forgot-top-right-img"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/contactus")}
      />

      <div className="forgot-container">
        <div className="forgot-card">
          <div className="logo">
            <h1>
              GrainZillow<span className="tm">™</span>
            </h1>
            <div className="tagline">Intelligent Grain Storage Monitoring</div>
          </div>
          <div className="page-title">Create New Password</div>
          <div className="page-subtitle">
            Create a strong, unique password to secure your grain storage monitoring account.
          </div>
          <div className="steps">
            <div className="step completed">
              <div className="step-circle">1</div>
              <div className="step-label">Identify</div>
            </div>
            <div className="step completed">
              <div className="step-circle">2</div>
              <div className="step-label">Verify</div>
            </div>
            <div className="step active">
              <div className="step-circle">3</div>
              <div className="step-label">Reset</div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="info-box" style={{ marginBottom: 19 }}>
              <div className="info-title">Password Requirements:</div>
              <ul style={{ marginTop: 7, paddingLeft: 22, textAlign: "left" }}>
                <li>At least 8 characters long</li>
                <li>Contains uppercase letter</li>
                <li>Contains lowercase letter</li>
                <li>Contains number</li>
                <li>Contains special character</li>
              </ul>
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                className="form-control"
                placeholder="Enter new password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div style={{ color: "#F44336", fontSize: 14, marginBottom: 15 }}>{error}</div>
            )}
            <button type="submit" className="submit-btn" disabled={resetting}>
              {resetting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
          <div className="secondary-text">
            <p>
              <Link to="/login">Back to Login</Link> &nbsp;|&nbsp;
              <Link to="/contactus">Contact Support</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
