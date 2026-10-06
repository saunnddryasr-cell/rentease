import React, { useState } from 'react';
import { X, FileText, CheckCircle2, Copy, Check, Layers, BarChart3, Database } from 'lucide-react';

interface PRDDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PRDDocModal: React.FC<PRDDocModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'features' | 'architecture' | 'kpis'>('overview');

  if (!isOpen) return null;

  const handleCopySummary = () => {
    navigator.clipboard.writeText(`RentEase – Furniture & Appliance Rental Platform (Unified Mentor & Rent Mojo Case Analysis)
Key Objectives: Affordable monthly rental options (3, 6, 12M), flexible tenure plans, free doorstep maintenance, zero relocation friction.
Tech Stack: React 19, TypeScript, Tailwind CSS, Vite.
Live App includes: Storefront Catalog, Room Bundles, Dynamic PDP with Tenure Calculator, KYC & Checkout Scheduler, My Rentals Portal, and Admin/Vendor Operations Console.`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Product Requirements Document (PRD) &amp; Technical Analysis
              </h2>
              <div className="text-xs text-slate-500 font-mono">
                Unified Mentor Case Project · RentEase Specification v1.0
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Specs'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              aria-label="Close PRD"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 px-6 bg-white text-xs font-semibold">
          <button
            onClick={() => setActiveSection('overview')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeSection === 'overview'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Problem &amp; Objectives</span>
          </button>
          <button
            onClick={() => setActiveSection('features')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeSection === 'features'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Scope &amp; Functional Spec</span>
          </button>
          <button
            onClick={() => setActiveSection('architecture')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeSection === 'architecture'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Data Schema &amp; Architecture</span>
          </button>
          <button
            onClick={() => setActiveSection('kpis')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeSection === 'kpis'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>KPIs &amp; Impact</span>
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs text-slate-700 leading-relaxed space-y-6">
          
          {activeSection === 'overview' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">1. Context &amp; Problem Statement</h3>
                <p className="text-slate-600 mb-3">
                  Students and young working professionals frequently relocate to major urban hubs (Bengaluru, Mumbai, Delhi-NCR, Pune, Hyderabad) for education and employment. Buying brand-new furniture and large home appliances causes significant friction:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-950 space-y-1">
                    <div className="font-bold">High Upfront Financial Drain</div>
                    <div>Purchasing a bed, fridge, sofa, and washer costs ₹80,000–₹1,50,000 upfront.</div>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-950 space-y-1">
                    <div className="font-bold">Inter-City Relocation Hurdles</div>
                    <div>Packing and transporting bulky heavy items between cities or leases is expensive and causes damage.</div>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-950 space-y-1">
                    <div className="font-bold">Lack of Flexible Tenures</div>
                    <div>Traditional leases or rentals lock users into rigid terms with opaque deposit retention.</div>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-950 space-y-1">
                    <div className="font-bold">Post-Purchase Maintenance Friction</div>
                    <div>Appliances break down and furniture requires servicing; arranging third-party technicians is stressful.</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-2">2. Primary &amp; Secondary Objectives</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-amber-700">
                      Primary Objectives
                    </div>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                      <li>Provide affordable monthly rental options starting from ₹399/mo</li>
                      <li>Offer tiered flexible tenure plans (3, 6, 12 months with up to 25% savings)</li>
                      <li>Simplify furniture &amp; appliance access for urban renters via 1-click booking</li>
                      <li>Improve urban living convenience with doorstep assembly &amp; free servicing</li>
                    </ul>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-emerald-700">
                      Secondary Objectives
                    </div>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                      <li>Reduce unnecessary consumer purchases and encourage circular economy</li>
                      <li>Promote sustainable consumption via certified refurbishing cycles</li>
                      <li>Enable free doorstep relocation support when tenants switch apartments</li>
                      <li>Create an operationally scalable multi-city rental ecosystem</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'features' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">Scope of Work: In-Scope vs Out-of-Scope</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-lg text-emerald-950">
                    <div className="font-bold text-emerald-800 mb-1">In-Scope (Fully Implemented)</div>
                    <ul className="space-y-1 list-disc list-inside text-[11px]">
                      <li>Web-based responsive, mobile-first platform</li>
                      <li>Comprehensive product catalog (Furniture, Appliances, Room Bundles)</li>
                      <li>Dynamic tenure pricing (3M, 6M, 12M) with instant discount calculation</li>
                      <li>Interactive delivery &amp; pickup scheduling with slot &amp; PIN check</li>
                      <li>Active rentals portal with plan extension, relocation &amp; return scheduler</li>
                      <li>Doorstep maintenance ticket desk with technician tracking</li>
                      <li>Admin &amp; Vendor operations dashboard with real-time KPI telemetry</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-700">
                    <div className="font-bold text-slate-900 mb-1">Out-of-Scope (Future Enhancements)</div>
                    <ul className="space-y-1 list-disc list-inside text-[11px]">
                      <li>Native iOS and Android Swift/Kotlin mobile applications</li>
                      <li>Cross-border international rentals outside domestic territory</li>
                      <li>Advanced AI-based algorithmic surge pricing</li>
                      <li>Customer-to-customer second-hand resale marketplace</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-2">User &amp; Admin Feature Matrix</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-bold text-slate-900 mb-1">End-User Experience</div>
                    <div className="text-slate-600 text-[11px]">
                      Zero upfront barrier · Dynamic tenure selection · Refundable security deposit transparency · Fast digital KYC check · Interactive checkout with delivery date/slot picker · Self-service subscription management (extend, relocate, return) · Instant maintenance ticket booking.
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-bold text-slate-900 mb-1">Admin &amp; Vendor Control Center</div>
                    <div className="text-slate-600 text-[11px]">
                      Fleet inventory management (add/edit pricing &amp; deposits) · Availability tracking (available, deployed, in maintenance) · Delivery &amp; pickup dispatch schedules · Maintenance desk with technician assignment · Condition inspection &amp; damage claims resolution · Multi-city service hub management.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'architecture' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">System Architecture &amp; Tech Stack</h3>
                <div className="p-3.5 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] space-y-2">
                  <div className="text-amber-400 font-bold">Frontend Stack:</div>
                  <div>- React 19 + TypeScript for type-safe interactive components</div>
                  <div>- Tailwind CSS v4 with zero-pill metadata discipline and 60-30-10 color allocation</div>
                  <div>- Vite 8.3 development &amp; build pipeline</div>
                  <div>- Lucide React iconography</div>
                  <div className="text-emerald-400 font-bold pt-2">Data Persistence &amp; State Model:</div>
                  <div>- LocalStorage reactive hydration with synchronous mutation hooks</div>
                  <div>- Real-time KPI computations derived directly from active database state</div>
                </div>
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Entity Relationship &amp; Data Models</h3>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 font-mono text-[11px] space-y-2 text-slate-700">
                  <div><strong>Product:</strong> id, title, category, subCategory, monthlyRent3m, monthlyRent6m, monthlyRent12m, securityDeposit, stockCount, availableCount, specs</div>
                  <div><strong>RentalOrder:</strong> id, orderNumber, createdAt, customerName, deliveryAddress, deliveryDate, deliverySlot, items[], totalMonthlyRent, totalDeposit, status, tenureEndDate</div>
                  <div><strong>MaintenanceTicket:</strong> id, orderId, productTitle, issueCategory, priority, status, preferredDate, technicianName, resolutionNotes</div>
                  <div><strong>ReturnDamageClaim:</strong> id, orderId, productTitle, conditionReport, originalDeposit, damageDeduction, refundAmount, claimStatus</div>
                  <div><strong>ServiceCity:</strong> id, name, state, pinCodes[], activeHubs, isAvailable, estDeliveryHours</div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'kpis' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">Key Performance Indicators (KPIs)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="font-bold text-slate-900">Monthly Recurring Revenue (MRR)</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">Sum of all active recurring subscription rentals across cities.</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="font-bold text-slate-900">Product Utilization Rate (%)</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">Percentage of inventory actively rented out vs sitting idle in hubs.</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="font-bold text-slate-900">Customer Retention Rate (%)</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">Percentage of renters who extend tenure or relocate with RentEase.</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="font-bold text-slate-900">Maintenance Resolution Time</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">Hours elapsed from ticket submission to verified doorstep fix.</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Assumptions, Constraints &amp; Impact</h3>
                <div className="space-y-2 text-slate-600">
                  <p><strong>Assumptions:</strong> Urban students and professionals prioritize cash liquidity and relocation flexibility over owning bulky physical depreciating goods.</p>
                  <p><strong>Constraints:</strong> Reverse logistics costs, physical wear-and-tear inspection consistency, and localized hub warehouse storage.</p>
                  <p><strong>Expected Impact:</strong> Unlocks premium lifestyle standards without debt, delivers 70% upfront financial savings for renters, and extends the physical lifespan of furniture and appliances by 300% through circular refurbishing.</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>RentEase Architecture &amp; PRD Specification</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
