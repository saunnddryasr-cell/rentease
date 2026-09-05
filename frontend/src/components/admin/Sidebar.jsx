import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaBox, FaShoppingCart, FaUsers, FaCog, FaBars } from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/admin/products', label: 'Products', icon: FaBox },
    { path: '/admin/orders', label: 'Orders', icon: FaShoppingCart },
    { path: '/admin/users', label: 'Users', icon: FaUsers },
    { path: '/admin/settings', label: 'Settings', icon: FaCog },
  ];

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out flex-shrink-0 h-screen sticky top-0`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        <h1 className={`font-bold text-xl ${!isOpen && 'hidden'}`}>Admin Panel</h1>
        <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-700 focus:outline-none">
          <FaBars />
        </button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className={`ml-3 ${!isOpen && 'hidden'}`}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="border-t border-gray-700 p-4">
        <div className={`flex items-center ${!isOpen && 'justify-center'}`}>
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-sm font-medium">JD</span>
          </div>
          {isOpen && (
            <div className="ml-3">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;