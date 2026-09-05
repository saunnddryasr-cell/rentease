// src/components/admin/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import { FaUpload, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'furniture',
    subCategory: 'bed',
    monthlyRent: '',
    securityDeposit: '',
    availableQuantity: 1,
    status: 'available',
    isFeatured: false,
    images: [],
    specifications: {
      brand: '',
      model: '',
      dimensions: '',
      weight: '',
      color: '',
      material: '',
      power: '',
      features: [],
    },
    rentalTenureOptions: [
      { tenure: 1, unit: 'months', discount: 0 },
      { tenure: 3, unit: 'months', discount: 5 },
      { tenure: 6, unit: 'months', discount: 10 },
      { tenure: 12, unit: 'months', discount: 15 },
    ],
    deliveryCharge: 0,
    pickupCharge: 0,
  });

  const [loading, setLoading] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  // Categories and sub-categories mapping
  const categories = {
    furniture: {
      label: 'Furniture',
      subCategories: ['bed', 'sofa', 'table', 'chair', 'wardrobe', 'dining_set', 'bookshelf', 'desk', 'cabinet']
    },
    appliance: {
      label: 'Appliances',
      subCategories: ['fridge', 'washing_machine', 'tv', 'ac', 'microwave', 'dishwasher', 'water_heater', 'oven', 'stove']
    },
    electronics: {
      label: 'Electronics',
      subCategories: ['laptop', 'monitor', 'speaker', 'printer', 'projector']
    }
  };

  // Load product data when editing
  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        monthlyRent: product.monthlyRent || '',
        securityDeposit: product.securityDeposit || '',
        availableQuantity: product.availableQuantity || 1,
        specifications: {
          brand: product.specifications?.brand || '',
          model: product.specifications?.model || '',
          dimensions: product.specifications?.dimensions || '',
          weight: product.specifications?.weight || '',
          color: product.specifications?.color || '',
          material: product.specifications?.material || '',
          power: product.specifications?.power || '',
          features: product.specifications?.features || [],
        },
        rentalTenureOptions: product.rentalTenureOptions || [
          { tenure: 1, unit: 'months', discount: 0 },
          { tenure: 3, unit: 'months', discount: 5 },
          { tenure: 6, unit: 'months', discount: 10 },
          { tenure: 12, unit: 'months', discount: 15 },
        ],
        deliveryCharge: product.deliveryCharge || 0,
        pickupCharge: product.pickupCharge || 0,
      });
    }
  }, [product]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle specification changes
  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value,
      },
    }));
  };

  // Handle feature additions
  const handleFeatureAdd = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          features: [...prev.specifications.features, featureInput.trim()],
        },
      }));
      setFeatureInput('');
    }
  };

  const handleFeatureKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleFeatureAdd();
    }
  };

  const handleFeatureRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        features: prev.specifications.features.filter((_, i) => i !== index),
      },
    }));
  };

  // Handle image additions
  const handleImageAdd = () => {
    if (imageInput.trim()) {
      // Support comma-separated URLs
      const urls = imageInput.split(',').map(url => url.trim()).filter(url => url);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
      setImageInput('');
    }
  };

  const handleImageKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleImageAdd();
    }
  };

  const handleImageRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handle tenure changes
  const handleTenureChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      rentalTenureOptions: prev.rentalTenureOptions.map((option, i) =>
        i === index ? { ...option, [field]: value } : option
      ),
    }));
  };

  const handleAddTenure = () => {
    setFormData(prev => ({
      ...prev,
      rentalTenureOptions: [
        ...prev.rentalTenureOptions,
        { tenure: 1, unit: 'months', discount: 0 }
      ],
    }));
  };

  const handleRemoveTenure = (index) => {
    if (formData.rentalTenureOptions.length <= 1) {
      toast.error('At least one tenure option is required');
      return;
    }
    setFormData(prev => ({
      ...prev,
      rentalTenureOptions: prev.rentalTenureOptions.filter((_, i) => i !== index),
    }));
  };

  // Validate and submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Product description is required');
      return;
    }
    if (!formData.monthlyRent || formData.monthlyRent <= 0) {
      toast.error('Valid monthly rent is required');
      return;
    }
    if (!formData.securityDeposit || formData.securityDeposit < 0) {
      toast.error('Valid security deposit is required');
      return;
    }
    if (formData.availableQuantity < 0) {
      toast.error('Available quantity cannot be negative');
      return;
    }
    if (formData.images.length === 0) {
      toast.error('At least one product image is required');
      return;
    }

    // Validate tenure options
    for (const option of formData.rentalTenureOptions) {
      if (!option.tenure || option.tenure <= 0) {
        toast.error('Invalid tenure value');
        return;
      }
      if (option.discount < 0 || option.discount > 100) {
        toast.error('Discount must be between 0 and 100');
        return;
      }
    }

    setLoading(true);
    try {
      // Convert string numbers to actual numbers
      const submitData = {
        ...formData,
        monthlyRent: Number(formData.monthlyRent),
        securityDeposit: Number(formData.securityDeposit),
        availableQuantity: Number(formData.availableQuantity),
        deliveryCharge: Number(formData.deliveryCharge || 0),
        pickupCharge: Number(formData.pickupCharge || 0),
        rentalTenureOptions: formData.rentalTenureOptions.map(opt => ({
          ...opt,
          tenure: Number(opt.tenure),
          discount: Number(opt.discount || 0)
        }))
      };

      await onSubmit(submitData);
    } catch (error) {
      // Error handled in parent
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format sub-category label
  const formatSubCategoryLabel = (sub) => {
    return sub.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
      {/* ============================================ */}
      {/* BASIC INFORMATION */}
      {/* ============================================ */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={(e) => {
                handleChange(e);
                // Reset sub-category when category changes
                setFormData(prev => ({
                  ...prev,
                  subCategory: categories[e.target.value]?.subCategories[0] || ''
                }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            >
              {Object.entries(categories).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub-Category *
            </label>
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            >
              {categories[formData.category]?.subCategories.map(sub => (
                <option key={sub} value={sub}>
                  {formatSubCategoryLabel(sub)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
              <option value="maintenance">Maintenance</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* DESCRIPTION */}
      {/* ============================================ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Describe your product in detail..."
          required
        />
      </div>

      {/* ============================================ */}
      {/* PRICING */}
      {/* ============================================ */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Rent (₹) *
            </label>
            <input
              type="number"
              name="monthlyRent"
              value={formData.monthlyRent}
              onChange={handleChange}
              min="0"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., 5000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Security Deposit (₹) *
            </label>
            <input
              type="number"
              name="securityDeposit"
              value={formData.securityDeposit}
              onChange={handleChange}
              min="0"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., 10000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Available Quantity *
            </label>
            <input
              type="number"
              name="availableQuantity"
              value={formData.availableQuantity}
              onChange={handleChange}
              min="0"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., 5"
              required
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Featured Product</span>
            </label>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* IMAGES */}
      {/* ============================================ */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            onKeyPress={handleImageKeyPress}
            placeholder="Enter image URL or comma-separated URLs"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={handleImageAdd}
            className="btn-primary px-4 py-2"
          >
            <FaUpload className="mr-2" />
            Add
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Supports JPG, PNG, WebP, and SVG images. Use comma to add multiple URLs.
        </p>
        
        {formData.images.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {formData.images.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Product ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleImageRemove(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
                <span className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* SPECIFICATIONS */}
      {/* ============================================ */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.specifications.brand}
              onChange={handleSpecChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Samsung"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
            <input
              type="text"
              name="model"
              value={formData.specifications.model}
              onChange={handleSpecChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Galaxy S23"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
            <input
              type="text"
              name="dimensions"
              value={formData.specifications.dimensions}
              onChange={handleSpecChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., 10 x 20 x 30 cm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
            <input
              type="text"
              name="weight"
              value={formData.specifications.weight}
              onChange={handleSpecChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., 2.5 kg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input
              type="text"
              name="color"
              value={formData.specifications.color}
              onChange={handleSpecChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Black, White"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
            <input
              type="text"
              name="material"
              value={formData.specifications.material}
              onChange={handleSpecChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Wood, Metal, Plastic"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Power / Energy</label>
            <input
              type="text"
              name="power"
              value={formData.specifications.power}
              onChange={handleSpecChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., 100W, 220V"
            />
          </div>
        </div>

        {/* Features */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyPress={handleFeatureKeyPress}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Add a feature (e.g., Bluetooth, Touchscreen)"
            />
            <button
              type="button"
              onClick={handleFeatureAdd}
              className="btn-primary px-4 py-2"
            >
              <FaPlus />
            </button>
          </div>
          
          {formData.specifications.features.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.specifications.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => handleFeatureRemove(index)}
                    className="ml-2 text-primary-400 hover:text-primary-600 transition-colors"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============================================ */}
      {/* RENTAL TENURE OPTIONS */}
      {/* ============================================ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Rental Plans</h3>
          <button
            type="button"
            onClick={handleAddTenure}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
          >
            <FaPlus className="w-3 h-3" />
            <span>Add Plan</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {formData.rentalTenureOptions.map((option, index) => (
            <div key={index} className="grid grid-cols-4 gap-3 items-end bg-gray-50 p-3 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tenure</label>
                <input
                  type="number"
                  value={option.tenure}
                  onChange={(e) => handleTenureChange(index, 'tenure', e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Unit</label>
                <select
                  value={option.unit}
                  onChange={(e) => handleTenureChange(index, 'unit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Discount %</label>
                <input
                  type="number"
                  value={option.discount}
                  onChange={(e) => handleTenureChange(index, 'discount', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => handleRemoveTenure(index)}
                  className="text-red-500 hover:text-red-700 transition-colors p-2"
                  title="Remove plan"
                >
                  <FaTrash />
                </button>
                {option.discount > 0 && (
                  <span className="text-xs text-green-600 font-medium ml-2">
                    Save {option.discount}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================ */}
      {/* DELIVERY & PICKUP */}
      {/* ============================================ */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery & Pickup</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Charge (₹)
            </label>
            <input
              type="number"
              name="deliveryCharge"
              value={formData.deliveryCharge}
              onChange={handleChange}
              min="0"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., 500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Charge (₹)
            </label>
            <input
              type="number"
              name="pickupCharge"
              value={formData.pickupCharge}
              onChange={handleChange}
              min="0"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., 300"
            />
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* FORM ACTIONS */}
      {/* ============================================ */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Saving...</span>
            </span>
          ) : (
            <span>{product ? 'Update Product' : 'Create Product'}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;