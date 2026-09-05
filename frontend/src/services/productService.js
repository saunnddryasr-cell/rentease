// src/services/productService.js
import { get, post, put, del } from './api';

const PRODUCT_ENDPOINTS = {
  PRODUCTS: '/products',
  FEATURED: '/products/featured',
  CATEGORIES: '/products/categories',
  CATEGORY: '/products/category',
};

class ProductService {
  // Get all products with filters
  async getProducts(params = {}) {
    try {
      const response = await get(PRODUCT_ENDPOINTS.PRODUCTS, params);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get product by ID
  async getProductById(id) {
    try {
      const response = await get(`${PRODUCT_ENDPOINTS.PRODUCTS}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get featured products
  async getFeaturedProducts() {
    try {
      const response = await get(PRODUCT_ENDPOINTS.FEATURED);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get products by category
  async getProductsByCategory(category) {
    try {
      const response = await get(`${PRODUCT_ENDPOINTS.CATEGORY}/${category}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get all categories
  async getCategories() {
    try {
      const response = await get(PRODUCT_ENDPOINTS.CATEGORIES);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create product (Admin/Vendor)
  async createProduct(productData) {
    try {
      const response = await post(PRODUCT_ENDPOINTS.PRODUCTS, productData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update product (Admin/Vendor)
  async updateProduct(id, productData) {
    try {
      const response = await put(`${PRODUCT_ENDPOINTS.PRODUCTS}/${id}`, productData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete product (Admin)
  async deleteProduct(id) {
    try {
      const response = await del(`${PRODUCT_ENDPOINTS.PRODUCTS}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update product availability
  async updateAvailability(id, available) {
    try {
      const response = await put(`${PRODUCT_ENDPOINTS.PRODUCTS}/${id}/availability`, {
        available,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get product reviews
  async getProductReviews(productId) {
    try {
      const response = await get(`${PRODUCT_ENDPOINTS.PRODUCTS}/${productId}/reviews`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Add product review
  async addProductReview(productId, reviewData) {
    try {
      const response = await post(`${PRODUCT_ENDPOINTS.PRODUCTS}/${productId}/reviews`, reviewData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Upload product image
  async uploadProductImage(productId, imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const response = await post(
        `${PRODUCT_ENDPOINTS.PRODUCTS}/${productId}/images`,
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

  // Search products
  async searchProducts(query) {
    try {
      const response = await get(PRODUCT_ENDPOINTS.PRODUCTS, { search: query });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Filter products
  async filterProducts(filters) {
    try {
      const response = await get(PRODUCT_ENDPOINTS.PRODUCTS, filters);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

// ✅ Create and export singleton instance
export const productService = new ProductService();

// ✅ Default export
export default productService;