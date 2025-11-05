import React, { useState } from "react";
import Layout from "./components/Layout";
import ContentContainer from "./components/ContentContainer";
import Button from "./components/Button";

const faqs = [
  {
    question: "What is GrainZillow?",
    icon: "fas fa-seedling",
    answer: (
      <>
        <p>
          <strong>GrainZillow</strong> is a smart IoT-based grain storage
          monitoring system that tracks temperature, humidity, and gas levels
          inside silos and provides real-time alerts and control features. It's
          designed to prevent grain spoilage and ensure optimal storage
          conditions through continuous monitoring and automated responses.
        </p>
      </>
    ),
  },
  {
    question: "How does the system work?",
    icon: "fas fa-cogs",
    answer: (
      <p>
        The system uses <strong>sensors like DHT11, MQ2, and MQ135</strong> to
        collect environmental data inside the silo. Data is sent to an{" "}
        <strong>ESP32 microcontroller</strong>, which processes it and updates
        readings on the web dashboard via a cloud database. Users can monitor
        conditions in real-time and control ventilation systems remotely.
      </p>
    ),
  },
  {
    question: "What happens if the levels exceed safety limits?",
    icon: "fas fa-exclamation-triangle",
    answer: (
      <p>
        When any reading crosses safe thresholds, the dashboard immediately
        shows a <strong>red warning (DANGER)</strong> indicator. The system can
        automatically or manually activate fans to stabilize conditions and
        prevent spoilage or combustion. Critical alerts are prominently
        displayed to ensure immediate attention.
      </p>
    ),
  },
  {
    question: "Can the system be controlled remotely?",
    icon: "fas fa-globe",
    answer: (
      <p>
        <strong>Yes, absolutely!</strong> The fan can be turned on or off
        through the web interface from anywhere with internet. This allows full
        remote grain storage monitoring and management.
      </p>
    ),
  },
  {
    question: "Who can access the data?",
    icon: "fas fa-user-shield",
    answer: (
      <p>
        Each user has a <strong>unique User ID</strong>, permitting access only
        to their assigned silo's data. Proper authentication and authorization
        protect privacy, and admins can manage multiple users and access rights.
      </p>
    ),
  },
  {
    question: "Does the system store historical data?",
    icon: "fas fa-database",
    answer: (
      <>
        <p>
          <strong>
            Yes, comprehensive historical data storage is included.
          </strong>{" "}
          All sensor readings and control actions are stored and accessible.
          Users can view trends, analyze storage conditions over time, and
          optimize for better safety.
        </p>
      </>
    ),
  },
  {
    question: "How do alerts and notifications work?",
    icon: "fas fa-bell",
    answer: (
      <p>
        Unsafe gas, humidity, or temperature levels trigger immediate red
        highlights on the dashboard. Notifications are sent via the web
        interface, with plans to add email and SMS alerts in future updates.
      </p>
    ),
  },
  {
    question: "What technologies are used in GrainZillow?",
    icon: "fas fa-microchip",
    answer: (
      <ul
        style={{
          listStyleType: "disc",
          paddingLeft: "20px",
          marginTop: "0",
          lineHeight: "1.6",
        }}
      >
        <li>
          <strong>Hardware:</strong> ESP32 microcontroller, DHT11
          (temp/humidity), MQ2 & MQ135 (gas sensors)
        </li>
        <li>
          <strong>Backend:</strong> Firebase/Cloud database
        </li>
        <li>
          <strong>Frontend:</strong> Web dashboard with HTML, CSS, JS
        </li>
        <li>
          <strong>Connectivity:</strong> Wi-Fi for data transmission
        </li>
      </ul>
    ),
  },
  {
    question: "Can the project be expanded in the future?",
    icon: "fas fa-rocket",
    answer: (
      <ul
        style={{
          listStyleType: "disc",
          paddingLeft: "20px",
          marginTop: "0",
          lineHeight: "1.6",
        }}
      >
        <li>AI predictive maintenance</li>
        <li>Multi-silo management</li>
        <li>Automated machine learning control systems</li>
        <li>Mobile monitoring app</li>
        <li>Integration with weather and market data</li>
        <li>Advanced analytics</li>
      </ul>
    ),
  },
  {
    question: "Who developed GrainZillow?",
    icon: "fas fa-users",
    answer: (
      <p>
        <strong>Developed by a 5-member team</strong> at VIT-AP University with
        hardware and software expertise, under expert mentorship to address
        real-world grain storage challenges.
      </p>
    ),
  },
];

