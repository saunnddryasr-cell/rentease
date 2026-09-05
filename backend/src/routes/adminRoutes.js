import { Router } from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Rental from '../models/Rental.js';
import Order from '../models/Order.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(authenticate, requireAdmin);
router.get('/dashboard', async (req, res, next) => { try { const [users, products, rentals, orders] = await Promise.all([User.countDocuments(), Product.countDocuments({ isActive: true }), Rental.countDocuments(), Order.countDocuments()]); res.json({ success: true, data: { users, products, rentals, orders }, users, products, rentals, orders }); } catch (error) { next(error); } });
router.get('/users', async (req, res, next) => { try { const users = await User.find().select('-password').sort({ createdAt: -1 }); res.json({ success: true, data: users, users }); } catch (error) { next(error); } });
router.get('/products', async (req, res, next) => { try { const products = await Product.find().sort({ createdAt: -1 }); res.json({ success: true, data: products, products }); } catch (error) { next(error); } });
router.get('/orders', async (req, res, next) => { try { const orders = await Order.find().populate('userId', 'name email'); res.json({ success: true, data: orders, orders }); } catch (error) { next(error); } });
router.get('/rentals', async (req, res, next) => { try { const rentals = await Rental.find().populate('userId productId'); res.json({ success: true, data: rentals, rentals }); } catch (error) { next(error); } });
router.get('/analytics', async (req, res, next) => { try { const [users, products, rentals, orders] = await Promise.all([User.countDocuments(), Product.countDocuments(), Rental.countDocuments(), Order.countDocuments()]); res.json({ success: true, data: { users, products, rentals, orders } }); } catch (error) { next(error); } });
export default router;
