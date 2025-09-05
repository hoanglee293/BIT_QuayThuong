import { create } from "zustand";
import { adminLogin, adminLogout, getCurrentAdmin, refreshToken, type AdminResponse } from "@/services/api/AuthService";

interface AuthState {
  admin: AdminResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
  checkAuthFromStorage: () => void;
}

const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  admin: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (usernameOrEmail: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await adminLogin({
        username_or_email: usernameOrEmail,
        password: password
      });
      
      // Set isAuth in localStorage
      localStorage.setItem('isAuth', 'true');
      
      set({ 
        admin: response.admin, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ 
        admin: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: errorMessage 
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    
    try {
      await adminLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Remove isAuth from localStorage
      localStorage.removeItem('isAuth');
      
      set({ 
        admin: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null 
      });
      
      // Redirect to connect page
      if (typeof window !== 'undefined') {
        window.location.href = '/connect';
      }
    }
  },

  getCurrentUser: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const admin = await getCurrentAdmin();
      
      // Set isAuth in localStorage when successfully getting current user
      localStorage.setItem('isAuth', 'true');
      
      set({ 
        admin, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to get current user';
      
      // Remove isAuth from localStorage on error
      localStorage.removeItem('isAuth');
      
      set({ 
        admin: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: errorMessage 
      });
    }
  },

  refreshAuth: async () => {
    try {
      const response = await refreshToken();
      
      // Set isAuth in localStorage when successfully refreshing token
      localStorage.setItem('isAuth', 'true');
      
      set({ 
        admin: response.admin, 
        isAuthenticated: true,
        error: null 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Token refresh failed';
      
      // Remove isAuth from localStorage on error
      localStorage.removeItem('isAuth');
      
      set({ 
        admin: null, 
        isAuthenticated: false,
        error: errorMessage 
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  checkAuthFromStorage: () => {
    if (typeof window !== 'undefined') {
      const isAuth = localStorage.getItem('isAuth');
      if (isAuth === 'true') {
        set({ isAuthenticated: true });
      } else {
        set({ isAuthenticated: false });
      }
    }
  }
}));

export const useAuth = () => {
  const { 
    admin, 
    isAuthenticated, 
    isLoading, 
    error, 
    login, 
    logout, 
    getCurrentUser, 
    refreshAuth, 
    clearError,
    checkAuthFromStorage
  } = useAuthStore();

  return { 
    admin, 
    isAuthenticated, 
    isLoading, 
    error, 
    login, 
    logout, 
    getCurrentUser, 
    refreshAuth, 
    clearError,
    checkAuthFromStorage
  };
};
