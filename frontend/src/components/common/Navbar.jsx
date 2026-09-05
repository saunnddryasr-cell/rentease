// src/components/common/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  // ✅ Add safe check for cart items
  const { items = [] } = useSelector((state) => state.cart) || {};
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  // ✅ Ensure items is always an array
  const cartItems = Array.isArray(items) ? items : [];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
            <img src="/favicon.svg" alt="RentEase logo" className="h-9 w-9" />
            <span className="text-2xl font-bold text-primary-600">RentEase</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors" onClick={closeMenu}>
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600 transition-colors" onClick={closeMenu}>
              Products
            </Link>
            {isAuthenticated && (
              <Link to="/my-rentals" className="text-gray-700 hover:text-primary-600 transition-colors" onClick={closeMenu}>
                My Rentals
              </Link>
            )}
          </div>

          {/* Right side - Cart & Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative" onClick={closeMenu}>
              <FaShoppingCart className="text-2xl text-gray-700 hover:text-primary-600 transition-colors" />
              {/* ✅ Safe check for cart items length */}
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                  <FaUser />
                  <span>{user?.name?.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 invisible group-hover:visible transition-all z-50">
                  <Link to="/my-rentals" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={closeMenu}>
                    My Rentals
                  </Link>
                  <Link to="/rental-history" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={closeMenu}>
                    Rental History
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={closeMenu}>
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors" onClick={closeMenu}>
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-primary-600 transition-colors"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-down">
            <Link to="/" className="block py-2 text-gray-700 hover:text-primary-600" onClick={closeMenu}>
              Home
            </Link>
            <Link to="/products" className="block py-2 text-gray-700 hover:text-primary-600" onClick={closeMenu}>
              Products
            </Link>
            {isAuthenticated && (
              <Link to="/my-rentals" className="block py-2 text-gray-700 hover:text-primary-600" onClick={closeMenu}>
                My Rentals
              </Link>
            )}
            <Link to="/cart" className="block py-2 text-gray-700 hover:text-primary-600" onClick={closeMenu}>
              Cart ({cartItems.length})
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/rental-history" className="block py-2 text-gray-700 hover:text-primary-600" onClick={closeMenu}>
                  Rental History
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="block py-2 text-gray-700 hover:text-primary-600" onClick={closeMenu}>
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-primary-600" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="block py-2 text-primary-600" onClick={closeMenu}>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;