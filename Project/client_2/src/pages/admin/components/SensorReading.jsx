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

export default function SensorReading({ type, label, value, unit, status, icon, color }) {
  const statusStyle = getStatusClass(status);

  return (
    <div style={{
      background: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      padding: "16px",
      textAlign: "center"
    }}>
      <div style={{
        width: "56px",
        height: "56px",
        margin: "0 auto 12px auto",
        borderRadius: "50%",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "20px"
      }}>
        <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
      <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }}>
        {value}{unit}
      </div>
      <div style={{ color: "#6b7280", fontSize: "14px", marginBottom: "8px" }}>
        {label}
      </div>
      <div
        style={{
          display: "inline-block",
          padding: "4px 12px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "bold",
          background: statusStyle.background,
          color: statusStyle.color
        }}
      >
        {status.toUpperCase()}
      </div>
    </div>
  );
}