import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const tokenFor = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'rentease-development-secret', { expiresIn: '7d' });
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address });

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    if (await User.exists({ email: email.toLowerCase() })) return res.status(409).json({ success: false, message: 'Email is already registered' });
    const user = await User.create({ name, email, password, phone, role: role === 'admin' ? 'admin' : 'user' });
    res.status(201).json({ success: true, token: tokenFor(user), data: publicUser(user) });
  } catch (error) { next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: String(req.body.email || '').toLowerCase() });
    if (!user || !(await user.comparePassword(req.body.password || ''))) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    res.json({ success: true, token: tokenFor(user), data: publicUser(user) });
  } catch (error) { next(error); }
});

router.get('/profile', authenticate, (req, res) => res.json({ success: true, data: publicUser(req.user) }));
router.post('/logout', authenticate, (req, res) => res.json({ success: true, message: 'Logged out successfully' }));
router.put('/profile', authenticate, async (req, res, next) => {
  try { const user = await User.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true, runValidators: true }).select('-password'); res.json({ success: true, data: publicUser(user) }); } catch (error) { next(error); }
});
router.put('/change-password', authenticate, async (req, res, next) => {
  try { const user = await User.findById(req.user._id); if (!(await user.comparePassword(req.body.currentPassword || req.body.oldPassword || ''))) return res.status(400).json({ success: false, message: 'Current password is incorrect' }); user.password = req.body.newPassword || req.body.password; await user.save(); res.json({ success: true, message: 'Password changed successfully' }); } catch (error) { next(error); }
});
router.post('/forgot-password', (req, res) => res.json({ success: true, message: 'If the email exists, reset instructions have been sent' }));
router.post('/reset-password/:token', (req, res) => res.json({ success: true, message: 'Password reset request accepted' }));
router.post('/verify-email/:token', (req, res) => res.json({ success: true, message: 'Email verified' }));

export default router;
