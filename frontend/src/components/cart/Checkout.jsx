// src/components/cart/Checkout.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { addToCart } from '../../store/slices/cartSlice';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { FaArrowLeft, FaLock, FaTruck, FaCalendarAlt, FaClock, FaCreditCard, FaHome, FaCity, FaMapMarkerAlt, FaBuilding, FaComment, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LoadingSpinner from '../common/LoadingSpinner';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth();
  const { cartItems, getCartSummary, clearCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // ✅ Get product ID from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const productId = params.get('productId');
    const quantity = parseInt(params.get('quantity')) || 1;
    const tenure = parseInt(params.get('tenure')) || 1;

    if (productId) {
      // eslint-disable-next-line react-hooks/immutability
      fetchProduct(productId, quantity, tenure);
    } else {
      // If no product ID, check if cart has items
      if (cartItems.length === 0) {
        navigate('/products');
        return;
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  }, [location]);

  const fetchProduct = async (productId, quantity, tenure) => {
    try {
      setLoading(true);
      const response = await productService.getProductById(productId);
      const productData = response.data || response;
      setProduct(productData);
      
      // Add to cart if not already added
      const existingItem = cartItems.find(item => item.productId === productData._id);
      if (!existingItem) {
        dispatch(addToCart({
          productId: productData._id,
          name: productData.name,
          price: productData.monthlyRent,
          monthlyRent: productData.monthlyRent,
          securityDeposit: productData.securityDeposit,
          quantity: quantity,
          tenureMonths: tenure,
          image: productData.images?.[0] || '',
          category: productData.category,
          subCategory: productData.subCategory,
          product: productData
        }));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      setLoading(false);
      navigate('/products');
    }
  };

  // Form state
  const [formData, setFormData] = useState({
    deliveryAddress: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || '',
      country: user?.address?.country || 'India'
    },
    deliveryDate: '',
    deliveryTimeSlot: '',
    rentalStartDate: '',
    rentalEndDate: '',
    paymentMethod: 'card',
    specialInstructions: ''
  });

  const [errors, setErrors] = useState({});

  // Calculate summary from cart
  const summary = getCartSummary();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed with checkout');
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [isAuthenticated]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    const { deliveryAddress, deliveryDate, rentalStartDate, rentalEndDate, paymentMethod } = formData;

    if (!deliveryAddress.street) newErrors['deliveryAddress.street'] = 'Street address is required';
    if (!deliveryAddress.city) newErrors['deliveryAddress.city'] = 'City is required';
    if (!deliveryAddress.state) newErrors['deliveryAddress.state'] = 'State is required';
    if (!deliveryAddress.pincode) newErrors['deliveryAddress.pincode'] = 'Pincode is required';
    else if (!/^[0-9]{5,6}$/.test(deliveryAddress.pincode)) {
      newErrors['deliveryAddress.pincode'] = 'Enter a valid pincode';
    }
    if (!deliveryDate) newErrors.deliveryDate = 'Delivery date is required';
    if (!rentalStartDate) newErrors.rentalStartDate = 'Rental start date is required';
    if (!rentalEndDate) newErrors.rentalEndDate = 'Rental end date is required';
    if (!paymentMethod) newErrors.paymentMethod = 'Payment method is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle order submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix all errors');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setSubmitting(true);
    try {
      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId || item.id,
          quantity: item.quantity,
          tenureMonths: item.tenureMonths || 1,
          monthlyRent: item.monthlyRent,
          securityDeposit: item.securityDeposit,
          totalRent: item.quantity * item.monthlyRent * (item.tenureMonths || 1)
        })),
        deliveryAddress: formData.deliveryAddress,
        deliveryDate: formData.deliveryDate,
        deliveryTimeSlot: formData.deliveryTimeSlot,
        rentalStartDate: formData.rentalStartDate,
        rentalEndDate: formData.rentalEndDate,
        paymentMethod: formData.paymentMethod,
        specialInstructions: formData.specialInstructions,
        subtotal: summary.subtotal,
        deliveryCharge: summary.delivery,
        securityDepositTotal: summary.deposits,
        grandTotal: summary.total,
        totalAmount: summary.total
      };

      // Call API to create order
      const response = await orderService.createOrder(orderData);
      
      // Clear cart and show success
      clearCart();
      setOrderId(response.data.orderId || response.data._id);
      setOrderComplete(true);
      toast.success('Order placed successfully! 🎉');
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner fullScreen />
      </div>
    );
  }

  // Order complete state
  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Order Placed Successfully! 🎉</h2>
          <p className="text-gray-600 mt-2">Thank you for your order. We'll process it shortly.</p>
          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-bold text-lg text-primary-600">{orderId}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
            <Link to="/my-rentals" className="btn-primary">View My Rentals</Link>
            <Link to="/products" className="btn-secondary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty (should be handled by useEffect)
  if (cartItems.length === 0 && !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
        <p className="text-gray-600 mt-2">Add some products to your cart before checking out.</p>
        <Link to="/products" className="btn-primary mt-6 inline-block">Browse Products</Link>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get min date for delivery (today + 2 days)
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate('/cart')}
          className="text-gray-600 hover:text-primary-600 transition-colors"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            {/* Delivery Address */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaHome className="text-primary-600" />
                Delivery Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="label">Street Address *</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="deliveryAddress.street"
                      value={formData.deliveryAddress.street}
                      onChange={handleInputChange}
                      className={`input pl-10 ${errors['deliveryAddress.street'] ? 'input-error' : ''}`}
                      placeholder="123 Main Street, Apartment 4B"
                      required
                    />
                  </div>
                  {errors['deliveryAddress.street'] && (
                    <p className="text-red-500 text-xs mt-1">{errors['deliveryAddress.street']}</p>
                  )}
                </div>
                <div>
                  <label className="label">City *</label>
                  <div className="relative">
                    <FaCity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="deliveryAddress.city"
                      value={formData.deliveryAddress.city}
                      onChange={handleInputChange}
                      className={`input pl-10 ${errors['deliveryAddress.city'] ? 'input-error' : ''}`}
                      placeholder="Mumbai"
                      required
                    />
                  </div>
                  {errors['deliveryAddress.city'] && (
                    <p className="text-red-500 text-xs mt-1">{errors['deliveryAddress.city']}</p>
                  )}
                </div>
                <div>
                  <label className="label">State *</label>
                  <div className="relative">
                    <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="deliveryAddress.state"
                      value={formData.deliveryAddress.state}
                      onChange={handleInputChange}
                      className={`input pl-10 ${errors['deliveryAddress.state'] ? 'input-error' : ''}`}
                      placeholder="Maharashtra"
                      required
                    />
                  </div>
                  {errors['deliveryAddress.state'] && (
                    <p className="text-red-500 text-xs mt-1">{errors['deliveryAddress.state']}</p>
                  )}
                </div>
                <div>
                  <label className="label">Pincode *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="deliveryAddress.pincode"
                      value={formData.deliveryAddress.pincode}
                      onChange={handleInputChange}
                      className={`input ${errors['deliveryAddress.pincode'] ? 'input-error' : ''}`}
                      placeholder="400001"
                      required
                    />
                  </div>
                  {errors['deliveryAddress.pincode'] && (
                    <p className="text-red-500 text-xs mt-1">{errors['deliveryAddress.pincode']}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Schedule */}
            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaTruck className="text-primary-600" />
                Delivery Schedule
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Delivery Date *</label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleInputChange}
                      className={`input pl-10 ${errors.deliveryDate ? 'input-error' : ''}`}
                      min={getMinDate()}
                      required
                    />
                  </div>
                  {errors.deliveryDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.deliveryDate}</p>
                  )}
                </div>
                <div>
                  <label className="label">Time Slot</label>
                  <div className="relative">
                    <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      name="deliveryTimeSlot"
                      value={formData.deliveryTimeSlot}
                      onChange={handleInputChange}
                      className="select pl-10"
                    >
                      <option value="">Select time slot</option>
                      <option value="9am-12pm">9:00 AM - 12:00 PM</option>
                      <option value="12pm-3pm">12:00 PM - 3:00 PM</option>
                      <option value="3pm-6pm">3:00 PM - 6:00 PM</option>
                      <option value="6pm-9pm">6:00 PM - 9:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Rental Duration */}
            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-primary-600" />
                Rental Duration
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Start Date *</label>
                  <input
                    type="date"
                    name="rentalStartDate"
                    value={formData.rentalStartDate}
                    onChange={handleInputChange}
                    className={`input ${errors.rentalStartDate ? 'input-error' : ''}`}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  {errors.rentalStartDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.rentalStartDate}</p>
                  )}
                </div>
                <div>
                  <label className="label">End Date *</label>
                  <input
                    type="date"
                    name="rentalEndDate"
                    value={formData.rentalEndDate}
                    onChange={handleInputChange}
                    className={`input ${errors.rentalEndDate ? 'input-error' : ''}`}
                    min={formData.rentalStartDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                  {errors.rentalEndDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.rentalEndDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaCreditCard className="text-primary-600" />
                Payment Method
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['card', 'upi', 'netbanking', 'cash'].map((method) => (
                  <label
                    key={method}
                    className={`
                      flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${formData.paymentMethod === method 
                        ? 'border-primary-600 bg-primary-50' 
                        : 'border-gray-200 hover:border-gray-300'}
                      ${errors.paymentMethod ? 'border-red-500' : ''}
                    `}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={formData.paymentMethod === method}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <FaCreditCard className={`text-xl mx-auto ${formData.paymentMethod === method ? 'text-primary-600' : 'text-gray-400'}`} />
                      <span className="text-xs capitalize mt-1 block">
                        {method === 'card' ? 'Credit/Debit' : method}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.paymentMethod && (
                <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>
              )}
            </div>

            {/* Special Instructions */}
            <div className="border-t border-gray-200 pt-4">
              <label className="label">Special Instructions</label>
              <div className="relative">
                <FaComment className="absolute left-3 top-4 text-gray-400" />
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  className="input pl-10 min-h-[80px]"
                  placeholder="Any special instructions for delivery or installation..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaLock />
                    Place Order
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.productId || item.id} className="flex justify-between text-sm">
                  <div className="flex-1">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-500 text-xs block">× {item.quantity} • {item.tenureMonths} mo</span>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(item.quantity * item.monthlyRent * (item.tenureMonths || 1))}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency(summary.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Security Deposits</span>
                <span>{formatCurrency(summary.deposits)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span>{summary.delivery === 0 ? 'Free' : formatCurrency(summary.delivery)}</span>
              </div>
              {summary.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(summary.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-primary-600">{formatCurrency(summary.total)}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700 flex items-center gap-2">
              <FaLock className="text-blue-500" />
              Your payment information is secure
            </div>

            <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-xs text-yellow-700 flex items-center gap-2">
              <FaTruck className="text-yellow-500" />
              Free delivery on orders above ₹5000
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;