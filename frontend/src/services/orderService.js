// src/services/orderService.js
import { get, post, put, del } from './api';

const ORDER_ENDPOINTS = {
  ORDERS: '/orders',
  MY_ORDERS: '/orders/my-orders',
};

class OrderService {
  // Create new order
  async createOrder(orderData) {
    try {
      const response = await post(ORDER_ENDPOINTS.ORDERS, orderData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get all orders (Admin)
  async getOrders(params = {}) {
    try {
      const response = await get(ORDER_ENDPOINTS.ORDERS, params);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get user's orders
  async getMyOrders() {
    try {
      const response = await get(ORDER_ENDPOINTS.MY_ORDERS);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get order by ID
  async getOrderById(id) {
    try {
      const response = await get(`${ORDER_ENDPOINTS.ORDERS}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update order status (Admin)
  async updateOrderStatus(orderId, status) {
    try {
      const response = await put(`${ORDER_ENDPOINTS.ORDERS}/${orderId}/status`, { status });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Cancel order
  async cancelOrder(orderId) {
    try {
      const response = await put(`${ORDER_ENDPOINTS.ORDERS}/${orderId}/cancel`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get order summary
  async getOrderSummary(orderId) {
    try {
      const response = await get(`${ORDER_ENDPOINTS.ORDERS}/${orderId}/summary`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Generate order invoice
  async generateInvoice(orderId) {
    try {
      const response = await get(`${ORDER_ENDPOINTS.ORDERS}/${orderId}/invoice`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get order statistics (Admin)
  async getOrderStats() {
    try {
      const response = await get(`${ORDER_ENDPOINTS.ORDERS}/stats`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const orderService = new OrderService();
export default orderService;