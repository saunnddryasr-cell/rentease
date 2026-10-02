const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, enum: ['Furniture', 'Appliance'] },
    subCategory: { type: String, required: true },
    images: [{ type: String }],
    monthlyRent: { type: Number, required: true, min: 0 },
    securityDeposit: { type: Number, required: true, min: 0 },
    tenureOptions: { type: [Number], default: [3, 6, 12] },
    stock: { type: Number, required: true, default: 0, min: 0 },
    available: { type: Boolean, default: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    serviceAreas: [{ type: String }],
    condition: { type: String, enum: ['new', 'good', 'fair'], default: 'good' },
  },
  { timestamps: true }
);

productSchema.virtual('isAvailable').get(function () {
  return this.available && this.stock > 0;
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);