import apiClient from './api';

const storageService = {
  // Get storage requests for manager
  getStorageRequests: async (managerId) => {
    try {
      const response = await apiClient.get('/managers/my-storage-requests');
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // Approve storage request
  approveStorage: async (storageId) => {
    try {
      const response = await apiClient.post(`/storage/${storageId}/approve`);
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // Reject storage request
  rejectStorage: async (storageId, reason) => {
    try {
      const response = await apiClient.post(`/storage/${storageId}/reject`, { reason });
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // Get manager's godown info
  getManagerGodown: async () => {
    try {
      const response = await apiClient.get('/managers/my-godown');
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // Update manager's godown
  updateGodown: async (godownData) => {
    try {
      const response = await apiClient.put('/managers/my-godown', godownData);
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // Get all storage with filters
  getAllStorage: async (params = {}) => {
    try {
      const response = await apiClient.get('/storage', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  }
};

export default storageService;
