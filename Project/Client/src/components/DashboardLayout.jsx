import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { Toaster } from 'react-hot-toast';
import notificationService from '../services/notificationService';

const DashboardLayout = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      const result = await notificationService.getUnreadCount();
      if (result.success) {
        setUnreadCount(result.data.count || 0);
      }
    };

    fetchUnreadCount();

    // Poll for unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  // Load sidebar collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState) {
      setSidebarCollapsed(savedState === 'true');
    }
  }, []);

  return (
    <div className="min-h-screen bg-grain-cream">
      {/* Sidebar */}
      <Sidebar unreadCount={unreadCount} />

      {/* Main content area */}
      <div
        className={`${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        } transition-all duration-300 min-h-screen`}
      >
        {/* Header */}
        <Header unreadCount={unreadCount} />

        {/* Page content */}
        <main className="pt-16 p-6">
          <Outlet />
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#374151',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default DashboardLayout;
