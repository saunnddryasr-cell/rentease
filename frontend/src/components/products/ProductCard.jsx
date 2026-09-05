// src/components/products/ProductCard.jsx - Updated with Rent API
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { addToCart } from '../../store/slices/cartSlice';
import { FaShoppingCart, FaStar, FaHeart, FaRegHeart, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProductCard = ({ product, onToggleWishlist, isWishlisted = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { addToCart: addToCartContext } = useCart();
  const [isRenting, setIsRenting] = useState(false);

  const isAvailable = product.status === 'available' && product.availableQuantity > 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // ✅ Direct Rent API Call
  const handleDirectRent = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to rent products');
      navigate('/login', { state: { from: '/products' } });
      return;
    }

    if (!isAvailable) {
      toast.error('Product is not available');
      return;
    }

    setIsRenting(true);
    try {
      const response = await axios.post(
        `${API_URL}/rentals`,
        {
          productId: product._id,
          quantity: 1,
          tenureMonths: 1,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          deliveryAddress: {
            street: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India'
          },
          deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          paymentMethod: 'card',
          specialInstructions: ''
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        toast.success(`Successfully rented ${product.name}! 🎉`);
        navigate('/my-rentals');
      }
    } catch (error) {
      console.error('Error renting product:', error);
      toast.error(error.response?.data?.message || 'Failed to rent product');
    } finally {
      setIsRenting(false);
    }
  };

  // ✅ Add to Cart and Navigate to Checkout
  const handleRentNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to rent products');
      navigate('/login', { state: { from: '/products' } });
      return;
    }

    if (!isAvailable) {
      toast.error('Product is not available');
      return;
    }

    dispatch(addToCart({
      id: product._id,
      productId: product._id,
      name: product.name,
      price: product.monthlyRent,
      monthlyRent: product.monthlyRent,
      securityDeposit: product.securityDeposit,
      quantity: 1,
      tenureMonths: 1,
      image: product.images?.[0] || '',
      category: product.category,
      subCategory: product.subCategory,
      product: product
    }));
    addToCartContext(product, 1, 1);

    toast.success(`Added ${product.name} to cart! 🛒`);
    navigate('/checkout');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
      {/* Product Image */}
      <Link to={`/products/${product._id}`} className="block relative h-48 overflow-hidden">
        <img
          src={product.images?.[0] || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Unavailable</span>
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist?.();
          }}
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow z-10"
        >
          {isWishlisted ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-gray-400 hover:text-red-500" />
          )}
        </button>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-semibold mb-1 hover:text-primary-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span className="capitalize">{product.category}</span>
          <span className="mx-2">•</span>
          <span className="capitalize">{product.subCategory}</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center text-yellow-400">
            <FaStar />
            <span className="ml-1 text-gray-700">{product.rating || 0}</span>
          </div>
          <span className="text-gray-500">({product.totalRentals || 0} rentals)</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-primary-600">{formatCurrency(product.monthlyRent)}</p>
            <p className="text-xs text-gray-500">/ month</p>
          </div>

          <div className="flex flex-col gap-1">
            {/* ✅ Rent Now Button with Direct API */}
            <button
              onClick={handleDirectRent}
              disabled={!isAvailable || isRenting}
              className={`btn-primary flex items-center gap-2 py-1.5 px-3 text-sm ${
                (!isAvailable || isRenting) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transition-transform'
              }`}
            >
              {isRenting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Renting...</span>
                </>
              ) : (
                <>
                  <FaShoppingCart />
                  <span>Rent Now</span>
                </>
              )}
            </button>

            {/* Add to Cart */}
            <button
              onClick={handleRentNow}
              disabled={!isAvailable}
              className={`btn-secondary text-xs py-1 px-3 flex items-center justify-center gap-1 ${
                !isAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transition-transform'
              }`}
            >
              <FaShoppingCart size={12} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>

        {product.securityDeposit > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Security Deposit: {formatCurrency(product.securityDeposit)}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;