// src/store/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

// ✅ Load cart from localStorage if available
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      return parsed.items || [];
    }
  } catch (error) {
    console.error('Error loading cart:', error);
  }
  return [];
};

const initialState = {
  items: loadCartFromStorage(),
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 });
      }
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      localStorage.setItem('cart', JSON.stringify({ items: state.items, total: state.total }));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      localStorage.setItem('cart', JSON.stringify({ items: state.items, total: state.total }));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        localStorage.setItem('cart', JSON.stringify({ items: state.items, total: state.total }));
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;