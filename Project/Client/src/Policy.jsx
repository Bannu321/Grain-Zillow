import React from "react";
import { Link } from "react-router-dom";
import "./Policy.css";

export default function PrivacyPolicy() {
  return (
    <div className="container">
      <header>
        <div className="logo">
          <h1>
            GrainZillow<span className="tm">™</span>
          </h1>
          <div className="tagline">Intelligent Grain Storage Monitoring</div>
        </div>
        <div className="page-title">Privacy Policy</div>
        <div className="last-updated">Last Updated: October 20,     2025</div>
      </header>

      <div className="content">
        <div className="section">
          <p>
            At GrainZillow™, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our grain storage monitoring platform.
          </p>
          <div className="highlight">
            <strong>Your Privacy Matters:</strong> We collect only the information necessary to provide our services and protect your grain storage data.
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">1. Information We Collect</h2>
          <div className="subsection">
            <h3 className="subsection-title">1.1 Personal Information</h3>
            <p>We may collect the following personal information:</p>
            <ul>
              <li>Name and contact details</li>
              <li>Business information</li>
              <li>Payment information</li>
              <li>Account credentials</li>
            </ul>
          </div>
          <div className="subsection">
            <h3 className="subsection-title">1.2 Grain Storage Data</h3>
            <p>We collect data related to your grain storage operations:</p>
            <ul>
              <li>Temperature, humidity, and CO₂ readings</li>
              <li>Storage facility information</li>
              <li>Grain type and quantity data</li>
              <li>Environmental control settings</li>
            </ul>
          </div>
          <div className="subsection">
            <h3 className="subsection-title">1.3 Technical Information</h3>
            <p>We automatically collect technical data when you use our services:</p>
            <ul>
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Usage patterns and analytics</li>
              <li>Error logs and performance data</li>
            </ul>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">2. How We Use Your Information</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Purpose</th>
                <th>Information Used</th>
                <th>Legal Basis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Provide monitoring services</td>
                <td>Grain storage data, account information</td>
                <td>Contract fulfillment</td>
              </tr>
              <tr>
                <td>Send alerts and notifications</td>
                <td>Contact information, sensor data</td>
                <td>Legitimate interest</td>
              </tr>
              <tr>
                <td>Improve our services</td>
                <td>Usage data, technical information</td>
                <td>Legitimate interest</td>
              </tr>
              <tr>
                <td>Process payments</td>
                <td>Payment information, contact details</td>
                <td>Contract fulfillment</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="section">
          <h2 className="section-title">3. Data Sharing and Disclosure</h2>
          <div className="subsection">
            <h3 className="subsection-title">3.1 Service Providers</h3>
            <p>We may share your information with trusted service providers who assist us in operating our platform, such as:</p>
            <ul>
              <li>Cloud hosting providers</li>
              <li>Payment processors</li>
              <li>Analytics services</li>
              <li>Customer support platforms</li>
            </ul>
          </div>
          <div className="subsection">
            <h3 className="subsection-title">3.2 Legal Requirements</h3>
            <p>We may disclose your information if required by law or in response to valid legal processes.</p>
          </div>
          <div className="subsection">
            <h3 className="subsection-title">3.3 Business Transfers</h3>
            <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity.</p>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">4. Data Security</h2>
          <p>We implement appropriate technical and organizational security measures to protect your data, including:</p>
          <ul>
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments</li>
            <li>Access controls and authentication</li>
            <li>Secure data backup procedures</li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">5. Data Retention</h2>
          <p>We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.</p>
          <div className="highlight">
            <strong>Retention Periods:</strong> Account data is retained while your account is active. Grain storage data is retained for 5 years to support historical analysis and compliance.
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">6. Your Rights</h2>
          <p>Depending on your location, you may have the following rights regarding your personal information:</p>
          <ul>
            <li>Right to access and receive copies of your data</li>
            <li>Right to correct inaccurate information</li>
            <li>Right to delete your personal data</li>
            <li>Right to restrict or object to processing</li>
            <li>Right to data portability</li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">7. Cookies and Tracking</h2>
          <p>We use cookies and similar technologies to enhance your experience, analyze usage, and support platform functionality. You can control cookie preferences through your browser settings.</p>
        </div>

        <div className="section">
          <h2 className="section-title">8. International Data Transfers</h2>
          <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.</p>
        </div>

        <div className="section">
          <h2 className="section-title">9. Children's Privacy</h2>
          <p>Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children.</p>
        </div>

        <div className="section">
          <h2 className="section-title">10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any material changes and update the "Last Updated" date.</p>
        </div>

        <div className="section">
          <h2 className="section-title">11. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
          <p>
            <strong>Email:</strong> privacy@grainzillow.com<br />
            <strong>Address:</strong> 123 Agriculture Way, Farmingville, FD 12345
          </p>
        </div>

        <div className="navigation">
          <Link to="/terms" className="nav-btn secondary">Terms of Service</Link>
          <Link to="/" className="nav-btn">Back to Login</Link>
        </div>
      </div>

      <footer>
        <p>
          © 2024 GrainZillow™. All rights reserved. | Contact: privacy@grainzillow.com
        </p>
      </footer>
    </div>
  );
}
