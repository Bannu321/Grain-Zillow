import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './SideBar';
import Footer from './Footer';

export default function Layout({ children, currentPage = "Dashboard" }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => setSidebarExpanded(!sidebarExpanded);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)' }}>
      <Header sidebarExpanded={sidebarExpanded} toggleSidebar={toggleSidebar} />
      
      <div style={{ display: 'flex', flex: 1, paddingTop: '70px' }}>
        <Sidebar sidebarExpanded={sidebarExpanded} currentPage={currentPage} />
        
        <main style={{
          flex: 1,
          marginLeft: sidebarExpanded ? '260px' : '80px',
          transition: 'margin-left 0.3s',
          minHeight: 'calc(100vh - 70px)'
        }}>
          {children}
        </main>
      </div>

      <Footer sidebarExpanded={sidebarExpanded} />
    </div>
  );
}