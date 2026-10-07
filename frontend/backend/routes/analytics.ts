import express from 'express';
import type { Request, Response } from 'express';
import { dbState, inMemoryStore } from '../config/db.ts';
import type { Product, RentalOrder, MaintenanceTicket, ServiceCity } from '../types/index.ts';

const router = express.Router();

router.get('/analytics/kpis', async (_req: Request, res: Response) => {
  let orderList = inMemoryStore.orders;
  let productList = inMemoryStore.products;
  let ticketList = inMemoryStore.tickets;
  let cityList = inMemoryStore.cities;

  if (dbState.isConnected && dbState.db) {
    try {
      orderList = await dbState.db.collection<RentalOrder>('orders').find({}).toArray();
      productList = await dbState.db.collection<Product>('products').find({}).toArray();
      ticketList = await dbState.db.collection<MaintenanceTicket>('tickets').find({}).toArray();
      cityList = await dbState.db.collection<ServiceCity>('cities').find({}).toArray();
    } catch (e) {
      console.warn('MongoDB analytics error:', e);
    }
  }

  const activeOrders = orderList.filter((o) => o.status === 'active' || o.status === 'scheduled');
  const mrr = activeOrders.reduce((sum, o) => sum + o.totalMonthlyRent, 0);
  const totalStock = productList.reduce((sum, p) => sum + p.stockCount, 0);
  const totalRented = productList.reduce((sum, p) => sum + p.rentedCount, 0);
  const utilizationRate = Math.round((totalRented / Math.max(totalStock, 1)) * 100);

  res.json({
    mrr,
    activeRentals: activeOrders.length,
    productUtilizationRate: utilizationRate,
    customerRetentionRate: 94.2,
    avgResolutionSlaHours: 18.4,
    totalOrders: orderList.length,
    totalTickets: ticketList.length,
    openTickets: ticketList.filter((t) => t.status === 'open' || t.status === 'in_progress').length,
    operationalCities: cityList.filter((c) => c.isAvailable).length
  });
});

export default router;
