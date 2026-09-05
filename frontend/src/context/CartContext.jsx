// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

// Create Cart Context
const CartContext = createContext();

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        updateTotals(parsedCart);
      } catch (error) {
        console.error('Error loading cart:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateTotals(cartItems);
  }, [cartItems]);

  // Update cart totals
  const updateTotals = (items) => {
    const total = items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.monthlyRent * (item.tenureMonths || 1);
      return sum + itemTotal + (item.securityDeposit || 0);
    }, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    
    setCartTotal(total);
    setItemCount(count);
  };

  // Add item to cart
  const addToCart = (product, quantity = 1, tenureMonths = 1) => {
    setLoading(true);
    
    const existingItem = cartItems.find(
      item => item.productId === product._id
    );

    if (existingItem) {
      // Update existing item
      const updatedItems = cartItems.map(item =>
        item.productId === product._id
          ? {
              ...item,
              quantity: item.quantity + quantity,
              tenureMonths: tenureMonths || item.tenureMonths,
              totalRent: (item.quantity + quantity) * product.monthlyRent * (tenureMonths || item.tenureMonths)
            }
          : item
      );
      setCartItems(updatedItems);
      toast.success(`Updated ${product.name} in cart`);
    } else {
      // Add new item
      const newItem = {
        productId: product._id,
        name: product.name,
        price: product.monthlyRent,
        monthlyRent: product.monthlyRent,
        securityDeposit: product.securityDeposit,
        quantity: quantity,
        tenureMonths: tenureMonths,
        totalRent: quantity * product.monthlyRent * tenureMonths,
        image: product.images?.[0] || '',
        category: product.category,
        subCategory: product.subCategory,
        maxQuantity: product.availableQuantity || 10,
        product: product // Store full product object for checkout
      };
      setCartItems([...cartItems, newItem]);
      toast.success(`Added ${product.name} to cart`);
    }
    
    setLoading(false);
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const item = cartItems.find(item => item.productId === productId);
    setCartItems(cartItems.filter(item => item.productId !== productId));
    if (item) {
      toast.success(`Removed ${item.name} from cart`);
    }
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems(cartItems.map(item => {
      if (item.productId === productId) {
        const maxQty = item.maxQuantity || 10;
        const newQuantity = Math.min(quantity, maxQty);
        return {
          ...item,
          quantity: newQuantity,
          totalRent: newQuantity * item.monthlyRent * (item.tenureMonths || 1)
        };
      }
      return item;
    }));
  };

  // Update item tenure
  const updateTenure = (productId, tenureMonths) => {
    setCartItems(cartItems.map(item => {
      if (item.productId === productId) {
        return {
          ...item,
          tenureMonths: tenureMonths,
          totalRent: item.quantity * item.monthlyRent * tenureMonths
        };
      }
      return item;
    }));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  // Get cart total with formatting
  const getCartTotal = () => {
    return cartTotal;
  };

  // Get item count
  const getItemCount = () => {
    return itemCount;
  };

  // Check if cart is empty
  const isCartEmpty = () => {
    return cartItems.length === 0;
  };

  // Calculate subtotal (without deposits)
  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.quantity * item.monthlyRent * (item.tenureMonths || 1));
    }, 0);
  };

  // Calculate total deposits
  const getTotalDeposits = () => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.securityDeposit || 0);
    }, 0);
  };

  // Calculate delivery charges
  const getDeliveryCharges = () => {
    // Free delivery for orders above ₹5000
    const subtotal = getSubtotal();
    if (subtotal >= 5000) return 0;
    return 99; // Fixed delivery charge
  };

  // Get cart summary
  const getCartSummary = () => {
    return {
      subtotal: getSubtotal(),
      deposits: getTotalDeposits(),
      delivery: getDeliveryCharges(),
      total: getCartTotal() + getDeliveryCharges(),
      items: itemCount,
      itemCount: cartItems.length
    };
  };

  const value = {
    cartItems,
    cartTotal,
    itemCount,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateTenure,
    clearCart,
    getCartTotal,
    getItemCount,
    isCartEmpty,
    getSubtotal,
    getTotalDeposits,
    getDeliveryCharges,
    getCartSummary
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;