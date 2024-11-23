import { create } from 'zustand';

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
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },
  updateUser: (updates) => 
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null
    })),
}));