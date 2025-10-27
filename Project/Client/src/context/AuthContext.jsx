import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        const result = await authService.getCurrentUser();
        if (result.success) {
          setUser(result.data);
          setIsAuthenticated(true);
        } else {
          // Token is invalid, clear it
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      const { token, user } = result.data;
      localStorage.setItem('authToken', token);
      setUser(user);
      setIsAuthenticated(true);
      return { success: true, user };
    }
    return result;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  // Update user data
  const updateUser = (userData) => {
    setUser({ ...user, ...userData });
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
