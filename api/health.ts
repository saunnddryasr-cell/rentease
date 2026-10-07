import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase, dbState, inMemoryStore } from '../backend/config/db.ts';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (_req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();
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

    return res.status(200).json({
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
  } catch (err: any) {
    return res.status(500).json({
      status: 'error',
      message: err?.message || String(err)
    });
  }
}
