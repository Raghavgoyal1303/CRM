import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from './config';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Errors & Logging
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('[Mobile API] Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('userToken');
    }
    return Promise.reject(error);
  }
);

// Authentication Service
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Leads Service
export const leadsApi = {
  getLeads: () => api.get('/leads'),
  getLead: (id) => api.get(`/leads/${id}`),
  createLead: (data) => api.post('/leads', data),
  updateLead: (id, data) => api.patch(`/leads/${id}`, data),
  deleteLead: (id) => api.delete(`/leads/${id}`),
  getRecent: () => api.get('/leads?limit=5&sort=created_at:desc'),
};

// Follow-ups Service
export const followUpsApi = {
  getFollowUps: () => api.get('/follow-ups'),
  createFollowUp: (data) => api.post('/follow-ups', data),
  updateStatus: (id, status) => api.patch(`/follow-ups/${id}/status`, { status }),
  deleteFollowUp: (id) => api.delete(`/follow-ups/${id}`),
};

// Analytics Service
export const analyticsApi = {
  getStats: () => api.get('/analytics/stats'),
  getDashboard: () => api.get('/analytics/dashboard'),
};

// Activity Service
export const activityApi = {
  getLogs: () => api.get('/activity'),
};

// - [x] Backend: Create `seed_premium_data.js`
// - [x] Mobile: Add `activityApi` to `api/index.js`
// - [x] Mobile: Implement full `ActivityScreen.js`
// - [ ] Verification: Run seed and sync test

export default api;
