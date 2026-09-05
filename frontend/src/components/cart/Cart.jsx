// src/components/cart/Cart.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import EmptyCart from './EmptyCart';
import { FaArrowLeft, FaShoppingCart, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Cart = () => {
  const { 
    cartItems, 
    cartTotal, 
    itemCount,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartSummary
  } = useCart();
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Get cart summary
  const summary = getCartSummary();

  // Handle checkout
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed with checkout');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/checkout');
    }, 1000);
  };

  // Handle clear cart
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to remove all items from your cart?')) {
      setIsClearing(true);
      clearCart();
      setTimeout(() => {
        setIsClearing(false);
        toast.success('Cart cleared');
      }, 500);
    }
  };

  // Handle continue shopping
  const handleContinueShopping = () => {
    navigate('/products');
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (!loading && cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleContinueShopping}
            className="text-gray-600 hover:text-primary-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            aria-label="Continue shopping"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-sm text-gray-500">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-semibold">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={handleClearCart}
            disabled={isClearing}
            className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            {isClearing ? (
              <>
                <FaSpinner className="animate-spin" />
                Clearing...
              </>
            ) : (
              'Clear Cart'
            )}
          </button>
        )}
      </div>

      {/* Cart Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            {/* Cart Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="text-sm text-gray-500">
                <p>Subtotal ({itemCount} items): <span className="font-medium text-gray-900">₹{summary.subtotal}</span></p>
                {summary.deposits > 0 && (
                  <p className="text-xs">Security Deposits: ₹{summary.deposits}</p>
                )}
              </div>
              <Link
                to="/products"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors flex items-center gap-1"
              >
                <FaArrowLeft className="text-xs" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <CartSummary 
            summary={summary}
            onCheckout={handleCheckout}
            isProcessing={isProcessing}
          />
        </div>
      </div>

      {/* Related Products or Recommendations (Optional) */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">You might also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* You can add a carousel or product recommendations here */}
          <div className="col-span-4 text-center text-gray-400 py-8">
            <p>Recommendations coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;