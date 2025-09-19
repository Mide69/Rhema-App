import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password, fcmToken) => {
    const response = await api.post('/auth/login', { email, password, fcmToken });
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
    }
    return response;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
    }
    return response;
  },

  logout: async () => {
    await api.post('/auth/logout');
    await AsyncStorage.removeItem('token');
  },

  getCurrentUser: () => api.get('/auth/me'),

  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
};