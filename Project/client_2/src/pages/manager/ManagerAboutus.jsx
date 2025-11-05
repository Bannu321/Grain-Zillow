import React from "react";
import Layout from "./components/Layout";
import ContentContainer from "./components/ContentContainer";

const teamMembers = [
  {
    name: "Talluri Jaswanth",
    role: "Backend Developer",
    responsibility: "Hardware, Database, IoT logic",
  },
  {
    name: "Vuddanti Dhana Sekhar",
    role: "Database Specialist and Documentation",
    responsibility:
      "Managing Database,SRS, technical reports, and presentation materials",
  },
  {
    name: "Talari Hima Sai",
    role: "Hardware Engineer & Frontend Developer",
    responsibility:
      "Designing Frontend, circuit connections, and hardware testing",
  },
  {
    name: "Syed Ameer Basha",
    role: " Teamlead and Frontend Developer",
    responsibility: "Managing the team, Dashboard UI",
  },
  {
    name: "Boddu Akhil",
    role: "Research Analyst and Backend Developer",
    responsibility: "Data collection, analysis, and system testing",
  },
];

const features = [
  {
    icon: "fas fa-chart-line",
    title: "Real-time Monitoring",
    description:
      "Continuous tracking of temperature, humidity, and gas levels (MQ2 & MQ135 sensors)",
  },
  {
    icon: "fas fa-bell",
    title: "Smart Alerts",
    description:
      "Instant notifications for unsafe conditions and potential hazards",
  },
  {
    icon: "fas fa-fan",
    title: "Remote Control",
    description: "Web-based fan control and environmental management",
  },
  {
    icon: "fas fa-tachometer-alt",
    title: "Visual Dashboard",
    description: "Intuitive interface with real-time data visualization",
  },
  {
    icon: "fas fa-shield-alt",
    title: "Secure Access",
    description: "User authentication with silo-specific data protection",
  },
  {
    icon: "fas fa-brain",
    title: "AI Ready",
    description: "Future integration with AI for predictive maintenance",
  },
];

const institutionInfo = [
  {
    title: "Institution",
    content: "Vellore Institute of Technology, Amaravati (VIT-AP)",
  },
  {
    title: "Mentor",
    content: "Yohoshiva Basaraboyina",
  },
  {
    title: "Program",
    content: "Principles of Software Engineering",
  },
  {
    title: "Project Module",
    content: "Academic Research Project",
  },
];

const futureScopeItems = [
  "AI Predictive Maintenance: Machine learning models to detect patterns before faults occur",
  "Mobile Application: Companion app for remote silo management on-the-go",
  "Cloud Analytics: Advanced dashboard for multi-silo management and analytics",
  "Enhanced Alerts: GSM/Email notifications for critical conditions",
  "Multi-language Support: Interface localization for global users",
  "Blockchain Integration: Secure transaction tracking for grain storage and distribution",
];

