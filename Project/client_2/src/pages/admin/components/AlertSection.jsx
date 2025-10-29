import React, { useState } from 'react';

export default function AlertSection({ siloId, siloName }) {
  const [alertMessage, setAlertMessage] = useState("");

  const sendAlert = () => {
    if (!siloId) {
      alert("Please select a silo to send an alert.");
      return;
    }

    const priority = document.getElementById("alertPriority")?.value || "low";
    const recipient = document.getElementById("alertRecipient")?.value || "manager";

    if (!alertMessage.trim()) {
      alert("Please enter an alert message.");
      return;
    }

    alert(
      `Alert sent successfully!\n\nSilo: ${siloId}\nPriority: ${priority}\nRecipient: ${recipient}\n\nMessage: ${alertMessage}`
    );

    setAlertMessage("");
  };

  const styles = {
    alertSection: {
      background: "#fffbeb",
      border: "1px solid #fcd34d",
      borderRadius: "8px",
      padding: "20px"
    },
    alertTitle: {
      color: "#92400e",
      fontWeight: "600",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
      marginBottom: "16px"
    },
    formGroup: {
      marginBottom: "16px"
    },
    label: {
      display: "block",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "4px"
    },
    select: {
      width: "100%",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      padding: "8px 12px",
      fontSize: "14px",
      outline: "none",
      transition: "border-color 0.2s"
    },
    textarea: {
      width: "100%",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      padding: "12px",
      fontSize: "14px",
      outline: "none",
      minHeight: "100px",
      resize: "vertical",
      transition: "border-color 0.2s"
    },
    sendButton: {
      background: "#dc2626",
      color: "white",
      border: "none",
      borderRadius: "6px",
      padding: "10px 20px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "background 0.2s"
    }
  };

  return (
    <div style={styles.alertSection}>
      <h4 style={styles.alertTitle}>
        <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Send Alert Message
      </h4>
      
      <div style={styles.formGrid}>
        <div style={styles.formGroup}>
          <label htmlFor="alertPriority" style={styles.label}>
            Alert Priority
          </label>
          <select
            id="alertPriority"
            style={styles.select}
            defaultValue="low"
            onFocus={(e) => {
              e.target.style.borderColor = '#0f766e';
              e.target.style.boxShadow = '0 0 0 2px rgba(15, 118, 110, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="alertRecipient" style={styles.label}>
            Send To
          </label>
          <select
            id="alertRecipient"
            style={styles.select}
            defaultValue="manager"
            onFocus={(e) => {
              e.target.style.borderColor = '#0f766e';
              e.target.style.boxShadow = '0 0 0 2px rgba(15, 118, 110, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="manager">Silo Manager Only</option>
            <option value="all_managers">All Managers</option>
            <option value="all_employees">All Employees</option>
          </select>
        </div>
      </div>
      
      <div style={styles.formGroup}>
        <label htmlFor="alertMessage" style={styles.label}>
          Alert Message
        </label>
        <textarea
          id="alertMessage"
          placeholder="Enter your alert message here..."
          style={styles.textarea}
          value={alertMessage}
          onChange={(e) => setAlertMessage(e.target.value)}
          onFocus={(e) => {
            e.target.style.borderColor = '#0f766e';
            e.target.style.boxShadow = '0 0 0 2px rgba(15, 118, 110, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>
      
      <button
        style={styles.sendButton}
        onClick={sendAlert}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#b91c1c';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#dc2626';
        }}
      >
        <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        Send Alert
      </button>
    </div>
  );
}