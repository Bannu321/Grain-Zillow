import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout({ 
  children, 
  currentPage = "Dashboard",
  variant = "default" // "default" or "admin"
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => setSidebarExpanded(!sidebarExpanded);

  const getBackgroundStyle = () => {
    return variant === "admin" 
      ? { background: 'linear-gradient(135deg, #e0f7f5 0%, #f2fdfb 100%)' }
      : { background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)' };
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      ...getBackgroundStyle(),
      fontFamily: 'Poppins, sans-serif'
    }}>
      <Header 
        sidebarExpanded={sidebarExpanded} 
        toggleSidebar={toggleSidebar} 
        variant={variant}
      />
      
      <div style={{ display: 'flex', flex: 1, paddingTop: '70px' }}>
        <Sidebar 
          sidebarExpanded={sidebarExpanded} 
          currentPage={currentPage}
          variant={variant}
        />
        
        <main style={{
          flex: 1,
          marginLeft: sidebarExpanded ? '260px' : '80px',
          transition: 'margin-left 0.3s',
          minHeight: 'calc(100vh - 70px)'
        }}>
          {children}
        </main>
      </div>

      <Footer sidebarExpanded={sidebarExpanded} variant={variant} />
    </div>
  );
}