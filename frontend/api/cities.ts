import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, inMemoryStore, type ServiceCity } from './_db.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = await getDb();

  if (req.method === 'GET') {
    if (db) {
      try {
        const dbCities = await db
          .collection<ServiceCity>('cities')
          .find({}, { projection: { _id: 0 } })
          .toArray();
        if (dbCities.length > 0) {
          return res.status(200).json(dbCities);
        }
      } catch (err) {
        console.warn('MongoDB cities error:', err);
      }
    }
    return res.status(200).json(inMemoryStore.cities);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
