import express, { Express, Request, Response } from 'express';
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

  // URL normalizer for Vercel serverless rewrites
  app.use((req, _res, next) => {
    if (req.url && req.url.startsWith('/api/index')) {
      req.url = req.url.replace('/api/index', '/api');
    }
    next();
  });

  // Mount API modular routes under BOTH /api and root /
  // This guarantees matching whether Vercel passes /api/health or /health
  app.use('/api', healthRoutes);
  app.use('/', healthRoutes);

  app.use('/api', productRoutes);
  app.use('/', productRoutes);

  app.use('/api', orderRoutes);
  app.use('/', orderRoutes);

  app.use('/api', ticketRoutes);
  app.use('/', ticketRoutes);

  app.use('/api', claimRoutes);
  app.use('/', claimRoutes);

  app.use('/api', cityRoutes);
  app.use('/', cityRoutes);

  app.use('/api', analyticsRoutes);
  app.use('/', analyticsRoutes);

  // Root health check & API info
  const apiInfo = (_req: Request, res: Response) => {
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
  };
  app.get('/api', apiInfo);
  app.get('/api/index', apiInfo);

  // Fallback JSON 404 for unmatched API routes
  app.use('/api', (req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not Found',
      message: `No API route matched ${req.method} ${req.originalUrl || req.url}`,
      validEndpoints: ['/api/health', '/api/products', '/api/orders', '/api/tickets', '/api/claims', '/api/cities', '/api/analytics/kpis']
    });
  });

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: express.NextFunction) => {
    console.error('[API Error]:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: err?.message || String(err)
    });
  });

  return app;
}

// Cached instance for serverless environments (e.g. Vercel)
let cachedAppInstance: any = null;

export default async function handler(req: any, res: any) {
  try {
    if (!cachedAppInstance) {
      cachedAppInstance = await createApp();
    }
    return cachedAppInstance(req, res);
  } catch (err: any) {
    console.error('[Serverless Handler Error]:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: err?.message || String(err),
      timestamp: new Date().toISOString()
    });
  }
}
