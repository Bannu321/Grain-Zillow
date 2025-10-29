import React from 'react';

export default function ProfileModal({ isOpen, onClose, profile, onChange, onSubmit }) {
  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.2)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modal: {
      background: '#fff',
      borderRadius: '18px',
      boxShadow: '0 10px 36px 0 rgba(15,118,110,0.11)',
      padding: '42px 38px 34px 38px',
      width: '100%',
      maxWidth: '380px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '13px'
    },
    title: {
      color: '#0f766e',
      margin: 0,
      fontWeight: '600',
      fontSize: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '33px',
      color: '#444',
      cursor: 'pointer',
      lineHeight: '24px'
    },
    formGroup: {
      marginBottom: '18px'
    },
    label: {
      display: 'block',
      fontWeight: '500',
      color: '#0f766e',
      marginBottom: '5px'
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '6px',
      border: '1px solid #e5e7eb',
      fontSize: '15px',
      outline: 'none',
      color: '#333',
      transition: 'border-color 0.2s'
    },
    select: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '6px',
      border: '1px solid #e5e7eb',
      fontSize: '15px',
      color: '#333',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '28px'
    },
    saveButton: {
      flex: 1,
      background: '#0f766e',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      padding: '11px',
      fontSize: '15px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '7px',
      transition: 'background 0.2s'
    },
    cancelButton: {
      flex: 1,
      background: '#e2e8f0',
      color: '#374151',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      padding: '11px',
      fontSize: '15px',
      cursor: 'pointer',
      transition: 'background 0.2s'
    }
  };

  const fieldLabels = {
    fullName: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    department: "Department"
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form onSubmit={onSubmit} style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>
            <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Update Profile Info
          </h3>
          <button
            type="button"
            style={styles.closeButton}
            aria-label="Close"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {["fullName", "email", "phone"].map((field) => (
          <div key={field} style={styles.formGroup}>
            <label htmlFor={field} style={styles.label}>
              {fieldLabels[field]}
            </label>
            <input
              type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
              id={field}
              required
              value={profile[field]}
              onChange={onChange}
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = '#0f766e';
                e.target.style.boxShadow = '0 0 0 2px rgba(15, 118, 110, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        ))}

        <div style={styles.formGroup}>
          <label htmlFor="department" style={styles.label}>
            Department
          </label>
          <select
            id="department"
            value={profile.department}
            onChange={onChange}
            style={styles.select}
            onFocus={(e) => {
              e.target.style.borderColor = '#0f766e';
              e.target.style.boxShadow = '0 0 0 2px rgba(15, 118, 110, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option>System Administration</option>
            <option>Operations</option>
            <option>Technical Support</option>
            <option>Management</option>
          </select>
        </div>

        <div style={styles.buttonGroup}>
          <button
            type="submit"
            style={styles.saveButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#115e59';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#0f766e';
            }}
          >
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Changes
          </button>
          <button
            type="button"
            onClick={onClose}
            style={styles.cancelButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#e2e8f0';
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}