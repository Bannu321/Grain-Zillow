import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ unreadCount = 0 }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  // Save collapsed state to localStorage
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState.toString());
  };

  // Navigation items
  const navItems = [
    { path: '/manager/dashboard', icon: '🌾', label: 'Dashboard' },
    { path: '/manager/users', icon: '👥', label: 'User Management' },
    { path: '/manager/storage', icon: '📦', label: 'Storage Requests' },
    { path: '/manager/notifications', icon: '🔔', label: 'Notifications', badge: unreadCount },
    { path: '/manager/settings', icon: '⚙️', label: 'Settings' }
  ];

  const isActive = (path) => location.pathname === path;

  // Get user initials
  const getInitials = () => {
    if (!user) return '?';
    const firstInitial = user.firstName?.charAt(0) || '';
    const lastInitial = user.lastName?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <div
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-grain-dark-green text-white transition-all duration-300 flex flex-col h-screen fixed left-0 top-0 z-40`}
    >
      {/* Hamburger toggle button */}
      <div className="p-4 flex items-center justify-between border-b border-green-800">
        <button
          onClick={toggleSidebar}
          className="text-white hover:bg-green-700 p-2 rounded transition-colors"
          aria-label="Toggle Sidebar"
        >
          <span className="text-2xl">☰</span>
        </button>
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-white">GrainZillow</h1>
        )}
      </div>

      {/* Navigation items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center ${
              isCollapsed ? 'justify-center' : 'justify-start'
            } px-4 py-3 mb-2 mx-2 rounded transition-colors relative ${
              isActive(item.path)
                ? 'bg-grain-green text-white'
                : 'text-gray-200 hover:bg-green-700'
            }`}
            title={isCollapsed ? item.label : ''}
          >
            {/* Icon */}
            <span className="text-2xl">{item.icon}</span>

            {/* Label (hidden when collapsed) */}
            {!isCollapsed && (
              <span className="ml-3 font-medium">{item.label}</span>
            )}

            {/* Badge for notifications */}
            {item.badge > 0 && !isCollapsed && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {item.badge}
              </span>
            )}
            {item.badge > 0 && isCollapsed && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {item.badge}
              </span>
            )}

            {/* Active indicator */}
            {isActive(item.path) && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"></div>
            )}
          </Link>
        ))}
      </nav>

      {/* Profile section at bottom */}
      <div className={`border-t border-green-800 p-4 ${isCollapsed ? 'text-center' : ''}`}>
        {isCollapsed ? (
          <div className="w-10 h-10 rounded-full bg-grain-green flex items-center justify-center mx-auto text-sm font-bold">
            {getInitials()}
          </div>
        ) : (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-grain-green flex items-center justify-center text-sm font-bold mr-3">
              {getInitials()}
            </div>
            <div>
              <p className="font-medium text-sm">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-300 capitalize">{user?.role}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
