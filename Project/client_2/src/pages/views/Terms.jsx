import React from "react";
import { Link } from "react-router-dom";
import "./Terms.css";

export default function Terms() {
  return (
    <div className="terms-container">
      <header className="terms-header">
        <div className="logo">
          <h1>
            GrainZillow<span className="tm">™</span>
          </h1>
          <div className="tagline">Intelligent Grain Storage Monitoring</div>
        </div>
        <div className="page-title">Terms of Service</div>
        <div className="last-updated">Last Updated: October 20, 2025</div>
      </header>

      <div className="terms-content">
        <div className="section">
          <p>
            Welcome to GrainZillow™. These Terms of Service govern your use of our grain storage monitoring platform and services. By accessing or using our services, you agree to be bound by these terms.
          </p>
          <div className="highlight">
            <strong>Important:</strong> Please read these terms carefully before using our services. If you do not agree with any part of these terms, you may not access our platform.
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">1. Account Registration</h2>
          <div className="subsection">
            <h3 className="subsection-title">1.1 Eligibility</h3>
            <p>You must be at least 18 years old and have the legal capacity to enter into binding contracts to use our services.</p>
          </div>
          <div className="subsection">
            <h3 className="subsection-title">1.2 Account Security</h3>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
          </div>
          <div className="subsection">
            <h3 className="subsection-title">1.3 Accurate Information</h3>
            <p>You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.</p>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">2. Services Description</h2>
          <p>GrainZillow™ provides intelligent grain storage monitoring solutions including:</p>
          <ul>
            <li>Real-time temperature, humidity, and CO₂ monitoring</li>
            <li>Automated environmental control systems</li>
            <li>Data analytics and reporting</li>
            <li>Alert notifications for critical conditions</li>
            <li>Historical data storage and analysis</li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">3. User Responsibilities</h2>
          <div className="subsection">
            <h3 className="subsection-title">3.1 Proper Use</h3>
            <p>You agree to use our services only for lawful purposes and in accordance with these terms. You shall not:</p>
            <ul>
              <li>Use the service in any way that could damage, disable, or impair our platform</li>
              <li>Attempt to gain unauthorized access to any part of the service</li>
              <li>Interfere with the proper working of the service</li>
              <li>Use any automated means to access the service without our permission</li>
            </ul>
          </div>
          <div className="subsection">
            <h3 className="subsection-title">3.2 Data Accuracy</h3>
            <p>You are responsible for the accuracy of data entered into the system and for maintaining your monitoring equipment in proper working condition.</p>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">4. Intellectual Property</h2>
          <p>All content, features, and functionality of the GrainZillow™ platform, including but not limited to software, text, graphics, and logos, are the exclusive property of GrainZillow™ and are protected by copyright, trademark, and other intellectual property laws.</p>
        </div>

        <div className="section">
          <h2 className="section-title">5. Payment Terms</h2>
          <div className="subsection">
            <h3 className="subsection-title">5.1 Subscription Fees</h3>
            <p>Certain features of our service may require payment of subscription fees. All fees are stated in U.S. dollars and are non-refundable unless otherwise stated.</p>
          </div>
          <div className="subsection">
            <h3 className="subsection-title">5.2 Billing</h3>
            <p>Subscription fees will be billed in advance on a recurring basis. You authorize us to charge your payment method for all applicable fees.</p>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">6. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, GrainZillow™ shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:</p>
          <ul>
            <li>Your use or inability to use the service</li>
            <li>Any unauthorized access to or use of our servers</li>
            <li>Any interruption or cessation of transmission to or from our service</li>
            <li>Any bugs, viruses, or similar that may be transmitted through our service</li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">7. Termination</h2>
          <p>We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.</p>
        </div>

        <div className="section">
          <h2 className="section-title">8. Governing Law</h2>
          <p>These Terms shall be governed and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions.</p>
        </div>

        <div className="section">
          <h2 className="section-title">9. Changes to Terms</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any material changes via email or through our platform.</p>
        </div>

        <div className="navigation">
          <Link to="/login" className="nav-btn secondary">Back to Login</Link>
          <a href="/privacy-policy" className="nav-btn">Privacy Policy</a>
        </div>
      </div>

      <footer className="terms-footer">
        &copy; 2024 GrainZillow™. All rights reserved. | Contact: <a href="mailto:legal@grainzillow.com">legal@grainzillow.com</a>
      </footer>
    </div>
  );
}
