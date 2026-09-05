// src/components/products/CategoryFilter.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  FaFilter, 
  FaTimes, 
  FaChevronDown, 
  FaChevronUp,
  FaSearch,
  FaSlidersH,
  FaStar,
  FaTruck,
  FaTag,
  FaCheck,
  FaPlus,
  FaMinus
} from 'react-icons/fa';

const CategoryFilter = ({ 
  onFilterChange, 
  categories = [],
  subCategories = {},
  initialFilters = {},
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    subCategories: true,
    availability: true,
    rating: true,
    delivery: true
  });
  
  const [filters, setFilters] = useState({
    category: initialFilters.category || 'all',
    subCategory: initialFilters.subCategory || 'all',
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
    minRating: initialFilters.minRating || 0,
    availability: initialFilters.availability || 'all',
    deliveryType: initialFilters.deliveryType || 'all',
    sort: initialFilters.sort || 'newest'
  });

  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 50000,
    currentMin: initialFilters.minPrice || 0,
    currentMax: initialFilters.maxPrice || 50000
  });

  const [searchTerm, setSearchTerm] = useState('');
  const filterRef = useRef(null);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        if (isMobile) {
          setIsOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile]);

  // Update parent when filters change
  useEffect(() => {
    const filterData = {
      ...filters,
      minPrice: filters.minPrice || '',
      maxPrice: filters.maxPrice || ''
    };
    
    // Remove empty values
    Object.keys(filterData).forEach(key => {
      if (filterData[key] === '' || filterData[key] === 'all' || filterData[key] === 0) {
        delete filterData[key];
      }
    });
    
    onFilterChange(filterData);
  }, [filters, onFilterChange]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePriceChange = (type, value) => {
    const numValue = parseInt(value) || 0;
    setPriceRange(prev => ({
      ...prev,
      [type === 'min' ? 'currentMin' : 'currentMax']: numValue
    }));
    
    setFilters(prev => ({
      ...prev,
      [type === 'min' ? 'minPrice' : 'maxPrice']: numValue
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Could implement search functionality here
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      subCategory: 'all',
      minPrice: '',
      maxPrice: '',
      minRating: 0,
      availability: 'all',
      deliveryType: 'all',
      sort: 'newest'
    });
    setPriceRange({
      ...priceRange,
      currentMin: 0,
      currentMax: 50000
    });
    setSearchTerm('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.subCategory !== 'all') count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.minRating > 0) count++;
    if (filters.availability !== 'all') count++;
    if (filters.deliveryType !== 'all') count++;
    if (filters.sort !== 'newest') count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  // Render mobile filter button
  const renderMobileButton = () => (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="md:hidden btn-primary flex items-center space-x-2 w-full justify-center"
    >
      <FaFilter />
      <span>Filters</span>
      {activeFilterCount > 0 && (
        <span className="bg-white text-primary-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
          {activeFilterCount}
        </span>
      )}
    </button>
  );

  // Render filter section header
  const renderSectionHeader = (title, section, count = null) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between py-2 text-left font-medium text-gray-700 hover:text-gray-900 transition-colors"
    >
      <div className="flex items-center space-x-2">
        <span>{title}</span>
        {count !== null && (
          <span className="text-xs text-gray-400">({count})</span>
        )}
      </div>
      {expandedSections[section] ? <FaChevronUp /> : <FaChevronDown />}
    </button>
  );

  // Render category filter
  const renderCategoryFilter = () => (
    <div className="border-b border-gray-200 pb-4">
      {renderSectionHeader('Categories', 'categories')}
      {expandedSections.categories && (
        <div className="mt-2 space-y-2">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={handleSearch}
              className="input pl-10 text-sm"
            />
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="radio"
                name="category"
                value="all"
                checked={filters.category === 'all'}
                onChange={() => handleFilterChange('category', 'all')}
                className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm">All Categories</span>
            </label>
            {categories.map((category) => (
              <label
                key={category.value}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="category"
                  value={category.value}
                  checked={filters.category === category.value}
                  onChange={() => {
                    handleFilterChange('category', category.value);
                    handleFilterChange('subCategory', 'all');
                  }}
                  className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm capitalize">
                  {category.label}
                </span>
                <span className="text-xs text-gray-400 ml-auto">
                  {category.count || 0}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Render sub-category filter
  const renderSubCategoryFilter = () => {
    const currentSubCategories = subCategories[filters.category] || [];
    if (currentSubCategories.length === 0) return null;

    return (
      <div className="border-b border-gray-200 pb-4">
        {renderSectionHeader('Sub Categories', 'subCategories')}
        {expandedSections.subCategories && (
          <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
            <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="radio"
                name="subCategory"
                value="all"
                checked={filters.subCategory === 'all'}
                onChange={() => handleFilterChange('subCategory', 'all')}
                className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm">All Sub Categories</span>
            </label>
            {currentSubCategories.map((sub) => (
              <label
                key={sub}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="subCategory"
                  value={sub}
                  checked={filters.subCategory === sub}
                  onChange={() => handleFilterChange('subCategory', sub)}
                  className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm capitalize">
                  {sub.replace('_', ' ')}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render price filter
  const renderPriceFilter = () => (
    <div className="border-b border-gray-200 pb-4">
      {renderSectionHeader('Price Range', 'price')}
      {expandedSections.price && (
        <div className="mt-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">Min</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                <input
                  type="number"
                  value={filters.minPrice || ''}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="input pl-7 text-sm"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">Max</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                <input
                  type="number"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="input pl-7 text-sm"
                  placeholder="50000"
                  min="0"
                />
              </div>
            </div>
          </div>
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="50000"
              step="500"
              value={filters.maxPrice || 50000}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="w-full accent-primary-600"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>₹0</span>
            <span>₹50,000+</span>
          </div>
        </div>
      )}
    </div>
  );

  // Render rating filter
  const renderRatingFilter = () => (
    <div className="border-b border-gray-200 pb-4">
      {renderSectionHeader('Rating', 'rating')}
      {expandedSections.rating && (
        <div className="mt-2 space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label
              key={rating}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.minRating === rating}
                onChange={() => handleFilterChange('minRating', rating)}
                className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${i < rating ? 'text-yellow-400' : 'text-gray-200'} text-sm`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">& up</span>
              </div>
            </label>
          ))}
          <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="radio"
              name="rating"
              value="0"
              checked={filters.minRating === 0}
              onChange={() => handleFilterChange('minRating', 0)}
              className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm">Any Rating</span>
          </label>
        </div>
      )}
    </div>
  );

  // Render availability filter
  const renderAvailabilityFilter = () => (
    <div className="border-b border-gray-200 pb-4">
      {renderSectionHeader('Availability', 'availability')}
      {expandedSections.availability && (
        <div className="mt-2 space-y-2">
          <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="radio"
              name="availability"
              value="all"
              checked={filters.availability === 'all'}
              onChange={() => handleFilterChange('availability', 'all')}
              className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm">All</span>
          </label>
          <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="radio"
              name="availability"
              value="available"
              checked={filters.availability === 'available'}
              onChange={() => handleFilterChange('availability', 'available')}
              className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-green-600 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Available
            </span>
          </label>
          <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="radio"
              name="availability"
              value="maintenance"
              checked={filters.availability === 'maintenance'}
              onChange={() => handleFilterChange('availability', 'maintenance')}
              className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-yellow-600 flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              Under Maintenance
            </span>
          </label>
        </div>
      )}
    </div>
  );

  // Render delivery filter
  const renderDeliveryFilter = () => (
    <div className="pb-4">
      {renderSectionHeader('Delivery Type', 'delivery')}
      {expandedSections.delivery && (
        <div className="mt-2 space-y-2">
          <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="radio"
              name="deliveryType"
              value="all"
              checked={filters.deliveryType === 'all'}
              onChange={() => handleFilterChange('deliveryType', 'all')}
              className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm">All</span>
          </label>
          <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="radio"
              name="deliveryType"
              value="free"
              checked={filters.deliveryType === 'free'}
              onChange={() => handleFilterChange('deliveryType', 'free')}
              className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-green-600 flex items-center">
              <FaTruck className="mr-2" />
              Free Delivery
            </span>
          </label>
          <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="radio"
              name="deliveryType"
              value="express"
              checked={filters.deliveryType === 'express'}
              onChange={() => handleFilterChange('deliveryType', 'express')}
              className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-blue-600 flex items-center">
              <FaTruck className="mr-2" />
              Express Delivery
            </span>
          </label>
        </div>
      )}
    </div>
  );

  // Render sort options
  const renderSortOptions = () => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <h4 className="font-medium text-gray-700 mb-2">Sort By</h4>
      <div className="space-y-2">
        {[
          { value: 'newest', label: 'Newest First' },
          { value: 'oldest', label: 'Oldest First' },
          { value: 'price_high', label: 'Price: High to Low' },
          { value: 'price_low', label: 'Price: Low to High' },
          { value: 'rating', label: 'Top Rated' },
          { value: 'popular', label: 'Most Popular' },
        ].map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <input
              type="radio"
              name="sort"
              value={option.value}
              checked={filters.sort === option.value}
              onChange={() => handleFilterChange('sort', option.value)}
              className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  // Render filter content
  const renderFilterContent = () => (
    <div className="space-y-4">
      {renderSortOptions()}
      {renderCategoryFilter()}
      {renderSubCategoryFilter()}
      {renderPriceFilter()}
      {renderRatingFilter()}
      {renderAvailabilityFilter()}
      {renderDeliveryFilter()}
      
      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full text-center text-sm text-red-600 hover:text-red-700 font-medium py-2 border-t border-gray-200 mt-4 pt-4 transition-colors"
        >
          Clear All Filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div ref={filterRef} className={`relative ${className}`}>
      {/* Mobile Filter Button */}
      {renderMobileButton()}

      {/* Filter Drawer / Dropdown */}
      <div className={`
        ${isMobile ? 'fixed inset-0 z-50' : 'relative'}
        ${isMobile && !isOpen ? 'pointer-events-none' : ''}
      `}>
        {/* Overlay */}
        {isMobile && isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Filter Panel */}
        <div className={`
          ${isMobile ? `
            fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          ` : `
            bg-white rounded-xl shadow-sm border border-gray-200 p-4
          `}
        `}>
          {/* Mobile Header */}
          {isMobile && (
            <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FaSlidersH className="text-primary-600" />
                <h3 className="text-lg font-bold">Filters</h3>
                {activeFilterCount > 0 && (
                  <span className="bg-primary-100 text-primary-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
          )}

          {/* Filter Body */}
          <div className={`
            ${isMobile ? 'p-4 overflow-y-auto max-h-[calc(85vh-60px)]' : ''}
          `}>
            {renderFilterContent()}
          </div>

          {/* Mobile Footer */}
          {isMobile && (
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 flex space-x-3">
              <button
                onClick={clearFilters}
                className="btn-secondary flex-1"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-primary flex-1"
              >
                Apply Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;