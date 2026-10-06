import React, { useState } from 'react';
import { X, Check, ShieldCheck, Truck, Wrench, RefreshCw, Calendar, Sparkles } from 'lucide-react';
import { Product, RentalTenure } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, tenure: RentalTenure) => void;
  onRentNow: (product: Product, tenure: RentalTenure) => void;
  selectedCity: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onRentNow,
  selectedCity
}) => {
  const [tenure, setTenure] = useState<RentalTenure>(6);
  const [pinCode, setPinCode] = useState('560103');
  const [pinChecked, setPinChecked] = useState(true);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const currentRent =
    tenure === 3
      ? product.monthlyRent3m
      : tenure === 6
      ? product.monthlyRent6m
      : product.monthlyRent12m;

  const savingsMonthly = product.monthlyRent3m - currentRent;
  const totalTenureSavings = savingsMonthly * tenure;

  const handleAdd = () => {
    onAddToCart(product, tenure);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleRent = () => {
    onRentNow(product, tenure);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-500 hover:text-slate-900 bg-white/80 hover:bg-white rounded-full transition-colors shadow-xs"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Gallery & Visual */}
            <div className="md:col-span-6 space-y-4">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Service Commitments Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2">
                  <Truck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900">Next-Day Delivery</div>
                    <div className="text-slate-500 text-[11px]">Free doorstep setup</div>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900">Refundable Deposit</div>
                    <div className="text-slate-500 text-[11px]">100% money back</div>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2">
                  <Wrench className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900">Zero Maintenance Fee</div>
                    <div className="text-slate-500 text-[11px]">Free tech visit included</div>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2">
                  <RefreshCw className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900">Free Relocation</div>
                    <div className="text-slate-500 text-[11px]">We move it when you move</div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="pt-2">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                  Item Specifications
                </h4>
                <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/80 text-xs space-y-1.5 font-mono">
                  {product.specs.dimensions && (
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Dimensions:</span>
                      <span className="font-medium text-slate-800">{product.specs.dimensions}</span>
                    </div>
                  )}
                  {product.specs.material && (
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Material:</span>
                      <span className="font-medium text-slate-800">{product.specs.material}</span>
                    </div>
                  )}
                  {product.specs.capacity && (
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Capacity / Spec:</span>
                      <span className="font-medium text-slate-800">{product.specs.capacity}</span>
                    </div>
                  )}
                  {product.specs.energyRating && (
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Energy Rating:</span>
                      <span className="font-medium text-slate-800">{product.specs.energyRating}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">Quality Grade:</span>
                    <span className="font-medium text-emerald-700">{product.specs.condition}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">Warranty:</span>
                    <span className="font-medium text-slate-800">{product.specs.warranty}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contiguous Purchase Module */}
            <div className="md:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="uppercase tracking-wider font-semibold text-amber-700">
                    {product.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>In Stock ({product.availableCount} units left)</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {product.title}
                </h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Key Highlights */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-900">Key Inclusions:</div>
                <ul className="text-xs text-slate-600 space-y-1">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tenure Selection Module */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-900">Choose Rental Tenure</span>
                  <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {tenure === 12 ? 'Best Value Plan' : `${tenure} Months Selected`}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[3, 6, 12].map((t) => {
                    const price =
                      t === 3
                        ? product.monthlyRent3m
                        : t === 6
                        ? product.monthlyRent6m
                        : product.monthlyRent12m;
                    return (
                      <button
                        key={t}
                        onClick={() => setTenure(t as RentalTenure)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          tenure === t
                            ? 'bg-white border-amber-600 shadow-sm ring-1 ring-amber-600'
                            : 'bg-white/80 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-900">{t} Months</div>
                        <div className="text-sm font-bold text-amber-700 font-mono tabular-nums mt-0.5">
                          ₹{price.toLocaleString()}
                          <span className="text-[10px] font-normal text-slate-500">/mo</span>
                        </div>
                        {t > 3 && (
                          <div className="text-[10px] text-emerald-600 font-medium mt-1">
                            Save {t === 6 ? '12%' : '25%'}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Savings Callout */}
                {totalTenureSavings > 0 && (
                  <div className="mt-3 p-2 bg-emerald-50 rounded-md border border-emerald-100 text-xs text-emerald-800 flex items-center justify-between">
                    <span>Tenure Discount Applied:</span>
                    <span className="font-bold font-mono tabular-nums">
                      ₹{totalTenureSavings.toLocaleString()} total saved
                    </span>
                  </div>
                )}
              </div>

              {/* Price & Deposit Summary */}
              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Monthly Rental Fee:</span>
                  <span className="font-mono tabular-nums font-bold text-slate-900 text-sm">
                    ₹{currentRent.toLocaleString()} / month
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="flex items-center gap-1">
                    Refundable Security Deposit:
                    <span className="text-[11px] text-slate-400 font-normal">(Returned on pickup)</span>
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-slate-800">
                    ₹{product.securityDeposit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Delivery &amp; Installation:</span>
                  <span className="font-semibold text-emerald-700">FREE</span>
                </div>
              </div>

              {/* Delivery Pin Code Check */}
              <div className="pt-2">
                <div className="text-xs font-medium text-slate-700 mb-1.5">
                  Check Delivery Availability in {selectedCity}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="Enter 6-digit PIN"
                    className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-amber-600 font-mono"
                    maxLength={6}
                  />
                  <button
                    onClick={() => setPinChecked(true)}
                    className="px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Check
                  </button>
                </div>
                {pinChecked && (
                  <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Express Delivery eligible in PIN {pinCode} (Scheduled within 24-48 hrs).
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={handleAdd}
                  className={`flex-1 py-3 px-4 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <span>Add to Bag</span>
                  )}
                </button>

                <button
                  onClick={handleRent}
                  className="flex-1 py-3 px-4 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm text-center"
                >
                  Rent Now ({tenure} Mo)
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
