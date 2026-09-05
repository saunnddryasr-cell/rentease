// src/components/cart/OrderConfirmation.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaCheckCircle, 
  FaTruck, 
  FaCalendarAlt, 
  FaReceipt, 
  FaHome, 
  FaPrint,
  FaDownload,
  FaShare,
  FaWhatsapp,
  FaEnvelope,
  FaCopy,
  FaCheck
} from 'react-icons/fa';
import { formatCurrency } from '../../utils/helpers';

const OrderConfirmation = ({ order }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Format date helper
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Generate order number
  const orderNumber = order?.orderId || `ORD-${Date.now().toString().slice(-8)}`;

  // Copy order ID to clipboard
  const copyOrderId = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Print order details
  const handlePrint = () => {
    window.print();
  };

  // Share order details
  const handleShare = (platform) => {
    const shareText = `🎉 Order Confirmed!\nOrder ID: ${orderNumber}\nTotal: ${formatCurrency(order?.totalAmount || 0)}\nStatus: ${order?.status || 'Confirmed'}\n\nThank you for choosing RentEase! 🏠`;
    
    const url = window.location.href;
    
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=Order Confirmation - ${orderNumber}&body=${encodeURIComponent(shareText)}`;
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: 'Order Confirmation',
            text: shareText,
            url: url,
          });
        }
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      confirmed: { color: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
      shipped: { color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
      delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
    };
    return statusMap[status] || statusMap.pending;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4 animate-bounce">
            <FaCheckCircle className="text-5xl text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Order Placed Successfully! 🎉</h1>
          <p className="text-gray-600 mt-2">
            Thank you for choosing RentEase. Your order has been confirmed.
          </p>
        </div>

        {/* Order ID */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <div className="flex items-center space-x-2">
                <p className="text-xl font-bold text-primary-600">{orderNumber}</p>
                <button
                  onClick={copyOrderId}
                  className="text-gray-400 hover:text-primary-600 transition-colors"
                  title="Copy Order ID"
                >
                  {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(order?.status).color}`}>
                {getStatusBadge(order?.status).label}
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(order?.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handlePrint}
            className="btn-secondary flex items-center space-x-2"
          >
            <FaPrint />
            <span>Print</span>
          </button>
          <button
            onClick={() => handleShare('whatsapp')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <FaWhatsapp />
            <span>Share on WhatsApp</span>
          </button>
          <button
            onClick={() => handleShare('email')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <FaEnvelope />
            <span>Email</span>
          </button>
          <button
            onClick={() => handleShare('share')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <FaShare />
            <span>Share</span>
          </button>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-100 rounded-lg p-2">
                <FaTruck className="text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivery Status</p>
                <p className="font-medium">
                  {order?.deliveryStatus || 'Processing'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-lg p-2">
                <FaCalendarAlt className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivery Date</p>
                <p className="font-medium">
                  {order?.deliveryDate ? formatDate(order.deliveryDate) : 'To be confirmed'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 rounded-lg p-2">
                <FaReceipt className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium text-primary-600">
                  {formatCurrency(order?.totalAmount || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <FaHome className="text-primary-600" />
            <span>Delivery Address</span>
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-medium">{order?.deliveryAddress?.street || 'Not provided'}</p>
            <p className="text-gray-600">
              {order?.deliveryAddress?.city}, {order?.deliveryAddress?.state} - {order?.deliveryAddress?.pincode}
            </p>
            <p className="text-gray-600">{order?.deliveryAddress?.country || 'India'}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          <div className="space-y-4">
            {order?.items?.map((item, index) => (
              <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center space-x-4">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity} × {formatCurrency(item.monthlyRent)}/mo
                    </p>
                    {item.tenureMonths > 1 && (
                      <p className="text-xs text-gray-400">
                        {item.tenureMonths} month{item.tenureMonths > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
                <p className="font-medium">
                  {formatCurrency(item.totalRent || item.quantity * item.monthlyRent * (item.tenureMonths || 1))}
                </p>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(order?.subtotal || 0)}</span>
            </div>
            {order?.securityDepositTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Security Deposits</span>
                <span>{formatCurrency(order?.securityDepositTotal || 0)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Charges</span>
              <span>{order?.deliveryCharge === 0 ? 'Free' : formatCurrency(order?.deliveryCharge || 0)}</span>
            </div>
            {order?.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-{formatCurrency(order?.discount || 0)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
              <span>Total</span>
              <span className="text-primary-600">{formatCurrency(order?.totalAmount || 0)}</span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="font-medium capitalize">{order?.paymentMethod || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                order?.paymentStatus === 'paid' 
                  ? 'bg-green-100 text-green-800' 
                  : order?.paymentStatus === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {order?.paymentStatus || 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-xl p-6 mb-6">
          <h4 className="font-semibold text-blue-800 mb-2">What's Next?</h4>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>You'll receive an order confirmation email shortly</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Our team will contact you within 24 hours to confirm delivery</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Track your order status in your <Link to="/my-rentals" className="font-semibold hover:underline">My Rentals</Link> section</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Need help? Contact our <Link to="/support" className="font-semibold hover:underline">support team</Link></span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/my-rentals"
            className="btn-primary flex-1 text-center"
          >
            View My Rentals
          </Link>
          <Link
            to="/"
            className="btn-secondary flex-1 text-center"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Print Styles */}
        <style jsx>{`
          @media print {
            .no-print {
              display: none !important;
            }
            body {
              background: white;
            }
            .shadow-sm {
              box-shadow: none !important;
            }
            .rounded-xl {
              border-radius: 8px !important;
            }
            .animate-bounce {
              animation: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default OrderConfirmation;