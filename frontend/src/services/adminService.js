// src/services/adminService.js
import { get, post, put, del } from './api';

const ADMIN_ENDPOINTS = {
  DASHBOARD: '/admin/dashboard',
  USERS: '/admin/users',
  PRODUCTS: '/admin/products',
  ORDERS: '/admin/orders',
  RENTALS: '/admin/rentals',
  ANALYTICS: '/admin/analytics',
  REPORTS: '/admin/reports',
  SETTINGS: '/admin/settings',
};

class AdminService {
  // Dashboard
  async getDashboardStats() {
    try {
      const response = await get(ADMIN_ENDPOINTS.DASHBOARD);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // User Management
  async getUsers(params = {}) {
    try {
      const response = await get(ADMIN_ENDPOINTS.USERS, params);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const response = await get(`${ADMIN_ENDPOINTS.USERS}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async createUser(userData) {
    try {
      const response = await post(ADMIN_ENDPOINTS.USERS, userData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      const response = await put(`${ADMIN_ENDPOINTS.USERS}/${id}`, userData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const response = await del(`${ADMIN_ENDPOINTS.USERS}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateUserStatus(id, status) {
    try {
      const response = await put(`${ADMIN_ENDPOINTS.USERS}/${id}/status`, { status });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Product Management (Admin specific)
  async getAllProducts(params = {}) {
    try {
      const response = await get(ADMIN_ENDPOINTS.PRODUCTS, params);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateProductStatus(id, status) {
    try {
      const response = await put(`${ADMIN_ENDPOINTS.PRODUCTS}/${id}/status`, { status });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Order Management (Admin specific)
  async getAllOrders(params = {}) {
    try {
      const response = await get(ADMIN_ENDPOINTS.ORDERS, params);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Rental Management (Admin specific)
  async getAllRentals(params = {}) {
    try {
      const response = await get(ADMIN_ENDPOINTS.RENTALS, params);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Analytics
  async getAnalytics(params = {}) {
    try {
      const response = await get(ADMIN_ENDPOINTS.ANALYTICS, params);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Reports
  async generateReport(params = {}) {
    try {
      const response = await post(ADMIN_ENDPOINTS.REPORTS, params);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Settings
  async getSettings() {
    try {
      const response = await get(ADMIN_ENDPOINTS.SETTINGS);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateSettings(settings) {
    try {
      const response = await put(ADMIN_ENDPOINTS.SETTINGS, settings);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Bulk operations
  async bulkDeleteUsers(userIds) {
    try {
      const response = await post(`${ADMIN_ENDPOINTS.USERS}/bulk-delete`, { userIds });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async bulkUpdateProducts(productIds, updateData) {
    try {
      const response = await post(`${ADMIN_ENDPOINTS.PRODUCTS}/bulk-update`, {
        productIds,
        ...updateData,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Export data
  async exportUsers(params = {}) {
    try {
      const response = await get(`${ADMIN_ENDPOINTS.USERS}/export`, {
        ...params,
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async exportOrders(params = {}) {
    try {
      const response = await get(`${ADMIN_ENDPOINTS.ORDERS}/export`, {
        ...params,
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const adminService = new AdminService();
export default adminService;