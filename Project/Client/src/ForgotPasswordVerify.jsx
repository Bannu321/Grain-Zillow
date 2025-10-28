import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./ForgotPassword.css";

export default function ForgotPasswordVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const { method = "email", userId = "" } = location.state || {};

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(300); // 5 min = 300 sec
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const iv = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(iv);
    }
  }, [timer]);

  function handleChange(i, val) {
    if (val.length > 1) return;
    let copy = [...code];
    copy[i] = val.replace(/[^0-9a-zA-Z]/g, "");
    setCode(copy);
    // focus next
    if (val !== "" && i < 5) {
      document.getElementById(`code${i + 1}`).focus();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (code.some(c => c === "")) {
      setError("Please enter all 6 digits!");
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      if (code.join("") === "123456") {
        navigate("/forgot-password/reset", { state: { userId } });
      } else {
        setError("Incorrect code. Please try again.");
      }
      setVerifying(false);
    }, 1000);
  }

  function handleResend() {
    setTimer(300);
    setError("");
    setCode(["", "", "", "", "", ""]);
    alert(`A new verification code has been sent to your ${method === "email" ? "email address" : "phone number"}.`);
  }

  return (
    <div className="forgot-bg">
      {/* Top Left Logo */}
      <img src="/grz_logo.jpg" alt="Logo" className="forgot-top-left-img" />
      {/* Top Right: Contact Us clickable */}
      <img
        src="/cnt_logo.jpg"
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
          <div className="page-title">Verify Your Identity</div>
          <div className="page-subtitle">
            Enter the 6-digit verification code sent to your {method === "email" ? "email address" : "phone number"}.
          </div>
          <div className="steps">
            <div className="step completed">
              <div className="step-circle">1</div>
              <div className="step-label">Identify</div>
            </div>
            <div className="step active">
              <div className="step-circle">2</div>
              <div className="step-label">Verify</div>
            </div>
            <div className="step">
              <div className="step-circle">3</div>
              <div className="step-label">Reset</div>
            </div>
          </div>
          <div className="info-box" style={{ marginBottom: 19, textAlign: "left" }}>
            <div className="info-title">
              <span role="img" aria-label="info" style={{ color: "#2A9D8F" }}>ℹ️</span>
              Sent to:
            </div>
            <div className="info-text">
              <b>UserID:</b> {userId || "--"} <br />
              <b>Sent to:</b> {method === "email" ? "john@example.com" : "+91-xxxxxxx"}<br />
              <Link to="/forgot-password">Not you? Change account</Link>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", justifyContent: "center", gap: "7px", marginBottom: 18 }}>
              {code.map((val, idx) => (
                <input
                  key={idx}
                  id={`code${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="form-control"
                  style={{ width: 38, textAlign: "center", fontSize: 18, fontWeight: 600, padding: "12px" }}
                  value={val}
                  onChange={e => handleChange(idx, e.target.value)}
                  autoFocus={idx === 0}
                />
              ))}
            </div>
            <div style={{ color: "#2A9D8F", fontSize: 13, marginBottom: 7 }}>
              Code expires in: {`${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`}
            </div>
            {error && <div style={{ color: "#FF5722", fontSize: 14, marginBottom: 7 }}>{error}</div>}
            <button type="submit" className="submit-btn" disabled={verifying || timer <= 0}>
              {verifying ? "Verifying..." : "Verify Code"}
            </button>
          </form>
          <div style={{ marginTop: 13, fontSize: "14px" }}>
            Didn't receive the code?{" "}
            <button type="button" className="secondary-link" style={{ color: "#2A9D8F", background: "none", border: "none", cursor: "pointer" }} onClick={handleResend}>Resend Code</button>
          </div>
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
