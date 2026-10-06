import React, { useState } from 'react';
import { X, Trash2, Calendar, MapPin, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { CartItem, RentalOrder, RentalTenure, ServiceCity } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onUpdateTenure: (id: string, tenure: RentalTenure) => void;
  onPlaceOrder: (order: RentalOrder) => void;
  selectedCity: string;
  cities: ServiceCity[];
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateTenure,
  onPlaceOrder,
  selectedCity,
  cities
}) => {
  const [step, setStep] = useState<'review' | 'delivery' | 'confirmed'>('review');
  const [createdOrder, setCreatedOrder] = useState<RentalOrder | null>(null);

  // Delivery form state
  const [address, setAddress] = useState('Flat 402, Green Glen Layout, Bellandur');
  const [pinCode, setPinCode] = useState('560103');
  const [customerName, setCustomerName] = useState('Sarah Chen');
  const [customerEmail, setCustomerEmail] = useState('sarah.chen@techcorp.io');
  const [customerPhone, setCustomerPhone] = useState('+91 98452 11094');
  
  // Tomorrow's date formatted YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [deliveryDate, setDeliveryDate] = useState(defaultDateStr);
  const [deliverySlot, setDeliverySlot] = useState('Morning (09:00 AM – 01:00 PM)');
  const [kycVerified, setKycVerified] = useState(true);

  if (!isOpen) return null;

  const totalMonthlyRent = items.reduce((acc, item) => acc + item.monthlyRent * item.quantity, 0);
  const totalDeposit = items.reduce((acc, item) => acc + item.securityDeposit * item.quantity, 0);
  const grandTotalToday = totalMonthlyRent + totalDeposit;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const maxTenure = Math.max(...items.map((i) => i.tenure), 6);
    
    // Calculate tenure end date
    const endDate = new Date(deliveryDate);
    endDate.setMonth(endDate.getMonth() + maxTenure);

    const newOrder: RentalOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `RE-${randomSuffix}`,
      createdAt: new Date().toISOString().split('T')[0],
      customerName,
      customerEmail,
      customerPhone,
      city: selectedCity,
      deliveryAddress: `${address}, ${selectedCity} - ${pinCode}`,
      deliveryDate,
      deliverySlot,
      items: [...items],
      totalMonthlyRent,
      totalDeposit,
      status: 'scheduled',
      tenureMonths: maxTenure,
      tenureEndDate: endDate.toISOString().split('T')[0],
      trackingSteps: [
        {
          title: 'Order Confirmed',
          description: 'Payment verified & refundable deposit reserved',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          completed: true
        },
        {
          title: 'KYC Document Verified',
          description: 'Digital Aadhaar / PAN verified instantly',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          completed: true
        },
        {
          title: 'Dispatched from Local Hub',
          description: `Dispatched from ${selectedCity} Central Logistics Center`,
          date: deliveryDate,
          completed: false
        },
        {
          title: 'Doorstep Assembly & Handover',
          description: 'Technician setup, unboxing, and operational demo',
          date: deliveryDate,
          completed: false
        }
      ],
      kycVerified
    };

    onPlaceOrder(newOrder);
    setCreatedOrder(newOrder);
    setStep('confirmed');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              {step === 'review'
                ? 'Your Rental Bag'
                : step === 'delivery'
                ? 'Delivery & Schedule'
                : 'Booking Confirmed'}
            </h2>
            {items.length > 0 && step === 'review' && (
              <span className="text-xs text-slate-500 font-mono">({items.length} items)</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* STEP 1: REVIEW ITEMS */}
          {step === 'review' && (
            <>
              {items.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800">Your bag is empty</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Explore our furniture and home appliances catalog to configure your monthly rental setup.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex gap-3 items-start"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg bg-white shrink-0 border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-semibold text-slate-900 truncate">
                            {item.title}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors p-0.5 ml-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Tenure Selector */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[11px] text-slate-500">Tenure:</span>
                          <select
                            value={item.tenure}
                            onChange={(e) =>
                              onUpdateTenure(item.id, Number(e.target.value) as RentalTenure)
                            }
                            className="text-[11px] font-medium bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-800 focus:outline-none"
                          >
                            <option value={3}>3 Months</option>
                            <option value={6}>6 Months (12% off)</option>
                            <option value={12}>12 Months (25% off)</option>
                          </select>
                        </div>

                        {/* Price breakdown */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-xs">
                          <div>
                            <span className="font-bold font-mono text-slate-900 tabular-nums">
                              ₹{item.monthlyRent.toLocaleString()}
                            </span>
                            <span className="text-[11px] text-slate-500"> /mo</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Dep: ₹{(item.securityDeposit * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* STEP 2: DELIVERY & SCHEDULING FORM */}
          {step === 'delivery' && (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Delivering to {selectedCity}</span>
                  <div className="text-[11px] text-amber-800">
                    Complimentary doorstep assembly &amp; demo included with every order.
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-amber-600 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Street Address &amp; Apartment
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      required
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-amber-600 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      disabled
                      value={selectedCity}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-500 font-semibold"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        Delivery Date
                      </label>
                      <input
                        type="date"
                        required
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-amber-600 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Time Slot
                      </label>
                      <select
                        value={deliverySlot}
                        onChange={(e) => setDeliverySlot(e.target.value)}
                        className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-amber-600"
                      >
                        <option value="Morning (09:00 AM – 01:00 PM)">Morning (09:00 - 13:00)</option>
                        <option value="Afternoon (02:00 PM – 06:00 PM)">Afternoon (14:00 - 18:00)</option>
                        <option value="Evening (06:00 PM – 09:00 PM)">Evening (18:00 - 21:00)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Instant Digital KYC Simulation */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className="font-semibold text-slate-800">
                      Paperless Digital KYC (Pre-Approved)
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Your work profile &amp; ID are verified. No hardcopy document collection required during delivery.
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* STEP 3: ORDER CONFIRMED */}
          {step === 'confirmed' && createdOrder && (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                  Order {createdOrder.orderNumber} Booked
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Your Rental Setup is Confirmed!
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                  We've reserved your items and assigned our local assembly team in {createdOrder.city}. Delivery is set for {createdOrder.deliveryDate}.
                </p>
              </div>

              {/* Order quick snapshot */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500">Order Reference:</span>
                  <span className="font-bold text-slate-900">{createdOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500">Delivery Slot:</span>
                  <span className="text-slate-800">{createdOrder.deliverySlot}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500">Address:</span>
                  <span className="text-slate-800 truncate max-w-[200px]">{createdOrder.deliveryAddress}</span>
                </div>
                <div className="flex justify-between font-mono pt-2 border-t border-slate-200">
                  <span className="text-slate-500">Refundable Deposit Held:</span>
                  <span className="font-bold text-emerald-700">₹{createdOrder.totalDeposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500">Monthly Billing:</span>
                  <span className="font-bold text-slate-900">₹{createdOrder.totalMonthlyRent.toLocaleString()} / mo</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Go to My Active Rentals Portal
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer with Calculation Matrix & Actions */}
        {step !== 'confirmed' && items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>1st Month Rental Fee:</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900">
                  ₹{totalMonthlyRent.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Refundable Security Deposit:</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900">
                  ₹{totalDeposit.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Doorstep Delivery &amp; Setup:</span>
                <span className="font-semibold text-emerald-700">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Due Today:</span>
                <span className="font-mono tabular-nums text-amber-700">
                  ₹{grandTotalToday.toLocaleString()}
                </span>
              </div>
            </div>

            {step === 'review' ? (
              <button
                onClick={() => setStep('delivery')}
                className="w-full py-3 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Proceed to Schedule Delivery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('review')}
                  className="px-4 py-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm text-center"
                >
                  Confirm &amp; Place Rental Order
                </button>
              </div>
            )}

            <div className="text-[11px] text-center text-slate-400">
              Safe &amp; encrypted checkout · 100% deposit refund guaranteed
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
