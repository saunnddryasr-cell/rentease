import { Router } from 'express';
import Maintenance from '../models/Maintenance.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);
router.post('/', async (req, res, next) => { try { const request = await Maintenance.create({ ...req.body, userId: req.user._id }); res.status(201).json({ success: true, data: request, request }); } catch (error) { next(error); } });
router.get('/my-requests', async (req, res, next) => { try { const requests = await Maintenance.find({ userId: req.user._id }).sort({ createdAt: -1 }); res.json({ success: true, data: requests, requests }); } catch (error) { next(error); } });
router.get('/:id', async (req, res, next) => { try { const request = await Maintenance.findOne({ _id: req.params.id, userId: req.user._id }); if (!request) return res.status(404).json({ success: false, message: 'Maintenance request not found' }); res.json({ success: true, data: request, request }); } catch (error) { next(error); } });
export default router;
