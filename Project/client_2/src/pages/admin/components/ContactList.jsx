import React from 'react';

export default function ContactList({ contacts, activeContactId, onContactSelect }) {
  const styles = {
    container: {
      background: "#f6f7fb",
      borderRadius: "11px",
      padding: "16px",
      minWidth: "230px",
      maxWidth: "255px",
      width: "255px",
      boxShadow: '0 3px 14px 0 rgba(15,100,80,0.07)',
      height: "450px",
      overflowY: 'auto'
    },
    title: {
      color: '#0f766e',
      fontWeight: 700,
      fontSize: "16px",
      marginBottom: "16px"
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px 10px',
      marginBottom: '7px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background 0.17s, border-color 0.17s'
    },
    avatar: {
      background: '#115e59',
      color: '#fff',
      fontWeight: 800,
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: "16px",
      flexShrink: 0
    },
    contactInfo: {
      marginLeft: "11px",
      flexGrow: 1,
      minWidth: 0
    },
    contactName: {
      fontWeight: 600,
      fontSize: "15px",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden"
    },
    contactRole: {
      fontSize: "13px",
      color: "#5c636e"
    },
    statusBadge: {
      marginLeft: 'auto',
      fontSize: "12px",
      borderRadius: "18px",
      padding: '2px 11px',
      fontWeight: 700,
      whiteSpace: 'nowrap',
      flexShrink: 0
    }
  };

  const getStatusStyle = (online) => ({
    background: online ? "#059669" : "#7b7b7b",
    color: '#fff'
  });

  const getContactStyle = (id, activeId) => ({
    background: id === activeId ? "#e0f7f5" : "transparent",
    borderLeft: id === activeId ? '4px solid #0f766e' : '4px solid transparent'
  });

  return (
    <aside style={styles.container}>
      <h3 style={styles.title}>Contacts</h3>
      {contacts.map(({ id, name, role, online }) => (
        <div
          key={id}
          style={{ ...styles.contactItem, ...getContactStyle(id, activeContactId) }}
          onClick={() => onContactSelect(id)}
          onMouseEnter={(e) => {
            if (id !== activeContactId) {
              e.currentTarget.style.background = "#f0fdfa";
            }
          }}
          onMouseLeave={(e) => {
            if (id !== activeContactId) {
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          <div style={styles.avatar}>
            {name.split(" ").map(n => n[0]).join("")}
          </div>
          <div style={styles.contactInfo}>
            <div style={styles.contactName}>{name}</div>
            <div style={styles.contactRole}>{role}</div>
          </div>
          <div style={{ ...styles.statusBadge, ...getStatusStyle(online) }}>
            {online ? "Online" : "Offline"}
          </div>
        </div>
      ))}
    </aside>
  );
}