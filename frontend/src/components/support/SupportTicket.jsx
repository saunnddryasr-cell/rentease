// src/components/support/SupportTicket.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaTicketAlt, 
  FaUser, 
  FaEnvelope, 
  FaPhone,
  FaPaperPlane,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
  FaFileAlt,
  FaUpload,
  FaPlus,
  FaChevronDown,
  FaChevronUp,
  FaReply,
  FaTrash,
  FaEdit,
  FaEye,
  FaFilter,
  FaSearch,
  FaSpinner,
  FaPaperclip,
  FaDownload,
  FaCheck,
  FaRegClock
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const SupportTicket = () => {
  const { user, isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [expandedTickets, setExpandedTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    message: '',
    attachments: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);

  // Fetch tickets on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchTickets();
    }
  }, [isAuthenticated]);

  // Fetch tickets from API
  const fetchTickets = async () => {
    setLoading(true);
    try {
      // Simulate API call - Replace with actual API
      setTimeout(() => {
        setTickets([
          {
            id: '1',
            ticketNumber: 'TKT-2024-001',
            subject: 'Delivery delay issue',
            category: 'delivery',
            priority: 'high',
            status: 'open',
            message: 'My order #ORD-2024-123 has been delayed for 3 days. The estimated delivery date was January 15th but it still hasn\'t arrived. I need this urgently for my new apartment.',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-16T09:00:00Z',
            user: {
              name: 'John Doe',
              email: 'john@example.com',
              phone: '+91 9876543210'
            },
            responses: [
              {
                id: '1',
                user: 'Support Team',
                message: 'We apologize for the delay. Let me check your order status and get back to you within 2 hours.',
                createdAt: '2024-01-16T09:00:00Z',
                isAdmin: true
              }
            ],
            attachments: ['delivery-screenshot.jpg']
          },
          {
            id: '2',
            ticketNumber: 'TKT-2024-002',
            subject: 'Refund request for damaged product',
            category: 'billing',
            priority: 'medium',
            status: 'resolved',
            message: 'I received a damaged sofa set from order #ORD-2024-456. The fabric is torn and the frame is broken. Please process a refund.',
            createdAt: '2024-01-10T14:20:00Z',
            updatedAt: '2024-01-12T16:30:00Z',
            user: {
              name: 'Jane Smith',
              email: 'jane@example.com',
              phone: '+91 8765432109'
            },
            responses: [
              {
                id: '1',
                user: 'Support Team',
                message: 'We sincerely apologize for the damaged product. We have processed your refund. It will reflect in your account within 3-5 business days.',
                createdAt: '2024-01-12T16:30:00Z',
                isAdmin: true
              },
              {
                id: '2',
                user: 'Jane Smith',
                message: 'Thank you for the quick resolution. I appreciate the support.',
                createdAt: '2024-01-12T17:00:00Z',
                isAdmin: false
              }
            ],
            attachments: ['damage-photo-1.jpg', 'damage-photo-2.jpg']
          },
          {
            id: '3',
            ticketNumber: 'TKT-2024-003',
            subject: 'Account login issue',
            category: 'account',
            priority: 'urgent',
            status: 'in_progress',
            message: 'I am unable to login to my account since yesterday. I tried resetting my password but I\'m not receiving the reset email.',
            createdAt: '2024-01-17T08:15:00Z',
            updatedAt: '2024-01-17T10:00:00Z',
            user: {
              name: 'Mike Johnson',
              email: 'mike@example.com',
              phone: '+91 7654321098'
            },
            responses: [
              {
                id: '1',
                user: 'Support Team',
                message: 'We are looking into this issue. Our technical team has been notified.',
                createdAt: '2024-01-17T10:00:00Z',
                isAdmin: true
              }
            ],
            attachments: []
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
      setLoading(false);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagePreviews.length > 5) {
      toast.error('Maximum 5 files allowed');
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // Handle ticket creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add new ticket to list
      const newTicket = {
        id: `${tickets.length + 1}`,
        ticketNumber: `TKT-2024-${String(tickets.length + 1).padStart(3, '0')}`,
        ...formData,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          name: user?.name || 'Unknown User',
          email: user?.email || 'unknown@example.com',
          phone: user?.phone || 'N/A'
        },
        responses: [],
        attachments: formData.attachments.map(f => f.name)
      };
      
      setTickets(prev => [newTicket, ...prev]);
      toast.success('Ticket created successfully!');
      setShowForm(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to create ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      subject: '',
      category: 'general',
      priority: 'medium',
      message: '',
      attachments: []
    });
    setImagePreviews([]);
    setEditingTicket(null);
  };

  // Handle reply submission
  const handleReplySubmit = async (ticketId) => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTickets(prev => prev.map(ticket => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            responses: [
              ...ticket.responses,
              {
                id: `${ticket.responses.length + 1}`,
                user: user?.name || 'User',
                message: replyMessage,
                createdAt: new Date().toISOString(),
                isAdmin: user?.role === 'admin'
              }
            ],
            updatedAt: new Date().toISOString()
          };
        }
        return ticket;
      }));
      
      setReplyMessage('');
      toast.success('Reply sent successfully!');
    } catch (error) {
      toast.error('Failed to send reply');
    }
  };

  // Handle ticket update
  const handleUpdateTicket = async (ticketId, updates) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTickets(prev => prev.map(ticket => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
        return ticket;
      }));
      
      toast.success('Ticket updated successfully!');
    } catch (error) {
      toast.error('Failed to update ticket');
    }
  };

  // Handle ticket deletion
  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
      toast.success('Ticket deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete ticket');
    }
  };

  // Toggle expanded ticket
  const toggleExpanded = (ticketId) => {
    setExpandedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  // View ticket details
  const viewTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
    setShowDetailModal(true);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      open: { color: 'bg-yellow-100 text-yellow-800', icon: <FaRegClock className="mr-1" />, label: 'Open' },
      in_progress: { color: 'bg-blue-100 text-blue-800', icon: <FaClock className="mr-1" />, label: 'In Progress' },
      resolved: { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle className="mr-1" />, label: 'Resolved' },
      closed: { color: 'bg-gray-100 text-gray-800', icon: <FaTimes className="mr-1" />, label: 'Closed' }
    };
    return badges[status] || badges.open;
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    const badges = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return badges[priority] || badges.medium;
  };

  // Get category label
  const getCategoryLabel = (category) => {
    const labels = {
      general: 'General',
      delivery: 'Delivery',
      billing: 'Billing',
      product: 'Product',
      account: 'Account',
      other: 'Other'
    };
    return labels[category] || category;
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      general: '📋',
      delivery: '🚚',
      billing: '💰',
      product: '📦',
      account: '👤',
      other: '📝'
    };
    return icons[category] || '📋';
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get filtered and sorted tickets
  const getFilteredTickets = () => {
    let filtered = [...tickets];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === filterStatus);
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === filterPriority);
    }

    // Sort
    switch(sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'updated':
        filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        break;
      case 'priority':
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
      default:
        break;
    }

    return filtered;
  };

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🎫</div>
        <h2 className="text-2xl font-bold text-gray-900">Please Login</h2>
        <p className="text-gray-600 mt-2">You need to be logged in to access support tickets.</p>
        <Link to="/login" className="btn-primary mt-6 inline-block">
          Login Now
        </Link>
      </div>
    );
  }

  const filteredTickets = getFilteredTickets();
  const statusOptions = ['all', 'open', 'in_progress', 'resolved', 'closed'];
  const priorityOptions = ['all', 'low', 'medium', 'high', 'urgent'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'updated', label: 'Recently Updated' },
    { value: 'priority', label: 'Priority' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-gray-500 text-sm">
            Manage your support requests
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) resetForm();
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus />
          <span>{showForm ? 'Cancel' : 'New Ticket'}</span>
        </button>
      </div>

      {/* Create Ticket Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 animate-fade-in">
          <h2 className="text-xl font-bold mb-4">
            {editingTicket ? 'Edit Ticket' : 'Create New Ticket'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="input"
                placeholder="Brief description of your issue"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="general">General</option>
                  <option value="delivery">Delivery</option>
                  <option value="billing">Billing</option>
                  <option value="product">Product</option>
                  <option value="account">Account</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="label">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="textarea"
                rows="4"
                placeholder="Describe your issue in detail..."
                required
              />
            </div>

            <div>
              <label className="label">Attachments</label>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary flex items-center gap-2"
                >
                  <FaUpload />
                  <span>Upload File</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <span className="text-sm text-gray-500">Max 5 files (5MB each)</span>
              </div>
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={preview} 
                        alt={`Attachment ${index + 1}`}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="inline mr-2" />
                    {editingTicket ? 'Update Ticket' : 'Submit Ticket'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
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
              {statusOptions.filter(s => s !== 'all').map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="relative min-w-[150px]">
            <FaExclamationCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="select pl-10"
            >
              <option value="all">All Priority</option>
              {priorityOptions.filter(p => p !== 'all').map(priority => (
                <option key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
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
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="text-center py-12">
          <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading tickets...</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎫</div>
          <h2 className="text-2xl font-bold text-gray-900">No Tickets Found</h2>
          <p className="text-gray-600 mt-2">
            {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' 
              ? 'No tickets match your filters.'
              : 'You haven\'t created any support tickets yet.'}
          </p>
          {(searchTerm || filterStatus !== 'all' || filterPriority !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setFilterPriority('all');
              }}
              className="btn-secondary mt-4"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => {
            const status = getStatusBadge(ticket.status);
            const isExpanded = expandedTickets.includes(ticket.id);
            
            return (
              <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0">
                          <FaTicketAlt className="text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {ticket.subject}
                            </h3>
                            <span className="text-xs text-gray-400 font-mono">
                              {ticket.ticketNumber}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                              {status.icon}
                              {status.label}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              {getCategoryIcon(ticket.category)}
                              {getCategoryLabel(ticket.category)}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatDate(ticket.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {ticket.message}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => viewTicketDetails(ticket)}
                        className="text-gray-400 hover:text-primary-600 transition-colors p-2"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => toggleExpanded(ticket.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                      >
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Customer</p>
                          <p className="font-medium">{ticket.user.name}</p>
                          <p className="text-sm text-gray-600">{ticket.user.email}</p>
                          <p className="text-sm text-gray-600">{ticket.user.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Timeline</p>
                          <p className="text-sm">Created: {formatDate(ticket.createdAt)}</p>
                          <p className="text-sm">Updated: {formatDate(ticket.updatedAt)}</p>
                          {ticket.responses.length > 0 && (
                            <p className="text-sm">{ticket.responses.length} responses</p>
                          )}
                        </div>
                      </div>

                      {/* Quick Reply */}
                      <div className="mt-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type your reply..."
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            className="input flex-1 text-sm"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleReplySubmit(ticket.id);
                              }
                            }}
                          />
                          <button
                            onClick={() => handleReplySubmit(ticket.id)}
                            className="btn-primary flex items-center gap-2"
                          >
                            <FaPaperPlane />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>

                      {/* Responses */}
                      {ticket.responses.length > 0 && (
                        <div className="mt-4 space-y-3 max-h-48 overflow-y-auto">
                          {ticket.responses.map((response) => (
                            <div key={response.id} className={`p-3 rounded-lg ${response.isAdmin ? 'bg-blue-50' : 'bg-gray-50'}`}>
                              <div className="flex justify-between items-start">
                                <span className="font-medium text-sm">
                                  {response.isAdmin ? '🛡️ Support Team' : response.user}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {formatDate(response.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm mt-1">{response.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Detail Modal */}
      {showDetailModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Ticket Details</h3>
                <p className="text-sm text-gray-500">{selectedTicket.ticketNumber}</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Ticket Info */}
              <div>
                <h4 className="text-lg font-semibold">{selectedTicket.subject}</h4>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedTicket.status).color}`}>
                    {getStatusBadge(selectedTicket.status).icon}
                    {getStatusBadge(selectedTicket.status).label}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                  <span className="text-xs text-gray-500">
                    {getCategoryLabel(selectedTicket.category)}
                  </span>
                </div>
              </div>

              {/* Message */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {selectedTicket.message}
                </p>
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                  <span>By: {selectedTicket.user.name}</span>
                  <span>•</span>
                  <span>{formatDate(selectedTicket.createdAt)}</span>
                </div>
              </div>

              {/* Attachments */}
              {selectedTicket.attachments?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Attachments</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTicket.attachments.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <FaPaperclip className="text-gray-400" />
                        <span className="text-sm">{file}</span>
                        <button className="text-gray-400 hover:text-primary-600">
                          <FaDownload size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Responses */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Responses ({selectedTicket.responses?.length || 0})
                </p>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedTicket.responses?.map((response) => (
                    <div key={response.id} className={`p-3 rounded-lg ${response.isAdmin ? 'bg-blue-50' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-sm">
                          {response.isAdmin ? '🛡️ Support Team' : response.user}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(response.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{response.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Form */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your reply..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="input flex-1 text-sm"
                  />
                  <button
                    onClick={() => {
                      handleReplySubmit(selectedTicket.id);
                      setShowDetailModal(false);
                    }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <FaPaperPlane />
                    <span>Send</span>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleUpdateTicket(selectedTicket.id, { status: 'resolved' });
                  }}
                  className="btn-success text-sm"
                >
                  <FaCheck className="inline mr-2" />
                  Mark as Resolved
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleDeleteTicket(selectedTicket.id);
                  }}
                  className="btn-danger text-sm"
                >
                  <FaTrash className="inline mr-2" />
                  Delete Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTicket;