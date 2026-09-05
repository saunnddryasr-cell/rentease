// src/components/products/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { fetchProducts } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { FaSearch, FaFilter, FaStar, FaShoppingCart, FaSpinner } from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { addToCart: addToCartContext } = useCart();
  const { products, loading, error } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [rentingProductId, setRentingProductId] = useState(null);
  const [rentalData, setRentalData] = useState({
    tenureMonths: 1,
    quantity: 1,
    startDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(fetchProducts({ search: searchTerm.trim() }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // ✅ API Call: Rent Product by ID
  const rentProduct = async (productId, quantity = 1, tenureMonths = 1) => {
    setRentingProductId(productId);
    try {
      // First, get the product details
      const productResponse = await axios.get(`${API_URL}/products/${productId}`);
      const product = productResponse.data.data || productResponse.data;

      if (!product) {
        toast.error('Product not found');
        return;
      }

      // Check if product is available
      

      // Calculate dates
      const startDate = new Date(rentalData.startDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + tenureMonths);

      // Prepare rental data
     const rentalPayload = {
      productId,
      quantity: quantity,
      tenureMonths: tenureMonths,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      deliveryAddress: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
  },
  deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 60 * 1000).toISOString(),
  paymentMethod: "card",
  specialInstructions: "",
};
      // ✅ API Call: Create rental
      const rentalResponse = await axios.post(`${API_URL}/rentals`, rentalPayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (rentalResponse.data.success) {
        toast.success(`Successfully rented ${product.name}! 🎉`);
        
        // Add to cart as well (for checkout flow)
        dispatch(addToCart({
          id: product._id,
          productId: product._id,
          name: product.name,
          price: product.monthlyRent,
          monthlyRent: product.monthlyRent,
          securityDeposit: product.securityDeposit,
          quantity: quantity,
          tenureMonths: tenureMonths,
          image: product.images?.[0] || '',
          category: product.category,
          subCategory: product.subCategory,
          product: product
        }));
        addToCartContext(product, quantity, tenureMonths);

        // Navigate to my rentals
        setTimeout(() => {
          navigate('/my-rentals');
        }, 1500);
      } else {
        toast.error(rentalResponse.data.message || 'Failed to rent product');
      }
    } catch (error) {
      console.error('Error renting product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to rent product. Please try again.';
      toast.error(errorMessage);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error('Please login to rent products');
        navigate('/login');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Invalid rental request');
      }
    } finally {
      setRentingProductId(null);
    }
  };

  // ✅ Alternative: Rent Now - Add to cart and navigate to checkout
  const handleRentNow = (product) => {
    

    // Add to cart
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

  // ✅ Direct Rent API Call
  const handleDirectRent = (product) => {
    
    rentProduct(product._id, 1, 1);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-900">Failed to Load Products</h2>
        <p className="text-gray-600 mt-2">{error}</p>
        <button 
          onClick={() => dispatch(fetchProducts())}
          className="btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-500 text-sm">
            {products?.length || 0} products available
          </p>
        </div>
        
        {/* Search */}
        <form onSubmit={handleSearch} className="w-full md:w-auto">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full md:w-64"
            />
          </div>
        </form>
      </div>

      {/* Products Grid */}
      {!products || products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const isAvailable = product.status === 'available' && product.availableQuantity > 0;
            const isRenting = rentingProductId === product._id;

            return (
              <div key={product._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                <Link to={`/products/${product._id}`}>
                  <div className="relative h-48 overflow-hidden">
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
                    {isAvailable && product.availableQuantity <= 3 && (
                      <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        Only {product.availableQuantity} left
                      </div>
                    )}
                  </div>
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
                      {product.securityDeposit > 0 && (
                        <p className="text-xs text-gray-400">
                          Deposit: {formatCurrency(product.securityDeposit)}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      {/* ✅ Rent Now Button with API Call */}
                      <button
                        onClick={() => handleDirectRent(product)}
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
                      
                      {/* ✅ Add to Cart Button */}
                      <button
                        onClick={() => handleRentNow(product)}
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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductList;