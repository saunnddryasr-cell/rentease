// src/services/auth.js
import { get, post, put } from './api';
import { storage } from './storageService';

const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  CHANGE_PASSWORD: '/auth/change-password',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  REFRESH_TOKEN: '/auth/refresh-token',
  VERIFY_EMAIL: '/auth/verify-email',
};

class AuthService {
  // Register user
  async register(userData) {
    try {
      const response = await post(AUTH_ENDPOINTS.REGISTER, userData);
      if (response.token) {
        this.setSession(response);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await post(AUTH_ENDPOINTS.LOGIN, credentials);
      if (response.token) {
        this.setSession(response);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Logout user
  logout() {
    this.clearSession();
    window.location.href = '/login';
  }

  // Set session data
  setSession(data) {
    const { token, ...user } = data;
    storage.setToken(token);
    storage.setUser(user);
    // Set axios default header
    this.setAuthHeader(token);
  }

  // Clear session
  clearSession() {
    storage.clear();
    this.removeAuthHeader();
  }

  // Set authorization header
  setAuthHeader(token) {
    if (token) {
      // This will be handled by axios interceptor
      localStorage.setItem('token', token);
    }
  }

  // Remove authorization header
  removeAuthHeader() {
    localStorage.removeItem('token');
  }

  // Get current user
  getCurrentUser() {
    return storage.getUser();
  }

  // Get auth token
  getToken() {
    return storage.getToken();
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Check if token is expired
  isTokenExpired(token) {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await get(AUTH_ENDPOINTS.PROFILE);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await put(AUTH_ENDPOINTS.PROFILE, userData);
      storage.setUser(response);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await put(AUTH_ENDPOINTS.CHANGE_PASSWORD, passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const response = await post(`${AUTH_ENDPOINTS.RESET_PASSWORD}/${token}`, {
        password: newPassword,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Verify email
  async verifyEmail(token) {
    try {
      const response = await post(`${AUTH_ENDPOINTS.VERIFY_EMAIL}/${token}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await post(AUTH_ENDPOINTS.REFRESH_TOKEN);
      if (response.token) {
        this.setSession(response);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Check user role
  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  isAdmin() {
    return this.hasRole('admin');
  }

  isVendor() {
    return this.hasRole('vendor') || this.hasRole('admin');
  }

  isUser() {
    return this.hasRole('user');
  }
}

export const authService = new AuthService();
export default authService;