import { Router, Request, Response } from 'express';
import { dbState, inMemoryStore } from '../config/db.ts';
import { MaintenanceTicket } from '../types/index.ts';

const router = Router();

// GET all tickets
router.get('/tickets', async (_req: Request, res: Response) => {
  if (dbState.isConnected && dbState.db) {
    try {
      const dbTickets = await dbState.db
        .collection<MaintenanceTicket>('tickets')
        .find({}, { projection: { _id: 0 } })
        .sort({ createdAt: -1 })
        .toArray();
      return res.json(dbTickets);
    } catch (e) {
      console.warn('MongoDB tickets error:', e);
    }
  }
  res.json(inMemoryStore.tickets);
});

// POST Create Ticket
router.post('/tickets', async (req: Request, res: Response) => {
  const newTicket: MaintenanceTicket = {
    id: req.body.id || `tkt-${Date.now()}`,
    orderId: req.body.orderId || 'ord-general',
    orderNumber: req.body.orderNumber || 'RE-00000',
    productTitle: req.body.productTitle || 'Rental Essential',
    issueCategory: req.body.issueCategory || 'general_servicing',
    issueCategoryLabel: req.body.issueCategoryLabel || 'General Servicing',
    description: req.body.description || 'Routine service request',
    priority: req.body.priority || 'normal',
    status: req.body.status || 'open',
    preferredDate: req.body.preferredDate || new Date().toISOString().split('T')[0],
    technicianName: req.body.technicianName || 'To be assigned within 4 hours',
    resolutionNotes: req.body.resolutionNotes || 'Ticket registered in system.',
    createdAt: new Date().toISOString().split('T')[0]
  };

  inMemoryStore.tickets.unshift(newTicket);

  if (dbState.isConnected && dbState.db) {
    try {
      await dbState.db.collection('tickets').insertOne(newTicket as any);
    } catch (e) {
      console.warn('MongoDB ticket insert error:', e);
    }
  }

  res.status(201).json(newTicket);
});

// PUT Update Ticket
router.put('/tickets/:id', async (req: Request, res: Response) => {
  const ticket = inMemoryStore.tickets.find((t) => t.id === req.params.id);
  if (ticket) {
    if (req.body.status) ticket.status = req.body.status;
    if (req.body.technicianName) ticket.technicianName = req.body.technicianName;
    if (req.body.resolutionNotes) ticket.resolutionNotes = req.body.resolutionNotes;
  }

  if (dbState.isConnected && dbState.db) {
    try {
      await dbState.db.collection('tickets').updateOne({ id: req.params.id }, { $set: req.body });
    } catch (e) {
      console.warn('MongoDB ticket update error:', e);
    }
  }

  res.json(ticket || { id: req.params.id, ...req.body });
});

export default router;
