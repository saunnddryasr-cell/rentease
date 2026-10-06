import React from 'react';
import { ServiceCity } from '../types';

interface FooterProps {
  cities: ServiceCity[];
  onOpenPrd: () => void;
  onNavigateTab: (tab: 'catalog' | 'bundles' | 'how-it-works' | 'my-rentals' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ cities, onOpenPrd, onNavigateTab }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand & mission */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-lg font-bold text-white tracking-tight">
              <span className="text-amber-500">Rent</span>Ease
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The flexible monthly furniture &amp; appliance rental platform for students and working professionals. Zero upfront capital, 100% refundable deposits, and free doorstep servicing.
            </p>
            <div className="text-[11px] text-slate-500 font-mono pt-2">
              Operational in {cities.filter((c) => c.isAvailable).length} major urban hubs across India.
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Platform
            </div>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onNavigateTab('catalog')}
                  className="hover:text-white transition-colors"
                >
                  All Products Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('bundles')}
                  className="hover:text-white transition-colors"
                >
                  Room Bundles (1BHK &amp; WFH)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('how-it-works')}
                  className="hover:text-white transition-colors"
                >
                  How It Works &amp; Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('my-rentals')}
                  className="hover:text-white transition-colors"
                >
                  My Active Rentals Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Operations & Project Docs */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Operations &amp; Specs
            </div>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onNavigateTab('admin')}
                  className="hover:text-white transition-colors"
                >
                  Admin / Vendor Console
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrd}
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  PRD &amp; Architecture Specs
                </button>
              </li>
              <li>
                <span className="text-slate-500">Free Doorstep Relocation Policy</span>
              </li>
              <li>
                <span className="text-slate-500">Deposit Refund Guarantee</span>
              </li>
            </ul>
          </div>

          {/* Service Cities */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Fulfillment Hubs
            </div>
            <div className="space-y-1 text-slate-400">
              {cities.map((city) => (
                <div key={city.id} className="flex justify-between items-center text-[11px]">
                  <span>{city.name}</span>
                  <span className="text-slate-600 font-mono">{city.activeHubs} hubs</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; 2026 RentEase Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span>Terms of Service</span>
            <span aria-hidden="true">·</span>
            <button onClick={onOpenPrd} className="hover:text-amber-400 underline">
              Unified Mentor Project Documentation
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
