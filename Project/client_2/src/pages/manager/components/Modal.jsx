import React from "react";

export default function Modal({
  isOpen,
  onClose,
  title,
  titleIcon,
  children,
  modalStyle = {},
}) {
  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      padding: "20px",
    },
    content: {
      backgroundColor: "white",
      borderRadius: "20px",
      padding: "32px",
      width: "100%",
      maxWidth: "600px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
      position: "relative",
      maxHeight: "90vh",
      overflowY: "auto",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
      color: "#0d9488",
      fontWeight: "700",
      fontSize: "20px",
    },
    title: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      margin: 0,
    },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: "28px",
      fontWeight: "700",
      color: "#64748b",
      cursor: "pointer",
      lineHeight: 1,
      padding: 0,
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "4px",
      transition: "background-color 0.2s",
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        style={{ ...styles.content, ...modalStyle }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.header}>
          <h3 style={styles.title}>
            {titleIcon && <i className={`fas ${titleIcon}`}></i>}
            {title}
          </h3>
          <button
            onClick={onClose}
            style={styles.closeButton}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f3f4f6")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
