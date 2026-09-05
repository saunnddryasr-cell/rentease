// src/services/maintenanceService.js
import { get, post, put, del } from './api';

const MAINTENANCE_ENDPOINTS = {
  REQUESTS: '/maintenance',
  MY_REQUESTS: '/maintenance/my-requests',
  RESOLVE: '/maintenance/resolve',
  ASSIGN: '/maintenance/assign',
};

class MaintenanceService {
  // Get all maintenance requests (Admin)
  async getRequests(params = {}) {
    try {
      const response = await get(MAINTENANCE_ENDPOINTS.REQUESTS, params);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get user's maintenance requests
  async getMyRequests() {
    try {
      const response = await get(MAINTENANCE_ENDPOINTS.MY_REQUESTS);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get request by ID
  async getRequestById(id) {
    try {
      const response = await get(`${MAINTENANCE_ENDPOINTS.REQUESTS}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create maintenance request
  async createRequest(requestData) {
    try {
      const response = await post(MAINTENANCE_ENDPOINTS.REQUESTS, requestData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update request (Admin)
  async updateRequest(id, requestData) {
    try {
      const response = await put(`${MAINTENANCE_ENDPOINTS.REQUESTS}/${id}`, requestData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Resolve request (Admin)
  async resolveRequest(id, resolution) {
    try {
      const response = await put(`${MAINTENANCE_ENDPOINTS.REQUESTS}/${id}${MAINTENANCE_ENDPOINTS.RESOLVE}`, {
        resolution,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Assign technician (Admin)
  async assignTechnician(id, technicianId) {
    try {
      const response = await put(`${MAINTENANCE_ENDPOINTS.REQUESTS}/${id}${MAINTENANCE_ENDPOINTS.ASSIGN}`, {
        technicianId,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete request (Admin)
  async deleteRequest(id) {
    try {
      const response = await del(`${MAINTENANCE_ENDPOINTS.REQUESTS}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get request statistics
  async getRequestStats() {
    try {
      const response = await get(`${MAINTENANCE_ENDPOINTS.REQUESTS}/stats`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Upload request image
  async uploadRequestImage(requestId, imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const response = await post(
        `${MAINTENANCE_ENDPOINTS.REQUESTS}/${requestId}/images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const maintenanceService = new MaintenanceService();
export default maintenanceService;