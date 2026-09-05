// ============================================================
// ProductManagement.jsx
// Admin Panel - Product Management Dashboard
//
// Features:
// - Display all products
// - Search, Filter & Sort products
// - Pagination
// - Create/Edit/Delete products
// - Bulk Delete
// - Product Statistics
// - Responsive Sidebar Navigation
// ============================================================

// ----------------------------
// React Imports
// ----------------------------
import React, { useState, useEffect } from 'react';

// ----------------------------
// Redux Imports
// ----------------------------
import { useDispatch, useSelector } from 'react-redux';

// ----------------------------
// React Router Imports
// ----------------------------
import { NavLink, useLocation } from 'react-router-dom';

// ----------------------------
// Redux Actions
// ----------------------------
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProductStats,
    clearError
} from '../../store/slices/productSlice';

// ----------------------------
// Third Party Libraries
// ----------------------------
import { toast } from 'react-hot-toast';

import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaEye,
    FaSearch,
    FaHome,
    FaBox,
    FaShoppingCart,
    FaUsers,
    FaCog,
    FaBars,
    FaTh,
    FaList,
    FaChevronLeft,
    FaChevronRight,
    FaUser,
    FaSignOutAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaClock
} from 'react-icons/fa';

// ----------------------------
// Custom Components
// ----------------------------
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import ProductForm from './ProductForm';

