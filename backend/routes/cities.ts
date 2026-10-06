import { Router, Request, Response } from 'express';
import { dbState, inMemoryStore } from '../config/db.ts';
import { ServiceCity } from '../types/index.ts';

const router = Router();

// GET all cities
router.get('/cities', async (_req: Request, res: Response) => {
  if (dbState.isConnected && dbState.db) {
    try {
      const dbCities = await dbState.db
        .collection<ServiceCity>('cities')
        .find({}, { projection: { _id: 0 } })
        .toArray();
      return res.json(dbCities);
    } catch (e) {
      console.warn('MongoDB cities error:', e);
    }
  }
  res.json(inMemoryStore.cities);
});

// PUT Toggle City Operational Availability
router.put('/cities/:id/toggle', async (req: Request, res: Response) => {
  const city = inMemoryStore.cities.find((c) => c.id === req.params.id);
  if (city) city.isAvailable = !city.isAvailable;

  if (dbState.isConnected && dbState.db) {
    try {
      const dbCity = await dbState.db.collection<ServiceCity>('cities').findOne({ id: req.params.id });
      if (dbCity) {
        await dbState.db.collection('cities').updateOne(
          { id: req.params.id },
          { $set: { isAvailable: !dbCity.isAvailable } }
        );
      }
    } catch (e) {
      console.warn('MongoDB city toggle error:', e);
    }
  }

  res.json(city || { id: req.params.id });
});

export default router;
