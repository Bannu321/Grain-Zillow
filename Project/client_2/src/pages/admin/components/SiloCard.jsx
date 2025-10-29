import React from 'react';

const getStatusClass = (status) => {
  switch (status) {
    case "safe":
      return { background: "#dcfce7", color: "#166534" };
    case "warning":
      return { background: "#fef3c7", color: "#92400e" };
    case "danger":
      return { background: "#fee2e2", color: "#991b1b" };
    default:
      return { background: "#f3f4f6", color: "#374151" };
  }
};

export default function SiloCard({ id, silo, isSelected, onSelect }) {
  const statusStyle = getStatusClass(silo.overallStatus);

  const cardStyle = {
    cursor: "pointer",
    padding: "16px",
    borderRadius: "8px",
    border: `2px solid ${isSelected ? "#0f766e" : "#e5e7eb"}`,
    background: "white",
    boxShadow: isSelected ? "0 4px 12px rgba(15, 118, 110, 0.2)" : "0 2px 4px rgba(0,0,0,0.05)",
    transition: "all 0.2s",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  };

  return (
    <div
      style={cardStyle}
      onClick={onSelect}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onSelect(); }}
      role="button"
      aria-pressed={isSelected}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
    >
      <div>
        <div style={{ fontWeight: "bold", color: "#0f766e", fontSize: "16px" }}>{id}</div>
        <div style={{ color: "#374151", fontSize: "14px", marginTop: "4px" }}>{silo.name}</div>
        <div style={{ color: "#6b7280", fontSize: "12px", marginTop: "4px" }}>
          Manager: {silo.manager}
        </div>
      </div>
      <div
        style={{
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "11px",
          fontWeight: "bold",
          background: statusStyle.background,
          color: statusStyle.color
        }}
      >
        {silo?.overallStatus?.toUpperCase()}
      </div>
    </div>
  );
}