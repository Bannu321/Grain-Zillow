import apiClient from './api';

const notificationService = {
  // Get all notifications
  getNotifications: async (params = {}) => {
    try {
      const response = await apiClient.get('/notifications', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // Get unread notification count
  getUnreadCount: async () => {
    try {
      const response = await apiClient.get('/notifications/unread-count');
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await apiClient.put(`/notifications/${notificationId}/read`);
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await apiClient.put('/notifications/mark-all-read');
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await apiClient.delete(`/notifications/${notificationId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // Send message/notification
  sendMessage: async (messageData) => {
    try {
      const response = await apiClient.post('/notifications/send', messageData);
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  }
};

export default notificationService;
