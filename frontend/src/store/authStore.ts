import { create } from 'zustand';
import { users } from '../lib/api';

interface Account {
  id: string;
  account_number: string;
  type: 'checking' | 'savings';
  balance: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  accounts?: Account[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  loadUserProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: (user) => set({ 
    user, 
    isAuthenticated: true,
    error: null
  }),

  logout: () => {
    localStorage.removeItem('token');
    set({ 
      user: null, 
      isAuthenticated: false,
      error: null
    });
  },

  updateUser: (updates) => 
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null
    })),

  loadUserProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const userData = await users.getProfile();
      set({ 
        user: userData, 
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || 'Failed to load user profile',
        isLoading: false 
      });
      throw err;
    }
  }
}));
