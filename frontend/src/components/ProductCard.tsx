import React, { useState } from 'react';
import { ShoppingBag, Eye, Check } from 'lucide-react';
import { Product, RentalTenure } from '../types';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, tenure: RentalTenure) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart
}) => {
  const [selectedTenure, setSelectedTenure] = useState<RentalTenure>(6);
  const [imageError, setImageError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Dynamic monthly rent based on selected tenure
  const currentRent =
    selectedTenure === 3
      ? product.monthlyRent3m
      : selectedTenure === 6
      ? product.monthlyRent6m
      : product.monthlyRent12m;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedTenure);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <article
      onClick={() => onQuickView(product)}
      className="group cursor-pointer bg-white border border-slate-200/80 rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.title}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <span className="text-xs font-medium text-slate-600">{product.title}</span>
            <span className="text-[11px] text-slate-400 mt-1">{product.specs.condition}</span>
          </div>
        )}

        {/* Quiet condition or popularity marker */}
        {product.isPopular && (
          <span className="absolute top-3 left-3 text-[11px] font-medium text-amber-900 bg-amber-100/90 backdrop-blur-xs px-2 py-0.5 rounded">
            Popular Choice
          </span>
        )}

        {/* Quick View Button overlay on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white text-slate-700 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Quick View Product Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Unboxed Metadata with · separator */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <span className="uppercase tracking-wider font-medium text-[11px]">
              {product.category === 'bundles' ? 'Room Bundle' : product.subCategory.replace('_', ' ')}
            </span>
            <span aria-hidden="true">·</span>
            <span>{product.specs.condition}</span>
          </div>

          <h3 className="text-base font-semibold text-slate-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
            {product.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Interactive Tenure Toggle inside card */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>Select Rental Tenure:</span>
            <span className="text-[11px] font-mono text-slate-400">Refundable Dep: ₹{product.securityDeposit}</span>
          </div>

          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-md">
            {[3, 6, 12].map((tenure) => (
              <button
                key={tenure}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTenure(tenure as RentalTenure);
                }}
                className={`py-1 text-xs font-medium rounded transition-colors ${
                  selectedTenure === tenure
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tenure} Mo
              </button>
            ))}
          </div>

          {/* Pricing Baseline and Action Button */}
          <div className="flex items-center justify-between mt-3 pt-2">
            <div>
              <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
                ₹{currentRent.toLocaleString()}
                <span className="text-xs font-normal text-slate-500"> /mo</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-medium">
                {selectedTenure === 12
                  ? 'Max 25% Savings'
                  : selectedTenure === 6
                  ? '12% Plan Discount'
                  : 'Standard Base Plan'}
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={product.availableCount <= 0}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : product.availableCount <= 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : product.availableCount <= 0 ? (
                <span>Rented Out</span>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
