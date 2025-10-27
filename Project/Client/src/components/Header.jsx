import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ unreadCount = 0 }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/users')) return 'User Management';
    if (path.includes('/storage')) return 'Storage Management';
    if (path.includes('/notifications')) return 'Notifications';
    if (path.includes('/settings')) return 'Settings';
    return 'Manager Portal';
  };

  // Get user initials
  const getInitials = () => {
    if (!user) return '?';
    const firstInitial = user.firstName?.charAt(0) || '';
    const lastInitial = user.lastName?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 fixed top-0 right-0 left-0 z-30">
      {/* Page Title */}
      <h2 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h2>

      {/* Right side - Notification bell and profile */}
      <div className="flex items-center space-x-4">
        {/* Notification bell */}
        <button
          onClick={() => navigate('/manager/notifications')}
          className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Notifications"
        >
          <span className="text-2xl">🔔</span>
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
            aria-label="Profile Menu"
          >
            <div className="w-8 h-8 rounded-full bg-grain-green text-white flex items-center justify-center text-sm font-bold">
              {getInitials()}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden md:block">
              {user?.firstName} {user?.lastName}
            </span>
            <svg
              className={`w-4 h-4 text-gray-600 transition-transform ${
                showProfileMenu ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown menu */}
          {showProfileMenu && (
            <>
              {/* Backdrop to close dropdown */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowProfileMenu(false)}
              ></div>

              {/* Menu */}
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                {/* User info */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <p className="text-xs text-grain-green capitalize mt-1">
                    {user?.role}
                  </p>
                </div>

                {/* Menu items */}
                <button
                  onClick={() => {
                    navigate('/manager/settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                >
                  <span className="mr-2">⚙️</span>
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center border-t border-gray-200"
                >
                  <span className="mr-2">🚪</span>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
