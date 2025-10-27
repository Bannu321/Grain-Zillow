import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./Login.css";

// --- CaptchaBox Component ---
function CaptchaBox({ onValidate, disabled }) {
  const [captcha, setCaptcha] = useState({ challenge: "", answer: "" });
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const generateCaptcha = () => {
    const types = ["math", "text", "sequence"];
    const type = types[Math.floor(Math.random() * types.length)];
    let challenge = "";
    let answer = "";
    if (type === "math") {
      const ops = ["+", "-", "*"];
      const op = ops[Math.floor(Math.random() * ops.length)];
      let num1 = Math.floor(Math.random() * 15) + 1;
      let num2 = Math.floor(Math.random() * 15) + 1;
      if (op === "-" && num1 < num2) [num1, num2] = [num2, num1];
      challenge = `${num1} ${op} ${num2} = ?`;
      answer = eval(`${num1}${op}${num2}`).toString();
    } else if (type === "text") {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
      let text = "";
      for (let i = 0; i < 6; i++) text += chars.charAt(Math.floor(Math.random() * chars.length));
      challenge = text;
      answer = text;
    } else if (type === "sequence") {
      const start = Math.floor(Math.random() * 10) + 1;
      const step = Math.floor(Math.random() * 5) + 1;
      const seqLength = 4;
      let sequence = [];
      for (let i = 0; i < seqLength; i++) sequence.push(start + i * step);
      challenge = `${sequence.join(", ")}, ?`;
      answer = (start + seqLength * step).toString();
    }
    setCaptcha({ challenge, answer });
    setInput("");
    setError(false);
  };

  useEffect(() => { generateCaptcha(); }, []);

  useEffect(() => {
    if (input === "") {
      onValidate(false);
      return;
    }
    if (input.trim() === captcha.answer) {
      setError(false);
      onValidate(true);
    } else {
      setError(false);
      onValidate(false);
    }
  }, [input, captcha.answer, onValidate]);

  const handleBlur = () => {
    if (input === "") return;
    if (input.trim() !== captcha.answer) {
      setError(true);
      generateCaptcha();
      onValidate(false);
      setInput("");
    }
  };

  return (
    <div className="captcha-container" style={{ marginBottom: "18px" }}>
      <div className="captcha-header">
        <span className="captcha-label">Security Verification</span>
        <button
          type="button"
          className="captcha-refresh"
          onClick={generateCaptcha}
          disabled={disabled}
        >
          New Code
        </button>
      </div>
      <div className="captcha-challenge">
        <span className="captcha-text">{captcha.challenge}</span>
      </div>
      <input
        type="text"
        className="captcha-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter here"
        disabled={disabled}
        onBlur={handleBlur}
      />
      {error && (
        <div className="captcha-error">
          Incorrect CAPTCHA. Please try again.
        </div>
      )}
    </div>
  );
}





// --- Main Login Component ---
export default function GrainZillowLogin() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);

  const handelOK = () =>{
    <Link className="secondary-link" to="/signup">
                Create an account
    </Link>
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId || !password) {
      alert("Please enter both user id and password");
      return;
    }
    if (!captchaValid) {
      alert("Captcha is not valid. Please try again.");
      return;
    }
    setAuthenticating(true);
    setTimeout(() => {
      alert("Login successful! Redirecting to Grain Storage Dashboard...");
      setAuthenticating(false);
    }, 1500);
  };

  return (
    <div className="top-images">
      {/* Top Left Logo */}
      <img src="/grz_logo.jpg" alt="Logo" className="top-left-img" />
      {/* Top Right: Contact Us icon, navigates to /contactus */}
      <img
        src="/operator_black.png"
        alt="Contact Us"
        className="top-right-img"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/contactus")}
      />

      {/* --- Login Card --- */}
      <div className="login-container">
        <div className="login-card">
          <div className="logo-section">
            <h1 className="logo-text">
              GrainZillow<span className="tm">™</span>
            </h1>
            <div className="tagline">
              Intelligent Grain Storage Monitoring
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="userId" className="form-label">
                User ID
              </label>
              <input
                type="text"
                id="userId"
                className="form-control"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                placeholder="Enter your user id"
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
            {/* <-- CAPTCHA here --> */}
            <CaptchaBox onValidate={setCaptchaValid} disabled={authenticating} />
            <button
              type="submit"
              className={`login-btn${authenticating ? " login-btn-disabled" : ""}`}
              disabled={authenticating}
            >
              {authenticating ? "Authenticating..." : "Login to Dashboard"}
            </button>
          </form>
          <div className="secondary-text">
            <p>
              New to GrainZillow?{" "}
              <Link className="secondary-link" to="/signup">
                Create an account
              </Link>
            </p>
           <p>
  <Link className="secondary-link" to="/forgot-password" style={{ cursor: "pointer" }}>
    Forgot your password?
  </Link>
</p>

          </div>
        </div>
      </div>
      {/* Sticky Footer */}
      <footer className="footer" >
        &copy; <b>2025 GrainZillow. All rights reserved.</b>

      </footer>
    </div>
  );
}