export default function AboutUs() {
  // --- Style objects ---
  const styles = {
    contentCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
      padding: "24px",
      marginBottom: "24px",
      width: "100%",
    },
    welcomeCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
      padding: "24px",
      marginBottom: "24px",
      width: "100%",
      textAlign: "center",
    },
    headline: {
      color: "#0d9488",
      fontWeight: "700",
      fontSize: "28px",
      marginBottom: "12px",
    },
    sectionTitle: {
      color: "#0d9488",
      fontWeight: "700",
      fontSize: "24px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "24px",
    },
    grid3: {
      width: "100%",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "24px",
      marginBottom: "40px",
    },
    featureCard: {
      backgroundColor: "#f3f4f6",
      borderRadius: "12px",
      padding: "24px",
      border: "1px solid #bbf7d0",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    },
    featureIcon: {
      color: "#0d9488",
      fontSize: "36px",
      marginBottom: "8px",
    },
    featureTitle: {
      color: "#0d9488",
      fontWeight: "600",
      fontSize: "18px",
    },
    featureDescription: {
      color: "#475569",
      fontSize: "14px",
      lineHeight: "1.5",
    },
    textGray: {
      color: "#475569",
      lineHeight: "1.5",
      marginBottom: "16px",
    },
    teamCard: {
      backgroundColor: "#f3f4f6",
      borderRadius: "12px",
      padding: "20px",
      borderLeft: "6px solid #0d9488",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      transition: "transform 0.2s ease",
    },
    teamName: {
      color: "#0d9488",
      fontWeight: "600",
      fontSize: "18px",
      marginBottom: "4px",
    },
    teamRole: {
      color: "#475569",
      fontWeight: "600",
      marginBottom: "4px",
      fontSize: "14px",
    },
    futureScopeList: {
      listStyleType: "disc",
      paddingLeft: "20px",
      color: "#475569",
      marginTop: "0",
      lineHeight: "1.6",
    },
    futureScopeItem: {
      marginBottom: "8px",
    },
    institutionSection: {
      backgroundImage: "linear-gradient(to bottom right, #dcfce7, #bbf7d0)",
      borderRadius: "12px",
      padding: "24px",
      width: "100%",
      marginBottom: "24px",
    },
    institutionGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: "24px",
    },
    institutionCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "16px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    institutionTitle: {
      color: "#0d9488",
      fontWeight: "600",
      marginBottom: "8px",
      fontSize: "16px",
    },
  };

  return (
    <Layout currentPage="About Us" variant="admin">
      <ContentContainer>
        {/* Welcome Section */}
        <section style={styles.welcomeCard}>
          <h1 style={styles.headline}>
            <i className="fas fa-info-circle"></i> About GrainZillow
          </h1>
          <p style={{ color: "#64748b", fontSize: "16px" }}>
            Learn about our mission to revolutionize grain storage through smart
            IoT technology
          </p>
        </section>

        {/* Project Overview */}
        <section style={styles.contentCard}>
          <h3 style={styles.sectionTitle}>
            <i className="fas fa-bullseye"></i> Project Overview
          </h3>
          <p style={styles.textGray}>
            <strong>GrainZillow</strong> is a smart IoT-based grain storage
            monitoring system designed to ensure safe and efficient grain
            management in silos. It continuously monitors temperature, humidity,
            and gas levels to detect early signs of spoilage or combustion,
            alerting warehouse managers in real-time.
          </p>
          <p style={styles.textGray}>
            Our system provides a comprehensive solution for agricultural
            storage facilities, combining cutting-edge sensor technology with an
            intuitive web interface for complete control and monitoring
            capabilities.
          </p>
        </section>

        {/* Problem Statement */}
        <section style={styles.contentCard}>
          <h3 style={styles.sectionTitle}>
            <i className="fas fa-exclamation-triangle"></i> Problem Statement
          </h3>
          <p style={styles.textGray}>
            In many rural and industrial storage facilities, grains often get
            damaged due to improper temperature, humidity, and gas accumulation.
            Manual monitoring is inefficient, delayed, and sometimes impossible.
            Traditional methods lack real-time alerts and remote access
            capabilities.
          </p>
          <p style={styles.textGray}>
            <strong>GrainZillow solves this</strong> by introducing automation
            and smart sensing for safer storage environments, preventing
            significant economic losses and ensuring food security through
            continuous, reliable monitoring.
          </p>
        </section>

        {/* Key Features */}
        <h2 style={styles.sectionTitle}>
          <i className="fas fa-star"></i> Key Features
        </h2>
        <div style={styles.grid3}>
          {features.map(({ icon, title, description }) => (
            <div
              key={title}
              style={styles.featureCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.1)";
              }}
            >
              <i className={icon} style={styles.featureIcon}></i>
              <h4 style={styles.featureTitle}>{title}</h4>
              <p style={styles.featureDescription}>{description}</p>
            </div>
          ))}
        </div>

        {/* Vision & Mission */}
        <section style={styles.contentCard}>
          <h3 style={styles.sectionTitle}>
            <i className="fas fa-eye"></i> Our Vision
          </h3>
          <p style={{ ...styles.textGray, marginBottom: "24px" }}>
            To revolutionize agricultural storage safety using intelligent
            automation and data-driven insights — ensuring zero grain loss and
            improved food security across global agricultural supply chains.
          </p>
          <h3 style={styles.sectionTitle}>
            <i className="fas fa-bullseye"></i> Our Mission
          </h3>
          <p style={styles.textGray}>
            To provide an affordable and scalable IoT-based solution for farmers
            and warehouse managers that enables continuous monitoring, control,
            and optimization of grain storage systems, making advanced
            technology accessible to all stakeholders in the agricultural
            ecosystem.
          </p>
        </section>

        {/* Our Team */}
        <h2 style={styles.sectionTitle}>
          <i className="fas fa-users"></i> Our Team
        </h2>
        <section style={{ ...styles.contentCard, padding: "24px" }}>
          <p style={{ ...styles.textGray, marginBottom: "24px" }}>
            Meet the dedicated team behind GrainZillow's development and
            success:
          </p>
          <div style={styles.grid3}>
            {teamMembers.map(({ name, role, responsibility }) => (
              <div
                key={name}
                style={styles.teamCard}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <h4 style={styles.teamName}>{name}</h4>
                <div style={styles.teamRole}>{role}</div>
                <div
                  style={{
                    color: "#475569",
                    fontSize: "14px",
                    lineHeight: "1.4",
                  }}
                >
                  {responsibility}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Future Scope */}
        <section style={styles.contentCard}>
          <h3 style={styles.sectionTitle}>
            <i className="fas fa-rocket"></i> Future Scope
          </h3>
          <p style={{ ...styles.textGray, marginBottom: "16px" }}>
            We're continuously working to enhance GrainZillow with advanced
            features:
          </p>
          <ul style={styles.futureScopeList}>
            {futureScopeItems.map((item, index) => (
              <li key={index} style={styles.futureScopeItem}>
                <strong>{item.split(":")[0]}:</strong>
                {item.split(":")[1]}
              </li>
            ))}
          </ul>
        </section>

        {/* Institution & Guidance */}
        <section style={styles.institutionSection}>
          <h3
            style={{
              ...styles.sectionTitle,
              color: "#166534",
              fontSize: "20px",
            }}
          >
            <i className="fas fa-graduation-cap"></i> Institution & Guidance
          </h3>
          <div style={styles.institutionGrid}>
            {institutionInfo.map(({ title, content }) => (
              <div key={title} style={styles.institutionCard}>
                <h4 style={styles.institutionTitle}>{title}</h4>
                <p style={{ color: "#374151", margin: 0, fontSize: "14px" }}>
                  {content}
                </p>
              </div>
            ))}
          </div>
        </section>
      </ContentContainer>
    </Layout>
  );
}
