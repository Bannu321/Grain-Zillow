import apiClient from './api';

const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/users/me');
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await apiClient.post('/auth/refresh');
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  }
};

export default authService;
