import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, inMemoryStore, type MaintenanceTicket } from './_db.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = await getDb();

  if (req.method === 'GET') {
    if (db) {
      try {
        const dbTickets = await db
          .collection<MaintenanceTicket>('tickets')
          .find({}, { projection: { _id: 0 } })
          .sort({ createdAt: -1 })
          .toArray();
        if (dbTickets.length > 0) {
          return res.status(200).json(dbTickets);
        }
      } catch (err) {
        console.warn('MongoDB tickets error:', err);
      }
    }
    return res.status(200).json(inMemoryStore.tickets);
  }

  if (req.method === 'POST') {
    const newTicket: MaintenanceTicket = {
      id: req.body.id || `tkt-${Date.now()}`,
      orderId: req.body.orderId || 'ORD-UNKNOWN',
      orderNumber: req.body.orderNumber || 'ORD-001',
      productTitle: req.body.productTitle || 'Rental Asset',
      issueCategory: req.body.issueCategory || 'general_servicing',
      issueCategoryLabel: req.body.issueCategoryLabel || 'General Maintenance',
      description: req.body.description || 'Service request',
      priority: req.body.priority || 'normal',
      status: 'open',
      preferredDate: req.body.preferredDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    inMemoryStore.tickets.unshift(newTicket);

    if (db) {
      try {
        await db.collection('tickets').insertOne({ ...newTicket } as any);
      } catch (err) {
        console.warn('MongoDB insert ticket error:', err);
      }
    }

    return res.status(201).json(newTicket);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
