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
      set({ 
        admin: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null 
      });
    }
  },

  getCurrentUser: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const admin = await getCurrentAdmin();
      set({ 
        admin, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to get current user';
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
      set({ 
        admin: response.admin, 
        isAuthenticated: true,
        error: null 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Token refresh failed';
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
    clearError 
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
    clearError 
  };
};
