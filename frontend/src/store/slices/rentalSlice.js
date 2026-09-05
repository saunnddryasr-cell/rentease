// src/store/slices/rentalSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ============================================
// ASYNC THUNKS
// ============================================

// Fetch active rentals
export const fetchActiveRentals = createAsyncThunk(
  'rentals/fetchActiveRentals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/rentals/active`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active rentals');
    }
  }
);

// Fetch rental history
export const fetchRentalHistory = createAsyncThunk(
  'rentals/fetchRentalHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/rentals/history`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rental history');
    }
  }
);

// Fetch rental by ID
export const fetchRentalById = createAsyncThunk(
  'rentals/fetchRentalById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/rentals/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rental');
    }
  }
);

// Create rental
export const createRental = createAsyncThunk(
  'rentals/createRental',
  async (rentalData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/rentals`, rentalData);
      toast.success('Rental created successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create rental';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Extend rental
export const extendRental = createAsyncThunk(
  'rentals/extendRental',
  async ({ id, extraMonths }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/rentals/${id}/extend`, { extraMonths });
      toast.success(`Rental extended by ${extraMonths} months!`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to extend rental';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Cancel rental
export const cancelRental = createAsyncThunk(
  'rentals/cancelRental',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/rentals/${id}/cancel`);
      toast.success('Rental cancelled successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel rental';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Return rental
export const returnRental = createAsyncThunk(
  'rentals/returnRental',
  async ({ id, returnData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/rentals/${id}/return`, returnData);
      toast.success('Rental returned successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to return rental';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ============================================
// INITIAL STATE
// ============================================
const initialState = {
  activeRentals: [],
  rentalHistory: [],
  currentRental: null,
  loading: false,
  error: null,
  stats: {
    total: 0,
    active: 0,
    completed: 0,
    overdue: 0,
    upcoming: 0,
  },
};

// ============================================
// SLICE
// ============================================
const rentalSlice = createSlice({
  name: 'rentals',
  initialState,
  reducers: {
    clearRentalError: (state) => {
      state.error = null;
    },
    clearCurrentRental: (state) => {
      state.currentRental = null;
    },
    clearAllRentals: (state) => {
      state.activeRentals = [];
      state.rentalHistory = [];
      state.currentRental = null;
    },
    updateRentalStats: (state) => {
      const allRentals = [...state.activeRentals, ...state.rentalHistory];
      state.stats.total = allRentals.length;
      state.stats.active = state.activeRentals.length;
      state.stats.completed = state.rentalHistory.filter(r => r.status === 'completed').length;
      state.stats.overdue = state.activeRentals.filter(r => new Date(r.endDate) < new Date()).length;
      state.stats.upcoming = state.activeRentals.filter(r => new Date(r.startDate) > new Date()).length;
    },
  },
  extraReducers: (builder) => {
    // ==========================================
    // FETCH ACTIVE RENTALS
    // ==========================================
    builder
      .addCase(fetchActiveRentals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveRentals.fulfilled, (state, action) => {
        state.loading = false;
        state.activeRentals = action.payload;
        state.error = null;
      })
      .addCase(fetchActiveRentals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.activeRentals = [];
      })

    // ==========================================
    // FETCH RENTAL HISTORY
    // ==========================================
      .addCase(fetchRentalHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRentalHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.rentalHistory = action.payload;
        state.error = null;
      })
      .addCase(fetchRentalHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.rentalHistory = [];
      })

    // ==========================================
    // FETCH RENTAL BY ID
    // ==========================================
      .addCase(fetchRentalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRentalById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRental = action.payload;
        state.error = null;
      })
      .addCase(fetchRentalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentRental = null;
      })

    // ==========================================
    // CREATE RENTAL
    // ==========================================
      .addCase(createRental.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRental.fulfilled, (state, action) => {
        state.loading = false;
        state.activeRentals.unshift(action.payload);
        state.error = null;
      })
      .addCase(createRental.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    // ==========================================
    // EXTEND RENTAL
    // ==========================================
      .addCase(extendRental.fulfilled, (state, action) => {
        const index = state.activeRentals.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.activeRentals[index] = action.payload;
        }
        if (state.currentRental && state.currentRental._id === action.payload._id) {
          state.currentRental = action.payload;
        }
      })

    // ==========================================
    // CANCEL RENTAL
    // ==========================================
      .addCase(cancelRental.fulfilled, (state, action) => {
        state.activeRentals = state.activeRentals.filter(r => r._id !== action.payload._id);
        if (state.currentRental && state.currentRental._id === action.payload._id) {
          state.currentRental = null;
        }
      })

    // ==========================================
    // RETURN RENTAL
    // ==========================================
      .addCase(returnRental.fulfilled, (state, action) => {
        state.activeRentals = state.activeRentals.filter(r => r._id !== action.payload._id);
        state.rentalHistory.unshift(action.payload);
        if (state.currentRental && state.currentRental._id === action.payload._id) {
          state.currentRental = action.payload;
        }
      });
  },
});

// ============================================
// EXPORT ACTIONS & REDUCER
// ============================================
export const {
  clearRentalError,
  clearCurrentRental,
  clearAllRentals,
  updateRentalStats,
} = rentalSlice.actions;

export default rentalSlice.reducer;

// ============================================
// SELECTORS
// ============================================

// Get all active rentals
export const selectActiveRentals = (state) => state.rentals.activeRentals;

// Get rental history
export const selectRentalHistory = (state) => state.rentals.rentalHistory;

// Get current rental
export const selectCurrentRental = (state) => state.rentals.currentRental;

// Get loading state
export const selectRentalsLoading = (state) => state.rentals.loading;

// Get error state
export const selectRentalsError = (state) => state.rentals.error;

// Get rental stats
export const selectRentalStats = (state) => state.rentals.stats;

// Get active rentals count
export const selectActiveRentalsCount = (state) => state.rentals.activeRentals.length;

// Get overdue rentals
export const selectOverdueRentals = (state) => {
  const now = new Date();
  return state.rentals.activeRentals.filter(r => new Date(r.endDate) < now);
};

// Get upcoming rentals
export const selectUpcomingRentals = (state) => {
  const now = new Date();
  return state.rentals.activeRentals.filter(r => new Date(r.startDate) > now);
};

// Get rentals ending soon (within 7 days)
export const selectRentalsEndingSoon = (state) => {
  const now = new Date();
  const sevenDaysFromNow = new Date(now);
  sevenDaysFromNow.setDate(now.getDate() + 7);
  return state.rentals.activeRentals.filter(r => {
    const endDate = new Date(r.endDate);
    return endDate >= now && endDate <= sevenDaysFromNow;
  });
};

// Get rental by ID
export const selectRentalById = (state, id) => {
  return state.rentals.activeRentals.find(r => r._id === id) ||
         state.rentals.rentalHistory.find(r => r._id === id);
};

// Get completed rentals count
export const selectCompletedRentalsCount = (state) => {
  return state.rentals.rentalHistory.filter(r => r.status === 'completed').length;
};

// Get total rentals
export const selectTotalRentals = (state) => {
  return state.rentals.activeRentals.length + state.rentals.rentalHistory.length;
};