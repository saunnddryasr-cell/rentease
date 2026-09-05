// src/components/cart/CartIcon.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart } from 'react-icons/fa';

const CartIcon = ({ className = '' }) => {
  const { itemCount } = useCart();

  return (
    <Link to="/cart" className={`relative inline-flex items-center ${className}`}>
      <FaShoppingCart className="text-2xl" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;