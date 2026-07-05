import axios from 'axios';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('epq_admin_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== 'undefined' &&
      error.response?.status === 401
    ) {
      localStorage.removeItem('epq_admin_token');
      localStorage.removeItem('epq_admin_user');

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;