const AdminDashboard = () => {

    // ============================================================
    // Redux Hooks
    // ============================================================

    const dispatch = useDispatch();
    const location = useLocation();

    // Get Product State from Redux Store
    const {
        products,
        loading,
        error,
        total,
        totalPages,
        currentPage,
        stats
    } = useSelector((state) => state.products);

    // Get User State from Redux Store
    const { user } = useSelector((state) => state.auth);

    // ============================================================
    // Local Component State
    // ============================================================

    // Search, Filter & Pagination
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: '',
        category: 'all',
        status: 'all',
        sort: 'newest'
    });

    // Selected Products for Bulk Actions
    const [selectedProducts, setSelectedProducts] = useState([]);

    // Create/Edit Modal
    const [showModal, setShowModal] = useState(false);

    // Product being edited
    const [editingProduct, setEditingProduct] = useState(null);

    // Grid/List View
    const [viewMode, setViewMode] = useState('grid');

    // Sidebar Toggle
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // ============================================================
    // Fetch Products whenever filters change
    // ============================================================

    useEffect(() => {

        dispatch(fetchProducts(filters));
        dispatch(fetchProductStats());

    }, [dispatch, filters]);

    // ============================================================
    // Display API Errors
    // ============================================================

    useEffect(() => {

        if (error) {
            toast.error(error);
            dispatch(clearError());
        }

    }, [error, dispatch]);

    // ============================================================
    // Filter Handlers
    // ============================================================

    /**
     * Update any filter and reset pagination
     */
    const handleFilterChange = (key, value) => {

        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1
        }));

    };

    /**
     * Pagination Handler
     */
    const handlePageChange = (page) => {

        setFilters(prev => ({
            ...prev,
            page
        }));

    };

    /**
     * Search Product
     */
    const handleSearch = (e) => {

        e.preventDefault();

        const searchTerm = e.target.search.value;

        handleFilterChange('search', searchTerm);

    };

    // ============================================================
    // Create / Edit Product
    // ============================================================

    /**
     * Open Modal in Create Mode
     */
    const handleCreateProduct = () => {

        setEditingProduct(null);
        setShowModal(true);

    };

    /**
     * Open Modal in Edit Mode
     */
    const handleEditProduct = (product) => {

        setEditingProduct(product);
        setShowModal(true);

    };

    /**
     * Save Product
     *
     * Creates a new product if editingProduct is null.
     * Otherwise updates the existing product.
     */
    const handleFormSubmit = async (formData) => {

        try {

            if (editingProduct) {

                await dispatch(updateProduct({
                    id: editingProduct._id,
                    productData: formData
                })).unwrap();

                toast.success('Product updated successfully');

            } else {

                await dispatch(createProduct(formData)).unwrap();

                toast.success('Product created successfully');

            }

            setShowModal(false);

            dispatch(fetchProducts(filters));
            dispatch(fetchProductStats());

        } catch (error) {

            toast.error(error || 'Failed to save product');

        }

    };

    // ============================================================
    // Delete Product
    // ============================================================

    /**
     * Delete Single Product
     */
    const handleDeleteProduct = async (id) => {

        if (!window.confirm('Are you sure you want to delete this product?'))
            return;

        try {

            await dispatch(deleteProduct(id)).unwrap();

            toast.success('Product deleted successfully');

            dispatch(fetchProducts(filters));

        } catch (error) {

            toast.error(error || 'Failed to delete product');

        }

    };

    // ============================================================
    // Bulk Actions
    // ============================================================

    /**
     * Bulk Delete Selected Products
     */
    const handleBulkAction = async (action) => {

        if (selectedProducts.length === 0) {

            toast.error('Please select products');

            return;
        }

        if (action === 'delete') {

            if (!window.confirm(`Delete ${selectedProducts.length} products?`))
                return;

            try {

                await Promise.all(

                    selectedProducts.map(id =>
                        dispatch(deleteProduct(id)).unwrap()
                    )

                );

                toast.success(`${selectedProducts.length} products deleted`);

                setSelectedProducts([]);

                dispatch(fetchProducts(filters));

            } catch {

                toast.error('Bulk delete failed');

            }

        }

    };

    // ============================================================
    // Checkbox Selection
    // ============================================================

    /**
     * Toggle Single Product Selection
     */
    const toggleSelectProduct = (id) => {

        setSelectedProducts(prev =>

            prev.includes(id)
                ? prev.filter(productId => productId !== id)
                : [...prev, id]

        );

    };

    /**
     * Select/Deselect All Products
     */
    const toggleSelectAll = () => {

        if (selectedProducts.length === products.length) {

            setSelectedProducts([]);

        } else {

            setSelectedProducts(

                products.map(product => product._id)

            );

        }

    };

    // ============================================================
    // Utility Functions
    // ============================================================

    /**
     * Convert number into INR Currency
     */
    const formatCurrency = (amount) => {

        return new Intl.NumberFormat('en-IN', {

            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0

        }).format(amount);

    };

    /**
     * Return Tailwind Badge Class
     * based on Product Status
     */
    const getStatusBadge = (status) => {

        const statusMap = {

            available: 'badge-success',
            unavailable: 'badge-danger',
            maintenance: 'badge-warning',
            reserved: 'badge-info'

        };

        return statusMap[status] || 'badge-secondary';

    };

    /**
     * Get status icon
     */
    const getStatusIcon = (status) => {
        switch(status) {
            case 'available':
                return <FaCheckCircle className="text-green-500" />;
            case 'unavailable':
                return <FaTimesCircle className="text-red-500" />;
            case 'maintenance':
                return <FaClock className="text-yellow-500" />;
            default:
                return null;
        }
    };

    // ============================================================
    // Sidebar Navigation
    // ============================================================

    /**
     * Sidebar Menu Configuration
     */
    const navItems = [

        {
            path: '/admin/dashboard',
            label: 'Dashboard',
            icon: FaHome
        },

        {
            path: '/admin/products',
            label: 'Products',
            icon: FaBox
        },

        {
            path: '/admin/orders',
            label: 'Orders',
            icon: FaShoppingCart
        },

        {
            path: '/admin/users',
            label: 'Users',
            icon: FaUsers
        },

        {
            path: '/admin/settings',
            label: 'Settings',
            icon: FaCog
        }

    ];

    // ============================================================
    // Loading Screen
    // ============================================================

    if (loading && products.length === 0) {
        return <LoadingSpinner fullScreen />;
    }

    // ============================================================
    // Main UI
    // ============================================================

    return (
  <div className="flex h-screen bg-gray-100 overflow-hidden">

    {/* =======================================================
        SIDEBAR
        Contains:
        - Logo
        - Navigation Menu
        - User Profile
    ======================================================== */}
    <aside
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-gray-900 text-white flex flex-col transition-all duration-300`}
    >

      {/* Brand Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>
          Admin Panel
        </h1>

        {/* Sidebar Toggle Button */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <FaBars />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 py-4">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-4 py-3 my-1 rounded-lg transition-colors
              ${isActive 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }
            `}
          >
            <item.icon className={`${!sidebarOpen ? 'mx-auto' : 'mr-3'} text-lg`} />
            <span className={`${!sidebarOpen && 'hidden'}`}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Logged-in User Information */}
      <div className="border-t border-gray-700 p-4">
        <div className={`flex items-center ${!sidebarOpen && 'justify-center'}`}>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <FaUser />
          </div>
          <div className={`ml-3 ${!sidebarOpen && 'hidden'}`}>
            <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-400">{user?.email || 'admin@example.com'}</p>
          </div>
        </div>
        {sidebarOpen && (
          <button className="w-full mt-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors flex items-center">
            <FaSignOutAlt className="mr-2" />
            Sign Out
          </button>
        )}
      </div>

    </aside>

    {/* =======================================================
        MAIN CONTENT
    ======================================================== */}
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* Top Header */}
      <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">
          {location.pathname === '/admin/products' ? 'Product Management' : 'Dashboard'}
        </h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleCreateProduct}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" />
            Add Product
          </button>
        </div>
      </header>

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* ==============================================
            PAGE HEADER
        ============================================== */}
        <section className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
            <p className="text-gray-600 mt-1">Manage your product inventory</p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              <FaTh />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              <FaList />
            </button>
          </div>
        </section>

        {/* ==============================================
            DASHBOARD STATISTICS
            - Total Products
            - Available Products
            - Featured Products
            - Average Price
        ============================================== */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{stats?.totalProducts || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaBox className="text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-xs text-gray-500">+12% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold">{stats?.availableProducts || 0}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaCheckCircle className="text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-xs text-gray-500">{Math.round((stats?.availableProducts / stats?.totalProducts) * 100) || 0}% of total</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Featured</p>
                <p className="text-2xl font-bold">{stats?.featuredProducts || 0}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaStar className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Price</p>
                <p className="text-2xl font-bold">{formatCurrency(stats?.averagePrice || 0)}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaRupeeSign className="text-yellow-600" />
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================
            SEARCH, FILTER & SORT
        ============================================== */}
        <section className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-wrap gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Search products..."
                  defaultValue={filters.search}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </form>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="home">Home & Living</option>
            </select>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
              <option value="maintenance">Maintenance</option>
              <option value="reserved">Reserved</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </section>

        {/* ==============================================
            BULK ACTION TOOLBAR
        ============================================== */}
        <section className="flex items-center justify-between bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {selectedProducts.length} selected
            </span>
            {selectedProducts.length > 0 && (
              <>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedProducts([])}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Clear Selection
                </button>
              </>
            )}
          </div>
          <div className="text-sm text-gray-600">
            Showing {products.length} of {total} products
          </div>
        </section>

        {/* ==============================================
            PRODUCTS TABLE
        ============================================== */}
        <section className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === products.length && products.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <FaBox className="text-4xl text-gray-300 mb-2" />
                        <p>No products found</p>
                        <button
                          onClick={handleCreateProduct}
                          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add your first product
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product._id)}
                          onChange={() => toggleSelectProduct(product._id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={product.image || 'https://via.placeholder.com/50'}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.brand || 'No brand'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.category || 'Uncategorized'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 inline-flex items-center text-xs font-semibold rounded-full ${getStatusBadge(product.status)}`}>
                          {getStatusIcon(product.status)}
                          <span className="ml-1">{product.status || 'Unknown'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <FaTrash />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800 transition-colors">
                            <FaEye />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ==============================================
            PAGINATION
        ============================================== */}
        {totalPages > 1 && (
          <section className="flex items-center justify-between bg-white rounded-lg shadow px-6 py-3">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FaChevronLeft />
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FaChevronRight />
              </button>
            </div>
          </section>
        )}

      </div>

    </div>

    {/* =======================================================
        CREATE / EDIT PRODUCT MODAL
    ======================================================== */}
    {showModal && (
      <Modal onClose={() => setShowModal(false)}>
        <ProductForm
          initialData={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    )}

  </div>
);
};

export default AdminDashboard;