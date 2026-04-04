import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * LeadFlow CRM API Service
 * Aliased exports provided for cross-component compatibility 
 */

// 1. Authentication
const authService = {
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};
export const auth = authService;
export const authApi = authService;

// 2. Super Admin Platform
const superService = {
  getStats: () => api.get('/super/stats'),
  getCompanies: () => api.get('/super/companies'),
  createCompany: (data) => api.post('/super/companies', data),
  deleteCompany: (id) => api.delete(`/super/companies/${id}`),
  toggleSuspension: (id, status) => api.patch(`/super/companies/${id}/suspend`, { status }),
  getActivity: () => api.get('/super/activity'),
};
export const superAdmin = superService;
export const superApi = superService;

// 3. Leads Management
const leadService = {
  getAll: () => api.get('/leads'),
  create: (data) => api.post('/leads', data),
  getOne: (id) => api.get(`/leads/${id}`),
  updateStatus: (id, status) => api.patch(`/leads/${id}/status`, { status }),
  assignLead: (id, employeeId) => api.patch(`/leads/${id}/assign`, { employeeId }),
  delete: (id) => api.delete(`/leads/${id}`),
  addNote: (id, content) => api.post(`/leads/${id}/notes`, { content }),
};
export const leads = leadService;
export const leadApi = { ...leadService, getLeads: leadService.getAll };
export const leadsApi = leadService;

// 4. Employee Management
const employeeSvc = {
  getAll: () => api.get('/employees'),
  create: (data) => api.post('/employees', data),
  delete: (id) => api.delete(`/employees/${id}`),
  resetPassword: (id, newPassword) => api.patch(`/employees/${id}/reset-password`, { newPassword }),
};
export const employees = employeeSvc;
export const employeeApi = employeeSvc;
export const employeesApi = employeeSvc;

// 5. Multi-channel Communications
const commsService = {
  getLogs: () => api.get('/communications'),
  getLeadLogs: (leadId) => api.get(`/communications/lead/${leadId}`),
  sendSMS: (data) => api.post('/communications/send-sms', data),
  sendWhatsApp: (data) => api.post('/communications/send-whatsapp', data),
};
export const communications = commsService;
export const commsApi = commsService;
export const communicationApi = commsService;

// 6. Outbound Campaigns
const campService = {
  getAll: () => api.get('/campaigns'),
  create: (data) => api.post('/campaigns', data),
  getOne: (id) => api.get(`/campaigns/${id}`),
  updateStatus: (id, status) => api.patch(`/campaigns/${id}/status`, { status }),
  uploadNumbers: (id, numbers) => api.post(`/campaigns/${id}/upload`, { numbers }),
};
export const campaigns = campService;
export const campaignApi = campService;
export const campaignsApi = campService;

// 7. Outbound Lead Capture
const obLeadService = {
  getAll: () => api.get('/outbound-leads'),
  update: (id, data) => api.patch(`/outbound-leads/${id}`, data),
  convert: (id) => api.post(`/outbound-leads/${id}/convert`),
  setReminder: (id, reminder_date) => api.post(`/outbound-leads/${id}/reminder`, { reminder_date }),
};
export const outboundLeads = obLeadService;
export const outboundLeadApi = obLeadService;

// 8. Security & Exclusions
const blacklistService = {
  getAll: () => api.get('/blacklist'),
  add: (data) => api.post('/blacklist', data),
  remove: (id) => api.delete(`/blacklist/${id}`),
};
export const blacklist = blacklistService;
export const blacklistApi = blacklistService;

// 9. Automated Retries
const retryService = {
  getQueue: () => api.get('/retry-queue'),
  manualRetry: (id) => api.post(`/retry-queue/${id}/retry`),
};
export const retryQueue = retryService;
export const retryApi = retryService;

// 10. Auto-Response Configuration
const arService = {
  getSettings: () => api.get('/auto-response-settings'),
  updateSettings: (data) => api.post('/auto-response-settings', data),
};
export const autoResponse = arService;
export const autoResponseApi = arService;

// 11. Business Intelligence
const analyticsService = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getCallStats: () => api.get('/analytics/calls'),
  getPipeline: () => api.get('/analytics/pipeline'),
};
export const analytics = analyticsService;
export const analyticsApi = { ...analyticsService, getMyPerformance: analyticsService.getDashboard };

// 12. Audit Logs
const activityService = {
  getLogs: () => api.get('/activity'),
};
export const activity = activityService;
export const activityApi = { ...activityService, getMyActivity: activityService.getLogs };

// 13. Appointments & Follow-ups
const followUpService = {
  getAll: () => api.get('/follow-ups'),
  create: (data) => api.post('/follow-ups', data),
  updateStatus: (id, status) => api.patch(`/follow-ups/${id}/status`, { status }),
  delete: (id) => api.delete(`/follow-ups/${id}`),
};
export const followUps = followUpService;
export const followUpApi = { ...followUpService, getFollowUps: followUpService.getAll };

// 14. Identity & Settings
const settingsService = {
  getSettings: () => api.get('/settings'),
  updateSettings: (data) => api.patch('/settings', data),
  updatePassword: (newPassword) => api.patch('/settings/password', { newPassword }),
};
export const settings = settingsService;
export const settingsApi = settingsService;
// 15. Developer Bridge
const developerService = {
  listKeys: () => api.get('/developer/keys'),
  generateKey: (data) => api.post('/developer/keys', data),
  revokeKey: (id) => api.delete(`/developer/keys/${id}`),
  getLogs: (id) => api.get(`/developer/keys/${id}/logs`),
};
export const developerApi = developerService;

export default api;
