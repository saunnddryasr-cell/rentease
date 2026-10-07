import express, { Express } from 'express';
import { connectToDatabase } from './config/db.ts';
import healthRoutes from './routes/health.ts';
import productRoutes from './routes/products.ts';
import orderRoutes from './routes/orders.ts';
import ticketRoutes from './routes/tickets.ts';
import claimRoutes from './routes/claims.ts';
import cityRoutes from './routes/cities.ts';
import analyticsRoutes from './routes/analytics.ts';

export async function createApp(): Promise<Express> {
  // Connect to MongoDB Atlas (with graceful in-memory fallback)
  await connectToDatabase();

  const app = express();

  // Middleware
  app.use(express.json());

  // CORS middleware allowing external frontends (e.g. Vercel)
  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (_req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Mount API modular routes under /api
  app.use('/api', healthRoutes);
  app.use('/api', productRoutes);
  app.use('/api', orderRoutes);
  app.use('/api', ticketRoutes);
  app.use('/api', claimRoutes);
  app.use('/api', cityRoutes);
  app.use('/api', analyticsRoutes);

  // Root health check & API info
  app.get('/api', (_req, res) => {
    res.json({
      service: 'RentEase Full-Stack Backend API',
      status: 'online',
      endpoints: {
        health: '/api/health',
        products: '/api/products',
        orders: '/api/orders',
        tickets: '/api/tickets',
        claims: '/api/claims',
        cities: '/api/cities',
        analytics: '/api/analytics/kpis'
      },
      timestamp: new Date().toISOString()
    });
  });

  return app;
}

// Cached instance for serverless environments (e.g. Vercel)
let cachedAppInstance: any = null;

export default async function handler(req: any, res: any) {
  if (!cachedAppInstance) {
    cachedAppInstance = await createApp();
  }
  return cachedAppInstance(req, res);
}
