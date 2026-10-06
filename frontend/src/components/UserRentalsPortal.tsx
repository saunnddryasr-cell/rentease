import React, { useState } from 'react';
import {
  Package,
  Wrench,
  Clock,
  Calendar,
  CheckCircle2,
  RefreshCw,
  PlusCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { RentalOrder, MaintenanceTicket, RentalTenure } from '../types';

interface UserRentalsPortalProps {
  orders: RentalOrder[];
  tickets: MaintenanceTicket[];
  onCreateTicket: (ticket: MaintenanceTicket) => void;
  onExtendTenure: (orderId: string, additionalMonths: RentalTenure) => void;
  onScheduleReturn: (orderId: string, date: string, reason: string) => void;
  onRequestRelocation: (orderId: string, newAddress: string, moveDate: string) => void;
  onBrowseMore: () => void;
}

export const UserRentalsPortal: React.FC<UserRentalsPortalProps> = ({
  orders,
  tickets,
  onCreateTicket,
  onExtendTenure,
  onScheduleReturn,
  onRequestRelocation,
  onBrowseMore
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'tickets' | 'history'>('active');

  // Modal states
  const [selectedOrderForAction, setSelectedOrderForAction] = useState<RentalOrder | null>(null);
  const [actionType, setActionType] = useState<'ticket' | 'extend' | 'relocate' | 'return' | null>(null);

  // Form states for modals
  const [ticketProduct, setTicketProduct] = useState('');
  const [issueCategory, setIssueCategory] = useState<MaintenanceTicket['issueCategory']>('general_servicing');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketPriority, setTicketPriority] = useState<MaintenanceTicket['priority']>('normal');
  const [ticketDate, setTicketDate] = useState('');

  const [extendMonths, setExtendMonths] = useState<RentalTenure>(6);
  const [relocateAddress, setRelocateAddress] = useState('');
  const [relocateDate, setRelocateDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returnReason, setReturnReason] = useState('Tenure completed / Relocating out of city');

  const activeOrders = orders.filter((o) => o.status === 'active' || o.status === 'scheduled');
  const pastOrders = orders.filter((o) => o.status === 'returned' || o.status === 'return_requested');

  const totalMonthlyActive = activeOrders.reduce((sum, o) => sum + o.totalMonthlyRent, 0);
  const totalDepositHeld = activeOrders.reduce((sum, o) => sum + o.totalDeposit, 0);

  const openTicketModal = (order: RentalOrder, productTitle?: string) => {
    setSelectedOrderForAction(order);
    setTicketProduct(productTitle || order.items[0]?.title || 'Rental Item');
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 3);
    setTicketDate(nextWeek.toISOString().split('T')[0]);
    setActionType('ticket');
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForAction) return;

    const categoryLabels: Record<string, string> = {
      cooling_issue: 'Temperature & Cooling',
      mechanical_defect: 'Mechanical / Joint Defect',
      physical_wear: 'Fabric / Cushion Wear',
      electrical_failure: 'Power & Motor Fault',
      general_servicing: 'General Deep Cleaning & Servicing'
    };

    const newTicket: MaintenanceTicket = {
      id: `tkt-${Date.now()}`,
      orderId: selectedOrderForAction.id,
      orderNumber: selectedOrderForAction.orderNumber,
      productTitle: ticketProduct,
      issueCategory,
      issueCategoryLabel: categoryLabels[issueCategory] || 'General Maintenance',
      description: ticketDesc,
      priority: ticketPriority,
      status: 'open',
      preferredDate: ticketDate,
      technicianName: 'To be assigned within 4 hours',
      resolutionNotes: 'Ticket logged. Support team will contact via registered phone to confirm appointment.',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onCreateTicket(newTicket);
    setActionType(null);
    setTicketDesc('');
    setActiveTab('tickets');
  };

  const handleExtendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForAction) return;
    onExtendTenure(selectedOrderForAction.id, extendMonths);
    setActionType(null);
  };

  const handleRelocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForAction) return;
    onRequestRelocation(selectedOrderForAction.id, relocateAddress, relocateDate);
    setActionType(null);
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForAction) return;
    onScheduleReturn(selectedOrderForAction.id, returnDate, returnReason);
    setActionType(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Profile Summary Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium tracking-wide mb-1">
            <span>Verified Subscriber</span>
            <span aria-hidden="true">·</span>
            <span>Bengaluru Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Sarah Chen's Rental Dashboard
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Manage your monthly subscriptions, request free maintenance visits, or book hassle-free relocation.
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Active Items</div>
            <div className="text-xl font-bold font-mono text-white tabular-nums">
              {activeOrders.reduce((sum, o) => sum + o.items.length, 0)}
            </div>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Monthly Rent</div>
            <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
              ₹{totalMonthlyActive.toLocaleString()}
            </div>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Deposits Held</div>
            <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
              ₹{totalDepositHeld.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('active')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'active'
              ? 'border-amber-600 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Active Subscriptions ({activeOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'tickets'
              ? 'border-amber-600 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Maintenance Tickets ({tickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'history'
              ? 'border-amber-600 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Rental Invoices &amp; Deposits</span>
        </button>
      </div>

      {/* TAB 1: ACTIVE SUBSCRIPTIONS */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          {activeOrders.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-800">No active subscriptions currently</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Ready to furnish your home? Rent premium furniture &amp; appliances with zero deposit hassles.
              </p>
              <button
                onClick={onBrowseMore}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors mt-2"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all space-y-6"
                >
                  {/* Order header row */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          Order {order.orderNumber}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>Placed on {order.createdAt}</span>
                        <span aria-hidden="true">·</span>
                        <span>{order.city}</span>
                      </div>
                      <div className="text-xs text-slate-600">
                        Delivering to: <span className="text-slate-900 font-medium">{order.deliveryAddress}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {order.status === 'active' ? 'Active Subscription' : 'Scheduled for Delivery'}
                      </span>
                    </div>
                  </div>

                  {/* Items in this order */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 flex gap-3 items-center"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-lg bg-white shrink-0 border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {item.title}
                          </h4>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {item.tenure} Months Plan · Free Maintenance Included
                          </div>
                          <div className="flex items-center justify-between mt-1 text-xs font-mono">
                            <span className="font-semibold text-slate-900">
                              ₹{item.monthlyRent.toLocaleString()} /mo
                            </span>
                            <button
                              onClick={() => openTicketModal(order, item.title)}
                              className="text-[11px] text-amber-700 hover:text-amber-800 font-sans font-medium flex items-center gap-1"
                            >
                              <Wrench className="w-3 h-3" />
                              Request Service
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery / Rental Timeline & Next Step */}
                  <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/60">
                    <div className="text-xs font-semibold text-slate-900 mb-3 flex items-center justify-between">
                      <span>Order Fulfillment &amp; Operational Milestones</span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Tenure Valid Till: {order.tenureEndDate}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {order.trackingSteps.map((step, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-lg border text-xs ${
                            step.completed
                              ? 'bg-white border-emerald-200 text-slate-900'
                              : 'bg-white/60 border-slate-200 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                            {step.completed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                            )}
                            <span className="truncate">{step.title}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                            {step.description}
                          </div>
                          <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                            {step.date}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Management Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-500">Monthly Bill: </span>
                        <span className="font-bold text-slate-900">₹{order.totalMonthlyRent.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Security Deposit: </span>
                        <span className="font-bold text-emerald-700">₹{order.totalDeposit.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrderForAction(order);
                          setActionType('extend');
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                        <span>Extend Plan</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedOrderForAction(order);
                          setRelocateAddress(order.deliveryAddress);
                          const futureDate = new Date();
                          futureDate.setDate(futureDate.getDate() + 10);
                          setRelocateDate(futureDate.toISOString().split('T')[0]);
                          setActionType('relocate');
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5 text-slate-600" />
                        <span>Free Relocation</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedOrderForAction(order);
                          const futureDate = new Date();
                          futureDate.setDate(futureDate.getDate() + 5);
                          setReturnDate(futureDate.toISOString().split('T')[0]);
                          setActionType('return');
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-700 bg-white border border-slate-200 hover:border-red-200 rounded-lg transition-colors"
                      >
                        Schedule Return
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MAINTENANCE TICKETS */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Doorstep Maintenance &amp; Repairs</h3>
              <p className="text-xs text-slate-500">
                100% free technician visits for wear, calibration, plumbing, or regular servicing.
              </p>
            </div>
            {activeOrders.length > 0 && (
              <button
                onClick={() => openTicketModal(activeOrders[0])}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Raise New Service Ticket</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      Ticket #{ticket.id}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-xs font-medium text-slate-600">
                      {ticket.productTitle}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-xs text-slate-400">Order {ticket.orderNumber}</span>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                      ticket.status === 'resolved'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : ticket.status === 'in_progress'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {ticket.status === 'resolved'
                      ? 'Service Completed'
                      : ticket.status === 'in_progress'
                      ? 'Technician Assigned'
                      : 'Ticket Open'}
                  </span>
                </div>

                <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                  <div className="font-semibold text-slate-900">
                    Category: {ticket.issueCategoryLabel}
                  </div>
                  <div>{ticket.description}</div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 text-xs pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
                    <span>Preferred Visit: {ticket.preferredDate}</span>
                    {ticket.technicianName && (
                      <span>Assigned: <strong className="text-slate-800">{ticket.technicianName}</strong></span>
                    )}
                  </div>
                  {ticket.resolutionNotes && (
                    <div className="text-[11px] text-emerald-700 font-medium">
                      Status Note: {ticket.resolutionNotes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RENTAL HISTORY & DEPOSITS */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Invoices &amp; Security Deposit Ledger</h3>
            <p className="text-xs text-slate-500">
              Transparent tracking of monthly payments, active deposits, and refund transfers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Transaction / Order</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Item Breakdown</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Deposit Status</th>
                  <th className="py-3 px-4">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {o.orderNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono">
                      {o.createdAt}
                    </td>
                    <td className="py-3 px-4 text-slate-800 max-w-xs truncate">
                      {o.items.map((i) => i.title).join(', ')}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums font-semibold text-slate-900">
                      ₹{o.totalMonthlyRent.toLocaleString()} /mo
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-700 font-semibold font-mono text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        ₹{o.totalDeposit.toLocaleString()} Held Secure
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => alert(`Tax Invoice downloaded for Order ${o.orderNumber}`)}
                        className="text-amber-700 hover:text-amber-800 font-medium underline"
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: RAISE MAINTENANCE TICKET */}
      {actionType === 'ticket' && selectedOrderForAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Request Doorstep Maintenance
            </h3>
            <p className="text-xs text-slate-500">
              Our certified technicians fix wear, replace components, or perform preventive servicing at zero cost.
            </p>

            <form onSubmit={handleTicketSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product
                </label>
                <select
                  value={ticketProduct}
                  onChange={(e) => setTicketProduct(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                >
                  {selectedOrderForAction.items.map((item) => (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Issue Category
                </label>
                <select
                  value={issueCategory}
                  onChange={(e) =>
                    setIssueCategory(e.target.value as MaintenanceTicket['issueCategory'])
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="cooling_issue">Cooling &amp; Temperature Fluctuation</option>
                  <option value="mechanical_defect">Mechanical Squeak / Joint Tightening</option>
                  <option value="physical_wear">Upholstery / Fabric Care</option>
                  <option value="electrical_failure">Electrical &amp; Motor Inspection</option>
                  <option value="general_servicing">Routine Deep Servicing &amp; Sanitization</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Describe the Issue
                </label>
                <textarea
                  required
                  rows={3}
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  placeholder="e.g. Mild vibration noise during high spin cycle..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Visit Date
                  </label>
                  <input
                    type="date"
                    required
                    value={ticketDate}
                    onChange={(e) => setTicketDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Urgency
                  </label>
                  <select
                    value={ticketPriority}
                    onChange={(e) =>
                      setTicketPriority(e.target.value as MaintenanceTicket['priority'])
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="normal">Normal (48 hrs)</option>
                    <option value="urgent">Urgent (Within 24 hrs)</option>
                    <option value="low">Flexible / Routine</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActionType(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Book Service Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EXTEND TENURE */}
      {actionType === 'extend' && selectedOrderForAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Extend Rental Plan ({selectedOrderForAction.orderNumber})
            </h3>
            <p className="text-xs text-slate-500">
              Extending your tenure locks in higher discounts and requires zero additional deposit.
            </p>

            <form onSubmit={handleExtendSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setExtendMonths(6)}
                  className={`p-3 rounded-lg border text-left ${
                    extendMonths === 6
                      ? 'border-amber-600 bg-amber-50/50'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">+6 Months Extension</div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-1">12% Monthly Discount</div>
                </button>
                <button
                  type="button"
                  onClick={() => setExtendMonths(12)}
                  className={`p-3 rounded-lg border text-left ${
                    extendMonths === 12
                      ? 'border-amber-600 bg-amber-50/50'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">+12 Months Extension</div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-1">25% Max Savings</div>
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-600 border border-slate-100">
                <div className="flex justify-between">
                  <span>Current Tenure Ends:</span>
                  <span className="font-mono text-slate-900">{selectedOrderForAction.tenureEndDate}</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-900 pt-1 border-t border-slate-200">
                  <span>New End Date:</span>
                  <span className="font-mono text-amber-700">
                    {(() => {
                      const d = new Date(selectedOrderForAction.tenureEndDate);
                      d.setMonth(d.getMonth() + extendMonths);
                      return d.toISOString().split('T')[0];
                    })()}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActionType(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Confirm Plan Extension
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: FREE RELOCATION */}
      {actionType === 'relocate' && selectedOrderForAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Book Free Doorstep Relocation
            </h3>
            <p className="text-xs text-slate-500">
              Moving to a new flat in {selectedOrderForAction.city}? Our logistics crew disassembles, packs, transports, and reassembles your rented items for free!
            </p>

            <form onSubmit={handleRelocationSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Apartment / Address
                </label>
                <textarea
                  required
                  rows={2}
                  value={relocateAddress}
                  onChange={(e) => setRelocateAddress(e.target.value)}
                  placeholder="Enter complete new street address, apartment # and landmark"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Moving Date
                </label>
                <input
                  type="date"
                  required
                  value={relocateDate}
                  onChange={(e) => setRelocateDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Zero Relocation Fee</div>
                  <div className="text-[11px] text-emerald-700">
                    Complimentary relocation service benefit active on all plans over 6 months.
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActionType(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Book Relocation Crew
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: SCHEDULE RETURN & DEPOSIT REFUND */}
      {actionType === 'return' && selectedOrderForAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Schedule Return &amp; Deposit Refund
            </h3>
            <p className="text-xs text-slate-500">
              Choose a pickup date. Our quality team will conduct a rapid 5-minute visual check and initiate 100% deposit refund directly to your bank account.
            </p>

            <form onSubmit={handleReturnSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Pickup Date
                </label>
                <input
                  type="date"
                  required
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Return
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="Tenure completed / Relocating out of city">Tenure completed / Relocating out of city</option>
                  <option value="Moving to pre-furnished house">Moving to pre-furnished house</option>
                  <option value="Upgrading to larger bundle">Upgrading to larger bundle</option>
                  <option value="Other">Other reason</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1 font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Refundable Deposit Due:</span>
                  <span className="font-bold text-emerald-700">
                    ₹{selectedOrderForAction.totalDeposit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Refund Method:</span>
                  <span>Original Payment Card / UPI</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActionType(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Schedule Pickup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
