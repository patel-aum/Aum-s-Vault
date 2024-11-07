import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
};

export const transactions = {
  getAll: async () => {
    const response = await api.get('/transactions');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/transactions', data);
    return response.data;
  },
  deposit: async (data: { accountId: string; amount: number }) => {
    const response = await api.post('/transactions/deposit', data);
    return response.data;
  },
  transfer: async (data: { fromAccountId: string; toAccountId: string; amount: number; description?: string }) => {
    const response = await api.post('/transactions/transfer', data);
    return response.data;
  },
};

export const users = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  getAllBeneficiaries: async () => {
    const response = await api.get('/users/beneficiaries');
    return response.data;
  },
  updateProfile: async (data: { name?: string; email?: string }) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
};

export const cards = {
  getAll: async () => {
    const response = await api.get('/cards');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/cards', data);
    return response.data;
  },
};

export default api;