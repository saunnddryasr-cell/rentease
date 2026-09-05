import { Router } from 'express';
import Product from '../models/Product.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();
const shape = (product) => ({ ...product.toObject?.() || product, id: product._id });
router.get('/', async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice } = req.query;
    const query = { isActive: true };
    if (category) query.category = category.toLowerCase();
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    if (minPrice || maxPrice) query.monthlyRent = { ...(minPrice && { $gte: Number(minPrice) }), ...(maxPrice && { $lte: Number(maxPrice) }) };
    const products = (await Product.find(query).sort({ createdAt: -1 })).map(shape);
    res.json({ success: true, data: products, products, total: products.length, totalPages: 1 });
  } catch (error) { next(error); }
});
router.get('/featured', async (req, res, next) => { try { const products = (await Product.find({ isActive: true, status: 'available' }).limit(6)).map(shape); res.json({ success: true, data: products, products }); } catch (error) { next(error); } });
router.get('/categories', async (req, res, next) => { try { const categories = await Product.distinct('category', { isActive: true }); res.json({ success: true, data: categories, categories }); } catch (error) { next(error); } });
router.get('/category/:category', async (req, res, next) => { try { const products = (await Product.find({ category: req.params.category.toLowerCase(), isActive: true })).map(shape); res.json({ success: true, data: products, products }); } catch (error) { next(error); } });
router.get('/:id', async (req, res, next) => { try { const product = await Product.findOne({ $or: [{ _id: req.params.id }, { productId: req.params.id }], isActive: true }); if (!product) return res.status(404).json({ success: false, message: 'Product not found' }); res.json({ success: true, data: shape(product), product: shape(product) }); } catch (error) { next(error); } });
router.post('/', authenticate, requireAdmin, async (req, res, next) => { try { const product = await Product.create(req.body); res.status(201).json({ success: true, data: shape(product), product: shape(product) }); } catch (error) { next(error); } });
router.put('/:id', authenticate, requireAdmin, async (req, res, next) => { try { const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); res.json({ success: true, data: shape(product), product: shape(product) }); } catch (error) { next(error); } });
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => { try { await Product.findByIdAndUpdate(req.params.id, { isActive: false }); res.json({ success: true }); } catch (error) { next(error); } });
router.put('/:id/availability', authenticate, requireAdmin, async (req, res, next) => { try { const product = await Product.findByIdAndUpdate(req.params.id, { status: req.body.available ? 'available' : 'unavailable' }, { new: true }); res.json({ success: true, data: shape(product) }); } catch (error) { next(error); } });

export default router;
