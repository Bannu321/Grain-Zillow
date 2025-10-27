import apiClient from './api';

const sensorService = {
  // Get current sensor readings for manager
  getCurrentReadings: async (managerId) => {
    try {
      const response = await apiClient.get(`/managers/${managerId}/zillow-status`);
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // Get historical sensor data
  getHistoricalData: async (params) => {
    try {
      const response = await apiClient.get('/data', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // Control IoT device
  controlDevice: async (deviceId, command) => {
    try {
      const response = await apiClient.post('/iot/control', {
        deviceId,
        command
      });
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // Get device status
  getDeviceStatus: async (deviceId) => {
    try {
      const response = await apiClient.get(`/devices/${deviceId}/status`);
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  }
};

export default sensorService;