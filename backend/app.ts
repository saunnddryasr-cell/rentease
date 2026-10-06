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

  return app;
}
