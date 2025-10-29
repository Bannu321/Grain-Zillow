import React from 'react';

export default function Footer({ sidebarExpanded, variant = "default" }) {
  const isAdmin = variant === "admin";
  
  const footerStyle = {
    background: isAdmin ? '#004D40' : '#134e4a',
    color: 'white',
    textAlign: 'center',
    padding: isAdmin ? '11px 0' : '24px 32px',
    fontSize: isAdmin ? '15px' : '16px',
    borderTop: isAdmin ? 'none' : '1px solid #0f766e',
    marginLeft: sidebarExpanded ? '260px' : '80px',
    transition: 'margin-left 0.3s',
    borderRadius: isAdmin ? '12px 12px 0 0' : '0'
  };

  return (
    <footer style={footerStyle}>
      {isAdmin 
        ? '© 2025 GrainZillow | Smart Grain Storage Monitoring System'
        : '© 2025 GrainZillow — Smart Grain Storage Monitoring System'
      }
    </footer>
  );
}