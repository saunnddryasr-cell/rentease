import type { VercelRequest, VercelResponse } from '@vercel/node';
import healthHandler from './health.ts';
import productsHandler from './products.ts';
import ordersHandler from './orders.ts';
import ticketsHandler from './tickets.ts';
import claimsHandler from './claims.ts';
import citiesHandler from './cities.ts';
import analyticsHandler from './analytics.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.url || '';
  if (url.includes('/products')) {
    return productsHandler(req, res);
  }
  if (url.includes('/orders')) {
    return ordersHandler(req, res);
  }
  if (url.includes('/tickets')) {
    return ticketsHandler(req, res);
  }
  if (url.includes('/claims')) {
    return claimsHandler(req, res);
  }
  if (url.includes('/cities')) {
    return citiesHandler(req, res);
  }
  if (url.includes('/analytics')) {
    return analyticsHandler(req, res);
  }
  return healthHandler(req, res);
}