export default function FAQs() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // --- Style objects ---
  const styles = {
    welcomeSection: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      padding: "20px",
      width: "100%",
      maxWidth: "768px",
      textAlign: "center",
      marginBottom: "24px",
    },
    headline: {
      color: "#0d9488",
      fontWeight: "700",
      fontSize: "28px",
      marginBottom: "12px",
    },
    faqSection: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
      padding: "28px",
      width: "100%",
      maxWidth: "768px",
      marginBottom: "24px",
    },
    faqIntro: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      padding: "28px",
      marginBottom: "32px",
      textAlign: "center",
    },
    faqIntroTitle: {
      color: "#0d9488",
      fontWeight: "600",
      fontSize: "24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      marginBottom: "16px",
    },
    faqIntroText: {
      color: "#475569",
      fontSize: "16px",
      maxWidth: "480px",
      margin: "0 auto",
      lineHeight: "1.6",
    },
    faqItem: {
      borderBottom: "1px solid #e5e7eb",
      paddingTop: "20px",
      paddingBottom: "20px",
      transition: "background-color 0.3s ease",
      borderRadius: "8px",
    },
    faqItemActive: {
      backgroundColor: "#f3f4f6",
      borderRadius: "8px",
    },
    faqQuestion: {
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "#0d9488",
      fontWeight: "600",
      fontSize: "18px",
      userSelect: "none",
      padding: "0 8px",
    },
    faqAnswerContainer: {
      overflow: "hidden",
      transition: "max-height 0.3s ease",
      color: "#475569",
      marginTop: "16px",
      fontSize: "16px",
      lineHeight: "1.6",
      padding: "0 8px",
    },
    faqAnswerShow: {
      maxHeight: "500px",
    },
    faqAnswerHide: {
      maxHeight: "0",
    },
    faqIcon: {
      fontSize: "24px",
      color: "#0d9488",
      transition: "transform 0.3s ease",
      minWidth: "24px",
    },
    faqIconRotate: {
      transform: "rotate(180deg)",
    },
    contactSupport: {
      marginTop: "24px",
      padding: "32px",
      borderRadius: "12px",
      backgroundImage: "linear-gradient(to top right, #dcfce7, #bbf7d0)",
      textAlign: "center",
      width: "100%",
      maxWidth: "768px",
    },
    contactSupportTitle: {
      color: "#166534",
      fontWeight: "600",
      fontSize: "22px",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
    },
    contactSupportText: {
      color: "#475569",
      fontSize: "16px",
      marginBottom: "24px",
      lineHeight: "1.6",
    },
  };

  return (
    <Layout currentPage="FAQs" variant="admin">
      <ContentContainer>
        {/* Welcome Section */}
        <section style={styles.welcomeSection}>
          <h1 style={styles.headline}>
            <i className="fas fa-question-circle"></i> Frequently Asked
            Questions
          </h1>
          <p style={{ color: "#64748b", fontSize: "16px" }}>
            Find answers to common questions about GrainZillow
          </p>
        </section>

        {/* FAQ Section */}
        <section style={styles.faqSection}>
          <div style={styles.faqIntro}>
            <h2 style={styles.faqIntroTitle}>
              <i className="fas fa-question-circle"></i> Need Help?
            </h2>
            <p style={styles.faqIntroText}>
              Browse through our frequently asked questions to learn more about
              how GrainZillow works, its features, and how it can help you
              manage grain storage effectively.
            </p>
          </div>

          {faqs.map(({ question, icon, answer }, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={idx}
                style={{
                  ...styles.faqItem,
                  ...(isActive ? styles.faqItemActive : {}),
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "#f8fafc";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <div style={styles.faqQuestion} onClick={() => toggleFAQ(idx)}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      margin: 0,
                      fontSize: "16px",
                    }}
                  >
                    <i
                      className={icon}
                      style={{ fontSize: "18px", color: "#0d9488" }}
                    ></i>
                    {question}
                  </h3>
                  <i
                    className={`fas fa-chevron-down`}
                    style={{
                      ...styles.faqIcon,
                      ...(isActive ? styles.faqIconRotate : {}),
                    }}
                  ></i>
                </div>
                <div
                  style={{
                    ...styles.faqAnswerContainer,
                    ...(isActive ? styles.faqAnswerShow : styles.faqAnswerHide),
                  }}
                >
                  <div style={{ paddingBottom: "8px" }}>{answer}</div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Contact Support Section */}
        <section style={styles.contactSupport}>
          <h3 style={styles.contactSupportTitle}>
            <i className="fas fa-headset"></i> Still Have Questions?
          </h3>
          <p style={styles.contactSupportText}>
            Can't find the answer you're looking for? Our support team is here
            to help you with any additional questions or technical support
            needs.
          </p>
          <Button
            variant="primary"
            icon="fa-phone"
            onClick={() =>
              alert(
                "Contact support clicked! You can reach us at support@grainzillow.com"
              )
            }
            buttonStyle={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            Contact Support
          </Button>
        </section>
      </ContentContainer>
    </Layout>
  );
}
