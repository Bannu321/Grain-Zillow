import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";
import ContentContainer from "./components/ContentContainer";
import InputField from "./components/InputField";
import Button from "./components/Button";
import Modal from "./components/Modal";

const initialProfile = {
  name: "John Anderson",
  role: "Storage Manager",
  id: "GRZ-2024-7284",
  memberSince: "January 15, 2024",
  profileImg:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  siloInfo: {
    siloId: "SL-2024-N-001",
    location: "Northern Storage Facility",
    capacity: "10,000 kg",
    utilization: "4,050 kg (40.5%)",
  },
};

export default function MyProfile() {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState({ email: "", phone: "" });
  const [formInputs, setFormInputs] = useState({ email: "", phone: "" });

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail") || "";
    const savedPhone = localStorage.getItem("userPhone") || "";
    setContactInfo({ email: savedEmail, phone: savedPhone });
    setFormInputs({ email: savedEmail, phone: savedPhone });

    if (!savedEmail && !savedPhone) {
      setTimeout(() => {
        setContactModalOpen(true);
      }, 1000);
    }
  }, []);

  const handleSaveContactInfo = (e) => {
    e.preventDefault();
    if (!formInputs.email || !formInputs.phone) {
      alert("Both email and phone are required.");
      return;
    }
    setContactInfo(formInputs);
    localStorage.setItem("userEmail", formInputs.email);
    localStorage.setItem("userPhone", formInputs.phone);
    alert("Contact information updated successfully!");
    setContactModalOpen(false);
  };

  // --- Style objects ---
  const styles = {
    contentCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
      padding: "32px",
      marginBottom: "24px",
      textAlign: "center",
      width: "100%",
    },
    headline: {
      color: "#0d9488",
      fontWeight: "700",
      fontSize: "28px",
      marginBottom: "12px",
    },
    grid3: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "24px",
      width: "100%",
      marginBottom: "32px",
    },
    grid3Md: {
      gridTemplateColumns: "1fr 2fr",
    },
    profileCard: {
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
      padding: "32px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
    },
    profileImage: {
      width: "144px",
      height: "144px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "4px solid #dcfce7",
    },
    roleBadge: {
      backgroundColor: "#dcfce7",
      color: "#166534",
      padding: "4px 12px",
      borderRadius: "9999px",
      fontSize: "14px",
      fontWeight: "600",
      display: "inline-block",
    },
    textGraySmall: {
      color: "#64748b",
      fontSize: "14px",
      marginBottom: "24px",
    },
    infoBox: {
      backgroundColor: "#f3f4f6",
      padding: "24px",
      borderRadius: "8px",
      width: "100%",
      textAlign: "left",
    },
    infoTitle: {
      color: "#0d9488",
      fontWeight: "600",
      fontSize: "18px",
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    contactCard: {
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
      padding: "32px",
      display: "flex",
      flexDirection: "column",
      gap: "24px",
    },
    contactSubGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "24px",
      width: "100%",
    },
    contactSubGridMd: {
      gridTemplateColumns: "1fr 1fr",
    },
    contactInfoRow: {
      backgroundColor: "#f3f4f6",
      padding: "20px",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },
    contactIcon: {
      color: "#0d9488",
      fontSize: "20px",
      width: "24px",
      textAlign: "center",
    },
    contactInfoLabel: {
      fontSize: "14px",
      color: "#475569",
      marginBottom: "4px",
    },
    contactInfoValue: {
      fontWeight: "600",
      fontSize: "16px",
      color: "#1e293b",
    },
    contactInfoValuePlaceholder: {
      fontWeight: "600",
      fontSize: "16px",
      fontStyle: "italic",
      color: "#94a3b8",
    },
    storageInfoGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "24px",
      width: "100%",
      marginTop: "24px",
      marginBottom: "24px",
    },
    storageInfoGridMd: {
      gridTemplateColumns: "repeat(4, 1fr)",
    },
    storageInfoCard: {
      backgroundColor: "#f3f4f6",
      borderRadius: "8px",
      padding: "24px",
      borderLeft: "6px solid #0d9488",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    storageInfoTitle: {
      fontSize: "14px",
      color: "#64748b",
      marginBottom: "4px",
      textTransform: "capitalize",
    },
    storageInfoValue: {
      fontWeight: "600",
      fontSize: "18px",
      color: "#0d9488",
    },
    modalContent: {
      maxWidth: "480px",
      width: "100%",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "32px",
      color: "#0d9488",
      fontWeight: "700",
      fontSize: "20px",
    },
    formGroup: {
      marginBottom: "20px",
    },
    formLabel: {
      display: "block",
      fontWeight: "600",
      marginBottom: "8px",
      color: "#475569",
    },
    formButtonRow: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "16px",
      marginTop: "24px",
    },
  };

  return (
    <Layout currentPage="My Profile" variant="admin">
      <ContentContainer>
        {/* Welcome Section */}
        <section style={styles.contentCard}>
          <h1 style={styles.headline}>
            <i className="fas fa-user"></i> My Profile
          </h1>
          <p style={{ color: "#64748b", fontSize: "16px" }}>
            Manage your account information and view your assigned storage
            details
          </p>
        </section>

        {/* Profile & Contact Section */}
        <div
          style={{
            ...styles.grid3,
            ...styles.grid3Md,
          }}
        >
          {/* Profile Card */}
          <div style={styles.profileCard}>
            <img
              src={initialProfile.profileImg}
              alt="Profile"
              style={styles.profileImage}
            />
            <h2
              style={{
                color: "#0d9488",
                fontWeight: "700",
                fontSize: "24px",
                marginBottom: "4px",
              }}
            >
              {initialProfile.name}
            </h2>
            <div style={styles.roleBadge}>{initialProfile.role}</div>
            <div style={styles.textGraySmall}>ID: {initialProfile.id}</div>
            <div style={styles.infoBox}>
              <h4 style={styles.infoTitle}>
                <i className="fas fa-calendar-alt"></i>
                Member Since
              </h4>
              <p style={{ color: "#374151", margin: 0 }}>
                {initialProfile.memberSince}
              </p>
            </div>
          </div>

          {/* Contact Card */}
          <div style={styles.contactCard}>
            <h3
              style={{
                ...styles.infoTitle,
                fontSize: "22px",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <i
                className="fas fa-address-card"
                style={{ marginRight: "12px" }}
              ></i>
              Contact Information
            </h3>

            <div
              style={{
                ...styles.contactSubGrid,
                ...styles.contactSubGridMd,
              }}
            >
              <div style={styles.contactInfoRow}>
                <i className="fas fa-envelope" style={styles.contactIcon}></i>
                <div>
                  <h4 style={styles.contactInfoLabel}>Email Address</h4>
                  <p
                    style={
                      contactInfo.email
                        ? styles.contactInfoValue
                        : styles.contactInfoValuePlaceholder
                    }
                  >
                    {contactInfo.email || "Not set yet"}
                  </p>
                </div>
              </div>

              <div style={styles.contactInfoRow}>
                <i className="fas fa-phone" style={styles.contactIcon}></i>
                <div>
                  <h4 style={styles.contactInfoLabel}>Phone Number</h4>
                  <p
                    style={
                      contactInfo.phone
                        ? styles.contactInfoValue
                        : styles.contactInfoValuePlaceholder
                    }
                  >
                    {contactInfo.phone || "Not set yet"}
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              icon="fa-edit"
              onClick={() => setContactModalOpen(true)}
              buttonStyle={{ alignSelf: "flex-start" }}
            >
              Update Contact Information
            </Button>
          </div>
        </div>

        {/* Assigned Storage Info */}
        <section
          style={{
            ...styles.storageInfoGrid,
            ...styles.storageInfoGridMd,
          }}
        >
          {Object.entries(initialProfile.siloInfo).map(([key, value]) => (
            <div key={key} style={styles.storageInfoCard}>
              <h4 style={styles.storageInfoTitle}>
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </h4>
              <p style={styles.storageInfoValue}>{value}</p>
            </div>
          ))}
        </section>

        {/* Contact Information Modal */}
        <Modal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          title="Update Contact Information"
          titleIcon="fa-edit"
        >
          <div style={styles.modalContent}>
            <form onSubmit={handleSaveContactInfo}>
              <div style={styles.formGroup}>
                <InputField
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formInputs.email}
                  onChange={(e) =>
                    setFormInputs({ ...formInputs, email: e.target.value })
                  }
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <InputField
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formInputs.phone}
                  onChange={(e) =>
                    setFormInputs({ ...formInputs, phone: e.target.value })
                  }
                  required
                />
              </div>

              <div style={styles.formButtonRow}>
                <Button
                  variant="secondary"
                  onClick={() => setContactModalOpen(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </ContentContainer>
    </Layout>
  );
}
