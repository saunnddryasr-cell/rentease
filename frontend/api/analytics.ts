import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase, dbState, inMemoryStore } from '../backend/config/db.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectToDatabase();

  const orderList = inMemoryStore.orders;
  const productList = inMemoryStore.products;
  const ticketList = inMemoryStore.tickets;
  const cityList = inMemoryStore.cities;

  const activeOrders = orderList.filter((o) => o.status === 'active' || o.status === 'scheduled');
  const mrr = activeOrders.reduce((sum, o) => sum + (o.totalMonthlyRent || 0), 0);
  const totalStock = productList.reduce((sum, p) => sum + (p.stockCount || 0), 0);
  const totalRented = productList.reduce((sum, p) => sum + (p.rentedCount || 0), 0);
  const productUtilizationRate = Math.round((totalRented / Math.max(totalStock, 1)) * 100);
  const openTickets = ticketList.filter((t) => t.status === 'open' || t.status === 'in_progress').length;

  return res.status(200).json({
    mrr,
    activeRentals: activeOrders.length,
    productUtilizationRate,
    customerRetentionRate: 94.6,
    avgResolutionSlaHours: 18.4,
    totalOrders: orderList.length,
    totalTickets: ticketList.length,
    openTickets,
    operationalCities: cityList.filter((c) => c.isAvailable).length,
    database: {
      connected: dbState.isConnected,
      type: dbState.isConnected ? 'mongodb_atlas' : 'in_memory_cached'
    }
  });
}
