import React from 'react';

export default function MessageComposer({ composeData, contacts, onChange, onSend }) {
  const { recipientType, selectedRecipient, subject, content } = composeData;

  const styles = {
    container: {
      maxWidth: "850px",
      background: "#fff",
      padding: "34px",
      borderRadius: "14px",
      boxShadow: '0 3px 14px 0 rgba(15,100,80,0.045)',
      margin: "0 auto 40px auto"
    },
    title: {
      color: '#0f766e',
      fontWeight: 700,
      fontSize: "18px",
      marginBottom: "18px",
      display: 'flex',
      alignItems: 'center',
      gap: "8px"
    },
    formRow: {
      display: "flex",
      gap: "18px",
      flexWrap: "wrap",
      marginBottom: "15px"
    },
    formGroup: {
      flex: 1,
      minWidth: "160px"
    },
    label: {
      color: "#374151",
      fontWeight: 600,
      marginBottom: "5px",
      display: 'block',
      fontSize: "15px"
    },
    input: {
      width: '100%',
      fontSize: "15px",
      padding: '10px 14px',
      border: '1px solid #e5e7eb',
      borderRadius: "7px",
      outline: 'none',
      marginBottom: "5px",
      transition: "border-color 0.2s"
    },
    select: {
      width: '100%',
      fontSize: "15px",
      padding: '10px 14px',
      border: '1px solid #e5e7eb',
      borderRadius: "7px",
      outline: 'none',
      marginBottom: "5px",
      transition: "border-color 0.2s"
    },
    textarea: {
      width: '100%',
      fontSize: "15px",
      padding: '10px 14px',
      border: '1px solid #e5e7eb',
      borderRadius: "7px",
      outline: 'none',
      minHeight: "100px",
      resize: "vertical",
      transition: "border-color 0.2s"
    },
    sendButton: {
      background: "#0f766e",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontWeight: 600,
      padding: "11px 24px",
      fontSize: "16px",
      marginTop: "4px",
      cursor: "pointer",
      display: 'flex',
      alignItems: 'center',
      gap: "7px",
      transition: "background 0.2s"
    }
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = '#0f766e';
    e.target.style.boxShadow = '0 0 0 2px rgba(15, 118, 110, 0.1)';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = '#e5e7eb';
    e.target.style.boxShadow = 'none';
  };

  return (
    <section style={styles.container}>
      <h3 style={styles.title}>
        <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Compose New Message
      </h3>

      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label htmlFor="recipientType" style={styles.label}>Recipient Type</label>
          <select
            id="recipientType"
            style={styles.select}
            value={recipientType}
            onChange={(e) => onChange('recipientType', e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            <option value="individual">Individual</option>
            <option value="managers">All Managers</option>
            <option value="employees">All Employees</option>
            <option value="all">All Users</option>
          </select>
        </div>

        {recipientType === "individual" && (
          <div style={styles.formGroup}>
            <label htmlFor="recipientSelect" style={styles.label}>Select Recipient</label>
            <select
              id="recipientSelect"
              style={styles.select}
              value={selectedRecipient}
              onChange={(e) => onChange('selectedRecipient', e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              {contacts.map(({ id, name, role }) => (
                <option key={id} value={id}>{name} ({role})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div style={{ marginBottom: "14px" }}>
        <label style={styles.label}>Subject</label>
        <input
          type="text"
          style={styles.input}
          value={subject}
          onChange={(e) => onChange('subject', e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={styles.label}>Message</label>
        <textarea
          rows={5}
          style={styles.textarea}
          value={content}
          onChange={(e) => onChange('content', e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      <button
        style={styles.sendButton}
        onClick={onSend}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#115e59';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#0f766e';
        }}
      >
        <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        Send Message
      </button>
    </section>
  );
}