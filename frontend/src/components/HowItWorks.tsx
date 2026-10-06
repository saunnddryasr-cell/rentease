import React from 'react';
import { CalendarCheck, Truck, Wrench, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onStartBrowsing: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartBrowsing }) => {
  return (
    <section className="py-16 md:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
            Simple 4-Step Lifecycle
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 text-balance">
            Furnish Your Entire Home Without Buying a Single Thing
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            From seamless selection to zero-cost relocation, see how RentEase frees students and working professionals from the burden of ownership.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4 relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm font-mono">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Pick Products &amp; Rental Tenure
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose essential furniture and appliances or curated room bundles. Select 3, 6, or 12-month tenure plans to unlock up to 25% savings.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 font-mono">
              ✓ Transparent refundable deposit
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4 relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm font-mono">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Scheduled Doorstep Setup
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pick your preferred delivery date and time slot. Our certified logistics crew delivers, unboxes, positions, and installs everything for free.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 font-mono">
              ✓ Delivery within 24–48 hours
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4 relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm font-mono">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Zero-Cost Maintenance
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enjoy your space with complete peace of mind. If a fridge cools mildly or a bed bolt needs tightening, raise a 1-click ticket for free doorstep service.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 font-mono">
              ✓ Free technician visits &amp; cleaning
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4 relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm font-mono">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Extend, Relocate or Return
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Switching apartments? We dismantle, pack, and reassemble at your new address for free. Done with your stay? Schedule pickup and get 100% deposit back.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 font-mono">
              ✓ 100% deposit refund to bank
            </div>
          </div>
        </div>

        {/* Buying vs Renting Comparison Matrix */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 border border-slate-800">
          <div className="max-w-2xl mb-8 space-y-2">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Financial &amp; Operational Comparison
            </div>
            <h3 className="text-2xl font-bold tracking-tight">
              Buying New vs Renting with RentEase
            </h3>
            <p className="text-xs text-slate-400">
              For a 12-month stay in an urban city, see why over 45,000 renters choose RentEase.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Feature / Parameter</th>
                  <th className="py-3 px-4 text-slate-400">Buying Outright</th>
                  <th className="py-3 px-4 text-amber-400 font-bold">RentEase Monthly Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">Upfront Capital Requirement</td>
                  <td className="py-3.5 px-4 text-red-400 font-mono">₹95,000 – ₹1,40,000</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold font-mono">
                    ₹3,400 refundable deposit + 1st mo rent
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">Relocation Between Flats</td>
                  <td className="py-3.5 px-4 text-slate-400">Pay movers ₹8,000 + risk damage</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold">100% Free Doorstep Relocation</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">Appliance Breakdown Repairs</td>
                  <td className="py-3.5 px-4 text-slate-400">Out-of-pocket repair bills &amp; warranty delay</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold">Free Doorstep Technician within 24h</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">Depreciation &amp; Resale Hassle</td>
                  <td className="py-3.5 px-4 text-slate-400">Resell on classifieds at 70% loss</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold">Zero loss; simple return &amp; full deposit refund</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
            <div className="text-xs text-slate-300">
              Ready to furnish your home effortlessly? Browse our full catalog now.
            </div>
            <button
              onClick={onStartBrowsing}
              className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
