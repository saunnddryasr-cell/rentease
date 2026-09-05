// src/components/cart/CartSummary.jsx
import React from 'react';
import { FaLock, FaGift, FaTruck, FaShieldAlt, FaCreditCard } from 'react-icons/fa';
import { formatCurrency } from '../../utils/helpers';

const CartSummary = ({ summary, onCheckout, isProcessing }) => {
  const {
    subtotal,
    deposits,
    delivery,
    total,
    items,
    itemCount
  } = summary;

  // Calculate discount if any (example: 10% off for orders above ₹5000)
  const discount = subtotal > 5000 ? subtotal * 0.1 : 0;
  const finalTotal = total - discount;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      
      {/* Items Count */}
      <div className="flex justify-between py-2 text-sm text-gray-600 border-b border-gray-100">
        <span>Items ({itemCount})</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      {/* Security Deposits */}
      {deposits > 0 && (
        <div className="flex justify-between py-2 text-sm text-gray-600 border-b border-gray-100">
          <span>Security Deposits</span>
          <span>{formatCurrency(deposits)}</span>
        </div>
      )}

      {/* Delivery Charges */}
      <div className="flex justify-between py-2 text-sm text-gray-600 border-b border-gray-100">
        <div className="flex items-center space-x-1">
          <FaTruck className="text-gray-400" />
          <span>Delivery Charges</span>
        </div>
        <span>{delivery === 0 ? 'Free' : formatCurrency(delivery)}</span>
      </div>

      {/* Discount */}
      {discount > 0 && (
        <div className="flex justify-between py-2 text-sm text-green-600 border-b border-gray-100">
          <div className="flex items-center space-x-1">
            <FaGift className="text-green-500" />
            <span>Discount (10%)</span>
          </div>
          <span>-{formatCurrency(discount)}</span>
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between py-3 text-lg font-bold border-b border-gray-200">
        <span>Total</span>
        <span className="text-primary-600">{formatCurrency(finalTotal)}</span>
      </div>

      {/* Includes note */}
      <p className="text-xs text-gray-500 mt-2">
        <FaShieldAlt className="inline mr-1" />
        Includes all taxes and charges
      </p>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={isProcessing || items === 0}
        className="w-full mt-4 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <div className="spinner-border spinner-border-sm" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <FaLock />
            <span>Proceed to Checkout</span>
          </>
        )}
      </button>

      {/* Trust Badges */}
      <div className="mt-4 flex justify-center space-x-4 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <FaCreditCard className="text-gray-400" />
          <span>Secure Payment</span>
        </div>
        <span>•</span>
        <div className="flex items-center space-x-1">
          <FaShieldAlt className="text-gray-400" />
          <span>100% Protected</span>
        </div>
      </div>

      {/* Promo Code */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter promo code"
            className="input flex-1 text-sm"
            disabled
          />
          <button className="btn-secondary text-sm whitespace-nowrap" disabled>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;