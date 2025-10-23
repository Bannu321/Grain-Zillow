import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";

const roles = [
  {
    key: "user",
    icon: "👤",
    name: "User",
    desc: "Monitor grain storage"
  },
  {
    key: "manager",
    icon: "👨‍💼",
    name: "Manager",
    desc: "Full system access"
  }
];

function getPasswordStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 2) return "weak";
  if (score === 3) return "medium";
  return "strong";
}

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const pwStrength = password ? getPasswordStrength(password) : "";

  function handleSubmit(e) {
    e.preventDefault();
    if (!role || !fullName || !userId || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      alert(`Account created successfully!\n\nWelcome ${fullName} (${role})!\n\nYou can now log in.`);
      setSubmitting(false);
      setRole("");
      setFullName("");
      setUserId("");
      setPassword("");
      setConfirmPassword("");
    }, 1500);
  }

  return (
    <div className="signup-bg">
      <img src="/grz_logo.jpg" alt="Logo" className="signup-left-img" />
      <img
        src="/cnt_logo.jpg"
        alt="Contact Us"
        className="signup-right-img"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/contactus")}
      />
      <div className="signup-content">
        <div className="signup-container">
          <div className="signup-card">
            <div className="logo">
              <h1>
                GrainZillow<span className="tm">™</span>
              </h1>
              <div className="tagline">Create Your Account</div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Select Your Role</label>
                <div className="role-selection">
                  {roles.map(r => (
                    <div
                      key={r.key}
                      className={`role-option${role === r.key ? " selected" : ""}`}
                      onClick={() => setRole(r.key)}
                      tabIndex={0}
                      role="button"
                      aria-label={r.name}
                    >
                      <div className="role-icon">{r.icon}</div>
                      <div className="role-name">{r.name}</div>
                      <div className="role-desc">{r.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="userId">User ID</label>
                <input
                  type="text"
                  id="userId"
                  className="form-control"
                  placeholder="Choose a user ID"
                  value={userId}
                  onChange={e => setUserId(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <div className={`password-strength ${pwStrength}`}>
                  <div className="password-strength-bar"></div>
                </div>
                <div className="password-hint">
                  Use 8+ characters with letters, numbers, and symbols
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-control"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
                <div
                  className={
                    "password-match " +
                    (confirmPassword === ""
                      ? ""
                      : password === confirmPassword
                      ? "valid"
                      : "invalid")
                  }
                >
                  {confirmPassword !== "" &&
                    (password === confirmPassword ? (
                      <span>
                        ✓ Passwords match
                      </span>
                    ) : (
                      <span>
                        ✗ Passwords do not match
                      </span>
                    ))}
                </div>
              </div>
              <div className="divider"></div>
              <button
                type="submit"
                className="signup-btn"
                disabled={submitting}
              >
                {submitting ? "Creating Account..." : "Create Account"}
              </button>
            </form>
            <div className="terms" style={{ marginTop: "20px", fontSize: "13px" }}>
              By creating an account, you agree to our{" "}
              <Link
                to="/terms"
                className="terms-link"
                style={{
                  color: "#2A9D8F",
                  textDecoration: "underline",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link
                to="/privacy-policy"
                className="terms-link"
                style={{
                  color: "#2A9D8F",
                  textDecoration: "underline",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Privacy Policy
              </Link>.
            </div>
            <div className="secondary-text">
              <p>
                Already have an account?{" "}
                <Link to="/" className="secondary-link">Sign in here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer">
        &copy; 2025 GrainZillow. All rights reserved.
      </footer>
    </div>
  );
}
