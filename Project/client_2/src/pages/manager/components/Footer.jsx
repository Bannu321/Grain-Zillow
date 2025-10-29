import React from 'react';

export default function Footer({ sidebarExpanded }) {
  return (
    <footer style={{
      background: '#134e4a',
      color: 'white',
      textAlign: 'center',
      padding: '24px 32px',
      fontSize: '16px',
      borderTop: '1px solid #0f766e',
      marginLeft: sidebarExpanded ? '260px' : '80px',
      transition: 'margin-left 0.3s'
    }}>
      &copy; 2025 GrainZillow — Smart Grain Storage Monitoring System
    </footer>
  );
}