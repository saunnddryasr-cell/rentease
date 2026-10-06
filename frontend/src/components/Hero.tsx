import React, { useState } from 'react';
import { ArrowRight, Truck, RefreshCw, Wrench, Shield, CheckCircle2 } from 'lucide-react';
import { RentalTenure } from '../types';

interface HeroProps {
  onExploreCatalog: () => void;
  onExploreBundles: () => void;
  selectedCity: string;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCatalog,
  onExploreBundles,
  selectedCity
}) => {
  const [calculatorTenure, setCalculatorTenure] = useState<RentalTenure>(12);

  // Sample quick calculations based on average household setup
  const baseMonthly = 3800; // 3 months
  const monthlyRates: Record<RentalTenure, number> = {
    3: 3800,
    6: 3290,
    12: 2790
  };
  const savingsPct: Record<RentalTenure, number> = {
    3: 0,
    6: 13,
    12: 26
  };

  return (
    <section className="relative bg-slate-900 text-white overflow-hidden">
      {/* Background Hero Image with measured scrim */}
      <div className="absolute inset-0">
        <img
          src="/src/assets/images/hero_modern_rental_living_1791088495163.jpg"
          alt="Modern furnished living room available for monthly rental"
          className="w-full h-full object-cover object-center opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Unboxed natural kicker */}
            <div className="flex items-center gap-2 text-xs font-medium text-amber-400 tracking-wide">
              <span>Urban Living Solved</span>
              <span aria-hidden="true">·</span>
              <span>Available in {selectedCity}</span>
              <span aria-hidden="true">·</span>
              <span>Next-Day Delivery</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight text-balance">
              Premium Living, Monthly Flexibility.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Rent verified furniture and smart home appliances on flexible 3, 6, or 12-month tenures. No upfront purchase pain, zero relocation hassles, and free doorstep maintenance.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreCatalog}
                className="px-6 py-3 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>Browse Furniture &amp; Appliances</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreBundles}
                className="px-5 py-3 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg transition-colors"
              >
                Explore Room Bundles (Save 20%)
              </button>
            </div>

            {/* Trust Proof Points */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Free Doorstep Setup</div>
                  <div className="text-slate-400 text-[11px]">Unboxed &amp; installed</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">100% Refundable</div>
                  <div className="text-slate-400 text-[11px]">Deposit returned</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Wrench className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Free Maintenance</div>
                  <div className="text-slate-400 text-[11px]">Annual care &amp; repairs</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <RefreshCw className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Free Relocation</div>
                  <div className="text-slate-400 text-[11px]">Move cities with ease</div>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Quick Tenure Estimator */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/80 backdrop-blur-md border border-white/15 rounded-xl p-6 sm:p-7 shadow-2xl">
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                Tenure Flexibility Calculator
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                How long are you planning to stay?
              </h3>
              <p className="text-xs text-slate-300 mb-5">
                Longer rental tenures unlock tiered monthly discounts with full flexibility to extend or relocate anytime.
              </p>

              {/* Segmented Tenure Selector */}
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-800/80 rounded-lg border border-slate-700/60 mb-5">
                {[3, 6, 12].map((t) => (
                  <button
                    key={t}
                    onClick={() => setCalculatorTenure(t as RentalTenure)}
                    className={`py-2 px-2 text-xs font-medium rounded-md transition-all text-center ${
                      calculatorTenure === t
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <span>{t} Months</span>
                    {t > 3 && (
                      <div className="text-[10px] opacity-80">
                        Save {savingsPct[t as RentalTenure]}%
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Price Calculation Matrix */}
              <div className="space-y-3 bg-slate-950/60 rounded-lg p-4 border border-slate-800 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Standard 1BHK Living Setup:</span>
                  <span className="font-mono tabular-nums text-slate-400 line-through">₹{baseMonthly}/mo</span>
                </div>
                <div className="flex justify-between items-center text-slate-200">
                  <span>Your Monthly Rent ({calculatorTenure} Mo Plan):</span>
                  <span className="text-base font-bold font-mono tabular-nums text-amber-400">
                    ₹{monthlyRates[calculatorTenure].toLocaleString()}/mo
                  </span>
                </div>
                <div className="flex justify-between items-center text-emerald-400 pt-2 border-t border-slate-800">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Total Tenure Savings:
                  </span>
                  <span className="font-bold font-mono tabular-nums">
                    ₹{((baseMonthly - monthlyRates[calculatorTenure]) * calculatorTenure).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <button
                  onClick={onExploreCatalog}
                  className="w-full py-2.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors text-center"
                >
                  Configure My Custom Plan
                </button>
              </div>

              <div className="mt-3 text-center text-[11px] text-slate-400">
                100% Refundable Security Deposit · Cancel or extend anytime
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
