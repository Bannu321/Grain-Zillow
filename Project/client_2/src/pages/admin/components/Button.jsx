import React from "react";

export default function Button({ 
  children, 
  onClick, 
  variant = "primary", 
  icon, 
  type = "button",
  buttonStyle = {}
}) {
  const variants = {
    primary: { background: "#059669", hover: "#047857" },
    secondary: { background: "#ea580c", hover: "#c2410c" },
    danger: { background: "#ef4444", hover: "#dc2626" },
    outline: { background: "#fff", hover: "#f3f4f6", textColor: "#14532d" },
  };

  const selectedVariant = variants[variant] || variants.primary;

  const defaultButtonStyle = {
    background: selectedVariant.background,
    color: selectedVariant.textColor || "#fff",
    padding: "10px 24px",
    borderRadius: 8,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "none",
    marginRight: 8,
    fontSize: 16,
    cursor: "pointer",
    transition: "background 0.2s",
  };

  return (
    <button
      style={{ ...defaultButtonStyle, ...buttonStyle }}
      onClick={onClick}
      type={type}
    >
      {icon && <i className={`fas ${icon}`}></i>}
      {children}
    </button>
  );
}