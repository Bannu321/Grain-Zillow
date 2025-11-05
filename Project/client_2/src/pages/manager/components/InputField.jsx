import React from "react";

export default function InputField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  min,
  required = true,
}) {
  const styles = {
    container: {
      marginBottom: "0",
    },
    label: {
      fontWeight: "600",
      marginBottom: "6px",
      color: "#374151",
      display: "block",
    },
    input: {
      width: "100%",
      padding: "10px 14px",
      borderRadius: "7px",
      border: "1.5px solid #e5e7eb",
      fontSize: "15px",
      background: "#fafbfb",
      outline: "none",
      transition: "border-color 0.2s",
    },
  };

  return (
    <div style={styles.container}>
      <label htmlFor={id} style={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        style={styles.input}
        required={required}
        onFocus={(e) => {
          e.target.style.borderColor = "#0f766e";
          e.target.style.boxShadow = "0 0 0 2px rgba(15, 118, 110, 0.1)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#e5e7eb";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}
