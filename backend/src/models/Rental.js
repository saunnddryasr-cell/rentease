const mongoose = require('mongoose');

const rentalItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1, min: 1 },
  monthlyRent: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
});

const rentalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [rentalItemSchema],
    tenureMonths: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    deliveryAddress: {
      line1: String,
      city: String,
      state: String,
      pincode: String,
    },
    deliveryDate: { type: Date },
    deliverySlot: { type: String },
    monthlyTotal: { type: Number, required: true },
    securityTotal: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'active', 'return_requested', 'returned', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    returnDate: { type: Date },
    extensionRequested: { type: Boolean, default: false },
    damageNotes: { type: String },
  },
  { timestamps: true }
);

rentalSchema.pre('save', function (next) {
  if (this.startDate && this.tenureMonths && !this.endDate) {
    const d = new Date(this.startDate);
    d.setMonth(d.getMonth() + this.tenureMonths);
    this.endDate = d;
  }
  next();
});

module.exports = mongoose.model('Rental', rentalSchema);