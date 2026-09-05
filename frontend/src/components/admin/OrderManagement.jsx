// src/components/admin/OrderManagement.jsx
import React, { useState, useEffect } from 'react';
import { FaEye, FaSearch, FaFilter } from 'react-icons/fa';
import toast from 'react-hot-toast';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setOrders([
          {
            _id: 'ORD-2024-001',
            user: { name: 'John Doe', email: 'john@example.com' },
            totalAmount: 4999,
            status: 'delivered',
            paymentStatus: 'paid',
            createdAt: '2024-01-15T10:30:00Z',
            items: [{ product: { name: 'Queen Size Bed' }, quantity: 1, totalRent: 4999 }]
          },
          {
            _id: 'ORD-2024-002',
            user: { name: 'Jane Smith', email: 'jane@example.com' },
            totalAmount: 1299,
            status: 'pending',
            paymentStatus: 'pending',
            createdAt: '2024-01-16T14:20:00Z',
            items: [{ product: { name: 'Refrigerator' }, quantity: 1, totalRent: 1299 }]
          },
          {
            _id: 'ORD-2024-003',
            user: { name: 'Mike Johnson', email: 'mike@example.com' },
            totalAmount: 2499,
            status: 'shipped',
            paymentStatus: 'paid',
            createdAt: '2024-01-14T09:15:00Z',
            items: [{ product: { name: 'Sofa Set' }, quantity: 1, totalRent: 2499 }]
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      confirmed: 'badge-info',
      shipped: 'badge-primary',
      delivered: 'badge-success',
      cancelled: 'badge-danger',
      completed: 'badge-success'
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

  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Order Management</h2>
          <p className="text-gray-500 text-sm">Manage all customer orders</p>
        </div>
        <span className="text-sm text-gray-500">Total Orders: {orders.length}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select pl-10 min-w-[150px]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-sm">{order._id}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{order.user.name}</p>
                    <p className="text-xs text-gray-500">{order.user.email}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${getStatusBadge(order.status)}`}>{order.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedOrder(order); setShowDetails(true); }} className="text-blue-600 hover:text-blue-800">
                        <FaEye />
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="text-xs border rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">No orders found</div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Order Details</h3>
              <button onClick={() => setShowDetails(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">Order ID</p><p className="font-medium">{selectedOrder._id}</p></div>
                <div><p className="text-sm text-gray-500">Date</p><p className="font-medium">{formatDate(selectedOrder.createdAt)}</p></div>
                <div><p className="text-sm text-gray-500">Customer</p><p className="font-medium">{selectedOrder.user.name}</p></div>
                <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{selectedOrder.user.email}</p></div>
                <div><p className="text-sm text-gray-500">Total</p><p className="font-medium text-primary-600">{formatCurrency(selectedOrder.totalAmount)}</p></div>
                <div><p className="text-sm text-gray-500">Status</p><span className={`badge ${getStatusBadge(selectedOrder.status)}`}>{selectedOrder.status}</span></div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Items</p>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span>{formatCurrency(item.totalRent)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;