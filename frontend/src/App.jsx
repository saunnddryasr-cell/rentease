// src/App.jsx
import  { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
 // ✅ Import useAuth
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProductList from './components/products/ProductList';
import ProductDetails from './components/products/ProductDetails';
import Cart from './components/cart/Cart';
import Checkout from './components/cart/Checkout';
import ActiveRentals from './components/rentals/ActiveRentals';
import RentalHistory from './components/rentals/RentalHistory';
import AdminDashboard from './components/admin/AdminDashboard';
import MaintenanceRequest from './components/support/MaintenanceRequest';
import { loadUser } from './store/slices/authSlice';

function App() {
  const dispatch = useDispatch();
   // ✅ Now this works

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-rentals" element={<ActiveRentals />} />
          <Route path="/rental-history" element={<RentalHistory />} />
          <Route path="/maintenance" element={<MaintenanceRequest />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminDashboard />} />
          
          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;