import axios from 'axios';

const authServiceHost = import.meta.env.AUTH_SERVICE_HOST || 'auth-service';
const authServicePort = import.meta.env.AUTH_SERVICE_PORT || '5000';
const userServiceHost = import.meta.env.USER_SERVICE_HOST || 'user-service';
const userServicePort = import.meta.env.USER_SERVICE_PORT || '5003';
const cardServiceHost = import.meta.env.CARD_SERVICE_HOST || 'card-service';
const cardServicePort = import.meta.env.CARD_SERVICE_PORT || '5001';
const transactionsServiceHost = import.meta.env.TRANSACTIONS_SERVICE_HOST || 'transactions-service';
const transactionsServicePort = import.meta.env.TRANSACTIONS_SERVICE_PORT || '5002';

const authServiceURL = `http://${authServiceHost}:${authServicePort}/api`;
const userServiceURL = `http://${userServiceHost}:${userServicePort}/api`;
const cardServiceURL = `http://${cardServiceHost}:${cardServicePort}/api`;
const transactionsServiceURL = `http://${transactionsServiceHost}:${transactionsServicePort}/api`;

const api = axios.create({
  baseURL: authServiceURL, // Default to auth service URL for the base
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
    const response = await axios.post(`${authServiceURL}/auth/login`, { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await axios.post(`${authServiceURL}/auth/register`, { name, email, password });
    return response.data;
  },
};


export const transactions = {
  getAll: async () => {
    const response = await api.get(`${transactionsServiceURL}/transactions`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post(`${transactionsServiceURL}/transactions`, data);
    return response.data;
  },
  deposit: async (data: { accountId: string; amount: number }) => {
    const response = await api.post(`${transactionsServiceURL}/transactions/deposit`, data);
    return response.data;
  },
  transfer: async (data: { fromAccountId: string; toAccountId: string; amount: number; description?: string }) => {
    const response = await api.post(`${transactionsServiceURL}/transactions/transfer`, data);
    return response.data;
  },
};


export const users = {
  getProfile: async () => {
    const response = await api.get(`${userServiceURL}/users/profile`);
    return response.data;
  },
  getAllBeneficiaries: async () => {
    const response = await api.get(`${userServiceURL}/users/beneficiaries`);
    return response.data;
  },
  updateProfile: async (data: { name?: string; email?: string }) => {
    const response = await api.put(`${userServiceURL}/users/profile`, data);
    return response.data;
  },
};


export const cards = {
  getAll: async () => {
    const response = await axios.get(`${cardServiceURL}/cards`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await axios.post(`${cardServiceURL}/cards`, data);
    return response.data;
  },
};

export default api;
