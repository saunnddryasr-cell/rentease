// src/components/cart/EmptyCart.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaArrowRight } from 'react-icons/fa';

const EmptyCart = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-gray-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
          <FaShoppingCart className="text-5xl text-gray-400" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Your Cart is Empty
        </h2>
        
        <p className="text-gray-600 mb-8">
          Looks like you haven't added any items to your cart yet.
          Browse our catalog and find the perfect furniture or appliance for your home.
        </p>

        <div className="space-y-4">
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            <span>Start Shopping</span>
            <FaArrowRight />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
          <Link to="/products?category=furniture" className="text-gray-600 hover:text-primary-600 transition-colors">
            🛋️ Furniture
          </Link>
          <Link to="/products?category=appliance" className="text-gray-600 hover:text-primary-600 transition-colors">
            🔌 Appliances
          </Link>
          <Link to="/products?subCategory=bed" className="text-gray-600 hover:text-primary-600 transition-colors">
            🛏️ Beds
          </Link>
          <Link to="/products?subCategory=sofa" className="text-gray-600 hover:text-primary-600 transition-colors">
            🛋️ Sofas
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;