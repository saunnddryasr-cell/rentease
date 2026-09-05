import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [mongoose.Schema.Types.Mixed], default: [] },
  total: { type: Number, default: 0 },
  status: { type: String, default: 'pending' },
  shippingAddress: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
