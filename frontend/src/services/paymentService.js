// src/services/paymentService.js
import { get, post, put } from './api';

const PAYMENT_ENDPOINTS = {
  PAYMENTS: '/payments',
  METHODS: '/payments/methods',
  VERIFY: '/payments/verify',
  REFUND: '/payments/refund',
  HISTORY: '/payments/history',
};

class PaymentService {
  // Get payment methods
  async getPaymentMethods() {
    try {
      const response = await get(PAYMENT_ENDPOINTS.METHODS);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create payment
  async createPayment(paymentData) {
    try {
      const response = await post(PAYMENT_ENDPOINTS.PAYMENTS, paymentData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Verify payment
  async verifyPayment(verificationData) {
    try {
      const response = await post(PAYMENT_ENDPOINTS.VERIFY, verificationData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get payment history
  async getPaymentHistory(params = {}) {
    try {
      const response = await get(PAYMENT_ENDPOINTS.HISTORY, params);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get payment by ID
  async getPaymentById(id) {
    try {
      const response = await get(`${PAYMENT_ENDPOINTS.PAYMENTS}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Request refund
  async requestRefund(paymentId, refundData) {
    try {
      const response = await post(`${PAYMENT_ENDPOINTS.PAYMENTS}/${paymentId}${PAYMENT_ENDPOINTS.REFUND}`, refundData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get payment status
  async getPaymentStatus(paymentId) {
    try {
      const response = await get(`${PAYMENT_ENDPOINTS.PAYMENTS}/${paymentId}/status`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Initialize payment session
  async initPaymentSession(orderId) {
    try {
      const response = await post(`${PAYMENT_ENDPOINTS.PAYMENTS}/session`, { orderId });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Process automatic payment (for auto-renewals)
  async processAutoPayment(rentalId) {
    try {
      const response = await post(`${PAYMENT_ENDPOINTS.PAYMENTS}/auto`, { rentalId });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get payment summary
  async getPaymentSummary() {
    try {
      const response = await get(`${PAYMENT_ENDPOINTS.PAYMENTS}/summary`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Save payment method
  async savePaymentMethod(methodData) {
    try {
      const response = await post(PAYMENT_ENDPOINTS.METHODS, methodData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Remove payment method
  async removePaymentMethod(methodId) {
    try {
      const response = await del(`${PAYMENT_ENDPOINTS.METHODS}/${methodId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Set default payment method
  async setDefaultPaymentMethod(methodId) {
    try {
      const response = await put(`${PAYMENT_ENDPOINTS.METHODS}/${methodId}/default`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;