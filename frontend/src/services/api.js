import axios from 'axios';
import toast from 'react-hot-toast';

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor - Add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Handle specific error codes
    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - Clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
          break;
        case 403:
          // Forbidden
          toast.error('You do not have permission to perform this action.');
          break;
        case 404:
          // Not found
          toast.error('Resource not found.');
          break;
        case 500:
          // Server error
          toast.error('Server error. Please try again later.');
          break;
        default:
          // Other errors
          if (response.data?.message) {
            toast.error(response.data.message);
          }
          break;
      }
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please try again.');
    } else if (error.message === 'Network Error') {
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

// Generic request handler with loading state
export const request = async (config) => {
  try {
    const response = await api(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// HTTP methods
export const get = (url, params = {}) => {
  return request({ method: 'GET', url, params });
};

export const post = (url, data = {}) => {
  return request({ method: 'POST', url, data });
};

export const put = (url, data = {}) => {
  return request({ method: 'PUT', url, data });
};

export const patch = (url, data = {}) => {
  return request({ method: 'PATCH', url, data });
};

export const del = (url) => {
  return request({ method: 'DELETE', url });
};

export const upload = (url, file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return request({
    method: 'POST',
    url,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

export default api;