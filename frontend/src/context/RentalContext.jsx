// src/context/RentalContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Create Rental Context
const RentalContext = createContext();

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Rental Provider Component
export const RentalProvider = ({ children }) => {
  const [activeRentals, setActiveRentals] = useState([]);
  const [rentalHistory, setRentalHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch active rentals
  const fetchActiveRentals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/rentals/active`);
      const rentals = response.data?.data || [];
      setActiveRentals(rentals);
      return rentals;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch active rentals';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch rental history
  const fetchRentalHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/rentals/history`);
      const rentals = response.data?.data || [];
      setRentalHistory(rentals);
      return rentals;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch rental history';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch rental by ID
  const fetchRentalById = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/rentals/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching rental:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create new rental
  const createRental = async (rentalData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/rentals`, rentalData);
      toast.success('Rental created successfully! 🎉');
      await fetchActiveRentals();
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create rental';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Extend rental
  const extendRental = async (rentalId, extraMonths) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_URL}/rentals/${rentalId}/extend`, { extraMonths });
      toast.success(`Rental extended by ${extraMonths} months!`);
      await fetchActiveRentals();
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to extend rental';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Cancel rental
  const cancelRental = async (rentalId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(`${API_URL}/rentals/${rentalId}/cancel`);
      toast.success('Rental cancelled successfully');
      await fetchActiveRentals();
      await fetchRentalHistory();
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to cancel rental';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Return rental
  const returnRental = async (rentalId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(`${API_URL}/rentals/${rentalId}/return`);
      toast.success('Rental returned successfully');
      await fetchActiveRentals();
      await fetchRentalHistory();
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to return rental';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Request maintenance
  const requestMaintenance = async (rentalId, maintenanceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/rentals/${rentalId}/maintenance`, maintenanceData);
      toast.success('Maintenance request submitted!');
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit maintenance request';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Get rental statistics
  const getRentalStats = () => {
    const total = activeRentals.length + rentalHistory.length;
    const active = activeRentals.length;
    const completed = rentalHistory.filter(r => r.status === 'completed' || r.status === 'returned').length;
    const overdue = activeRentals.filter(r => new Date(r.endDate) < new Date()).length;

    return {
      total,
      active,
      completed,
      overdue,
      upcoming: activeRentals.filter(r => new Date(r.startDate) > new Date()).length
    };
  };

  // Get upcoming rentals
  const getUpcomingRentals = () => {
    const today = new Date();
    return activeRentals.filter(r => new Date(r.startDate) > today);
  };

  // Get overdue rentals
  const getOverdueRentals = () => {
    const today = new Date();
    return activeRentals.filter(r => new Date(r.endDate) < today);
  };

  // Get rentals ending soon (within 7 days)
  const getRentalsEndingSoon = () => {
    const today = new Date();
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);
    
    return activeRentals.filter(r => {
      const endDate = new Date(r.endDate);
      return endDate >= today && endDate <= sevenDaysFromNow;
    });
  };

  const value = {
    activeRentals,
    rentalHistory,
    loading,
    error,
    fetchActiveRentals,
    fetchRentalHistory,
    fetchRentalById,
    createRental,
    extendRental,
    cancelRental,
    returnRental,
    requestMaintenance,
    getRentalStats,
    getUpcomingRentals,
    getOverdueRentals,
    getRentalsEndingSoon
  };

  return (
    <RentalContext.Provider value={value}>
      {children}
    </RentalContext.Provider>
  );
};

// Custom hook to use rental context
export const useRentals = () => {
  const context = useContext(RentalContext);
  if (!context) {
    throw new Error('useRentals must be used within a RentalProvider');
  }
  return context;
};

export default RentalContext;