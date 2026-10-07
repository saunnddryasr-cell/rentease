import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase, dbState, inMemoryStore } from '../backend/config/db.ts';
import type { RentalOrder } from '../backend/types/index.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectToDatabase();

  if (req.method === 'GET') {
    if (dbState.isConnected && dbState.db) {
      try {
        const dbOrders = await dbState.db
          .collection<RentalOrder>('orders')
          .find({}, { projection: { _id: 0 } })
          .sort({ createdAt: -1 })
          .toArray();
        return res.status(200).json(dbOrders);
      } catch (err) {
        console.warn('MongoDB orders error:', err);
      }
    }
    return res.status(200).json(inMemoryStore.orders);
  }

  if (req.method === 'POST') {
    const newOrder: RentalOrder = req.body;
    if (!newOrder.id) {
      newOrder.id = `ord-${Date.now()}`;
    }
    inMemoryStore.orders.unshift(newOrder);

    if (dbState.isConnected && dbState.db) {
      try {
        await dbState.db.collection('orders').insertOne({ ...newOrder } as any);
      } catch (err) {
        console.warn('MongoDB insert order error:', err);
      }
    }

    return res.status(201).json(newOrder);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
