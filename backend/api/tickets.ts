import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, inMemoryStore, type MaintenanceTicket } from './_db.ts';

function parseTicketRoute(req: VercelRequest) {
  const url = new URL(req.url || '', 'http://localhost');
  const parts = url.pathname.split('/').filter(Boolean);
  const baseIdx = parts.indexOf('tickets');
  const query = req.query || {};
  if (baseIdx === -1) {
    return { id: (query.id as string) || '' };
  }
  const id = parts[baseIdx + 1] || (query.id as string) || '';
  return { id };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = await getDb();
  const { id: ticketId } = parseTicketRoute(req);

  // 1. GET Tickets
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

  // 2. PUT Update Ticket (/api/tickets/:id)
  if (req.method === 'PUT') {
    const { status, technicianName, resolutionNotes } = req.body || {};
    const ticket = inMemoryStore.tickets.find((t) => t.id === ticketId);

    if (ticket) {
      if (status) ticket.status = status;
      if (technicianName) ticket.technicianName = technicianName;
      if (resolutionNotes) ticket.resolutionNotes = resolutionNotes;
    }

    if (db && ticketId) {
      try {
        const updateFields: any = {};
        if (status) updateFields.status = status;
        if (technicianName) updateFields.technicianName = technicianName;
        if (resolutionNotes) updateFields.resolutionNotes = resolutionNotes;
        await db.collection('tickets').updateOne({ id: ticketId }, { $set: updateFields });
      } catch (err) {
        console.warn('MongoDB ticket update error:', err);
      }
    }

    return res.status(200).json(ticket || { id: ticketId, status, technicianName, resolutionNotes });
  }

  // 3. POST Create Ticket (/api/tickets)
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
