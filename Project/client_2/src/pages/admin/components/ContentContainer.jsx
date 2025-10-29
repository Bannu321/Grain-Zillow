import React from "react";

export default function ContentContainer({ children }) {
  const styles = {
    container: {
      padding: "24px",
      maxWidth: "1200px",
      margin: "0 auto",
      width: "100%",
    },
  };

  return (
    <div style={styles.container}>
      {children}
    </div>
  );
}