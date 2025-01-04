import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseUrl = () => {
  // Get the local IP address from Expo constants
  const { manifest } = Constants;
  
  // For Expo Go
  if (manifest?.debuggerHost) {
    const debuggerHost = manifest.debuggerHost.split(':').shift();
    return `http://${debuggerHost}:8000`;
  }
  
  // Fallback URLs
  if (Platform.OS === 'android') {
    return 'http://192.168.29.231:8000'; // Android emulator localhost
  }
  return 'http://localhost:8000'; // iOS simulator or web
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000, // 30 second timeout
});

// Add request logging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response logging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
    });
    return Promise.reject(error);
  }
);

export default api;