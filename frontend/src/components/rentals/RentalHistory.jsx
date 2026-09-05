// src/components/rentals/RentalHistory.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt, 
  FaChevronDown, 
  FaChevronUp,
  FaEye,
  FaStar,
  FaRegStar,
  FaDownload,
  FaPrint,
  FaTimes,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaTruck,
  FaHome,
  FaMoneyBillWave,
  FaFileInvoice
} from 'react-icons/fa';
import { useRentals } from '../../context/RentalContext';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const RentalHistory = () => {
  const { 
    rentalHistory, 
    loading, 
    fetchRentalHistory,
    getRentalStats 
  } = useRentals();
  const { isAuthenticated } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedRental, setSelectedRental] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [expandedItems, setExpandedItems] = useState([]);

  // Fetch rental history on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchRentalHistory();
    }
  }, [isAuthenticated]);

  // Toggle expanded item
  const toggleExpanded = (id) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
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

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format date with time
  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      active: { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle className="text-green-500" /> },
      completed: { color: 'bg-blue-100 text-blue-800', icon: <FaCheckCircle className="text-blue-500" /> },
      returned: { color: 'bg-blue-100 text-blue-800', icon: <FaCheckCircle className="text-blue-500" /> },
      cancelled: { color: 'bg-red-100 text-red-800', icon: <FaTimes className="text-red-500" /> },
      overdue: { color: 'bg-yellow-100 text-yellow-800', icon: <FaExclamationCircle className="text-yellow-500" /> },
      extended: { color: 'bg-purple-100 text-purple-800', icon: <FaClock className="text-purple-500" /> },
      pending: { color: 'bg-gray-100 text-gray-800', icon: <FaClock className="text-gray-500" /> }
    };
    return statusMap[status] || statusMap.pending;
  };

  // Get rental status label
  const getStatusLabel = (status) => {
    const labels = {
      active: 'Active',
      completed: 'Completed',
      returned: 'Completed',
      cancelled: 'Cancelled',
      overdue: 'Overdue',
      extended: 'Extended',
      pending: 'Pending'
    };
    return labels[status] || status;
  };

  // Calculate days remaining or elapsed
  const getRentalDuration = (rental) => {
    const start = new Date(rental.startDate);
    const end = new Date(rental.endDate);
    const now = new Date();
    
    if (rental.status === 'completed' || rental.status === 'returned') {
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return `${days} days`;
    }
    
    if (rental.status === 'active') {
      const remaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
      if (remaining > 0) {
        return `${remaining} days remaining`;
      } else {
        return 'Overdue';
      }
    }
    
    return 'N/A';
  };

  // Get filtered and sorted rentals
  const getFilteredRentals = () => {
    let filtered = [...rentalHistory];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(rental => 
        rental.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.product?.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(rental => filterStatus === 'completed'
        ? rental.status === 'completed' || rental.status === 'returned'
        : rental.status === filterStatus);
    }

    // Date range filter
    if (dateRange.startDate) {
      filtered = filtered.filter(rental => 
        new Date(rental.startDate) >= new Date(dateRange.startDate)
      );
    }
    if (dateRange.endDate) {
      filtered = filtered.filter(rental => 
        new Date(rental.endDate) <= new Date(dateRange.endDate)
      );
    }

    // Sort
    switch(sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'startDate':
        filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        break;
      case 'endDate':
        filtered.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
        break;
      case 'amount_high':
        filtered.sort((a, b) => b.totalRent - a.totalRent);
        break;
      case 'amount_low':
        filtered.sort((a, b) => a.totalRent - b.totalRent);
        break;
      default:
        break;
    }

    return filtered;
  };

  // Get paginated data
  const getPaginatedData = () => {
    const filtered = getFilteredRentals();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);
    
    return {
      data: paginated,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / itemsPerPage),
      currentPage
    };
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle view details
  const handleViewDetails = (rental) => {
    setSelectedRental(rental);
    setShowDetailModal(true);
  };

  // Handle download invoice
  const handleDownloadInvoice = (rental) => {
    toast.success('Invoice downloaded successfully');
  };

  // Handle print invoice
  const handlePrintInvoice = (rental) => {
    window.print();
  };

  // Render rental stats
  const renderStats = () => {
    const stats = getRentalStats();
    
    const statItems = [
      { label: 'Total Rentals', value: stats.total, icon: FaHome, color: 'blue' },
      { label: 'Active', value: stats.active, icon: FaCheckCircle, color: 'green' },
      { label: 'Completed', value: stats.completed, icon: FaClock, color: 'purple' },
      { label: 'Overdue', value: stats.overdue, icon: FaExclamationCircle, color: 'red' }
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statItems.map((item) => (
          <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${item.color}-50`}>
                <item.icon className={`text-${item.color}-600 text-xl`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render rental card
  const renderRentalCard = (rental) => {
    const status = getStatusBadge(rental.status);
    const isExpanded = expandedItems.includes(rental._id);

    return (
      <div key={rental._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            {/* Product Info */}
            <div className="flex-1">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {rental.product?.images?.[0] ? (
                    <img 
                      src={rental.product.images[0]} 
                      alt={rental.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FaHome className="text-2xl" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Link 
                    to={`/products/${rental.product?._id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                  >
                    {rental.product?.name || 'Product Unavailable'}
                  </Link>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500 capitalize">
                      {rental.product?.category}
                    </span>
                    {rental.product?.subCategory && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500 capitalize">
                          {rental.product.subCategory}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.icon}
                      {getStatusLabel(rental.status)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {getRentalDuration(rental)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Rent</p>
                <p className="text-xl font-bold text-primary-600">
                  {formatCurrency(rental.totalRent)}
                </p>
              </div>
              {rental.securityDeposit > 0 && (
                <p className="text-xs text-gray-500">
                  Deposit: {formatCurrency(rental.securityDeposit)}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => handleViewDetails(rental)}
                  className="btn-secondary text-sm flex items-center gap-1"
                >
                  <FaEye />
                  <span>Details</span>
                </button>
                <button
                  onClick={() => toggleExpanded(rental._id)}
                  className="btn-secondary text-sm flex items-center gap-1"
                >
                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Rental Period</p>
                  <p className="font-medium">
                    {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {rental.tenureMonths} month{rental.tenureMonths > 1 ? 's' : ''}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="font-medium text-sm">{rental.order?._id || rental._id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Payment Status</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    rental.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {rental.paymentStatus || 'Pending'}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Delivery</p>
                  <p className="font-medium text-sm capitalize">{rental.deliveryStatus || 'Pending'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pickup</p>
                  <p className="font-medium text-sm capitalize">{rental.pickupStatus || 'Pending'}</p>
                </div>
                {rental.isExtended && (
                  <div>
                    <p className="text-xs text-gray-500">Extension</p>
                    <p className="font-medium text-sm text-purple-600">
                      +{rental.extensionDetails?.extraMonths} months
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => handleDownloadInvoice(rental)}
                  className="btn-secondary text-sm flex items-center gap-1"
                >
                  <FaDownload />
                  <span>Invoice</span>
                </button>
                <button
                  onClick={() => handlePrintInvoice(rental)}
                  className="btn-secondary text-sm flex items-center gap-1"
                >
                  <FaPrint />
                  <span>Print</span>
                </button>
                {rental.status === 'active' && (
                  <>
                    <Link
                      to={`/maintenance?rentalId=${rental._id}`}
                      className="btn-secondary text-sm flex items-center gap-1"
                    >
                      <FaExclamationCircle />
                      <span>Request Maintenance</span>
                    </Link>
                    <Link
                      to={`/rentals/${rental._id}/extend`}
                      className="btn-primary text-sm flex items-center gap-1"
                    >
                      <FaClock />
                      <span>Extend</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render detail modal
  const renderDetailModal = () => {
    if (!selectedRental) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl flex justify-between items-center">
            <h3 className="text-xl font-bold">Rental Details</h3>
            <button
              onClick={() => setShowDetailModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Product Info */}
            <div className="flex items-start space-x-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {selectedRental.product?.images?.[0] ? (
                  <img 
                    src={selectedRental.product.images[0]} 
                    alt={selectedRental.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaHome className="text-3xl" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-lg font-semibold">{selectedRental.product?.name}</h4>
                <p className="text-sm text-gray-500 capitalize">
                  {selectedRental.product?.category} • {selectedRental.product?.subCategory}
                </p>
                <div className="mt-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedRental.status).color}`}>
                    {getStatusBadge(selectedRental.status).icon}
                    {getStatusLabel(selectedRental.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Rental Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Rental ID</p>
                <p className="font-medium">{selectedRental._id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium">{selectedRental.order?._id || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium">{formatDateTime(selectedRental.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-medium">{formatDateTime(selectedRental.endDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tenure</p>
                <p className="font-medium">{selectedRental.tenureMonths} months</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Monthly Rent</p>
                <p className="font-medium">{formatCurrency(selectedRental.monthlyRent)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Rent</p>
                <p className="font-medium text-primary-600">{formatCurrency(selectedRental.totalRent)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Security Deposit</p>
                <p className="font-medium">{formatCurrency(selectedRental.securityDeposit)}</p>
              </div>
            </div>

            {/* Address */}
            <div>
              <p className="text-sm text-gray-500">Delivery Address</p>
              <div className="bg-gray-50 rounded-lg p-3 mt-1">
                <p>{selectedRental.deliveryAddress?.street}</p>
                <p>{selectedRental.deliveryAddress?.city}, {selectedRental.deliveryAddress?.state}</p>
                <p>{selectedRental.deliveryAddress?.pincode}, {selectedRental.deliveryAddress?.country}</p>
              </div>
            </div>

            {/* Payment History */}
            {selectedRental.paymentHistory?.length > 0 && (
              <div>
                <p className="text-sm text-gray-500">Payment History</p>
                <div className="space-y-2 mt-2">
                  {selectedRental.paymentHistory.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div>
                        <p className="font-medium">{formatCurrency(payment.amount)}</p>
                        <p className="text-xs text-gray-500">{formatDateTime(payment.date)}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extension Details */}
            {selectedRental.isExtended && selectedRental.extensionDetails && (
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p className="text-sm font-semibold text-purple-800">Extension Details</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="text-xs text-purple-600">Previous End Date</p>
                    <p className="font-medium">{formatDate(selectedRental.extensionDetails.previousEndDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-600">New End Date</p>
                    <p className="font-medium">{formatDate(selectedRental.extensionDetails.newEndDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-600">Extra Months</p>
                    <p className="font-medium">+{selectedRental.extensionDetails.extraMonths}</p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-600">Extra Charge</p>
                    <p className="font-medium">{formatCurrency(selectedRental.extensionDetails.extraCharge)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleDownloadInvoice(selectedRental)}
                className="btn-secondary flex items-center gap-2"
              >
                <FaDownload />
                <span>Download Invoice</span>
              </button>
              <button
                onClick={() => handlePrintInvoice(selectedRental)}
                className="btn-secondary flex items-center gap-2"
              >
                <FaPrint />
                <span>Print Invoice</span>
              </button>
              {selectedRental.status === 'active' && (
                <Link
                  to={`/maintenance?rentalId=${selectedRental._id}`}
                  className="btn-secondary flex items-center gap-2"
                >
                  <FaExclamationCircle />
                  <span>Request Maintenance</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading && rentalHistory.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const paginatedData = getPaginatedData();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Rental History</h1>
          <p className="text-gray-500 text-sm">
            View all your past and current rentals
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/my-rentals"
            className="btn-primary flex items-center gap-2"
          >
            <FaClock />
            <span>Active Rentals</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      {renderStats()}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product name or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[150px]">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="select pl-10"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="overdue">Overdue</option>
              <option value="extended">Extended</option>
            </select>
          </div>

          {/* Sort */}
          <div className="relative min-w-[150px]">
            <FaChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select pl-10"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="startDate">Start Date</option>
              <option value="endDate">End Date</option>
              <option value="amount_high">Amount: High to Low</option>
              <option value="amount_low">Amount: Low to High</option>
            </select>
          </div>
        </div>

        {/* Date Range */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200">
          <div>
            <label className="text-xs text-gray-500">From</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="input text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">To</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="input text-sm"
            />
          </div>
          {(dateRange.startDate || dateRange.endDate) && (
            <button
              onClick={() => setDateRange({ startDate: '', endDate: '' })}
              className="text-sm text-red-600 hover:text-red-700 self-end"
            >
              Clear Dates
            </button>
          )}
        </div>
      </div>

      {/* Rental List */}
      {paginatedData.data.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📜</div>
          <h2 className="text-2xl font-bold text-gray-900">No Rental History</h2>
          <p className="text-gray-600 mt-2">
            You haven't rented any products yet.
          </p>
          <Link to="/products" className="btn-primary mt-6 inline-block">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedData.data.map(rental => renderRentalCard(rental))}
          </div>

          {/* Pagination */}
          {paginatedData.totalPages > 1 && (
            <div className="flex items-center justify-center mt-8 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex space-x-1">
                {[...Array(paginatedData.totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  const isActive = pageNumber === currentPage;
                  
                  if (
                    pageNumber > 1 &&
                    pageNumber < paginatedData.totalPages &&
                    Math.abs(pageNumber - currentPage) > 2 &&
                    pageNumber !== 2 &&
                    pageNumber !== paginatedData.totalPages - 1
                  ) {
                    if (pageNumber === 3 || pageNumber === paginatedData.totalPages - 2) {
                      return <span key={pageNumber} className="px-3 py-2">...</span>;
                    }
                    return null;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-600 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === paginatedData.totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}

          {/* Result Count */}
          <div className="text-center text-sm text-gray-500 mt-4">
            Showing {paginatedData.data.length} of {paginatedData.total} rentals
          </div>
        </>
      )}

      {/* Detail Modal */}
      {showDetailModal && renderDetailModal()}
    </div>
  );
};

export default RentalHistory;