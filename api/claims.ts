import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, inMemoryStore, type ReturnDamageClaim } from './_db.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = await getDb();

  if (req.method === 'GET') {
    if (db) {
      try {
        const dbClaims = await db
          .collection<ReturnDamageClaim>('claims')
          .find({}, { projection: { _id: 0 } })
          .sort({ returnDate: -1 })
          .toArray();
        if (dbClaims.length > 0) {
          return res.status(200).json(dbClaims);
        }
      } catch (err) {
        console.warn('MongoDB claims error:', err);
      }
    }
    return res.status(200).json(inMemoryStore.claims);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
