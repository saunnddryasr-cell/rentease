import { Router } from 'express';
import Order from '../models/Order.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);
router.post('/', async (req, res, next) => { try { const order = await Order.create({ ...req.body, userId: req.user._id }); res.status(201).json({ success: true, data: order, order }); } catch (error) { next(error); } });
router.get('/my-orders', async (req, res, next) => { try { const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 }); res.json({ success: true, data: orders, orders }); } catch (error) { next(error); } });
router.get('/', requireAdmin, async (req, res, next) => { try { const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 }); res.json({ success: true, data: orders, orders }); } catch (error) { next(error); } });
router.get('/:id', async (req, res, next) => { try { const order = await Order.findOne({ _id: req.params.id, ...(req.user.role !== 'admin' && { userId: req.user._id }) }); if (!order) return res.status(404).json({ success: false, message: 'Order not found' }); res.json({ success: true, data: order, order }); } catch (error) { next(error); } });
router.put('/:id/cancel', async (req, res, next) => { try { const order = await Order.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { status: 'cancelled' }, { new: true }); res.json({ success: true, data: order, order }); } catch (error) { next(error); } });
router.put('/:id/status', requireAdmin, async (req, res, next) => { try { const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }); res.json({ success: true, data: order, order }); } catch (error) { next(error); } });
export default router;
