const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    rental: { type: mongoose.Schema.Types.ObjectId, ref: 'Rental', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    issueType: {
      type: String,
      enum: ['repair', 'replacement', 'cleaning', 'other'],
      required: true,
    },
    description: { type: String, required: true },
    preferredDate: { type: Date },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'rejected'],
      default: 'open',
    },
    resolvedAt: { type: Date },
    remarks: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MaintenanceRequest', maintenanceSchema);