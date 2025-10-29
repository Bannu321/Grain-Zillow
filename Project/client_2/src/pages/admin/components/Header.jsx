import React from 'react';
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


export default function Header({ sidebarExpanded, toggleSidebar, variant = "default" }) {
  const isAdmin = variant === "admin";
  
  const headerStyle = {
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    height: '70px', 
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    boxShadow: '0 8px 12px -3px rgba(0,0,0,0.12)',
    zIndex: 50,
    background: isAdmin 
      ? 'linear-gradient(120deg, #0f766e, #115e59)'
      : 'linear-gradient(to right, #0f766e, #115e59)'
  };

  const buttonStyle = {
    background: 'white',
    color: isAdmin ? '#0f766e' : '#0f766e',
    fontWeight: 600,
    padding: '8px 18px',
    borderRadius: '7px',
    border: 'none',
    fontSize: '15px',
    cursor: 'pointer',
    boxShadow: '0 1px 4px 0 rgba(0,0,0,0.05)',
    transition: 'background 0.2s'
  };

  return (
    <header style={headerStyle}>
      <button
        onClick={toggleSidebar}
        style={{
          padding: '10px',
          borderRadius: '10px',
          border: 'none',
          background: 'transparent',
          color: 'white',
          cursor: 'pointer',
          transition: 'all 0.3s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      > 
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"> 
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /> 
        </svg> 
      </button> 
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}> 
        <svg width="32" height="32" fill="currentColor" viewBox="0 0 20 20" style={{ 
          opacity: 0.9,
          color: isAdmin ? '#FFD600' : '#ffffff'
        }}> 
          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" /> 
        </svg> 
        <h1 style={{ 
          fontSize: isAdmin ? '22px' : '26px', 
          fontWeight: 'bold', 
          margin: 0, 
          letterSpacing: '0.5px' 
        }}>
          {isAdmin ? 'GrainZillow - Admin Dashboard' : 'GrainZillow'}
        </h1> 
      </div> 
      
      <button 
        style={buttonStyle}
        onClick={handleLogout}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#e0fdfa';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
        }}
      >
        Logout 
      </button> 
    </header>
  );
}