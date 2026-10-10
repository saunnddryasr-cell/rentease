import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Truck,
  Wrench,
  AlertTriangle,
  MapPin,
  TrendingUp,
  Plus,
  CheckCircle,
  Clock,
  RotateCcw,
  Check,
  Edit2,
  Database,
  Server,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import {
  Product,
  RentalOrder,
  MaintenanceTicket,
  ReturnDamageClaim,
  ServiceCity,
  ProductCategory,
  SubCategory
} from '../types';
import { api } from '../services/api';

interface AdminConsoleProps {
  products: Product[];
  orders: RentalOrder[];
  tickets: MaintenanceTicket[];
  claims: ReturnDamageClaim[];
  cities: ServiceCity[];
  onAddProduct: (product: Product) => void;
  onUpdateOrderStatus: (orderId: string, status: RentalOrder['status']) => void;
  onUpdateTicketStatus: (
    ticketId: string,
    status: MaintenanceTicket['status'],
    technicianName?: string,
    notes?: string
  ) => void;
  onResolveClaim: (
    claimId: string,
    status: ReturnDamageClaim['claimStatus'],
    deduction: number,
    notes: string
  ) => void;
  onToggleCityOperational: (cityId: string) => void;
  onRefreshDb?: () => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  products,
  orders,
  tickets,
  claims,
  cities,
  onAddProduct,
  onUpdateOrderStatus,
  onUpdateTicketStatus,
  onResolveClaim,
  onToggleCityOperational,
  onRefreshDb
}) => {
  const [activeTab, setActiveTab] = useState<
    'inventory' | 'logistics' | 'maintenance' | 'claims' | 'service_areas' | 'database'
  >('inventory');

  const [dbStatus, setDbStatus] = useState<any>(null);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [customApiUrl, setCustomApiUrl] = useState(() => api.getApiBase());
  const [saveUrlSuccess, setSaveUrlSuccess] = useState(false);

  const fetchDbHealth = async () => {
    setIsTestingDb(true);
    try {
      const data = await api.checkHealth();
      setDbStatus(data);
    } catch {
      setDbStatus(null);
    } finally {
      setIsTestingDb(false);
    }
  };

  const handleSaveApiUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    api.setApiBase(customApiUrl);
    setSaveUrlSuccess(true);
    setTimeout(() => setSaveUrlSuccess(false), 2500);
    await fetchDbHealth();
  };

  useEffect(() => {
    fetchDbHealth();
  }, []);

  // New product modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('furniture');
  const [newSubCategory, setNewSubCategory] = useState<SubCategory>('sofa');
  const [newRent3m, setNewRent3m] = useState(999);
  const [newDeposit, setNewDeposit] = useState(1200);
  const [newStock, setNewStock] = useState(10);
  const [newDesc, setNewDesc] = useState('');

  // Claim resolution modal
  const [selectedClaim, setSelectedClaim] = useState<ReturnDamageClaim | null>(null);
  const [claimDeduction, setClaimDeduction] = useState(0);
  const [claimNotes, setClaimNotes] = useState('');

  // Ticket assignment modal
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);
  const [assignTech, setAssignTech] = useState('');
  const [ticketResolutionNote, setTicketResolutionNote] = useState('');
  const [ticketTargetStatus, setTicketTargetStatus] = useState<MaintenanceTicket['status']>('in_progress');

  // KPI Calculations
  const activeOrders = orders.filter((o) => o.status === 'active' || o.status === 'scheduled');
  const mrr = activeOrders.reduce((sum, o) => sum + o.totalMonthlyRent, 0);
  const totalStock = products.reduce((sum, p) => sum + p.stockCount, 0);
  const totalRented = products.reduce((sum, p) => sum + p.rentedCount, 0);
  const utilizationRate = Math.round((totalRented / Math.max(totalStock, 1)) * 100);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const p: Product = {
      id: `prod-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      subCategory: newSubCategory,
      description: newDesc || 'High quality modular rental essential for modern homes.',
      features: ['100% Free Doorstep Setup', 'Zero Maintenance Guarantee', 'Annual sanitization included'],
      image:
        newCategory === 'appliances'
          ? '/frontend/assets/images/product_smart_refrigerator_1791088541075.jpg'
          : '/frontend/assets/images/product_scandinavian_sofa_1791088510891.jpg',
      monthlyRent3m: Number(newRent3m),
      monthlyRent6m: Math.round(Number(newRent3m) * 0.88),
      monthlyRent12m: Math.round(Number(newRent3m) * 0.75),
      securityDeposit: Number(newDeposit),
      specs: {
        condition: 'Brand New',
        warranty: 'Comprehensive zero-cost repair warranty'
      },
      stockCount: Number(newStock),
      availableCount: Number(newStock),
      rentedCount: 0
    };
    onAddProduct(p);
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const submitTicketUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    onUpdateTicketStatus(selectedTicket.id, ticketTargetStatus, assignTech, ticketResolutionNote);
    setSelectedTicket(null);
  };

  const submitClaimResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClaim) return;
    const finalStatus: ReturnDamageClaim['claimStatus'] =
      claimDeduction > 0 ? 'deposit_deducted' : 'approved_refund';
    onResolveClaim(selectedClaim.id, finalStatus, claimDeduction, claimNotes);
    setSelectedClaim(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header with KPIs */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              Operations Control Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Admin &amp; Vendor Management Console
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Real-time monitoring of fleet inventory, fulfillment logistics, damage claims, and maintenance SLAs.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Inventory Item</span>
          </button>
        </div>

        {/* 5 Core Business KPIs specified in requirements */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4 border-t border-slate-800">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
            <div className="text-[11px] text-slate-400">Monthly Recurring (MRR)</div>
            <div className="text-lg font-bold font-mono text-amber-400 tabular-nums mt-0.5">
              ₹{mrr.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">+18.4% MoM Growth</div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
            <div className="text-[11px] text-slate-400">Active Rentals</div>
            <div className="text-lg font-bold font-mono text-white tabular-nums mt-0.5">
              {activeOrders.length}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Across {cities.filter((c) => c.isAvailable).length} Cities</div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
            <div className="text-[11px] text-slate-400">Product Utilization</div>
            <div className="text-lg font-bold font-mono text-white tabular-nums mt-0.5">
              {utilizationRate}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {totalRented} of {totalStock} deployed
            </div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
            <div className="text-[11px] text-slate-400">Customer Retention</div>
            <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
              94.2%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Tenure renewal rate</div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 col-span-2 sm:col-span-1">
            <div className="text-[11px] text-slate-400">Avg Resolution SLA</div>
            <div className="text-lg font-bold font-mono text-white tabular-nums mt-0.5">
              18.4 hrs
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Target &lt; 24 hrs</div>
          </div>
        </div>
      </div>

      {/* Segmented Operations Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-2 px-3.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Product Inventory ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logistics')}
          className={`py-2 px-3.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'logistics'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Delivery &amp; Pickup Logistics ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('maintenance')}
          className={`py-2 px-3.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'maintenance'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Maintenance Desk ({tickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`py-2 px-3.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'claims'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Returns &amp; Damages ({claims.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('service_areas')}
          className={`py-2 px-3.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'service_areas'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Service Areas &amp; Hubs ({cities.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('database');
            fetchDbHealth();
          }}
          className={`py-2 px-3.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'database'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>MongoDB &amp; Backend Sync</span>
        </button>
      </div>

      {/* TAB 1: PRODUCT INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Fleet Inventory &amp; Rental Pricing</h3>
              <p className="text-xs text-slate-500">
                Track availability, configure monthly rates, and adjust security deposits.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Asset</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Item &amp; Category</th>
                  <th className="py-3 px-4">Base Rent (3M)</th>
                  <th className="py-3 px-4">6M Plan</th>
                  <th className="py-3 px-4">12M Plan</th>
                  <th className="py-3 px-4">Deposit</th>
                  <th className="py-3 px-4">Stock Utilization</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const utilization = Math.round((p.rentedCount / Math.max(p.stockCount, 1)) * 100);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-semibold text-slate-900">{p.title}</div>
                            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
                              {p.category} · {p.subCategory}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 tabular-nums">
                        ₹{p.monthlyRent3m.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700 tabular-nums">
                        ₹{p.monthlyRent6m.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-700 font-semibold tabular-nums">
                        ₹{p.monthlyRent12m.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700 tabular-nums">
                        ₹{p.securityDeposit.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span>{p.availableCount} available</span>
                            <span className="text-slate-400">{p.stockCount} total</span>
                          </div>
                          <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-amber-500 h-1.5 rounded-full"
                              style={{ width: `${utilization}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {p.availableCount > 0 ? (
                          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            Available
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                            100% Deployed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DELIVERY & PICKUP LOGISTICS */}
      {activeTab === 'logistics' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
          <div className="p-5 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Delivery &amp; Pickup Dispatch Operations</h3>
            <p className="text-xs text-slate-500">
              Manage fulfillment schedules, dispatch technicians, and confirm doorstep handover.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Customer &amp; Contact</th>
                  <th className="py-3 px-4">City &amp; Slot</th>
                  <th className="py-3 px-4">Scheduled Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Update Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900">{ord.orderNumber}</div>
                      <div className="text-[11px] text-slate-500">{ord.items.length} product(s)</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{ord.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{ord.customerPhone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{ord.city}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                        {ord.deliverySlot}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-800">
                      {ord.deliveryDate}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          ord.status === 'active'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                            : ord.status === 'out_for_delivery'
                            ? 'bg-amber-50 text-amber-800 border border-amber-100'
                            : ord.status === 'returned'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-blue-50 text-blue-800 border border-blue-100'
                        }`}
                      >
                        {ord.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          onUpdateOrderStatus(ord.id, e.target.value as RentalOrder['status'])
                        }
                        className="text-[11px] font-medium bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 focus:outline-none"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="out_for_delivery">Out For Delivery</option>
                        <option value="active">Delivered &amp; Active</option>
                        <option value="return_requested">Return Requested</option>
                        <option value="returned">Returned &amp; Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MAINTENANCE SUPPORT DESK */}
      {activeTab === 'maintenance' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
          <div className="p-5 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Maintenance &amp; Support Tickets</h3>
            <p className="text-xs text-slate-500">
              Assign technicians, track parts replacement, and resolve subscriber requests.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Item &amp; Issue Category</th>
                  <th className="py-3 px-4">Customer Notes</th>
                  <th className="py-3 px-4">Assigned Tech</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.map((tkt) => (
                  <tr key={tkt.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {tkt.id}
                      <div className="text-[10px] text-slate-400 font-normal">Order {tkt.orderNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{tkt.productTitle}</div>
                      <div className="text-[11px] text-amber-700 font-medium">{tkt.issueCategoryLabel}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {tkt.description}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-800">
                      {tkt.technicianName || 'Unassigned'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          tkt.status === 'resolved'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                            : tkt.status === 'in_progress'
                            ? 'bg-amber-50 text-amber-800 border border-amber-100'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {tkt.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          setSelectedTicket(tkt);
                          setAssignTech(tkt.technicianName || 'Prakash Rao (Sr. Specialist)');
                          setTicketTargetStatus(tkt.status);
                          setTicketResolutionNote(tkt.resolutionNotes || '');
                        }}
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                      >
                        Manage Ticket
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: RETURNS & DAMAGE CLAIMS */}
      {activeTab === 'claims' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
          <div className="p-5 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Returns, Quality Inspections &amp; Damage Claims</h3>
            <p className="text-xs text-slate-500">
              Audit returned inventory, assess fair wear-and-tear vs damage, and release security deposits.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Claim ID</th>
                  <th className="py-3 px-4">Customer &amp; Product</th>
                  <th className="py-3 px-4">Condition Check</th>
                  <th className="py-3 px-4">Original Deposit</th>
                  <th className="py-3 px-4">Damage Fee</th>
                  <th className="py-3 px-4">Refund Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claims.map((clm) => (
                  <tr key={clm.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {clm.id}
                      <div className="text-[10px] text-slate-400 font-normal">Order {clm.orderNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{clm.customerName}</div>
                      <div className="text-[11px] text-slate-500">{clm.productTitle}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded uppercase ${
                          clm.conditionReport === 'mint'
                            ? 'text-emerald-700 bg-emerald-50'
                            : clm.conditionReport === 'normal_wear'
                            ? 'text-blue-700 bg-blue-50'
                            : 'text-amber-800 bg-amber-50'
                        }`}
                      >
                        {clm.conditionReport.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                      ₹{clm.originalDeposit.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums font-semibold text-red-600">
                      ₹{clm.damageDeduction.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums font-bold text-emerald-700">
                      ₹{clm.refundAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          clm.claimStatus === 'approved_refund'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                            : clm.claimStatus === 'deposit_deducted'
                            ? 'bg-amber-50 text-amber-800 border border-amber-100'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {clm.claimStatus.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          setSelectedClaim(clm);
                          setClaimDeduction(clm.damageDeduction);
                          setClaimNotes(clm.damageNotes);
                        }}
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                      >
                        Audit Refund
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SERVICE AREAS & HUBS */}
      {activeTab === 'service_areas' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
          <div className="p-5 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Regional Service Areas &amp; Fulfillment Hubs</h3>
            <p className="text-xs text-slate-500">
              Configure multi-city expansion, manage local inventory hubs, and set PIN coverage.
            </p>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map((city) => (
              <div
                key={city.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{city.name}</h4>
                    <div className="text-[11px] text-slate-500">{city.state}</div>
                  </div>

                  <button
                    onClick={() => onToggleCityOperational(city.id)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                      city.isAvailable
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {city.isAvailable ? 'Operational' : 'Disabled'}
                  </button>
                </div>

                <div className="space-y-1 text-xs text-slate-600 font-mono">
                  <div className="flex justify-between">
                    <span>Active Hubs:</span>
                    <span className="font-semibold text-slate-900">{city.activeHubs} Central Depots</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery SLA:</span>
                    <span className="font-semibold text-emerald-700">{city.estDeliveryHours}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80">
                  <div className="text-[11px] text-slate-500 mb-1">Supported PIN codes:</div>
                  <div className="flex flex-wrap gap-1">
                    {city.pinCodes.map((pin) => (
                      <span
                        key={pin}
                        className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-700"
                      >
                        {pin}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: MONGODB & BACKEND API SYNC */}
      {activeTab === 'database' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-6">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  MongoDB Atlas Cluster &amp; Backend API Integration
                </h3>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded font-mono ${
                    dbStatus?.database?.connected
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {dbStatus?.database?.connected ? 'Atlas Connected' : 'In-Memory Engine (Ready for Password)'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Real-time persistence layer tracking documents across MongoDB Atlas and Express REST API endpoints.
              </p>
            </div>

            <button
              onClick={fetchDbHealth}
              disabled={isTestingDb}
              className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingDb ? 'animate-spin text-amber-600' : ''}`} />
              <span>{isTestingDb ? 'Checking Health...' : 'Refresh Status'}</span>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Cluster & Server Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                  Database Cluster
                </div>
                <div className="text-sm font-bold text-slate-900 font-mono flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>cluster0.kk44seh.mongodb.net</span>
                </div>
                <div className="text-xs text-slate-600 font-mono">
                  Database: <span className="font-semibold text-slate-800">rentease</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  User: <span className="font-semibold text-slate-700">saunnddryasr_db_user</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                  Full-Stack Express API
                </div>
                <div className="text-sm font-bold text-slate-900 font-mono flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-amber-600" />
                  <span>Local Express Port 3000</span>
                </div>
                <div className="text-xs text-slate-600 font-mono">
                  Mounted: <span className="text-emerald-700 font-semibold">Vite SPA + REST Middlewares</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  API Prefix: <span className="font-semibold text-slate-700">/api/*</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                  External Vercel Services
                </div>
                <div className="text-xs font-mono truncate space-y-1">
                  <div className="flex items-center gap-1 text-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold">API:</span>
                    <a
                      href="https://rentease1-31epwmjif-saunnddryasr-cells-projects.vercel.app"
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-700 hover:underline truncate"
                    >
                      rentease1-31epwmjif...vercel.app
                    </a>
                  </div>
                  <div className="flex items-center gap-1 text-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold">WEB:</span>
                    <a
                      href="https://rentease1-frontend-9kkh7d94a-saunnddryasr-cells-projects.vercel.app"
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-700 hover:underline truncate"
                    >
                      rentease1-frontend...vercel.app
                    </a>
                  </div>
                </div>
                <div className="text-[10px] text-emerald-600 font-mono flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>CORS &amp; Atlas Linked</span>
                </div>
              </div>
            </div>

            {/* Collection Document Counts */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Synchronized Collections &amp; Document Counts
                </h4>
                {onRefreshDb && (
                  <button
                    onClick={() => {
                      onRefreshDb();
                      fetchDbHealth();
                    }}
                    disabled={isTestingDb}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isTestingDb ? 'animate-spin' : ''}`} />
                    <span>Re-sync All Collections</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 bg-white border border-slate-200 rounded-xl text-center">
                  <div className="text-[11px] text-slate-500">Products</div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
                    {products.length}
                  </div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">Seeded &amp; Ready</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl text-center">
                  <div className="text-[11px] text-slate-500">Rental Orders</div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
                    {orders.length}
                  </div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">Active Sync</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl text-center">
                  <div className="text-[11px] text-slate-500">Maintenance</div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
                    {tickets.length}
                  </div>
                  <div className="text-[10px] text-amber-600 mt-0.5">Tickets Tracked</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl text-center">
                  <div className="text-[11px] text-slate-500">Damage Claims</div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
                    {claims.length}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Audits Logged</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl text-center col-span-2 sm:col-span-1">
                  <div className="text-[11px] text-slate-500">Service Cities</div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
                    {cities.length}
                  </div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">Hubs Operating</div>
                </div>
              </div>
            </div>

            {/* Connection Instructions Card */}
            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 font-mono">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>MongoDB Atlas Setup Guide for Production Persistence</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The RentEase backend natively supports MongoDB Atlas. To link your database directly, replace <code className="text-amber-300 bg-slate-800 px-1 py-0.5 rounded">&lt;db_password&gt;</code> with your actual database user password in the <code className="text-amber-300 bg-slate-800 px-1 py-0.5 rounded">MONGODB_URI</code> environment variable:
              </p>
              <div className="p-2.5 bg-black/60 rounded-lg font-mono text-[11px] text-emerald-400 break-all border border-slate-800 select-all">
                mongodb+srv://saunnddryasr_db_user:&lt;YOUR_PASSWORD&gt;@cluster0.kk44seh.mongodb.net/rentease?retryWrites=true&amp;w=majority&amp;appName=Cluster0
              </div>
              <div className="text-[11px] text-slate-400 pt-1">
                Once set, the server automatically connects, provisions the <code className="text-slate-300">rentease</code> database, seeds collections if empty, and stores all orders, tickets, and inventory updates directly in MongoDB Atlas.
              </div>
            </div>

            {/* Live Backend Connection URL Setting */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <Server className="w-4 h-4 text-amber-500" />
                    <span>Backend API URL Configuration</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Configure the target API endpoint. If frontend is deployed alone on Vercel, paste your deployed backend URL.
                  </p>
                </div>
                <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full ${
                  dbStatus?.status === 'ok'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {dbStatus?.status === 'ok' ? '● Connected' : '○ Standalone / Offline'}
                </span>
              </div>

              <form onSubmit={handleSaveApiUrl} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={customApiUrl}
                  onChange={(e) => setCustomApiUrl(e.target.value)}
                  placeholder="e.g. https://rentease-backend.vercel.app/api or /api"
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  disabled={isTestingDb}
                  className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  {isTestingDb ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : saveUrlSuccess ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : null}
                  <span>{saveUrlSuccess ? 'Saved & Tested' : 'Save & Test'}</span>
                </button>
              </form>
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <span>Active Target:</span>
                <code className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded font-mono">
                  {api.getEndpointUrl('/health')}
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD INVENTORY ASSET */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add New Rental Product</h3>
            <p className="text-xs text-slate-500">
              Provision a new furniture or appliance asset into the RentEase fleet.
            </p>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Minimalist Bookshelf & Storage"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="furniture">Furniture</option>
                    <option value="appliances">Appliances</option>
                    <option value="bundles">Room Bundles</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sub-Category
                  </label>
                  <select
                    value={newSubCategory}
                    onChange={(e) => setNewSubCategory(e.target.value as SubCategory)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="sofa">Sofa / Couch</option>
                    <option value="bed">Bed &amp; Mattress</option>
                    <option value="refrigerator">Refrigerator</option>
                    <option value="washing_machine">Washing Machine</option>
                    <option value="tv">Smart TV</option>
                    <option value="desk">Work Desk</option>
                    <option value="chair">Task Chair</option>
                    <option value="table">Dining Table</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Base Rent (₹/mo)
                  </label>
                  <input
                    type="number"
                    required
                    value={newRent3m}
                    onChange={(e) => setNewRent3m(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Deposit (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newDeposit}
                    onChange={(e) => setNewDeposit(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Key materials, finish, and dimensions..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TICKET RESOLUTION */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Manage Ticket #{selectedTicket.id}
            </h3>
            <p className="text-xs text-slate-500">
              Update technician assignment, progress milestone, or log resolution notes.
            </p>

            <form onSubmit={submitTicketUpdate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Technician
                </label>
                <input
                  type="text"
                  required
                  value={assignTech}
                  onChange={(e) => setAssignTech(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={ticketTargetStatus}
                  onChange={(e) =>
                    setTicketTargetStatus(e.target.value as MaintenanceTicket['status'])
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="open">Open (Unscheduled)</option>
                  <option value="in_progress">In Progress (Tech Dispatched)</option>
                  <option value="resolved">Resolved (Customer Verified)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resolution Notes
                </label>
                <textarea
                  rows={3}
                  value={ticketResolutionNote}
                  onChange={(e) => setTicketResolutionNote(e.target.value)}
                  placeholder="e.g. Component inspected and recalibrated. Running within nominal parameters."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CLAIM AUDIT & REFUND */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Audit Return &amp; Refund ({selectedClaim.id})
            </h3>
            <p className="text-xs text-slate-500">
              Assess item condition, specify any damage deductions according to policy, and finalize refund.
            </p>

            <form onSubmit={submitClaimResolution} className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Product:</span>
                  <span className="font-semibold text-slate-900">{selectedClaim.productTitle}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Original Security Deposit:</span>
                  <span className="font-bold text-slate-900">₹{selectedClaim.originalDeposit}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Damage Deduction Amount (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  max={selectedClaim.originalDeposit}
                  value={claimDeduction}
                  onChange={(e) => setClaimDeduction(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono"
                />
                <div className="text-[11px] text-slate-500 mt-1">
                  Net Refund to Customer:{' '}
                  <strong className="text-emerald-700 font-mono">
                    ₹{selectedClaim.originalDeposit - claimDeduction}
                  </strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Inspection Assessment Notes
                </label>
                <textarea
                  rows={2}
                  value={claimNotes}
                  onChange={(e) => setClaimNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedClaim(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Approve Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
