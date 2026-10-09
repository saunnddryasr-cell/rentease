import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, inMemoryStore } from './_db.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = await getDb();
  let isConnected = false;

  let orderList = inMemoryStore.orders;
  let productList = inMemoryStore.products;
  let ticketList = inMemoryStore.tickets;
  let cityList = inMemoryStore.cities;

  if (db) {
    try {
      const [dbOrders, dbProducts, dbTickets, dbCities] = await Promise.all([
        db.collection('orders').find({}).toArray(),
        db.collection('products').find({}).toArray(),
        db.collection('tickets').find({}).toArray(),
        db.collection('cities').find({}).toArray()
      ]);
      if (dbOrders.length > 0) orderList = dbOrders as any;
      if (dbProducts.length > 0) productList = dbProducts as any;
      if (dbTickets.length > 0) ticketList = dbTickets as any;
      if (dbCities.length > 0) cityList = dbCities as any;
      isConnected = true;
    } catch (err) {
      console.warn('MongoDB analytics query error:', err);
    }
  }

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
      connected: isConnected,
      type: isConnected ? 'mongodb_atlas' : 'in_memory_cached'
    }
  });
}
