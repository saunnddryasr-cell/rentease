import { Router } from 'express';
import Rental from '../models/Rental.js';
import Product from '../models/Product.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);
const populate = (query) => query.populate('productId');
const rentalResponse = (rental) => {
  const result = rental.toObject?.() || rental;
  const product = result.productId;
  return {
    ...result,
    product,
    monthlyRent: product?.monthlyRent || 0,
    securityDeposit: product?.securityDeposit || 0,
    totalRent: (product?.monthlyRent || 0) * (result.tenureMonths || 1) * (result.quantity || 1),
  };
};
router.post('/', async (req, res, next) => {
  try {
    const product = await Product.findOne({ $or: [{ _id: req.body.productId }, { productId: req.body.productId }], isActive: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const quantity = Number(req.body.quantity || 1);
    if (product.availableQuantity < quantity) return res.status(400).json({ success: false, message: 'Requested quantity is unavailable' });
    const rental = await Rental.create({ ...req.body, productId: product._id, userId: req.user._id, quantity });
    product.availableQuantity -= quantity;
    await product.save();
    const result = rentalResponse(await populate(Rental.findById(rental._id)));
    res.status(201).json({ success: true, data: result, rental: result });
  } catch (error) { next(error); }
});
router.get('/active', async (req, res, next) => { try { const rentals = (await populate(Rental.find({ userId: req.user._id, status: 'active' }).sort({ createdAt: -1 }))).map(rentalResponse); res.json({ success: true, data: rentals, rentals }); } catch (error) { next(error); } });
router.get('/history', async (req, res, next) => { try { const rentals = (await populate(Rental.find({ userId: req.user._id, status: { $ne: 'active' } }).sort({ createdAt: -1 }))).map(rentalResponse); res.json({ success: true, data: rentals, rentals }); } catch (error) { next(error); } });
router.get('/stats', async (req, res, next) => { try { const stats = await Rental.aggregate([{ $match: { userId: req.user._id } }, { $group: { _id: '$status', count: { $sum: 1 } } }]); res.json({ success: true, data: stats }); } catch (error) { next(error); } });
router.get('/:id', async (req, res, next) => { try { const rental = await populate(Rental.findOne({ _id: req.params.id, userId: req.user._id })); if (!rental) return res.status(404).json({ success: false, message: 'Rental not found' }); const result = rentalResponse(rental); res.json({ success: true, data: result, rental: result }); } catch (error) { next(error); } });
const updateStatus = (status) => async (req, res, next) => { try { const rental = await Rental.findOne({ _id: req.params.id, userId: req.user._id }); if (!rental) return res.status(404).json({ success: false, message: 'Rental not found' }); rental.status = status; if (status === 'returned') { rental.endDate = new Date(); await Product.findByIdAndUpdate(rental.productId, { $inc: { availableQuantity: rental.quantity } }); } await rental.save(); const result = rentalResponse(await populate(Rental.findById(rental._id))); res.json({ success: true, data: result, rental: result }); } catch (error) { next(error); } };
router.put('/:id/extend', async (req, res, next) => { try { const rental = await Rental.findOne({ _id: req.params.id, userId: req.user._id }); if (!rental) return res.status(404).json({ success: false, message: 'Rental not found' }); rental.tenureMonths += Number(req.body.extraMonths || 1); rental.endDate = new Date(new Date(rental.startDate).setMonth(new Date(rental.startDate).getMonth() + rental.tenureMonths)); await rental.save(); res.json({ success: true, data: rental, rental }); } catch (error) { next(error); } });
router.put('/:id/cancel', updateStatus('cancelled'));
router.put('/:id/return', updateStatus('returned'));
router.post('/:id/maintenance', async (req, res) => res.status(201).json({ success: true, data: { ...req.body, rentalId: req.params.id, status: 'open' } }));
export default router;
