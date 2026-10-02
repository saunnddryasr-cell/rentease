const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    rental: { type: mongoose.Schema.Types.ObjectId, ref: 'Rental', required: true },
    type: { type: String, enum: ['delivery', 'pickup'], required: true },
    scheduledDate: { type: Date, required: true },
    slot: { type: String, required: true },
    address: {
      line1: String,
      city: String,
      state: String,
      pincode: String,
    },
    status: {
      type: String,
      enum: ['scheduled', 'in_transit', 'completed', 'failed'],
      default: 'scheduled',
    },
    partnerName: { type: String },
    partnerPhone: { type: String },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Delivery', deliverySchema);