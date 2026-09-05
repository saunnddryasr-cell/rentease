import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top header – optional, but keep it */}
        <header className="bg-white shadow-sm py-3 px-6 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">Admin</h2>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Welcome, Admin</span>
            <button className="text-gray-500 hover:text-gray-700">Logout</button>
          </div>
        </header>
        <div className="p-6 flex-1">
          <Outlet />  {/* This is where each page content will render */}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;