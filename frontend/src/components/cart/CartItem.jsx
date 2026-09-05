// src/components/cart/CartItem.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaImage } from 'react-icons/fa';
import { formatCurrency } from '../../utils/helpers';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) {
      onRemove(item.productId);
      return;
    }

    if (newQuantity > (item.maxQuantity || 10)) {
      toast.error(`Only ${item.maxQuantity} units available`);
      return;
    }

    setQuantity(newQuantity);
    setIsUpdating(true);
    await onUpdateQuantity(item.productId, newQuantity);
    setIsUpdating(false);
  };

  const handleRemove = () => {
    if (window.confirm(`Remove "${item.name}" from cart?`)) {
      onRemove(item.productId);
    }
  };

  const totalPrice = item.quantity * item.monthlyRent * (item.tenureMonths || 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors">
      {/* Product Image & Info */}
      <div className="md:col-span-6 flex items-start space-x-4">
        <Link to={`/products/${item.productId}`}>
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {item.image ? (
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <FaImage className="text-2xl" />
              </div>
            )}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={`/products/${item.productId}`}>
            <h3 className="font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-2">
              {item.name}
            </h3>
          </Link>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="text-xs text-gray-500 capitalize">
              {item.category}
            </span>
            {item.subCategory && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-gray-500 capitalize">
                  {item.subCategory}
                </span>
              </>
            )}
          </div>
          {item.securityDeposit > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Security Deposit: {formatCurrency(item.securityDeposit)}
            </p>
          )}
          <button
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 text-sm mt-2 inline-flex items-center space-x-1 transition-colors md:hidden"
          >
            <FaTrash size={14} />
            <span>Remove</span>
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="md:col-span-2 flex md:block items-center justify-between">
        <span className="text-sm text-gray-500 md:hidden">Price:</span>
        <span className="font-medium">{formatCurrency(item.monthlyRent)}/mo</span>
      </div>

      {/* Quantity */}
      <div className="md:col-span-2 flex md:block items-center justify-between">
        <span className="text-sm text-gray-500 md:hidden">Quantity:</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1 || isUpdating}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaMinus size={12} />
          </button>
          <span className="w-8 text-center font-medium">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= (item.maxQuantity || 10) || isUpdating}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPlus size={12} />
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="md:col-span-2 flex md:block items-center justify-between">
        <span className="text-sm text-gray-500 md:hidden">Total:</span>
        <div className="text-right">
          <p className="font-bold text-primary-600">{formatCurrency(totalPrice)}</p>
          {item.tenureMonths > 1 && (
            <p className="text-xs text-gray-500">
              {item.tenureMonths} {item.tenureMonths === 1 ? 'month' : 'months'}
            </p>
          )}
        </div>
      </div>

      {/* Remove Button (Desktop) */}
      <div className="hidden md:flex md:col-span-1 items-center justify-end">
        <button
          onClick={handleRemove}
          className="text-gray-400 hover:text-red-500 transition-colors p-2"
          title="Remove item"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CartItem;