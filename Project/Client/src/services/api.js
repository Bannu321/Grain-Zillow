import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - attach JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors - unauthorized
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/';
      return Promise.reject({ success: false, message: 'Session expired. Please login again.' });
    }

    // Handle 403 errors - forbidden
    if (error.response && error.response.status === 403) {
      return Promise.reject({ success: false, message: 'Unauthorized access' });
    }

    // Handle 500 errors - server error
    if (error.response && error.response.status === 500) {
      return Promise.reject({ success: false, message: 'Server error occurred' });
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject({ success: false, message: 'Network connection failed' });
    }

    // Extract error message from response
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject({ success: false, message });
  }
);

export default apiClient;
