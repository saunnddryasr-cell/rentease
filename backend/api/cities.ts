import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, inMemoryStore, type ServiceCity } from './_db.ts';

function parseCityRoute(req: VercelRequest) {
  const url = new URL(req.url || '', 'http://localhost');
  const parts = url.pathname.split('/').filter(Boolean);
  const baseIdx = parts.indexOf('cities');
  const query = req.query || {};
  if (baseIdx === -1) {
    return { id: (query.id as string) || '' };
  }
  const id = parts[baseIdx + 1] || (query.id as string) || '';
  return { id };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = await getDb();
  const { id: cityId } = parseCityRoute(req);

  // 1. GET Cities
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

  // 2. PUT Toggle City Status (/api/cities/:id/toggle or /api/cities/:id)
  if (req.method === 'PUT') {
    const city = inMemoryStore.cities.find((c) => c.id === cityId);
    let newStatus = false;

    if (city) {
      city.isAvailable = !city.isAvailable;
      newStatus = city.isAvailable;
    }

    if (db && cityId) {
      try {
        await db.collection('cities').updateOne({ id: cityId }, { $set: { isAvailable: newStatus } });
      } catch (err) {
        console.warn('MongoDB toggle city error:', err);
      }
    }

    return res.status(200).json(city || { id: cityId, isAvailable: newStatus });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
