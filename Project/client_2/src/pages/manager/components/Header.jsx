import React from "react";
import axios from "axios";

const handleLogout = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post('http://localhost:5000/api/auth/logout', {}, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}); // Use GET or POST based on your backend implementation
    if (response.data.success) {
      // User logged out successfully, you can redirect or update UI
      // alert("Logout successful!");
      window.location.href = "/"; // Redirect to login page or home
    } else {
      alert("Logout failed!");
    }
  } catch (error) {
    alert("Error logging out!");
    console.error(error);
  }
};


const user = JSON.parse(localStorage.getItem('user'));

const role = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase() : null;

export default function Header({ sidebarExpanded, toggleSidebar }) {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "70px",
        background: "linear-gradient(to right, #0f766e, #115e59)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        zIndex: 50,
        borderBottom: "1px solid #0d9488",
      }}
    >
      <button
        onClick={toggleSidebar}
        style={{
          padding: "10px",
          borderRadius: "10px",
          border: "none",
          background: "transparent",
          color: "white",
          cursor: "pointer",
          transition: "all 0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.15)";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <svg
          width="32"
          height="32"
          fill="currentColor"
          viewBox="0 0 20 20"
          style={{ opacity: 0.9 }}
        >
          <path
            fillRule="evenodd"
            d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
            clipRule="evenodd"
          />
        </svg>
        <h1
          style={{
            fontSize: "26px",
            fontWeight: "bold",
            margin: 0,
            letterSpacing: "0.5px",
          }}
        >
          GrainZillow {role ? `- ${role}` : ""}
        </h1>
      </div>

      <button
        style={{
          background: "white",
          color: "#0f766e",
          padding: "10px 20px",
          borderRadius: "10px",
          border: "none",
          fontWeight: "600",
          fontSize: "15px",
          cursor: "pointer",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          transition: "all 0.3s",
        }}
        onClick={handleLogout}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#f0fdfa";
          e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0,0,0,0.1)";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "white";
          e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.1)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        Logout
      </button>
    </header>
  );
}
