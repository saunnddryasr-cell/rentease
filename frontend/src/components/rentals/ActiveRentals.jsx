// src/components/rentals/ActiveRentals.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRentals } from '../../context/RentalContext';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaTruck, 
  FaTools,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock as FaClockIcon,
  FaEye,
  FaPlus,
  FaCalendarCheck,
  FaCalendarTimes,
  FaTrash,
  FaSpinner,
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaPrint,
  FaHome,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaStar,
  FaRegStar,
  FaArrowRight,
  FaSearch,
  FaFilter,
  FaTimes
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const ActiveRentals = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { 
    activeRentals = [],  // ✅ Default to empty array
    loading, 
    fetchActiveRentals,
    extendRental,
    cancelRental,
    returnRental,
    getRentalStats,
    getUpcomingRentals,
    getOverdueRentals,
    getRentalsEndingSoon
  } = useRentals();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedRental, setSelectedRental] = useState(null);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]);
  const [extendMonths, setExtendMonths] = useState(1);
  const [returnCondition, setReturnCondition] = useState('good');
  const [sortBy, setSortBy] = useState('endDate');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch active rentals on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchActiveRentals();
    }
  }, [isAuthenticated]);

  // ✅ Get days remaining with safe check
  const getDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // ✅ Get filtered rentals - FIXED
  const getFilteredRentals = () => {
    // ✅ Ensure activeRentals is an array
    const rentals = Array.isArray(activeRentals) ? activeRentals : [];
    let filtered = [...rentals];

    if (searchTerm) {
      filtered = filtered.filter(rental => 
        rental.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental._id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      switch(filterType) {
        case 'active':
          filtered = filtered.filter(r => r.status === 'active' && getDaysRemaining(r.endDate) > 0);
          break;
        case 'ending_soon':
          filtered = filtered.filter(r => getDaysRemaining(r.endDate) <= 3 && getDaysRemaining(r.endDate) > 0);
          break;
        case 'overdue':
          filtered = filtered.filter(r => getDaysRemaining(r.endDate) < 0);
          break;
        case 'extended':
          filtered = filtered.filter(r => r.isExtended);
          break;
        default:
          break;
      }
    }

    switch(sortBy) {
      case 'endDate':
        filtered.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
        break;
      case 'startDate':
        filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        break;
      case 'rentAmount':
        filtered.sort((a, b) => b.monthlyRent - a.monthlyRent);
        break;
      case 'productName':
        filtered.sort((a, b) => a.product?.name?.localeCompare(b.product?.name) || 0);
        break;
      default:
        break;
    }

    return filtered;
  };

  // ✅ Get stats with safe check
  const getStats = () => {
    const rentals = Array.isArray(activeRentals) ? activeRentals : [];
    return {
      total: rentals.length,
      active: rentals.filter(r => r.status === 'active' && getDaysRemaining(r.endDate) > 0).length,
      overdue: rentals.filter(r => getDaysRemaining(r.endDate) < 0).length,
      endingSoon: rentals.filter(r => getDaysRemaining(r.endDate) <= 3 && getDaysRemaining(r.endDate) > 0).length,
      extended: rentals.filter(r => r.isExtended).length,
    };
  };

  // ✅ Get paginated data
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

  // ✅ Get status badge with safe check
  const getStatusBadge = (rental) => {
    if (!rental) return { color: 'bg-gray-100 text-gray-800', icon: <FaClock />, label: 'Unknown' };
    
    const daysRemaining = getDaysRemaining(rental.endDate);
    
    if (rental.status === 'cancelled') {
      return { color: 'bg-red-100 text-red-800', icon: <FaTimes />, label: 'Cancelled' };
    }
    if (rental.status === 'completed') {
      return { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle />, label: 'Completed' };
    }
    if (daysRemaining < 0) {
      return { color: 'bg-red-100 text-red-800', icon: <FaExclamationCircle />, label: 'Overdue' };
    }
    if (daysRemaining <= 3) {
      return { color: 'bg-yellow-100 text-yellow-800', icon: <FaClockIcon />, label: 'Ending Soon' };
    }
    if (rental.isExtended) {
      return { color: 'bg-purple-100 text-purple-800', icon: <FaClockIcon />, label: 'Extended' };
    }
    return { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle />, label: 'Active' };
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

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-gray-900">Please Login</h2>
        <p className="text-gray-600 mt-2">You need to be logged in to view your rentals.</p>
        <Link to="/login" className="btn-primary mt-6 inline-block">
          Login Now
        </Link>
      </div>
    );
  }

  const filteredData = getPaginatedData();
  const stats = getStats();

  // Render rental card
  const renderRentalCard = (rental) => {
    const daysRemaining = getDaysRemaining(rental.endDate);
    const status = getStatusBadge(rental);
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
                      {status.label}
                    </span>
                    {rental.isExtended && (
                      <span className="text-xs text-purple-600 font-medium">
                        Extended
                      </span>
                    )}
                    {daysRemaining > 0 && daysRemaining <= 3 && (
                      <span className="text-xs text-yellow-600 font-medium animate-pulse">
                        ⚠️ {daysRemaining} days left
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="text-right">
                <p className="text-sm text-gray-500">Monthly Rent</p>
                <p className="text-xl font-bold text-primary-600">
                  {formatCurrency(rental.monthlyRent)}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => {
                    setSelectedRental(rental);
                    setShowDetailModal(true);
                  }}
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

          {/* Quick Actions */}
          {daysRemaining > 0 && rental.status !== 'cancelled' && (
            <div className="mt-3 pt-3 border-t border-gray-200 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedRental(rental);
                  setShowExtendModal(true);
                }}
                className="btn-primary text-sm flex items-center gap-1"
              >
                <FaCalendarCheck />
                <span>Extend</span>
              </button>
              <button
                onClick={() => {
                  setSelectedRental(rental);
                  setShowReturnModal(true);
                }}
                className="btn-secondary text-sm flex items-center gap-1"
              >
                <FaTruck />
                <span>Return</span>
              </button>
              <Link
                to={`/maintenance?rentalId=${rental._id}`}
                className="btn-secondary text-sm flex items-center gap-1"
              >
                <FaTools />
                <span>Maintenance</span>
              </Link>
              <button
                onClick={() => {
                  setSelectedRental(rental);
                  setShowCancelModal(true);
                }}
                className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
              >
                <FaTrash />
                <span>Cancel</span>
              </button>
            </div>
          )}

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
                  {daysRemaining > 0 && (
                    <p className="text-sm text-gray-500">
                      {daysRemaining} days remaining
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Rent</p>
                  <p className="font-medium text-primary-600">
                    {formatCurrency(rental.totalRent)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Security Deposit</p>
                  <p className="font-medium">{formatCurrency(rental.securityDeposit)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Delivery Status</p>
                  <p className="font-medium capitalize">{rental.deliveryStatus || 'Pending'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pickup Status</p>
                  <p className="font-medium capitalize">{rental.pickupStatus || 'Pending'}</p>
                </div>
                {rental.isExtended && (
                  <div>
                    <p className="text-xs text-gray-500">Extension</p>
                    <p className="font-medium text-purple-600">
                      +{rental.extensionDetails?.extraMonths} months
                    </p>
                  </div>
                )}
              </div>

              {/* Delivery Address */}
              {rental.deliveryAddress && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500">Delivery Address</p>
                  <div className="bg-gray-50 rounded-lg p-3 mt-1 text-sm">
                    <p>{rental.deliveryAddress.street}</p>
                    <p>{rental.deliveryAddress.city}, {rental.deliveryAddress.state}</p>
                    <p>{rental.deliveryAddress.pincode}, {rental.deliveryAddress.country}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Toggle expanded item
  const toggleExpanded = (id) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = async () => {
    if (!selectedRental || !window.confirm('Cancel this rental?')) return;
    setIsSubmitting(true);
    const result = await cancelRental(selectedRental._id);
    setIsSubmitting(false);
    if (result.success) {
      setSelectedRental(null);
      setShowCancelModal(false);
    }
  };

  const handleReturn = async () => {
    if (!selectedRental || !window.confirm('Return this rental?')) return;
    setIsSubmitting(true);
    const result = await returnRental(selectedRental._id, { condition: returnCondition });
    setIsSubmitting(false);
    if (result.success) {
      setSelectedRental(null);
      setShowReturnModal(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Active Rentals</h1>
          <p className="text-gray-500 text-sm">
            Manage your active rental items
          </p>
        </div>
        <Link
          to="/products"
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus />
          <span>Rent More</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Active Rentals</p>
          <p className="text-2xl font-bold">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Ending Soon</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.endingSoon}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Overdue</p>
          <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Extended</p>
          <p className="text-2xl font-bold text-purple-600">{stats.extended}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="relative min-w-[150px]">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="select pl-10"
            >
              <option value="all">All Rentals</option>
              <option value="active">Active</option>
              <option value="ending_soon">Ending Soon</option>
              <option value="overdue">Overdue</option>
              <option value="extended">Extended</option>
            </select>
          </div>
          <div className="relative min-w-[150px]">
            <FaChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select pl-10"
            >
              <option value="endDate">End Date</option>
              <option value="startDate">Start Date</option>
              <option value="rentAmount">Rent Amount</option>
              <option value="productName">Product Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rental List */}
      {loading ? (
        <div className="text-center py-12">
          <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading your rentals...</p>
        </div>
      ) : filteredData.data.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold text-gray-900">No Active Rentals</h2>
          <p className="text-gray-600 mt-2">
            {searchTerm || filterType !== 'all' 
              ? 'No rentals match your filters.'
              : 'You don\'t have any active rentals at the moment.'}
          </p>
          {(searchTerm || filterType !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="btn-secondary mt-4"
            >
              Clear Filters
            </button>
          )}
          {!searchTerm && filterType === 'all' && (
            <Link to="/products" className="btn-primary mt-4 inline-block">
              Browse Products
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {filteredData.data.map(rental => renderRentalCard(rental))}
          </div>

          {filteredData.totalPages > 1 && (
            <div className="flex items-center justify-center mt-8 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex space-x-1">
                {[...Array(filteredData.totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber > 1 &&
                    pageNumber < filteredData.totalPages &&
                    Math.abs(pageNumber - currentPage) > 2
                  ) {
                    if (pageNumber === 2 || pageNumber === filteredData.totalPages - 1) {
                      return <span key={pageNumber} className="px-3 py-2">...</span>;
                    }
                    return null;
                  }
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        pageNumber === currentPage
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
                disabled={currentPage === filteredData.totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}

          <div className="text-center text-sm text-gray-500 mt-4">
            Showing {filteredData.data.length} of {filteredData.total} rentals
          </div>
        </>
      )}

      {showCancelModal && (
        <button type="button" className="fixed inset-0 z-50 bg-black/40" onClick={() => setShowCancelModal(false)}>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 text-left shadow-xl" onClick={(event) => event.stopPropagation()}>
            <strong className="block text-lg">Cancel rental?</strong>
            <span className="mt-2 block text-sm text-gray-600">This action will release the rented item.</span>
            <span className="mt-5 flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => setShowCancelModal(false)}>Keep rental</button>
              <button type="button" className="rounded-lg bg-red-600 px-4 py-2 text-white" onClick={handleCancel} disabled={isSubmitting}>{isSubmitting ? 'Cancelling...' : 'Cancel rental'}</button>
            </span>
          </span>
        </button>
      )}

      {showReturnModal && (
        <button type="button" className="fixed inset-0 z-50 bg-black/40" onClick={() => setShowReturnModal(false)}>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 text-left shadow-xl" onClick={(event) => event.stopPropagation()}>
            <strong className="block text-lg">Return rental?</strong>
            <label className="mt-4 block text-sm text-gray-600">Item condition
              <select value={returnCondition} onChange={(event) => setReturnCondition(event.target.value)} className="select mt-1">
                <option value="good">Good</option>
                <option value="damaged">Damaged</option>
              </select>
            </label>
            <span className="mt-5 flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => setShowReturnModal(false)}>Keep rental</button>
              <button type="button" className="rounded-lg bg-primary-600 px-4 py-2 text-white" onClick={handleReturn} disabled={isSubmitting}>{isSubmitting ? 'Returning...' : 'Return rental'}</button>
            </span>
          </span>
        </button>
      )}
    </div>
  );
};

export default ActiveRentals;