import React from "react";

export default function SuccessMessage({ message, show, style = {} }) {
  const defaultStyle = {
    background: "#d1fae5",
    color: "#059669",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 6,
    fontWeight: 500,
    marginBottom: 10,
  };

  if (!show) return null;

  return (
    <div style={{ ...defaultStyle, ...style }}>
      <i className="fas fa-check-circle"></i> {message}
    </div>
  );
}