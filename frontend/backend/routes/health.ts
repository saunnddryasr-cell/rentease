import { Router, Request, Response } from 'express';
import { dbState, inMemoryStore } from '../config/db.ts';

const router = Router();

router.get('/health', async (_req: Request, res: Response) => {
  let orderCount = inMemoryStore.orders.length;
  let productCount = inMemoryStore.products.length;

  if (dbState.isConnected && dbState.db) {
    try {
      orderCount = await dbState.db.collection('orders').countDocuments();
      productCount = await dbState.db.collection('products').countDocuments();
    } catch (e) {
      console.warn('MongoDB count error, using memory count:', e);
    }
  }

  res.json({
    status: 'ok',
    service: 'RentEase Full-Stack Backend API',
    database: {
      type: dbState.isConnected ? 'mongodb_atlas' : 'in_memory_cached',
      connected: dbState.isConnected,
      cluster: dbState.cluster,
      database: dbState.database,
      status: dbState.statusMessage
    },
    externalBackend: dbState.externalBackend,
    frontendUrl: dbState.frontendUrl,
    timestamp: new Date().toISOString(),
    activeRentals: orderCount,
    totalProducts: productCount
  });
});

export default router;
