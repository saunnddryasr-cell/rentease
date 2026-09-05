// src/context/ProductContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Create Product Context
const ProductContext = createContext();

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Product Provider Component
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    subCategory: 'all',
    minPrice: '',
    maxPrice: '',
    search: '',
    sort: 'newest'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  // Fetch products with filters
  const fetchProducts = async (page = 1, newFilters = {}) => {
    setLoading(true);
    setError(null);
    
    const currentFilters = { ...filters, ...newFilters };
    setFilters(currentFilters);

    try {
      const params = {
        page,
        limit: pagination.limit,
        ...currentFilters
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === 'all') {
          delete params[key];
        }
      });

      const response = await axios.get(`${API_URL}/products`, { params });
      
      setProducts(response.data.products || response.data);
      setPagination({
        ...pagination,
        page,
        total: response.data.total || response.data.length,
        totalPages: response.data.totalPages || Math.ceil(response.data.length / pagination.limit)
      });
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch products';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Fetch featured products
  const fetchFeaturedProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products/featured`);
      setFeaturedProducts(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch product by ID
  const fetchProductById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch product';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/categories`);
      setCategories(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  };

  // Fetch products by category
  const fetchProductsByCategory = async (category) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products/category/${category}`);
      setProducts(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Search products
  const searchProducts = async (searchTerm) => {
    return await fetchProducts(1, { search: searchTerm });
  };

  // Apply filters
  const applyFilters = async (newFilters) => {
    return await fetchProducts(1, newFilters);
  };

  // Reset filters
  const resetFilters = async () => {
    const defaultFilters = {
      category: 'all',
      subCategory: 'all',
      minPrice: '',
      maxPrice: '',
      search: '',
      sort: 'newest'
    };
    return await fetchProducts(1, defaultFilters);
  };

  // Sort products
  const sortProducts = async (sortBy) => {
    return await fetchProducts(1, { sort: sortBy });
  };

  // Get product count
  const getProductCount = () => {
    return products.length;
  };

  // Check if product is available
  const isProductAvailable = (product) => {
    return product.status === 'available' && product.availableQuantity > 0;
  };

  // Get product price range
  const getPriceRange = () => {
    if (products.length === 0) return { min: 0, max: 0 };
    const prices = products.map(p => p.monthlyRent);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  };

  const value = {
    products,
    featuredProducts,
    categories,
    loading,
    error,
    filters,
    pagination,
    fetchProducts,
    fetchFeaturedProducts,
    fetchProductById,
    fetchCategories,
    fetchProductsByCategory,
    searchProducts,
    applyFilters,
    resetFilters,
    sortProducts,
    getProductCount,
    isProductAvailable,
    getPriceRange
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use product context
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export default ProductContext;