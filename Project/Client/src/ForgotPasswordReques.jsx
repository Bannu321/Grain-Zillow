import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ForgotPassword.css";

export default function ForgotPasswordRequest() {
  const [recoveryMethod, setRecoveryMethod] = useState("email");
  const [userId, setUserId] = useState("");
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  function handleMethodChange(method) {
    setRecoveryMethod(method);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!userId.trim()) {
      alert("Please enter your user id");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      navigate("/forgot-password/verify", {
        state: { method: recoveryMethod, userId }
      });
    }, 1000);
  }

  return (
    <div className="forgot-bg">
      {/* Top Left Logo */}
      <img src="/grz_logo.jpg" alt="Logo" className="forgot-top-left-img" />
      {/* Top Right: Contact Us clickable */}
      <img
        src="/operator_black.png"
        alt="Contact Us"
        className="forgot-top-right-img"
        onClick={() => navigate("/contactus")}
        style={{ cursor: "pointer" }}
      />

      <div className="forgot-container">
        <div className="forgot-card">
          <div className="logo">
            <h1>GrainZillow<span className="tm">™</span></h1>
            <div className="tagline">Intelligent Grain Storage Monitoring</div>
          </div>
          <div className="page-title">Reset Your Password</div>
          <div className="page-subtitle">
            Enter your account details to reset your password and regain access to your grain storage monitoring system.
          </div>
          <div className="steps">
            <div className="step active">
              <div className="step-circle">1</div>
              <div className="step-label">Identify</div>
            </div>
            <div className="step">
              <div className="step-circle">2</div>
              <div className="step-label">Verify</div>
            </div>
            <div className="step">
              <div className="step-circle">3</div>
              <div className="step-label">Reset</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Recovery Method</label>
              <div className="method-selection">
                <div
                  className={`method-option${recoveryMethod === "email" ? " selected" : ""}`}
                  onClick={() => handleMethodChange("email")}
                  style={{ userSelect: "none" }}
                >
                  <div className="method-icon">📧</div>
                  <div className="method-name">Email</div>
                </div>
                <div
                  className={`method-option${recoveryMethod === "sms" ? " selected" : ""}`}
                  onClick={() => handleMethodChange("sms")}
                  style={{ userSelect: "none" }}
                >
                  <div className="method-icon">📱</div>
                  <div className="method-name">SMS</div>
                </div>
              </div>
              <input type="hidden" value={recoveryMethod} />
            </div>
            <div className="form-group">
              <label htmlFor="userId">User ID</label>
              <input
                type="text"
                id="userId"
                className="form-control"
                placeholder="Enter your user id"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                required
              />
            </div>
            <div className="info-box">
              <div className="info-title">
                <span role="img" aria-label="info" style={{ color: "#2A9D8F" }}>ℹ️</span>
                What to expect next
              </div>
              <div className="info-text">
                {recoveryMethod === "email"
                  ? "We will send a verification code to your registered email address. Use this code to verify your identity and reset your password."
                  : "We will send a verification code to your registered phone number via SMS. Use this code to verify your identity and reset your password."
                }
              </div>
            </div>
            <div className="divider"></div>
            <button
              type="submit"
              className="submit-btn"
              disabled={sending}
            >
              {sending ? "Sending..." : "Send Reset Instructions"}
            </button>
          </form>

          <div className="secondary-text">
            <p>
              Remember your password? <Link to="/">Back to Login</Link>
            </p>
            <p>
              Need help? <Link to="/contactus">Contact Support</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
