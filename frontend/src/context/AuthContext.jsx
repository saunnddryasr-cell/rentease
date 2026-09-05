// src/context/AuthContext.jsx
import  { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Create Auth Context
const AuthContext = createContext();

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ============================================
// AUTH PROVIDER
// ============================================
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set auth token in axios headers
  const setAuthToken = useCallback((token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, []);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        setAuthToken(token);
        try {
          const response = await axios.get(`${API_URL}/auth/profile`);
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token, setAuthToken]);

  // ============================================
  // REGISTER USER
  // ============================================
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📝 Registering user...', userData);
      
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      console.log('✅ Registration response:', response.data);
      
      const { token, data } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
        setToken(token);
        setAuthToken(token);
        setUser(data);
        setIsAuthenticated(true);
        toast.success('Registration successful! Welcome to RentEase! 🎉');
        return { success: true, data: response.data };
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      console.error('❌ Registration error:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // LOGIN USER
  // ============================================
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔑 Logging in...', credentials.email);
      
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      console.log('✅ Login response:', response.data);
      
      const { token, data } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
        setToken(token);
        setAuthToken(token);
        setUser(data);
        setIsAuthenticated(true);
        toast.success('Welcome back! 👋');
        return { success: true, data: response.data };
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      console.error('❌ Login error:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // LOGOUT USER
  // ============================================
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  }, [setAuthToken]);

  // ============================================
  // UPDATE PROFILE
  // ============================================
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, userData);
      setUser(response.data);
      toast.success('Profile updated successfully!');
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // CHANGE PASSWORD
  // ============================================
  const changePassword = async (passwordData) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(`${API_URL}/auth/change-password`, passwordData);
      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FORGOT PASSWORD
  // ============================================
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      toast.success('Password reset link sent to your email!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset link';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RESET PASSWORD
  // ============================================
  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/auth/reset-password/${token}`, { password: newPassword });
      toast.success('Password reset successfully!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // VERIFY EMAIL
  // ============================================
  const verifyEmail = async (token) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/auth/verify-email/${token}`);
      toast.success('Email verified successfully!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to verify email';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // CLEAR ERROR
  // ============================================
  const clearError = () => setError(null);

  // ============================================
  // ROLE CHECKS
  // ============================================
  const hasRole = (role) => user?.role === role;
  const isAdmin = () => user?.role === 'admin';
  const isVendor = () => user?.role === 'vendor' || user?.role === 'admin';

  // ============================================
  // CONTEXT VALUE
  // ============================================
  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    clearError,
    hasRole,
    isAdmin,
    isVendor,
    setUser,
    setAuthToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// CUSTOM HOOK
// ============================================
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;