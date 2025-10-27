import apiClient from './api';

const userService = {
  // Get pending user approvals
  getPendingApprovals: async () => {
    try {
      const response = await apiClient.get('/users/pending-approvals');
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // Approve user
  approveUser: async (userId) => {
    try {
      const response = await apiClient.post(`/users/${userId}/approve`);
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // Reject user
  rejectUser: async (userId, reason) => {
    try {
      const response = await apiClient.post(`/users/${userId}/reject`, { reason });
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // Get all users
  getAllUsers: async (filters = {}) => {
    try {
      const response = await apiClient.get('/users', { params: filters });
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (formData) => {
    try {
      const response = await apiClient.post('/users/upload-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await apiClient.post('/users/change-password', {
        currentPassword,
        newPassword
      });
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/users/profile', profileData);
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  }
};

export default userService;
