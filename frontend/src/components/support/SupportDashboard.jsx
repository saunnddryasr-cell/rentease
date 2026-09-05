# Complete SupportDashboard.jsx (Fully Corrected) ✅

Here's the complete, fully corrected SupportDashboard component with all compile-time errors fixed:

---

```jsx
// src/components/support/SupportDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { 
  FaTicketAlt, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaUsers,
  FaChartLine,
  FaStar,
  FaRegStar,
  FaTools,
  FaHeadset,
  FaUserCheck,
  FaUserClock,
  FaUserTimes,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaFilter,
  FaSearch,
  FaDownload,
  FaPrint,
  FaEye,
  FaEdit,
  FaTrash,
  FaReply,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaChevronDown,
  FaChevronUp,
  FaArrowLeft,
  FaArrowRight,
  FaChartBar,
  FaPieChart,
  FaLineChart,
  FaCog,
  FaPlus,
  FaUserPlus
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const SupportDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Redirect if not admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [tickets, setTickets] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    totalMaintenance: 0,
    pendingMaintenance: 0,
    inProgressMaintenance: 0,
    completedMaintenance: 0,
    averageResponseTime: '2.5h',
    customerSatisfaction: 4.6,
    supportTeamSize: 5,
    ticketsResolvedToday: 12,
  });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [expandedSections, setExpandedSections] = useState({
    tickets: true,
    maintenance: true,
    team: true,
    analytics: true
  });
  
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Support Specialist',
    status: 'online'
  });

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        // Tickets data
        setTickets([
          {
            id: 'TKT-2024-001',
            subject: 'Delivery delay - urgent',
            category: 'delivery',
            priority: 'urgent',
            status: 'open',
            message: 'Customer reports delivery delay of 3 days. Order #ORD-2024-123 was supposed to be delivered on Jan 15th but still not received. Customer is very frustrated and needs immediate resolution.',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-16T09:00:00Z',
            user: {
              name: 'John Doe',
              email: 'john@example.com',
              phone: '+91 9876543210'
            },
            assignedTo: 'Support Team 1',
            responses: 2,
            attachments: 1,
            resolution: null
          },
          {
            id: 'TKT-2024-002',
            subject: 'Refund request for damaged product',
            category: 'billing',
            priority: 'high',
            status: 'in_progress',
            message: 'Customer received damaged sofa set from order #ORD-2024-456. The fabric is torn and the frame is broken. Customer is requesting full refund.',
            createdAt: '2024-01-10T14:20:00Z',
            updatedAt: '2024-01-12T16:30:00Z',
            user: {
              name: 'Jane Smith',
              email: 'jane@example.com',
              phone: '+91 8765432109'
            },
            assignedTo: 'Support Team 2',
            responses: 3,
            attachments: 2,
            resolution: null
          },
          {
            id: 'TKT-2024-003',
            subject: 'Account login issue',
            category: 'account',
            priority: 'medium',
            status: 'resolved',
            message: 'Unable to login to account since yesterday. Password reset email not being received. Tried multiple times.',
            createdAt: '2024-01-12T08:15:00Z',
            updatedAt: '2024-01-13T10:00:00Z',
            user: {
              name: 'Mike Johnson',
              email: 'mike@example.com',
              phone: '+91 7654321098'
            },
            assignedTo: 'Support Team 1',
            responses: 4,
            attachments: 0,
            resolution: 'Password reset link was sent manually. User confirmed login successful.'
          },
          {
            id: 'TKT-2024-004',
            subject: 'Payment gateway error',
            category: 'billing',
            priority: 'high',
            status: 'in_progress',
            message: 'Payment was deducted from card but order not confirmed. Amount: ₹4999. Transaction ID: TXN-2024-789.',
            createdAt: '2024-01-16T11:45:00Z',
            updatedAt: '2024-01-16T14:20:00Z',
            user: {
              name: 'Sarah Wilson',
              email: 'sarah@example.com',
              phone: '+91 6543210987'
            },
            assignedTo: 'Support Team 3',
            responses: 1,
            attachments: 1,
            resolution: null
          },
          {
            id: 'TKT-2024-005',
            subject: 'Product out of stock',
            category: 'product',
            priority: 'low',
            status: 'open',
            message: 'Product showing available on website but when ordering shows out of stock. Product: Queen Size Bed.',
            createdAt: '2024-01-17T09:30:00Z',
            updatedAt: '2024-01-17T10:00:00Z',
            user: {
              name: 'David Brown',
              email: 'david@example.com',
              phone: '+91 5432109876'
            },
            assignedTo: 'Support Team 2',
            responses: 0,
            attachments: 1,
            resolution: null
          }
        ]);

        // Maintenance requests
        setMaintenanceRequests([
          {
            id: 'MR-2024-001',
            product: 'Queen Size Bed',
            user: 'John Doe',
            issueType: 'breakdown',
            priority: 'urgent',
            status: 'in_progress',
            description: 'Bed frame is broken. The wooden slats have cracked and the bed is unstable. Customer is unable to sleep on it.',
            createdAt: '2024-01-14T08:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
            assignedTo: 'Technician 1',
            images: ['image1.jpg', 'image2.jpg'],
            resolution: null,
            scheduledDate: '2024-01-16'
          },
          {
            id: 'MR-2024-002',
            product: 'Refrigerator',
            user: 'Jane Smith',
            issueType: 'maintenance',
            priority: 'high',
            status: 'pending',
            description: 'Fridge not cooling properly. Temperature is around 15°C instead of 4°C. Food is spoiling.',
            createdAt: '2024-01-15T14:30:00Z',
            updatedAt: '2024-01-15T14:30:00Z',
            assignedTo: 'Unassigned',
            images: ['image1.jpg'],
            resolution: null,
            scheduledDate: null
          },
          {
            id: 'MR-2024-003',
            product: 'Washing Machine',
            user: 'Mike Johnson',
            issueType: 'damage',
            priority: 'medium',
            status: 'completed',
            description: 'Door handle broken. The handle came off while opening the door.',
            createdAt: '2024-01-12T10:00:00Z',
            updatedAt: '2024-01-13T16:00:00Z',
            assignedTo: 'Technician 2',
            images: [],
            resolution: 'Handle replaced with new part. Machine is working fine now.',
            scheduledDate: '2024-01-13'
          },
          {
            id: 'MR-2024-004',
            product: 'Sofa Set',
            user: 'Sarah Wilson',
            issueType: 'installation',
            priority: 'low',
            status: 'pending',
            description: 'Sofa legs not properly installed. One leg is loose and sofa is unstable.',
            createdAt: '2024-01-16T09:00:00Z',
            updatedAt: '2024-01-16T09:00:00Z',
            assignedTo: 'Unassigned',
            images: ['image1.jpg'],
            resolution: null,
            scheduledDate: null
          }
        ]);

        // Team members
        setTeamMembers([
          {
            id: '1',
            name: 'Alex Kumar',
            role: 'Support Lead',
            email: 'alex@rentease.com',
            phone: '+91 9876543210',
            status: 'online',
            ticketsAssigned: 8,
            ticketsResolved: 45,
            rating: 4.8,
            avatar: 'https://ui-avatars.com/api/?name=Alex+Kumar&background=2563eb&color=fff',
            online: true,
            joinedDate: '2023-06-01'
          },
          {
            id: '2',
            name: 'Priya Patel',
            role: 'Support Specialist',
            email: 'priya@rentease.com',
            phone: '+91 8765432109',
            status: 'busy',
            ticketsAssigned: 5,
            ticketsResolved: 32,
            rating: 4.6,
            avatar: 'https://ui-avatars.com/api/?name=Priya+Patel&background=7c3aed&color=fff',
            online: true,
            joinedDate: '2023-08-15'
          },
          {
            id: '3',
            name: 'Rahul Sharma',
            role: 'Support Specialist',
            email: 'rahul@rentease.com',
            phone: '+91 7654321098',
            status: 'offline',
            ticketsAssigned: 3,
            ticketsResolved: 28,
            rating: 4.5,
            avatar: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=059669&color=fff',
            online: false,
            joinedDate: '2023-09-01'
          },
          {
            id: '4',
            name: 'Sneha Reddy',
            role: 'Technical Support',
            email: 'sneha@rentease.com',
            phone: '+91 6543210987',
            status: 'online',
            ticketsAssigned: 6,
            ticketsResolved: 38,
            rating: 4.7,
            avatar: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=dc2626&color=fff',
            online: true,
            joinedDate: '2023-07-20'
          },
          {
            id: '5',
            name: 'Vikram Singh',
            role: 'Support Associate',
            email: 'vikram@rentease.com',
            phone: '+91 5432109876',
            status: 'away',
            ticketsAssigned: 2,
            ticketsResolved: 15,
            rating: 4.2,
            avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=f59e0b&color=fff',
            online: false,
            joinedDate: '2023-10-01'
          }
        ]);

        setStats({
          totalTickets: 12,
          openTickets: 3,
          inProgressTickets: 2,
          resolvedTickets: 7,
          totalMaintenance: 8,
          pendingMaintenance: 3,
          inProgressMaintenance: 2,
          completedMaintenance: 3,
          averageResponseTime: '2.5h',
          customerSatisfaction: 4.6,
          supportTeamSize: 5,
          ticketsResolvedToday: 12,
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      open: { color: 'bg-yellow-100 text-yellow-800', icon: <FaClock />, label: 'Open' },
      in_progress: { color: 'bg-blue-100 text-blue-800', icon: <FaSpinner />, label: 'In Progress' },
      resolved: { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle />, label: 'Resolved' },
      closed: { color: 'bg-gray-100 text-gray-800', icon: <FaTimes />, label: 'Closed' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <FaClock />, label: 'Pending' },
      completed: { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle />, label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: <FaTimes />, label: 'Cancelled' }
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

  // Get category badge
  const getCategoryBadge = (category) => {
    const badges = {
      delivery: 'bg-indigo-100 text-indigo-800',
      billing: 'bg-purple-100 text-purple-800',
      account: 'bg-pink-100 text-pink-800',
      product: 'bg-teal-100 text-teal-800',
      general: 'bg-gray-100 text-gray-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return badges[category] || badges.general;
  };

  // Get issue type icon
  const getIssueIcon = (type) => {
    const icons = {
      damage: '🔧',
      breakdown: '⚡',
      maintenance: '🛠️',
      installation: '🔨',
      cleaning: '🧹',
      replacement: '🔄',
      other: '📝'
    };
    return icons[type] || '📝';
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

  // Format relative time
  const formatRelativeTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Handle ticket update
  const handleUpdateTicket = async (ticketId, updates) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId ? { ...ticket, ...updates, updatedAt: new Date().toISOString() } : ticket
      ));
      toast.success('Ticket updated successfully!');
    } catch (error) {
      toast.error('Failed to update ticket');
    }
  };

  // Handle reply to ticket
  const handleReplySubmit = async (ticketId) => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTickets(prev => prev.map(ticket => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            responses: (ticket.responses || 0) + 1,
            updatedAt: new Date().toISOString()
          };
        }
        return ticket;
      }));
      toast.success('Reply sent successfully!');
      setReplyMessage('');
      setShowTicketModal(false);
    } catch (error) {
      toast.error('Failed to send reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle ticket deletion
  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
      toast.success('Ticket deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete ticket');
    }
  };

  // Handle maintenance update
  const handleUpdateMaintenance = async (id, updates) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMaintenanceRequests(prev => prev.map(request => 
        request.id === id ? { ...request, ...updates, updatedAt: new Date().toISOString() } : request
      ));
      toast.success('Maintenance request updated!');
    } catch (error) {
      toast.error('Failed to update maintenance request');
    }
  };

  // Handle assign technician
  const handleAssignTechnician = async (id, technician) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMaintenanceRequests(prev => prev.map(request => 
        request.id === id ? { ...request, assignedTo: technician, status: 'in_progress' } : request
      ));
      toast.success(`Assigned to ${technician}`);
    } catch (error) {
      toast.error('Failed to assign technician');
    }
  };

  // Handle team member add
  const handleAddTeamMember = async (e) => {
    e.preventDefault();
    if (!teamFormData.name || !teamFormData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newMember = {
        id: `${teamMembers.length + 1}`,
        ...teamFormData,
        ticketsAssigned: 0,
        ticketsResolved: 0,
        rating: 0,
        avatar: `https://ui-avatars.com/api/?name=${teamFormData.name.replace(' ', '+')}&background=2563eb&color=fff`,
        online: teamFormData.status === 'online',
        joinedDate: new Date().toISOString()
      };
      setTeamMembers(prev => [...prev, newMember]);
      setStats(prev => ({
        ...prev,
        supportTeamSize: prev.supportTeamSize + 1
      }));
      toast.success('Team member added successfully!');
      setShowTeamModal(false);
      setTeamFormData({
        name: '',
        email: '',
        phone: '',
        role: 'Support Specialist',
        status: 'online'
      });
    } catch (error) {
      toast.error('Failed to add team member');
    }
  };

  // Get filtered tickets
  const getFilteredTickets = () => {
    let filtered = [...tickets];
    
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === filterStatus);
    }
    
    if (filterPriority !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === filterPriority);
    }
    
    return filtered;
  };

  // Get filtered maintenance
  const getFilteredMaintenance = () => {
    let filtered = [...maintenanceRequests];
    
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.user.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(request => request.status === filterStatus);
    }
    
    if (filterPriority !== 'all') {
      filtered = filtered.filter(request => request.priority === filterPriority);
    }
    
    return filtered;
  };

  // Render stats cards
  const renderStatsCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Tickets</p>
            <p className="text-2xl font-bold">{stats.totalTickets}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <FaTicketAlt className="text-blue-600 text-xl" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="text-green-600">↑ 12%</span>
          <span className="text-gray-400">vs last week</span>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Open Tickets</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.openTickets}</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <FaClock className="text-yellow-600 text-xl" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="text-red-600">↑ 5%</span>
          <span className="text-gray-400">vs last week</span>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Resolved Today</p>
            <p className="text-2xl font-bold text-green-600">{stats.ticketsResolvedToday}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <FaCheckCircle className="text-green-600 text-xl" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="text-green-600">↑ 8%</span>
          <span className="text-gray-400">vs yesterday</span>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Satisfaction</p>
            <p className="text-2xl font-bold text-purple-600">{stats.customerSatisfaction}★</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <FaStar className="text-purple-600 text-xl" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="text-green-600">↑ 0.2</span>
          <span className="text-gray-400">vs last month</span>
        </div>
      </div>
    </div>
  );

  // Render tickets table
  const renderTicketsTable = () => {
    const filteredTickets = getFilteredTickets();

    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold">Recent Tickets</h3>
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <button className="text-gray-400 hover:text-gray-600">
              <FaDownload />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTickets.map((ticket) => {
                const status = getStatusBadge(ticket.status);
                return (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-sm">{ticket.id}</p>
                        <p className="text-sm text-gray-600 truncate max-w-[150px]">{ticket.subject}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{ticket.user.name}</p>
                        <p className="text-xs text-gray-500">{ticket.user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.icon}
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{ticket.assignedTo || 'Unassigned'}</td>
                    <td className="px-4 py-3 text-sm">{formatRelativeTime(ticket.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setShowTicketModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="View"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => handleUpdateTicket(ticket.id, { status: ticket.status === 'open' ? 'in_progress' : 'resolved' })}
                          className="text-green-600 hover:text-green-800"
                          title="Update Status"
                        >
                          <FaCheck size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTicket(ticket.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredTickets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No tickets found matching the filters
          </div>
        )}
      </div>
    );
  };

  // Render maintenance table
  const renderMaintenanceTable = () => {
    const filteredRequests = getFilteredMaintenance();

    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold">Maintenance Requests</h3>
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRequests.map((request) => {
                const status = getStatusBadge(request.status);
                return (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium">{request.id}</td>
                    <td className="px-4 py-3 text-sm">{request.product}</td>
                    <td className="px-4 py-3 text-sm">{request.user}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="flex items-center gap-1">
                        {getIssueIcon(request.issueType)}
                        {request.issueType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(request.priority)}`}>
                        {request.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.icon}
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{request.assignedTo || 'Unassigned'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowMaintenanceModal(true)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View"
                        >
                          <FaEye size={16} />
                        </button>
                        <select
                          onChange={(e) => handleAssignTechnician(request.id, e.target.value)}
                          className="text-xs border rounded px-1 py-0.5"
                          value={request.assignedTo}
                        >
                          <option value="Unassigned">Assign</option>
                          <option value="Technician 1">Tech 1</option>
                          <option value="Technician 2">Tech 2</option>
                          <option value="Technician 3">Tech 3</option>
                        </select>
                        <button
                          onClick={() => handleUpdateMaintenance(request.id, { status: 'completed' })}
                          className="text-green-600 hover:text-green-800"
                          title="Complete"
                        >
                          <FaCheck size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredRequests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No maintenance requests found
          </div>
        )}
      </div>
    );
  };

  //