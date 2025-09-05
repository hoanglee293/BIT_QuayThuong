import axiosClient from "@/utils/axiosClient";

// Admin login interface
interface AdminLoginData {
    username_or_email: string;
    password: string;
}

// Admin response interface
interface AdminResponse {
    id: number;
    username: string;
    email: string;
    role: string;
    is_active: boolean;
    last_login: string;
    created_at: string;
    updated_at: string;
}

// Login response interface
interface LoginResponse {
    admin: AdminResponse;
    message: string;
}

// Refresh response interface
interface RefreshResponse {
    admin: AdminResponse;
    message: string;
}

// Logout response interface
interface LogoutResponse {
    message: string;
}

// Admin login API
export const adminLogin = async (data: AdminLoginData): Promise<LoginResponse> => {
    try {
        const response = await axiosClient.post(`/auth/login`, data);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

// Admin logout API
export const adminLogout = async (): Promise<LogoutResponse> => {
    try {
        const response = await axiosClient.post(`/auth/logout`);
        return response.data;
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};

// Get current admin profile API
export const getCurrentAdmin = async (): Promise<AdminResponse> => {
    try {
        const response = await axiosClient.get(`/auth/me`);
        return response.data;
    } catch (error) {
        console.error('Get current admin error:', error);
        throw error;
    }
};

// Refresh access token API
export const refreshToken = async (): Promise<RefreshResponse> => {
    try {
        const response = await axiosClient.post(`/auth/refresh`);
        return response.data;
    } catch (error) {
        console.error('Refresh token error:', error);
        throw error;
    }
};

// Export types for use in other files
export type { AdminLoginData, AdminResponse, LoginResponse, RefreshResponse, LogoutResponse };
