import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase, dbState, inMemoryStore } from '../backend/config/db.ts';
import type { ReturnDamageClaim } from '../backend/types/index.ts';

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
        const dbClaims = await dbState.db
          .collection<ReturnDamageClaim>('claims')
          .find({}, { projection: { _id: 0 } })
          .sort({ returnDate: -1 })
          .toArray();
        return res.status(200).json(dbClaims);
      } catch (err) {
        console.warn('MongoDB claims error:', err);
      }
    }
    return res.status(200).json(inMemoryStore.claims);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
