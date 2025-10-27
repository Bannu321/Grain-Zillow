import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-grain-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-grain-green"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check if user has the required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user?.role === 'manager') {
      return <Navigate to="/manager/dashboard" replace />;
    } else if (user?.role === 'user') {
      return <Navigate to="/user/dashboard" replace />;
    }
    // If no role match, redirect to home
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has correct role
  return children;
};

// Specific route wrappers for each role
export const ManagerRoute = ({ children }) => {
  return <ProtectedRoute allowedRoles={['manager']}>{children}</ProtectedRoute>;
};

export const AdminRoute = ({ children }) => {
  return <ProtectedRoute allowedRoles={['admin']}>{children}</ProtectedRoute>;
};

export const UserRoute = ({ children }) => {
  return <ProtectedRoute allowedRoles={['user']}>{children}</ProtectedRoute>;
};

export default ProtectedRoute;
