import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1, min: 1 },
  tenureMonths: { type: Number, default: 1, min: 1 },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  deliveryAddress: { type: mongoose.Schema.Types.Mixed, default: {} },
  deliveryDate: Date,
  paymentMethod: { type: String, default: 'card' },
  status: { type: String, enum: ['active', 'returned', 'cancelled'], default: 'active' },
}, { timestamps: true });

export default mongoose.model('Rental', rentalSchema);
