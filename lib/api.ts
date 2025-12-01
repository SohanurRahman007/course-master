// lib/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
    
  register: (userData: any) =>
    api.post('/api/auth/register', userData),
    
  logout: () => api.post('/api/auth/logout'),
};

// Course API calls
export const courseApi = {
  getAll: (params?: any) => api.get('/api/courses', { params }),
  
  getById: (id: string) => api.get(`/api/courses/${id}`),
  
  create: (courseData: any) => api.post('/api/courses', courseData),
  
  update: (id: string, courseData: any) => 
    api.put(`/api/courses/${id}`, courseData),
  
  delete: (id: string) => api.delete(`/api/courses/${id}`),
};