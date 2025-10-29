import React from 'react';

export default function Alert({ type, message }) {
  const getAlertStyles = (alertType) => {
    const baseStyle = {
      display: "flex",
      alignItems: "center",
      borderRadius: "6px",
      padding: "10px 15px",
      fontWeight: "600",
      fontSize: "16px",
      marginBottom: "14px",
      gap: "7px"
    };

    switch (alertType) {
      case "error":
        return {
          ...baseStyle,
          color: "#cf2a2a",
          background: "#fff1f0"
        };
      case "success":
        return {
          ...baseStyle,
          color: "#09814a",
          background: "#eafff4"
        };
      case "warning":
        return {
          ...baseStyle,
          color: "#92400e",
          background: "#fffbeb"
        };
      default:
        return baseStyle;
    }
  };

  const getIcon = (alertType) => {
    switch (alertType) {
      case "error":
        return "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
      case "success":
        return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
      case "warning":
        return "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z";
      default:
        return "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
    }
  };

  return (
    <div style={getAlertStyles(type)}>
      <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon(type)} />
      </svg>
      {message}
    </div>
  );
}