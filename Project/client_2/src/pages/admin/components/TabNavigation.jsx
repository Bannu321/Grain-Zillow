import React from 'react';

export default function TabNavigation({ items, activeTab, onTabChange }) {
  const styles = {
    container: {
      display: "flex",
      gap: "18px",
      borderBottom: "2.2px solid #e5e7eb",
      marginBottom: "22px"
    },
    tab: (isActive) => ({
      padding: "13px 30px",
      fontWeight: "700",
      fontSize: "15px",
      border: "none",
      borderBottom: isActive ? "3px solid #0f766e" : "3px solid transparent",
      color: isActive ? "#0f766e" : "#365265",
      background: "none",
      outline: "none",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      transition: "all 0.2s",
      cursor: "pointer"
    })
  };

  return (
    <div style={styles.container}>
      {items.map(({ id, label, icon }) => (
        <button
          key={id}
          style={styles.tab(activeTab === id)}
          onClick={() => onTabChange(id)}
          onMouseEnter={(e) => {
            if (activeTab !== id) {
              e.currentTarget.style.color = '#0f766e';
              e.currentTarget.style.background = '#f0fdfa';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== id) {
              e.currentTarget.style.color = '#365265';
              e.currentTarget.style.background = 'none';
            }
          }}
        >
          <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
          {label}
        </button>
      ))}
    </div>
  );
}