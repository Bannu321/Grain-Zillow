import React, { useState } from "react";
import Layout from "./components/Layout";
import ContentContainer from "./components/ContentContainer";
import InputField from "./components/InputField";
import SelectField from "./components/SelectField";
import Button from "./components/Button";
import SuccessMessage from "./components/SuccessMessage";

const initialContacts = {
  email: "grainszillow.support@gmail.com",
  landline: "+91 866 242 3456",
  mobile: "+91 82590 73296",
  whatsapp: "+91 75433 66557",
  institution: "VIT-AP University",
  address: "VIT-AP University, Amaravati, AP-522237",
};

export default function ContactManagement() {
  const [broadcastMessage, setBroadcastMessage] = useState(
    "Silo maintenance scheduled for this Saturday from 9 AM to 12 PM. All silos will be offline during this period. Please plan your activities accordingly."
  );
  const [recipient, setRecipient] = useState("all");
  const [expiry, setExpiry] = useState("3days");
  const [priority, setPriority] = useState("normal");
  const [showSuccess, setShowSuccess] = useState(false);
  const [contacts, setContacts] = useState(initialContacts);

  const priorityOptions = [
    { id: "normal", label: "Normal", icon: "fa-info-circle", bg: "#16a34a" },
    { id: "important", label: "Important", icon: "fa-exclamation-triangle", bg: "#facc15" },
    { id: "critical", label: "Critical", icon: "fa-exclamation-circle", bg: "#ef4444" },
  ];

  const recipientOptions = [
    { value: "all", label: "Send to All Users" },
    { value: "managers", label: "Managers Only" },
    { value: "employees", label: "Employees Only" },
  ];

  const expiryOptions = [
    { value: "1day", label: "Expire in 1 day" },
    { value: "3days", label: "Expire in 3 days" },
    { value: "1week", label: "Expire in 1 week" },
    { value: "2weeks", label: "Expire in 2 weeks" },
  ];

  const handleSendBroadcast = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleResetContacts = () => {
    setContacts(initialContacts);
  };

  const handleContactChange = (field, value) => {
    setContacts((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveContacts = () => {
    alert("Contact information updated successfully!");
    // Implement backend save logic here
  };

  // --- Style objects ---
  const styles = {
    broadcastSection: {
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      padding: "24px",
      marginBottom: "24px",
    },
    sectionTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#134e4a",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    contactSection: {
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      padding: "24px",
      marginBottom: "24px",
      maxWidth: "500px",
    },
    textarea: {
      width: "100%",
      padding: "12px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      minHeight: "120px",
      fontSize: "16px",
      resize: "vertical",
      outline: "none",
      marginBottom: "16px",
      fontFamily: "inherit",
    },
    selectRow: {
      display: "flex",
      gap: "16px",
      flexWrap: "wrap",
      marginBottom: "16px",
    },
    priorities: {
      display: "flex",
      gap: "16px",
      marginBottom: "16px",
      flexWrap: "wrap",
    },
    priority: (active, bg) => ({
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      borderRadius: "8px",
      fontWeight: "600",
      color: "#fff",
      background: active ? bg : "#9ca3af",
      opacity: active ? 1 : 0.6,
      border: "none",
      fontSize: "14px",
      transition: "background 0.2s, opacity 0.2s",
    }),
    buttonGroup: {
      display: "flex",
      gap: "12px",
      marginTop: "8px",
    },
    contactForm: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    contactButtons: {
      display: "flex",
      gap: "12px",
      marginTop: "16px",
    },
  };

  return (
    <Layout currentPage="Contact Management">
      <ContentContainer>
        {/* Broadcast Announcement Section */}
        <section style={styles.broadcastSection}>
          <h2 style={styles.sectionTitle}>
            <i className="fas fa-bullhorn"></i> Broadcast Announcement
          </h2>
          
          <SuccessMessage 
            message="Announcement sent successfully!"
            show={showSuccess}
          />

          <textarea
            style={styles.textarea}
            rows={6}
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            placeholder="Enter your broadcast message here..."
          />

          <div style={styles.selectRow}>
            <SelectField
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              options={recipientOptions}
              selectStyle={{ flex: 1 }}
            />
            <SelectField
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              options={expiryOptions}
              selectStyle={{ flex: 1 }}
            />
          </div>

          <div style={styles.priorities}>
            {priorityOptions.map(({ id, label, icon, bg }) => (
              <button
                key={id}
                onClick={() => setPriority(id)}
                style={styles.priority(priority === id, bg)}
                title={label}
              >
                <i className={`fas ${icon}`}></i>
                {priority === id && label}
              </button>
            ))}
          </div>

          <div style={styles.buttonGroup}>
            <Button
              variant="primary"
              icon="fa-paper-plane"
              onClick={handleSendBroadcast}
            >
              Send Now
            </Button>
            <Button
              variant="secondary"
              icon="fa-clock"
            >
              Schedule
            </Button>
          </div>
        </section>

        {/* Contact Information Management Section */}
        <section style={styles.contactSection}>
          <h2 style={styles.sectionTitle}>
            <i className="fas fa-edit"></i> Manage Contact Information
          </h2>
          
          <div style={styles.contactForm}>
            <InputField
              label="Email Address"
              icon="fa-envelope"
              value={contacts.email}
              onChange={(e) => handleContactChange("email", e.target.value)}
              placeholder="Enter email address"
            />
            <InputField
              label="Landline"
              icon="fa-phone"
              value={contacts.landline}
              onChange={(e) => handleContactChange("landline", e.target.value)}
              placeholder="Enter landline number"
            />
            <InputField
              label="Mobile"
              icon="fa-mobile-alt"
              value={contacts.mobile}
              onChange={(e) => handleContactChange("mobile", e.target.value)}
              placeholder="Enter mobile number"
            />
            <InputField
              label="WhatsApp"
              icon="fa-whatsapp"
              value={contacts.whatsapp}
              onChange={(e) => handleContactChange("whatsapp", e.target.value)}
              placeholder="Enter WhatsApp number"
            />
            <InputField
              label="Institution"
              icon="fa-university"
              value={contacts.institution}
              onChange={(e) => handleContactChange("institution", e.target.value)}
              placeholder="Enter institution name"
            />
            <InputField
              label="Address"
              icon="fa-map-marker-alt"
              value={contacts.address}
              onChange={(e) => handleContactChange("address", e.target.value)}
              placeholder="Enter full address"
            />

            <div style={styles.contactButtons}>
              <Button
                variant="primary"
                icon="fa-save"
                onClick={handleSaveContacts}
              >
                Save Changes
              </Button>
              <Button
                variant="danger"
                icon="fa-undo"
                onClick={handleResetContacts}
              >
                Reset
              </Button>
            </div>
          </div>
        </section>
      </ContentContainer>
    </Layout>
  );
}