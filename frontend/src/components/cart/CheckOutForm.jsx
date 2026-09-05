// src/components/cart/CheckoutForm.jsx
import React from 'react';
import { FaHome, FaCity, FaMapMarkerAlt, FaBuilding, FaCalendarAlt, FaClock, FaCreditCard, FaComment } from 'react-icons/fa';

const CheckoutForm = ({ formData, onChange, onSubmit, loading }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Delivery Address */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Delivery Address</h3>
        
        <div>
          <label className="label">Street Address *</label>
          <div className="relative">
            <FaHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="deliveryAddress.street"
              value={formData.deliveryAddress.street}
              onChange={onChange}
              className="input pl-10"
              placeholder="123 Main Street, Apartment 4B"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">City *</label>
            <div className="relative">
              <FaCity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="deliveryAddress.city"
                value={formData.deliveryAddress.city}
                onChange={onChange}
                className="input pl-10"
                placeholder="Mumbai"
                required
              />
            </div>
          </div>
          <div>
            <label className="label">State *</label>
            <div className="relative">
              <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="deliveryAddress.state"
                value={formData.deliveryAddress.state}
                onChange={onChange}
                className="input pl-10"
                placeholder="Maharashtra"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Pincode *</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="deliveryAddress.pincode"
                value={formData.deliveryAddress.pincode}
                onChange={onChange}
                className="input pl-10"
                placeholder="400001"
                required
              />
            </div>
          </div>
          <div>
            <label className="label">Country</label>
            <input
              type="text"
              value="India"
              className="input bg-gray-100"
              disabled
            />
          </div>
        </div>
      </div>

      {/* Delivery Schedule */}
      <div className="space-y-4 border-t border-gray-200 pt-4">
        <h3 className="font-semibold text-gray-700">Delivery Schedule</h3>
        
        <div>
          <label className="label">Delivery Date *</label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={onChange}
              className="input pl-10"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        </div>

        <div>
          <label className="label">Time Slot</label>
          <div className="relative">
            <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              name="deliveryTimeSlot"
              value={formData.deliveryTimeSlot}
              onChange={onChange}
              className="input pl-10"
            >
              <option value="">Select time slot</option>
              <option value="9am-12pm">9:00 AM - 12:00 PM</option>
              <option value="12pm-3pm">12:00 PM - 3:00 PM</option>
              <option value="3pm-6pm">3:00 PM - 6:00 PM</option>
              <option value="6pm-9pm">6:00 PM - 9:00 PM</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rental Duration */}
      <div className="space-y-4 border-t border-gray-200 pt-4">
        <h3 className="font-semibold text-gray-700">Rental Duration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Start Date *</label>
            <input
              type="date"
              name="rentalStartDate"
              value={formData.rentalStartDate}
              onChange={onChange}
              className="input"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div>
            <label className="label">End Date *</label>
            <input
              type="date"
              name="rentalEndDate"
              value={formData.rentalEndDate}
              onChange={onChange}
              className="input"
              min={formData.rentalStartDate || new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-4 border-t border-gray-200 pt-4">
        <h3 className="font-semibold text-gray-700">Payment Method</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['card', 'upi', 'netbanking', 'cash'].map((method) => (
            <label key={method} className={`
              flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all
              ${formData.paymentMethod === method 
                ? 'border-primary-600 bg-primary-50' 
                : 'border-gray-200 hover:border-gray-300'}
            `}>
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={formData.paymentMethod === method}
                onChange={onChange}
                className="sr-only"
              />
              <div className="text-center">
                <FaCreditCard className={`text-xl mx-auto ${formData.paymentMethod === method ? 'text-primary-600' : 'text-gray-400'}`} />
                <span className="text-xs capitalize mt-1 block">
                  {method === 'card' ? 'Credit/Debit' : method}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Special Instructions */}
      <div className="space-y-4 border-t border-gray-200 pt-4">
        <div>
          <label className="label">Special Instructions</label>
          <div className="relative">
            <FaComment className="absolute left-3 top-4 text-gray-400" />
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={onChange}
              className="input pl-10 min-h-[80px]"
              placeholder="Any special instructions for delivery or installation..."
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Placing Order...
            </span>
          ) : (
            'Place Order'
          )}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;