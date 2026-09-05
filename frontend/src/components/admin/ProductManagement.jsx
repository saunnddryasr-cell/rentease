import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchProducts, createProduct, updateProduct, deleteProduct,
  fetchProductStats, clearError 
} from '../../store/slices/productSlice';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import ProductForm from './ProductForm';

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error, total, totalPages, currentPage, stats } = useSelector(
    (state) => state.products
  );
  
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    category: 'all',
    status: 'all',
    sort: 'newest',
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts(filters));
    dispatch(fetchProductStats());
  }, [dispatch, filters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // ---------- Handlers (all same as before) ----------
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = e.target.search.value;
    handleFilterChange('search', searchTerm);
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        toast.success('Product deleted successfully');
        dispatch(fetchProducts(filters));
      } catch (error) {
        toast.error(error || 'Failed to delete product');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await dispatch(updateProduct({ id: editingProduct._id, productData: formData })).unwrap();
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

  const handleBulkAction = async (action) => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products to perform action');
      return;
    }
    if (action === 'delete') {
      if (!window.confirm(`Delete ${selectedProducts.length} products?`)) return;
      try {
        await Promise.all(selectedProducts.map(id => dispatch(deleteProduct(id)).unwrap()));
        toast.success(`${selectedProducts.length} products deleted`);
        setSelectedProducts([]);
        dispatch(fetchProducts(filters));
      } catch (error) {
        toast.error('Failed to delete products');
      }
    }
  };

  const toggleSelectProduct = (id) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p._id));
    }
  };

  // ---------- Helpers ----------
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      available: 'badge-success',
      unavailable: 'badge-danger',
      maintenance: 'badge-warning',
      reserved: 'badge-info',
    };
    return statusMap[status] || 'badge-secondary';
  };

  if (loading && products.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Add button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-500 mt-1">{total} products total</p>
        </div>
        <button onClick={handleCreateProduct} className="btn-primary flex items-center space-x-2">
          <FaPlus /><span>Add Product</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-100">
            <p className="text-sm text-green-600">Available</p>
            <p className="text-2xl font-bold text-green-700">{stats.available}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow-sm border border-yellow-100">
            <p className="text-sm text-yellow-600">Featured</p>
            <p className="text-2xl font-bold text-yellow-700">{stats.featured}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-100">
            <p className="text-sm text-blue-600">Avg Price</p>
            <p className="text-2xl font-bold text-blue-700">{formatCurrency(stats.averagePrice)}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex items-center space-x-2">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="search"
                type="text"
                placeholder="Search products..."
                defaultValue={filters.search}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button type="submit" className="btn-primary px-4 py-2">Search</button>
          </form>

          <div className="flex items-center space-x-3">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Categories</option>
              <option value="furniture">Furniture</option>
              <option value="appliance">Appliances</option>
              <option value="electronics">Electronics</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
              <option value="maintenance">Maintenance</option>
              <option value="reserved">Reserved</option>
            </select>

            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_high">Price: High to Low</option>
              <option value="price_low">Price: Low to High</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-primary-50 p-3 rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium">{selectedProducts.length} products selected</span>
          <div className="flex items-center space-x-2">
            <button onClick={() => handleBulkAction('delete')} className="btn-danger text-sm px-3 py-1">
              Delete Selected
            </button>
            <button onClick={() => setSelectedProducts([])} className="text-gray-500 hover:text-gray-700 text-sm">
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr><td colSpan="8" className="px-4 py-8 text-center text-gray-500">No products found</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => toggleSelectProduct(product._id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <img src={product.images?.[0] || '/placeholder-image.jpg'} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">{product.description?.slice(0, 50)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm capitalize">{product.category}</td>
                    <td className="px-4 py-3 text-sm font-medium">{formatCurrency(product.monthlyRent)}</td>
                    <td className="px-4 py-3 text-sm">{product.availableQuantity}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${getStatusBadge(product.status)}`}>{product.status}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center space-x-1">
                        <span>⭐</span>
                        <span>{product.rating || 0}</span>
                        <span className="text-gray-400 text-xs">({product.totalRatings || 0})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleEditProduct(product)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Edit"><FaEdit /></button>
                        <button onClick={() => handleDeleteProduct(product._id)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete"><FaTrash /></button>
                        <button onClick={() => window.open(`/products/${product._id}`, '_blank')} className="p-1 text-gray-600 hover:bg-gray-100 rounded" title="View"><FaEye /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * filters.limit + 1} to {Math.min(currentPage * filters.limit, total)} of {total} results
            </p>
            <div className="flex items-center space-x-2">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm">Previous</button>
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-1 rounded-lg text-sm ${page === currentPage ? 'bg-primary-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}>
                    {page}
                  </button>
                );
              })}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingProduct ? 'Edit Product' : 'Add New Product'} size="lg">
        <ProductForm product={editingProduct} onSubmit={handleFormSubmit} onCancel={() => setShowModal(false)} />
      </Modal>
    </div>
  );
};

export default ProductManagement;