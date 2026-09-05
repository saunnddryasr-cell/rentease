import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rentalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rental' },
  issueType: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'open' },
}, { timestamps: true });

export default mongoose.model('Maintenance', maintenanceSchema);
