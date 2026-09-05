import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: { type: String, unique: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'other' },
  subCategory: { type: String, default: '' },
  monthlyRent: { type: Number, required: true, min: 0 },
  securityDeposit: { type: Number, default: 0, min: 0 },
  availableQuantity: { type: Number, default: 0, min: 0 },
  images: { type: [String], default: [] },
  status: { type: String, enum: ['available', 'unavailable'], default: 'available' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
