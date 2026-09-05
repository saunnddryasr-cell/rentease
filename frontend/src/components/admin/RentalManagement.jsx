// src/components/admin/RentalManagement.jsx
import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import toast from 'react-hot-toast';

const RentalManagement = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedItems, setExpandedItems] = useState([]);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setRentals([
          {
            _id: 'RENT-001',
            user: { name: 'John Doe', email: 'john@example.com' },
            product: { name: 'Queen Size Bed', category: 'furniture' },
            startDate: '2024-01-01T10:00:00Z',
            endDate: '2024-04-01T10:00:00Z',
            status: 'active',
            monthlyRent: 999,
            totalRent: 2997,
            securityDeposit: 1999,
            paymentStatus: 'paid'
          },
          {
            _id: 'RENT-002',
            user: { name: 'Jane Smith', email: 'jane@example.com' },
            product: { name: 'Refrigerator', category: 'appliance' },
            startDate: '2024-01-15T14:30:00Z',
            endDate: '2024-03-15T14:30:00Z',
            status: 'active',
            monthlyRent: 1299,
            totalRent: 2598,
            securityDeposit: 3999,
            paymentStatus: 'paid'
          },
          {
            _id: 'RENT-003',
            user: { name: 'Mike Johnson', email: 'mike@example.com' },
            product: { name: 'Sofa Set', category: 'furniture' },
            startDate: '2023-12-01T09:00:00Z',
            endDate: '2024-01-01T09:00:00Z',
            status: 'completed',
            monthlyRent: 1499,
            totalRent: 1499,
            securityDeposit: 2999,
            paymentStatus: 'paid'
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching rentals:', error);
      toast.error('Failed to load rentals');
      setLoading(false);
    }
  };

  const toggleExpanded = (id) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'badge-success',
      completed: 'badge-info',
      cancelled: 'badge-danger',
      overdue: 'badge-danger',
      extended: 'badge-purple',
      pending: 'badge-warning'
    };
    return badges[status] || 'badge-secondary';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const filteredRentals = rentals.filter(rental =>
    rental.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rental.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rental._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Rental Management</h2>
          <p className="text-gray-500 text-sm">Manage all rental transactions</p>
        </div>
        <span className="text-sm text-gray-500">Total Rentals: {rentals.length}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search rentals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="relative min-w-[150px]">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="overdue">Overdue</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rental</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Left</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRentals.map((rental) => (
                <tr key={rental._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-sm">{rental._id}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{rental.user.name}</p>
                    <p className="text-xs text-gray-500">{rental.user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{rental.product.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{rental.product.category}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{formatCurrency(rental.monthlyRent)}/mo</p>
                    <p className="text-xs text-gray-500">Total: {formatCurrency(rental.totalRent)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${getStatusBadge(rental.status)}`}>{rental.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    {rental.status === 'active' ? (
                      <span className={`font-medium ${getDaysRemaining(rental.endDate) <= 3 ? 'text-red-600' : 'text-green-600'}`}>
                        {getDaysRemaining(rental.endDate)} days
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleExpanded(rental._id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedItems.includes(rental._id) ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRentals.length === 0 && (
          <div className="text-center py-8 text-gray-500">No rentals found</div>
        )}
      </div>

      {/* Expanded Details */}
      {expandedItems.map((id) => {
        const rental = rentals.find(r => r._id === id);
        if (!rental) return null;
        return (
          <div key={id} className="bg-gray-50 rounded-xl p-4 mt-2 border border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500">Start Date</p>
                <p className="font-medium">{formatDate(rental.startDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">End Date</p>
                <p className="font-medium">{formatDate(rental.endDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Security Deposit</p>
                <p className="font-medium">{formatCurrency(rental.securityDeposit)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Payment Status</p>
                <span className={`badge ${rental.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                  {rental.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RentalManagement;