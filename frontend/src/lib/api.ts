import axios from 'axios';

// Define individual service URLs
const authServiceURL = `/auth/api`;
const userServiceURL = `/user/api`;
const cardServiceURL = `/card/api`;
const transactionsServiceURL = `/transactions/api`;

// Create separate axios instances for each service
const authApi = axios.create({
  baseURL: authServiceURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const userApi = axios.create({
  baseURL: userServiceURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const cardApi = axios.create({
  baseURL: cardServiceURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const transactionsApi = axios.create({
  baseURL: transactionsServiceURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptors to each service instance for auth token
const addAuthInterceptor = (apiInstance) => {
  apiInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

// Apply the auth interceptor to each instance
addAuthInterceptor(authApi);
addAuthInterceptor(userApi);
addAuthInterceptor(cardApi);
addAuthInterceptor(transactionsApi);

// Define your services with the correct instances
export const auth = {
  login: async (email, password) => {
    const response = await authApi.post(`/auth/login`, { email, password });
    return response.data;
  },
  register: async (name, email, password) => {
    const response = await authApi.post(`/auth/register`, { name, email, password });
    return response.data;
  },
};

export const transactions = {
  getAll: async () => {
    const response = await transactionsApi.get(`/transactions`);
    return response.data;
  },
  create: async (data) => {
    const response = await transactionsApi.post(`/transactions`, data);
    return response.data;
  },
  deposit: async (data) => {
    const response = await transactionsApi.post(`/transactions/deposit`, data);
    return response.data;
  },
  transfer: async (data) => {
    const response = await transactionsApi.post(`/transactions/transfer`, data);
    return response.data;
  },
};

export const users = {
  getProfile: async () => {
    const response = await userApi.get(`/users/profile`);
    return response.data;
  },
  getAllBeneficiaries: async () => {
    const response = await userApi.get(`/users/beneficiaries`);
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await userApi.put(`/users/profile`, data);
    return response.data;
  },
};

export const cards = {
  getAll: async () => {
    const response = await cardApi.get(`/cards`);
    return response.data;
  },
  create: async (data) => {
    const response = await cardApi.post(`/cards`, data);
    return response.data;
  },
};

export default { authApi, userApi, cardApi, transactionsApi };
