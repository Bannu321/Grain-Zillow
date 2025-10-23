import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cont_beforeLogin.css";

export default function ContactUs_beforeLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    issue: "",
    userId: "",
    message: ""
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    alert(`Thank you, ${form.name}! Your ${form.issue} issue has been reported.\n\nOur support team will contact you within 2-4 hours.`);
    setForm({ name: "", email: "", issue: "", userId: "", message: "" });
  };

  return (
    <div className="contact-support-root">
      <header>
        <div className="logo">
          <i className="fas fa-seedling"></i>
          <h1>GrainZillow</h1>
        </div>
        <p>Smart Grain Storage Monitoring System</p>
        <div className="back-to-login">
          <button 
            className="back-btn"
            onClick={() => navigate("/")}
          >
            <i className="fas fa-arrow-left"></i> Back to Login
          </button>
        </div>
      </header>
      <main>
        <div className="welcome">
          <h1>Contact Support</h1>
          <p>Having trouble logging in? We're here to help! Contact our support team for assistance with login issues or any other technical problems.</p>
        </div>
        <div className="contact-section">
          <div className="login-help">
            <h3><i className="fas fa-exclamation-circle"></i> Login Issues?</h3>
            <p>Before contacting support, try these quick fixes:</p>
            <ul>
              <li>Ensure you're using the correct User ID and password</li>
              <li>Check your internet connection</li>
              <li>Clear your browser cache and cookies</li>
              <li>Try using a different browser</li>
              <li>Make sure JavaScript is enabled in your browser</li>
            </ul>
          </div>
          <div className="contact-card">
            <h2 className="contact-title"><i className="fas fa-phone"></i> Contact Information</h2>
            <div className="contact-item">
              <i className="fas fa-envelope contact-icon"></i>
              <div className="contact-text">
                <span className="contact-label">Email:</span>
                <span className="contact-value">grainzillow.support@gmail.com</span>
              </div>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone contact-icon"></i>
              <div className="contact-text">
                <span className="contact-label">Landline:</span>
                <span className="contact-value">+918662423456</span>
              </div>
            </div>
            <div className="contact-item">
              <i className="fas fa-mobile-alt contact-icon"></i>
              <div className="contact-text">
                <span className="contact-label">Mobile:</span>
                <span className="contact-value">+918259073296</span>
              </div>
            </div>
            <div className="contact-item">
              <i className="fab fa-whatsapp contact-icon"></i>
              <div className="contact-text">
                <span className="contact-label">WhatsApp:</span>
                <span className="contact-value">+917543366557</span>
              </div>
            </div>
            <div className="contact-item">
              <i className="fas fa-university contact-icon"></i>
              <div className="contact-text">
                <span className="contact-label">Institution:</span>
                <span className="contact-value">VIT-AP University</span>
              </div>
            </div>
            <div className="contact-item">
              <i className="fas fa-globe contact-icon"></i>
              <div className="contact-text">
                <span className="contact-label">Website:</span>
                <span className="contact-value">vitap.ac.in</span>
              </div>
            </div>
            <div className="contact-item">
              <i className="fas fa-map-marker-alt contact-icon"></i>
              <div className="contact-text">
                <span className="contact-label">Address:</span>
                <span className="contact-value">VIT-AP University, Amaravati, AP-522237</span>
              </div>
            </div>
            <div className="contact-item">
              <i className="fas fa-clock contact-icon"></i>
              <div className="contact-text">
                <span className="contact-label">Hours:</span>
                <span className="contact-value">Mon-Fri, 9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>
          <div className="contact-card">
            <h2 className="contact-title"><i className="fas fa-comment"></i> Send us a Message</h2>
            <form className="simple-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Your Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Issue Type *</label>
                <select
                  name="issue"
                  required
                  value={form.issue}
                  onChange={handleChange}
                >
                  <option value="">Select issue type</option>
                  <option value="login">Login Problem</option>
                  <option value="password">Password Reset</option>
                  <option value="access">Access Issues</option>
                  <option value="technical">Technical Problem</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>User ID (if known)</label>
                <input
                  type="text"
                  name="userId"
                  placeholder="Enter your User ID if available"
                  value={form.userId}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea
                  rows={5}
                  name="message"
                  required
                  placeholder="Describe your issue in detail..."
                  value={form.message}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="submit-btn">
                <i className="fas fa-paper-plane"></i> Send Message
              </button>
            </form>
          </div>
          <div className="footer-note">
            <p>© 2025 GrainZillow Project Team | VIT-AP University</p>
            <p style={{ marginTop: "5px", fontSize: "13px", color: "#888" }}>
              For login issues, please include your registered email address for faster resolution.
              Our support team typically responds within 2-4 hours during working days.
            </p>
          </div>
        </div>
      </main>
      <footer>
        © 2025 GrainZillow — Smart Grain Storage Monitoring System
      </footer>
    </div>
  );
}
