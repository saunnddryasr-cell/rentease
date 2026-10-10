import type { VercelRequest, VercelResponse } from '@vercel/node';
import healthHandler from './health.ts';
import productsHandler from './products.ts';
import ordersHandler from './orders.ts';
import ticketsHandler from './tickets.ts';
import claimsHandler from './claims.ts';
import citiesHandler from './cities.ts';
import analyticsHandler from './analytics.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const matched =
    (req.headers['x-matched-path'] as string) ||
    (req.headers['x-invoke-path'] as string) ||
    (req.headers['x-now-route-matches'] as string) ||
    req.url ||
    '';

  if (matched.includes('/products')) {
    return productsHandler(req, res);
  }
  if (matched.includes('/orders')) {
    return ordersHandler(req, res);
  }
  if (matched.includes('/tickets')) {
    return ticketsHandler(req, res);
  }
  if (matched.includes('/claims')) {
    return claimsHandler(req, res);
  }
  if (matched.includes('/cities')) {
    return citiesHandler(req, res);
  }
  if (matched.includes('/analytics')) {
    return analyticsHandler(req, res);
  }
  return healthHandler(req, res);
}
