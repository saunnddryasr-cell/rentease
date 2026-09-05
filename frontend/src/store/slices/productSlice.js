// src/store/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ============================================
// GET AUTH TOKEN HELPER
// ============================================
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ============================================
// ASYNC THUNKS
// ============================================

// Fetch products with filters
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products`, { 
        params: filters 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// Fetch featured products
export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/featured`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
    }
  }
);

// Fetch product by ID
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

// ✅ CREATE PRODUCT
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/products`,
        productData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

// ✅ UPDATE PRODUCT
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/products/${id}`,
        productData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

// ✅ DELETE PRODUCT
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/products/${id}`,
        { headers: getAuthHeader() }
      );
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

// ✅ GET PRODUCT STATS (Admin)
export const fetchProductStats = createAsyncThunk(
  'products/fetchProductStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/products/stats`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

// ✅ SEARCH PRODUCTS
export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ query, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/search`, {
        params: { q: query, limit }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

// ✅ ADD PRODUCT REVIEW
export const addProductReview = createAsyncThunk(
  'products/addProductReview',
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/products/${productId}/reviews`,
        reviewData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add review');
    }
  }
);

// ✅ BULK UPDATE PRODUCT STATUS
export const bulkUpdateProductStatus = createAsyncThunk(
  'products/bulkUpdateStatus',
  async ({ productIds, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/products/bulk-status`,
        { productIds, status },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

// ============================================
// INITIAL STATE
// ============================================
const initialState = {
  products: [],
  featuredProducts: [],
  product: null,
  similarProducts: [],
  stats: null,
  searchResults: [],
  reviews: [],
  loading: false,
  error: null,
  filters: {
    category: 'all',
    subCategory: 'all',
    minPrice: '',
    maxPrice: '',
    search: '',
    sort: 'newest',
    page: 1,
    limit: 12,
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  },
};

// ============================================
// SLICE
// ============================================
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        category: 'all',
        subCategory: 'all',
        minPrice: '',
        maxPrice: '',
        search: '',
        sort: 'newest',
        page: 1,
        limit: 12,
      };
      state.pagination.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
      state.filters.page = action.payload;
    },
    setSortOption: (state, action) => {
      state.filters.sort = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.filters.search = action.payload;
      state.filters.page = 1;
    },
    clearProducts: (state) => {
      state.products = [];
      state.product = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearProduct: (state) => {
      state.product = null;
      state.similarProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== FETCH PRODUCTS ==========
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) 
          ? action.payload 
          : action.payload?.data || [];
        state.pagination.totalItems = action.payload?.total || state.products.length;
        state.pagination.totalPages = action.payload?.totalPages || 1;
        state.pagination.currentPage = action.payload?.page || 1;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
        state.products = [];
      })

      // ========== FETCH FEATURED ==========
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = Array.isArray(action.payload) 
          ? action.payload 
          : action.payload?.data || [];
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch featured products';
        state.featuredProducts = [];
      })

      // ========== FETCH PRODUCT BY ID ==========
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        // Handle different response structures
        if (action.payload?.data) {
          state.product = action.payload.data.product || action.payload.data;
          state.similarProducts = action.payload.data.similarProducts || [];
        } else {
          state.product = action.payload;
          state.similarProducts = [];
        }
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch product';
        state.product = null;
        state.similarProducts = [];
      })

      // ========== CREATE PRODUCT ==========
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        const newProduct = action.payload?.data || action.payload;
        if (newProduct) {
          state.products = [newProduct, ...state.products];
          state.pagination.totalItems += 1;
        }
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create product';
      })

      // ========== UPDATE PRODUCT ==========
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload?.data || action.payload;
        if (updatedProduct) {
          // Update in products list
          const index = state.products.findIndex(p => p._id === updatedProduct._id);
          if (index !== -1) {
            state.products[index] = updatedProduct;
          }
          // Update in featured products
          const featuredIndex = state.featuredProducts.findIndex(p => p._id === updatedProduct._id);
          if (featuredIndex !== -1) {
            state.featuredProducts[featuredIndex] = updatedProduct;
          }
          // Update current product
          if (state.product?._id === updatedProduct._id) {
            state.product = updatedProduct;
          }
        }
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update product';
      })

      // ========== DELETE PRODUCT ==========
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload?.id || action.meta?.arg;
        if (deletedId) {
          state.products = state.products.filter(p => p._id !== deletedId);
          state.featuredProducts = state.featuredProducts.filter(p => p._id !== deletedId);
          if (state.product?._id === deletedId) {
            state.product = null;
            state.similarProducts = [];
          }
          state.pagination.totalItems -= 1;
        }
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete product';
      })

      // ========== FETCH PRODUCT STATS ==========
      .addCase(fetchProductStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload?.data || action.payload;
        state.error = null;
      })
      .addCase(fetchProductStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch stats';
      })

      // ========== SEARCH PRODUCTS ==========
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = Array.isArray(action.payload) 
          ? action.payload 
          : action.payload?.data || [];
        state.error = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Search failed';
        state.searchResults = [];
      })

      // ========== ADD REVIEW ==========
      .addCase(addProductReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductReview.fulfilled, (state, action) => {
        state.loading = false;
        const newReview = action.payload?.data || action.payload;
        if (newReview) {
          state.reviews = [newReview, ...state.reviews];
          // Update product rating
          if (state.product && newReview.productId === state.product._id) {
            // Recalculate rating
            const allReviews = state.reviews;
            const totalRating = allReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
            state.product.rating = totalRating / allReviews.length;
            state.product.totalRatings = allReviews.length;
          }
        }
        state.error = null;
      })
      .addCase(addProductReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add review';
      })

      // ========== BULK UPDATE STATUS ==========
      .addCase(bulkUpdateProductStatus.fulfilled, (state, action) => {
        const { productIds, status } = action.meta.arg;
        state.products = state.products.map(product => 
          productIds.includes(product._id) 
            ? { ...product, status } 
            : product
        );
        state.featuredProducts = state.featuredProducts.map(product =>
          productIds.includes(product._id)
            ? { ...product, status }
            : product
        );
        if (state.product && productIds.includes(state.product._id)) {
          state.product = { ...state.product, status };
        }
      });
  },
});

// ============================================
// EXPORT ACTIONS & REDUCER
// ============================================
export const {
  setFilters,
  resetFilters,
  setCurrentPage,
  setSortOption,
  setSearchTerm,
  clearProducts,
  clearError,
  clearProduct,
} = productSlice.actions;

export default productSlice.reducer;

// ============================================
// SELECTORS
// ============================================
export const selectAllProducts = (state) => {
  const products = state.products.products;
  return Array.isArray(products) ? products : [];
};

export const selectFeaturedProducts = (state) => {
  const featured = state.products.featuredProducts;
  return Array.isArray(featured) ? featured : [];
};

export const selectProductById = (state) => state.products.product;
export const selectSimilarProducts = (state) => state.products.similarProducts;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectFilters = (state) => state.products.filters;
export const selectPagination = (state) => state.products.pagination;
export const selectProductStats = (state) => state.products.stats;
export const selectSearchResults = (state) => state.products.searchResults;
export const selectProductReviews = (state) => state.products.reviews;