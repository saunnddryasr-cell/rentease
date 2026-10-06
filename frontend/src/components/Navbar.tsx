import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, MapPin, User, ChevronDown } from 'lucide-react';
import { ServiceCity } from '../types';

interface NavbarProps {
  activeTab: 'catalog' | 'bundles' | 'how-it-works' | 'my-rentals' | 'admin' | 'prd';
  setActiveTab: (tab: 'catalog' | 'bundles' | 'how-it-works' | 'my-rentals' | 'admin' | 'prd') => void;
  cartCount: number;
  openCart: () => void;
  userRole: 'customer' | 'admin_vendor';
  setUserRole: (role: 'customer' | 'admin_vendor') => void;
  cities: ServiceCity[];
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  apiSynced?: boolean;
  isSyncing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  userRole,
  setUserRole,
  cities,
  selectedCity,
  setSelectedCity,
  apiSynced = true,
  isSyncing = false
}) => {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark + subtle city selector */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => setActiveTab('catalog')}
            className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5 focus:outline-none"
          >
            <span className="text-amber-600">Rent</span>Ease
          </button>

          {/* City selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>{selectedCity}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isCityDropdownOpen && (
              <div className="absolute left-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-50">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Service Area
                </div>
                {cities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      setSelectedCity(city.name);
                      setIsCityDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      selectedCity === city.name ? 'text-amber-700 font-semibold bg-amber-50/60' : 'text-slate-700'
                    }`}
                  >
                    <span>{city.name}</span>
                    <span className="text-[10px] text-slate-400">{city.activeHubs} hubs</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`transition-colors hover:text-slate-900 pb-1 border-b-2 ${
              activeTab === 'catalog' ? 'border-amber-600 text-slate-900 font-semibold' : 'border-transparent'
            }`}
          >
            Catalog
          </button>
          <button
            onClick={() => setActiveTab('bundles')}
            className={`transition-colors hover:text-slate-900 pb-1 border-b-2 ${
              activeTab === 'bundles' ? 'border-amber-600 text-slate-900 font-semibold' : 'border-transparent'
            }`}
          >
            Room Bundles
          </button>
          <button
            onClick={() => setActiveTab('how-it-works')}
            className={`transition-colors hover:text-slate-900 pb-1 border-b-2 ${
              activeTab === 'how-it-works' ? 'border-amber-600 text-slate-900 font-semibold' : 'border-transparent'
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => setActiveTab('my-rentals')}
            className={`transition-colors hover:text-slate-900 pb-1 border-b-2 ${
              activeTab === 'my-rentals' ? 'border-amber-600 text-slate-900 font-semibold' : 'border-transparent'
            }`}
          >
            My Rentals
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`transition-colors hover:text-slate-900 pb-1 border-b-2 ${
              activeTab === 'admin' ? 'border-amber-600 text-slate-900 font-semibold' : 'border-transparent'
            }`}
          >
            Admin Console
          </button>
          <button
            onClick={() => setActiveTab('prd')}
            className={`transition-colors hover:text-slate-900 pb-1 border-b-2 text-slate-500 hover:text-amber-700 ${
              activeTab === 'prd' ? 'border-amber-600 text-slate-900 font-semibold' : 'border-transparent'
            }`}
          >
            PRD &amp; Specs
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* API Sync indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 font-mono pr-1">
            <span
              className={`w-2 h-2 rounded-full ${
                apiSynced ? 'bg-emerald-500' : 'bg-amber-500'
              } ${isSyncing ? 'animate-ping' : ''}`}
            />
            <span className="text-[11px] text-slate-600">
              {isSyncing ? 'API Syncing...' : 'REST API Synced'}
            </span>
          </div>

          {/* Role switcher */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
            >
              {userRole === 'customer' ? (
                <>
                  <User className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">Sarah Chen</span>
                  <span className="text-[11px] text-slate-400 font-normal hidden lg:inline">(User)</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-semibold text-amber-800">Admin Mode</span>
                </>
              )}
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-xl py-1.5 z-50">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Role
                </div>
                <button
                  onClick={() => {
                    setUserRole('customer');
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 transition-colors ${
                    userRole === 'customer' ? 'text-amber-800 font-semibold bg-amber-50/50' : 'text-slate-700'
                  }`}
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="font-medium">Customer View</div>
                    <div className="text-[11px] text-slate-500">Sarah Chen (Active Renter)</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setUserRole('admin_vendor');
                    setActiveTab('admin');
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 transition-colors ${
                    userRole === 'admin_vendor' ? 'text-amber-800 font-semibold bg-amber-50/50' : 'text-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="font-medium">Admin &amp; Vendor Console</div>
                    <div className="text-[11px] text-slate-500">Manage Inventory &amp; Logistics</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Cart Drawer Trigger */}
          <button
            onClick={openCart}
            className="relative p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="View Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-amber-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Nav strip */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-2 py-2 text-xs font-medium text-slate-600 bg-slate-50/70 overflow-x-auto">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-2 py-1 ${activeTab === 'catalog' ? 'text-amber-700 font-bold' : ''}`}
        >
          Catalog
        </button>
        <button
          onClick={() => setActiveTab('bundles')}
          className={`px-2 py-1 ${activeTab === 'bundles' ? 'text-amber-700 font-bold' : ''}`}
        >
          Bundles
        </button>
        <button
          onClick={() => setActiveTab('my-rentals')}
          className={`px-2 py-1 ${activeTab === 'my-rentals' ? 'text-amber-700 font-bold' : ''}`}
        >
          My Rentals
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`px-2 py-1 ${activeTab === 'admin' ? 'text-amber-700 font-bold' : ''}`}
        >
          Admin
        </button>
        <button
          onClick={() => setActiveTab('prd')}
          className={`px-2 py-1 ${activeTab === 'prd' ? 'text-amber-700 font-bold' : ''}`}
        >
          PRD
        </button>
      </div>
    </header>
  );
};
