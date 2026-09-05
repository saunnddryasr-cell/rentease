// src/components/admin/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaBox, 
  FaShoppingCart, 
  FaMoneyBillWave, 
  FaArrowUp, 
  FaArrowDown,
  FaChartLine
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    users: 0,
    orders: 0,
    products: 0,
    growth: 0,
    conversion: 0
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Simulate API call - Replace with actual API
      setTimeout(() => {
        setStats({
          revenue: 1250000,
          users: 1250,
          orders: 567,
          products: 342,
          growth: 12.5,
          conversion: 3.2
        });
        setChartData([
          { month: 'Jan', revenue: 120000 },
          { month: 'Feb', revenue: 150000 },
          { month: 'Mar', revenue: 180000 },
          { month: 'Apr', revenue: 220000 },
          { month: 'May', revenue: 250000 },
          { month: 'Jun', revenue: 300000 }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    { label: 'Total Revenue', value: formatCurrency(stats.revenue), icon: FaMoneyBillWave, color: 'blue' },
    { label: 'Total Users', value: stats.users, icon: FaUsers, color: 'green' },
    { label: 'Total Orders', value: stats.orders, icon: FaShoppingCart, color: 'purple' },
    { label: 'Active Products', value: stats.products, icon: FaBox, color: 'orange' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-500 text-sm">Track your business performance</p>
        </div>
        <button onClick={fetchAnalytics} className="btn-secondary text-sm">
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                <stat.icon className={`text-${stat.color}-600 text-xl`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Growth Indicators */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Growth Rate</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-green-600">{stats.growth}%</span>
            <FaArrowUp className="text-green-500" />
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Conversion Rate</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-blue-600">{stats.conversion}%</span>
            <span className="text-sm text-gray-500">of visitors convert</span>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
        <div className="h-64 flex items-end gap-2">
          {chartData.map((item, index) => {
            const maxRevenue = Math.max(...chartData.map(d => d.revenue));
            const height = (item.revenue / maxRevenue) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-primary-500 rounded-t hover:bg-primary-600 transition-all cursor-pointer"
                  style={{ height: `${height}%`, minHeight: '10px' }}
                  title={`${item.month}: ${formatCurrency(item.revenue)}`}
                />
                <p className="text-xs text-gray-500 mt-2">{item.month}</p>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>{formatCurrency(Math.min(...chartData.map(d => d.revenue)))}</span>
          <span>{formatCurrency(Math.max(...chartData.map(d => d.revenue)))}</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;