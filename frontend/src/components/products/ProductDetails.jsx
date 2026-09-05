// src/components/products/ProductDetails.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaStar, 
  FaStarHalfAlt, 
  FaRegStar,
  FaHeart, 
  FaRegHeart,
  FaShoppingCart,
  FaTruck,
  FaShieldAlt,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaWhatsapp,
  FaShare,
  FaPrint,
  FaRuler,
  FaWeight,
  FaPalette,
  FaCog,
  FaTools,
  FaBolt,
  FaTag,
  FaThumbsUp,
  FaArrowLeft,
  FaSpinner
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { fetchProductById } = useProducts();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedTenure, setSelectedTenure] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [userReview, setUserReview] = useState({ rating: 0, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const imageRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Fetch product details from API
  useEffect(() => {
    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Check if product is in wishlist
  useEffect(() => {
    if (isAuthenticated && product) {
      checkWishlistStatus();
    }
  }, [isAuthenticated, product]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch product from API
      const response = await axios.get(`${API_URL}/products/${id}`);
      
      if (response.data.success) {
        const productData = response.data.data;
        setProduct(productData);
        
        // Set default tenure from product options
        if (productData.rentalTenureOptions && productData.rentalTenureOptions.length > 0) {
          setSelectedTenure(productData.rentalTenureOptions[0].tenure);
        }
        
        // Fetch reviews for this product
        await fetchProductReviews(id);
        
        // Fetch similar/related products
        await fetchRelatedProducts(productData.category, productData._id);
      } else {
        setError('Failed to load product details');
        toast.error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(error.response?.data?.message || 'Failed to load product details');
      toast.error(error.response?.data?.message || 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  // Fetch product reviews
  const fetchProductReviews = async (productId) => {
    try {
      const response = await axios.get(`${API_URL}/products/${productId}/reviews`);
      if (response.data.success) {
        setReviews(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    }
  };

  // Fetch related products
  const fetchRelatedProducts = async (category, productId) => {
    try {
      const response = await axios.get(`${API_URL}/products/related/${productId}`, {
        params: { category, limit: 4 }
      });
      if (response.data.success && Array.isArray(response.data.data)) {
        setRelatedProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
      setRelatedProducts([]);
    }
  };

  // Check wishlist status
  const checkWishlistStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/wishlist/check/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsWishlisted(response.data.isWishlisted || false);
    } catch (error) {
      console.error('Error checking wishlist:', error);
      setIsWishlisted(false);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.availableQuantity < 1) {
      toast.error('Product is currently out of stock');
      return;
    }

    const cartItem = {
      productId: product._id,
      name: product.name,
      price: getRentalPrice(),
      monthlyRent: product.monthlyRent,
      quantity: quantity,
      tenure: selectedTenure,
      totalPrice: getTotalPrice(),
      image: product.images?.[0] || '',
      securityDeposit: product.securityDeposit || 0
    };

    addToCart(cartItem);
    toast.success(`Added ${product.name} to cart!`);
  };

  // Handle buy now
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed');
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    handleAddToCart();
    navigate('/checkout');
  };

  // Handle wishlist toggle
  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to manage wishlist');
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }

    try {
      if (isWishlisted) {
        await axios.delete(`${API_URL}/wishlist/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await axios.post(`${API_URL}/wishlist`, 
          { productId: id },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    }
  };

  // Handle quantity change
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity < 1) return;
    if (product && newQuantity > product.availableQuantity) {
      toast.error(`Only ${product.availableQuantity} units available`);
      return;
    }
    setQuantity(newQuantity);
  };

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      navigate('/login');
      return;
    }
    if (userReview.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const response = await axios.post(
        `${API_URL}/products/${id}/reviews`,
        {
          productId: id,
          rating: userReview.rating,
          comment: userReview.comment
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      if (response.data.success) {
        toast.success('Review submitted successfully!');
        setUserReview({ rating: 0, comment: '' });
        setShowReviewForm(false);
        // Refresh reviews
        await fetchProductReviews(id);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Handle review helpful toggle
  const handleReviewHelpful = async (reviewId) => {
    if (!isAuthenticated) {
      toast.error('Please login to mark reviews as helpful');
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/products/${id}/reviews/${reviewId}/helpful`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      if (response.data.success) {
        // Update the review in state
        setReviews(prevReviews => 
          prevReviews.map(review => 
            review._id === reviewId 
              ? { ...review, helpful: (review.helpful || 0) + 1 }
              : review
          )
        );
        toast.success('Marked as helpful!');
      }
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      toast.error('Failed to mark review as helpful');
    }
  };

  // Calculate rental price with discount
  const getRentalPrice = () => {
    if (!product) return 0;
    const option = product.rentalTenureOptions?.find(o => o.tenure === selectedTenure);
    if (!option) return product.monthlyRent;
    const discount = option.discount || 0;
    return product.monthlyRent * (1 - discount / 100);
  };

  const getTotalPrice = () => {
    return getRentalPrice() * selectedTenure * quantity;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Render rating stars
  const renderStars = (rating, size = 'md') => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    const sizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-xl',
      xl: 'text-2xl'
    };

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className={`text-yellow-400 ${sizes[size]}`} />
        ))}
        {hasHalfStar && <FaStarHalfAlt className={`text-yellow-400 ${sizes[size]}`} />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className={`text-gray-300 ${sizes[size]}`} />
        ))}
      </div>
    );
  };

  // Render tenure options
  const renderTenureOptions = () => {
    if (!product?.rentalTenureOptions || product.rentalTenureOptions.length === 0) {
      return (
        <div className="text-gray-500 text-sm">
          Standard rental plans available
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {product.rentalTenureOptions.map((option) => {
          const price = product.monthlyRent * (1 - (option.discount || 0) / 100);
          const isSelected = selectedTenure === option.tenure;
          
          return (
            <button
              key={option.tenure}
              onClick={() => setSelectedTenure(option.tenure)}
              className={`
                p-3 rounded-lg border-2 text-center transition-all
                ${isSelected 
                  ? 'border-primary-600 bg-primary-50' 
                  : 'border-gray-200 hover:border-gray-300'}
              `}
            >
              <p className="font-medium">{option.tenure} {option.unit}</p>
              <p className="text-sm text-gray-600">
                {formatCurrency(price)}/mo
              </p>
              {option.discount > 0 && (
                <span className="text-xs text-green-600 font-medium">
                  Save {option.discount}%
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // Error state
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-900">
          {error || 'Product Not Found'}
        </h2>
        <p className="text-gray-600 mt-2">
          {error ? 'Please try again later.' : "The product you're looking for doesn't exist or has been removed."}
        </p>
        <div className="mt-6 space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary inline-block"
          >
            Try Again
          </button>
          <Link to="/products" className="btn-primary inline-block">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const rentalPrice = getRentalPrice();
  const totalPrice = getTotalPrice();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors mb-6"
      >
        <FaArrowLeft />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-square">
            <img
              ref={imageRef}
              src={product.images?.[selectedImage] || '/images/placeholder.jpg'}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.target.src = '/images/placeholder.jpg';
              }}
            />
            
            {/* Status Badge */}
            {product.status === 'unavailable' && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                Unavailable
              </div>
            )}
            
            {product.status === 'available' && product.availableQuantity < 3 && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold">
                Only {product.availableQuantity} left
              </div>
            )}
            
            {/* Wishlist Button */}
            <button
              onClick={toggleWishlist}
              className="absolute top-4 left-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              {isWishlisted ? (
                <FaHeart className="text-red-500 text-xl" />
              ) : (
                <FaRegHeart className="text-gray-400 text-xl hover:text-red-500 transition-colors" />
              )}
            </button>

            {/* Image Counter */}
            {product.images?.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {product.images.length}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`
                    w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all
                    ${selectedImage === index ? 'border-primary-600' : 'border-transparent hover:border-gray-300'}
                  `}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title & Rating */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center space-x-4 mt-2 flex-wrap gap-y-2">
              <div className="flex items-center space-x-2">
                {renderStars(product.rating || 0, 'lg')}
                <span className="font-medium">{product.rating || 0}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">{product.totalRentals || 0} rentals</span>
              <span className="text-gray-400">•</span>
              <Link 
                to="#reviews" 
                className="text-primary-600 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('reviews');
                  document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {reviews.length} reviews
              </Link>
            </div>
          </div>

          {/* Price */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-baseline space-x-4">
              <span className="text-3xl font-bold text-primary-600">
                {formatCurrency(rentalPrice)}
              </span>
              <span className="text-gray-500">/ month</span>
              {product.monthlyRent > rentalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatCurrency(product.monthlyRent)}
                </span>
              )}
            </div>
            {product.securityDeposit > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                Security Deposit: {formatCurrency(product.securityDeposit)}
              </p>
            )}
          </div>

          {/* Rental Tenure */}
          <div>
            <h3 className="font-medium text-gray-700 mb-3">Select Rental Plan</h3>
            {renderTenureOptions()}
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-medium text-gray-700 mb-3">Quantity</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 min-w-[50px] text-center font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={product.availableQuantity <= quantity}
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-500">
                {product.availableQuantity} available
              </span>
            </div>
          </div>

          {/* Total */}
          <div className="bg-primary-50 rounded-xl p-4 border border-primary-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total for {selectedTenure} month{selectedTenure > 1 ? 's' : ''}</p>
                <p className="text-2xl font-bold text-primary-700">{formatCurrency(totalPrice)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">+ Security Deposit</p>
                <p className="text-lg font-medium text-gray-700">{formatCurrency((product.securityDeposit || 0) * quantity)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.status === 'unavailable' || product.availableQuantity === 0}
              className="btn-secondary flex items-center justify-center space-x-2 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaShoppingCart />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.status === 'unavailable' || product.availableQuantity === 0}
              className="btn-primary flex items-center justify-center space-x-2 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Buy Now</span>
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaTruck className="text-primary-600" />
              <span>Free Delivery</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaShieldAlt className="text-primary-600" />
              <span>Secure Rental</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaCalendarAlt className="text-primary-600" />
              <span>Flexible Tenure</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaTools className="text-primary-600" />
              <span>Maintenance Support</span>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex space-x-3 pt-2">
            <button 
              className="text-gray-400 hover:text-green-500 transition-colors"
              onClick={() => {
                window.open(`https://wa.me/?text=Check out ${product.name} at ${window.location.href}`, '_blank');
              }}
            >
              <FaWhatsapp size={20} />
            </button>
            <button 
              className="text-gray-400 hover:text-primary-600 transition-colors"
              onClick={() => {
                navigator.share?.({
                  title: product.name,
                  text: `Check out ${product.name} on RentEase!`,
                  url: window.location.href
                }).catch(() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied to clipboard!');
                });
              }}
            >
              <FaShare size={20} />
            </button>
            <button 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => window.print()}
            >
              <FaPrint size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12">
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap -mb-px space-x-8">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  py-2 px-1 border-b-2 font-medium text-sm transition-colors capitalize
                  ${activeTab === tab 
                    ? 'border-primary-600 text-primary-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="py-6">
            <div className="prose max-w-none">
              <p className={`text-gray-700 leading-relaxed ${!showFullDescription ? 'line-clamp-4' : ''}`}>
                {product.description || 'No description available.'}
              </p>
              {product.description && product.description.length > 200 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-primary-600 hover:text-primary-700 font-medium mt-2"
                >
                  {showFullDescription ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>

            {/* Key Features */}
            {product.specifications?.features && product.specifications.features.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.specifications.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <FaCheck className="text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === 'specifications' && (
          <div className="py-6">
            {product.specifications && Object.keys(product.specifications).length > 0 ? (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications || {}).map(([key, value]) => {
                    if (key === 'features') return null;
                    const icons = {
                      brand: <FaTag className="text-primary-600" />,
                      model: <FaCog className="text-primary-600" />,
                      dimensions: <FaRuler className="text-primary-600" />,
                      weight: <FaWeight className="text-primary-600" />,
                      color: <FaPalette className="text-primary-600" />,
                      material: <FaTools className="text-primary-600" />,
                      power: <FaBolt className="text-primary-600" />,
                      warranty: <FaShieldAlt className="text-primary-600" />,
                      assembly: <FaTools className="text-primary-600" />
                    };
                    return (
                      <div key={key} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                        {icons[key] || <FaInfoCircle className="text-primary-600" />}
                        <div>
                          <p className="text-xs text-gray-500 capitalize">{key}</p>
                          <p className="font-medium">{value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No specifications available</p>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="py-6" id="reviews">
            {/* Review Summary */}
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8 mb-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900">{product.rating || 0}</p>
                <div className="flex justify-center mt-1">
                  {renderStars(product.rating || 0, 'lg')}
                </div>
                <p className="text-sm text-gray-500 mt-1">{reviews.length} reviews</p>
              </div>
              <div className="flex-1 w-full space-y-1">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter(r => r.rating === rating).length;
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 w-6">{rating}</span>
                      <FaStar className="text-yellow-400 text-sm" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 rounded-full h-2 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-12">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Write Review */}
            {isAuthenticated ? (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="btn-primary mb-6"
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            ) : (
              <p className="text-gray-600 mb-6">
                <Link to="/login" className="text-primary-600 hover:underline" state={{ from: `/products/${id}` }}>
                  Login
                </Link> to write a review
              </p>
            )}

            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="bg-gray-50 rounded-xl p-6 mb-6">
                <h4 className="font-semibold mb-4">Share Your Experience</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setUserReview(prev => ({ ...prev, rating }))}
                          className="text-3xl focus:outline-none transition-colors"
                        >
                          {rating <= userReview.rating ? (
                            <FaStar className="text-yellow-400" />
                          ) : (
                            <FaRegStar className="text-gray-300 hover:text-yellow-400 transition-colors" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                    <textarea
                      value={userReview.comment}
                      onChange={(e) => setUserReview(prev => ({ ...prev, comment: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows="4"
                      placeholder="Share your experience with this product..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingReview ? (
                      <>
                        <FaSpinner className="animate-spin inline mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold">
                            {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-medium">{review.user?.name || 'Anonymous'}</p>
                            <div className="flex items-center space-x-2">
                              {renderStars(review.rating, 'sm')}
                              <span className="text-xs text-gray-500">
                                {new Date(review.createdAt || review.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleReviewHelpful(review._id)}
                        className="text-gray-400 hover:text-gray-600 text-sm flex items-center space-x-1 transition-colors"
                      >
                        <FaThumbsUp />
                        <span>{review.helpful || 0}</span>
                      </button>
                    </div>
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Similar Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">You May Also Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <Link
                key={item._id}
                to={`/products/${item._id}`}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.images?.[0] || '/images/placeholder.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                  {item.status === 'unavailable' && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold px-3 py-1 bg-red-500 rounded-full">Unavailable</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                    {item.name}
                  </h4>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-primary-600 font-bold">
                      {formatCurrency(item.monthlyRent)}
                      <span className="text-sm text-gray-500 font-normal">/mo</span>
                    </p>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-sm text-gray-600 ml-1">{item.rating || 0}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;