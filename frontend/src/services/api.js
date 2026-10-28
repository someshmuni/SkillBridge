
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Attach Authorization header if token exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getMe: () => API.get('/auth/me'),
};

export const userAPI = {
  updateProfile: (data) => API.put('/users/profile', data),
  addSkill: (skill) => API.post('/users/skills', { skill }),
  removeSkill: (skillName) =>
    API.delete(`/users/skills/${encodeURIComponent(skillName)}`),
};

export const internshipAPI = {
  getAll: (params) => API.get('/internships', { params }),
  getById: (id) => API.get(`/internships/${id}`),
  create: (data) => API.post('/internships', data),
  update: (id, data) => API.put(`/internships/${id}`, data),
  delete: (id) => API.delete(`/internships/${id}`),
};

export const applicationAPI = {
  getAll: (params) => API.get('/applications', { params }),
  createOrUpdate: (data) => API.post('/applications', data),
  updateStatus: (id, data) => API.put(`/applications/${id}`, data),
  delete: (id) => API.delete(`/applications/${id}`),
  getStats: () => API.get('/applications/dashboard-stats'),
};

export const skillGapAPI = {
  getInternshipGap: (id) => API.get(`/skill-gap/internship/${id}`),
  getOverallGap: () => API.get('/skill-gap/overall'),
};

export const adminAPI = {
  getUsers: () => API.get('/admin/users'),

  getApplications: () => API.get('/admin/applications'),

  updateApplication: (id, data) =>
    API.put(`/admin/applications/${id}`, data),

  // New: fetch real admin analytics from MongoDB
  getAnalytics: () => API.get('/admin/analytics'),
};

export default API;
