import React, { useState } from "react";
import Layout from "./components/Layout";
import WelcomeSection from "./components/WelcomeSection";
import ContentContainer from "./components/ContentContainer";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Message sent!\nName: ${formData.name}\nEmail: ${formData.email}\nMessage:\n${formData.message}`
    );
    setFormData({ name: "", email: "", message: "" });
  };

  // Style objects
  const styles = {
    contactSection: {
      width: "100%",
      maxWidth: "460px",
      display: "flex",
      flexDirection: "column",
      gap: "32px",
    },
    card: {
      background: "white",
      borderRadius: "16px",
      boxShadow: "0 4px 18px rgba(0,0,0,0.10)",
      padding: "30px 36px",
      marginBottom: 0,
    },
    cardTitle: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      color: "#00897B",
      fontSize: "22px",
      fontWeight: "600",
      marginBottom: "20px",
    },
    contactInfoRow: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "11px 0",
      borderBottom: "1px solid #ececec",
      fontSize: "16px",
    },
    contactInfoLabel: {
      minWidth: "82px",
      color: "#78909C",
      fontWeight: "500",
    },
    contactInfoValue: {
      color: "#37474F",
      fontWeight: "600",
      flex: 1,
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "18px",
      marginTop: "10px",
    },
    label: {
      display: "block",
      marginBottom: "7px",
      fontSize: "15px",
      color: "#00897B",
      fontWeight: "500",
      letterSpacing: "0.2px",
    },
    input: {
      width: "100%",
      padding: "12px 13px",
      borderRadius: "8px",
      border: "1px solid #B0BEC5",
      fontSize: "16px",
      outline: "none",
      marginBottom: "2px",
      background: "#f8f9fa",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    },
    textarea: {
      width: "100%",
      minHeight: "88px",
      padding: "13px",
      borderRadius: "8px",
      border: "1px solid #B0BEC5",
      fontSize: "16px",
      outline: "none",
      background: "#f8f9fa",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      resize: "vertical",
    },
    submitBtn: {
      marginTop: "8px",
      width: "100%",
      background: "linear-gradient(90deg, #00897B, #00695C)",
      color: "white",
      fontWeight: "600",
      borderRadius: "8px",
      padding: "13px",
      border: "none",
      fontSize: "16px",
      cursor: "pointer",
      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      transition: "background 0.2s",
    },
    footerNote: {
      textAlign: "center",
      color: "#607D8B",
      fontSize: "16px",
      marginTop: "6px",
      marginBottom: "9px",
    },
    footerNoteSub: {
      marginTop: "3px",
      color: "#B0BEC5",
      fontSize: "12px",
    },
  };

  return (
    <Layout currentPage="Contact Us">
      <ContentContainer>
        <WelcomeSection 
          title="Contact Us"
          subtitle="Get in touch with the GrainZillow team"
        />
        
        <div style={styles.contactSection}>
          {/* Contact Information */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Contact Information
            </div>
            {[
              { 
                icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", 
                label: "Email:", 
                value: "grainzillow.support@gmail.com" 
              },
              { 
                icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", 
                label: "Landline:", 
                value: "+91 866 242 3456" 
              },
              { 
                icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", 
                label: "Mobile:", 
                value: "+91 82590 73296" 
              },
              { 
                icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", 
                label: "WhatsApp:", 
                value: "+91 75433 66557" 
              },
              { 
                icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", 
                label: "Institution:", 
                value: "VIT-AP University" 
              },
              { 
                icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9a9 9 0 00-9 9", 
                label: "Website:", 
                value: "www.vitap.ac.in" 
              },
              { 
                icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z", 
                label: "Address:", 
                value: "VIT-AP University, Amaravati, AP-522237" 
              },
              { 
                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", 
                label: "Hours:", 
                value: "Mon-Fri, 9:00 AM - 6:00 PM" 
              },
            ].map(({ icon, label, value }, idx, arr) => (
              <div
                key={label}
                style={{
                  ...styles.contactInfoRow,
                  borderBottom: idx === arr.length - 1 ? "none" : "1px solid #ececec",
                }}
              >
                <svg style={{ width: '18px', height: '18px', color: '#00897B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
                <span style={styles.contactInfoLabel}>{label}</span>
                <span style={styles.contactInfoValue}>{value}</span>
              </div>
            ))}
          </div>

          {/* Quick Message Form */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Send us a Message
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div>
                <label htmlFor="name" style={styles.label}>Your Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  style={styles.input}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" style={styles.label}>Your Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  style={styles.input}
                  required
                />
              </div>
              <div>
                <label htmlFor="message" style={styles.label}>Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                  style={styles.textarea}
                  required
                />
              </div>
              <button 
                type="submit" 
                style={styles.submitBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #00695C, #004D40)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #00897B, #00695C)';
                }}
              >
                Send Message
              </button>
            </form>
          </div>
          
          <div style={styles.footerNote}>
            <p>© 2025 GrainZillow Project Team | VIT-AP University</p>
            <div style={styles.footerNoteSub}>
              For technical queries, include your User ID for faster resolution.
            </div>
          </div>
        </div>
      </ContentContainer>
    </Layout>
  );
}