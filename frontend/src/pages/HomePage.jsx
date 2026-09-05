// src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedProducts } from '../store/slices/productSlice';
import ProductCard from '../components/products/ProductCard';

const HomePage = () => {
  const dispatch = useDispatch();
  const { featuredProducts, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  // ✅ FIX: Ensure featuredProducts is always an array
  const productsArray = React.useMemo(() => {
    if (!featuredProducts) return [];
    if (Array.isArray(featuredProducts)) return featuredProducts;
    // If it's an object with a data property
    if (featuredProducts.data && Array.isArray(featuredProducts.data)) {
      return featuredProducts.data;
    }
    // If it's an object with other structure
    if (typeof featuredProducts === 'object') {
      // Try to find an array property
      const values = Object.values(featuredProducts);
      for (const val of values) {
        if (Array.isArray(val)) return val;
      }
    }
    return [];
  }, [featuredProducts]);

  const categories = [
    { name: 'Furniture', icon: '🛋️', path: '/products?category=furniture', description: 'Premium furniture for every room' },
    { name: 'Appliances', icon: '🔌', path: '/products?category=appliance', description: 'Smart appliances for modern living' },
  ];

  const features = [
    { 
      icon: '💰', 
      title: 'Affordable Rentals', 
      description: 'Monthly rentals starting at just ₹999. No hidden charges or long-term commitments.'
    },
    { 
      icon: '🚚', 
      title: 'Free Delivery', 
      description: 'Free delivery and pickup services included. We handle all the logistics.'
    },
    { 
      icon: '🛠️', 
      title: 'Maintenance Support', 
      description: '24/7 maintenance and repair support. We ensure your products stay in perfect condition.'
    },
    { 
      icon: '🔄', 
      title: 'Flexible Tenure', 
      description: 'Choose from 1 to 24 months rental plans. Extend or return anytime.'
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Rahul Sharma',
      role: 'Software Engineer',
      image: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=2563eb&color=fff',
      quote: 'RentEase made my move to Bangalore so easy! I got quality furniture delivered within 2 days.',
      rating: 5
    },
    {
      id: 2,
      name: 'Priya Patel',
      role: 'Student',
      image: 'https://ui-avatars.com/api/?name=Priya+Patel&background=7c3aed&color=fff',
      quote: 'As a student, I couldn\'t afford to buy furniture. RentEase gave me the perfect solution.',
      rating: 5
    },
    {
      id: 3,
      name: 'Amit Kumar',
      role: 'Business Owner',
      image: 'https://ui-avatars.com/api/?name=Amit+Kumar&background=059669&color=fff',
      quote: 'Excellent service! The products are high quality and the support team is very responsive.',
      rating: 4
    },
  ];

  const stats = [
    { value: '50K+', label: 'Happy Customers' },
    { value: '10K+', label: 'Products Rented' },
    { value: '4.8★', label: 'Average Rating' },
    { value: '100+', label: 'Cities Served' },
  ];

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="spinner mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading amazing deals...</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Use productsArray instead of featuredProducts
  const displayProducts = productsArray.slice(0, 4);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 p-8 md:p-12 text-white">
          <div className="max-w-3xl">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
              🎉 Limited Time Offer: Get 10% Off Your First Rental
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Rent Furniture & Appliances for Your Home
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-100 leading-relaxed">
              Flexible monthly rentals with free delivery and maintenance. 
              Perfect for students, working professionals, and everyone in between.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/products" 
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-all hover:shadow-lg text-center"
              >
                Browse Products
              </Link>
              <Link 
                to="/register" 
                className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-all hover:shadow-lg text-center border border-primary-600"
              >
                Get Started Free
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-6 mt-8">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img 
                    key={i}
                    src={`https://ui-avatars.com/api/?name=User+${i}&background=random&color=fff`}
                    alt={`Customer ${i}`}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <p className="text-sm text-primary-100">
                <span className="font-bold text-white">1,000+</span> happy customers this month
              </p>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full hidden lg:block">
          <div className="absolute right-10 top-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute right-20 bottom-20 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <p className="text-2xl md:text-3xl font-bold text-primary-600">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Browse Categories</h2>
          <p className="text-gray-600 mt-2">Find exactly what you need for your home</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="card p-8 text-center hover:scale-105 transition-transform duration-300 group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{category.icon}</div>
              <h3 className="text-2xl font-semibold">{category.name}</h3>
              <p className="text-gray-600 mt-2">{category.description}</p>
              <span className="inline-block mt-4 text-primary-600 font-medium group-hover:underline">
                Explore Now →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <p className="text-gray-500 text-sm">Handpicked just for you</p>
          </div>
          <Link to="/products" className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
            View All →
          </Link>
        </div>
        {displayProducts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500">No featured products available right now</p>
            <p className="text-sm text-gray-400 mt-1">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Why Choose RentEase?</h2>
          <p className="text-gray-600 mt-2">We make renting furniture simple, affordable, and stress-free</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="text-center p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">What Our Customers Say</h2>
          <p className="text-gray-600 mt-2">Real stories from real people</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <div className="mt-3 text-yellow-400 text-sm">
                {renderStars(testimonial.rating)}
              </div>
              <p className="mt-2 text-gray-600 italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="flex flex-wrap justify-center items-center gap-8 py-4">
        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-2xl">🔒</span>
          <span className="text-sm">Secure Payments</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-2xl">✅</span>
          <span className="text-sm">Quality Assured</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-2xl">📦</span>
          <span className="text-sm">Free Delivery</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-2xl">🛠️</span>
          <span className="text-sm">24/7 Support</span>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">Ready to Transform Your Home?</h2>
        <p className="text-lg md:text-xl text-primary-100 mb-6 max-w-2xl mx-auto">
          Join thousands of satisfied customers who have made their homes comfortable
          without the burden of ownership. Start renting today!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-all hover:shadow-lg"
          >
            Create Your Account
          </Link>
          <Link
            to="/products"
            className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-all hover:shadow-lg border border-primary-600"
          >
            Browse Products
          </Link>
        </div>
        <p className="text-sm text-primary-200 mt-4">
          🎉 No hidden charges • Free cancellation • Flexible terms
        </p>
      </section>
    </div>
  );
};

export default HomePage;