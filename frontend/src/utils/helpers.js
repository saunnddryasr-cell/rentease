// src/utils/helpers.js

// Format currency in Indian Rupees
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (date, format = 'medium') => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  const options = {
    short: { day: 'numeric', month: 'short', year: 'numeric' },
    medium: { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' },
    long: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
  };
  
  return d.toLocaleDateString('en-IN', options[format] || options.medium);
};

// Calculate days between dates
export const daysBetween = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Get rental duration in months
export const getRentalDuration = (startDate, endDate) => {
  const days = daysBetween(startDate, endDate);
  const months = days / 30;
  return Math.ceil(months);
};

// Generate random order ID
export const generateOrderId = () => {
  return `ORD-${Date.now().toString().slice(-8)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Validate email
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validate phone
export const isValidPhone = (phone) => {
  return /^[0-9+\-\s()]{10,15}$/.test(phone);
};

// Get initial letter
export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// Format time
export const formatTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};