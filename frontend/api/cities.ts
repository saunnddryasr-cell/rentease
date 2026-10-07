import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase, dbState, inMemoryStore } from '../backend/config/db.ts';
import type { ServiceCity } from '../backend/types/index.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectToDatabase();

  if (req.method === 'GET') {
    if (dbState.isConnected && dbState.db) {
      try {
        const dbCities = await dbState.db
          .collection<ServiceCity>('cities')
          .find({}, { projection: { _id: 0 } })
          .toArray();
        return res.status(200).json(dbCities);
      } catch (err) {
        console.warn('MongoDB cities error:', err);
      }
    }
    return res.status(200).json(inMemoryStore.cities);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
