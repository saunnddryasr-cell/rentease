import express from 'express';
import type { Request, Response } from 'express';
import { dbState, inMemoryStore } from '../config/db.ts';
import type { RentalOrder, RentalTenure, ReturnDamageClaim } from '../types/index.ts';

const router = express.Router();

// GET all orders
router.get('/orders', async (_req: Request, res: Response) => {
  if (dbState.isConnected && dbState.db) {
    try {
      const dbOrders = await dbState.db
        .collection<RentalOrder>('orders')
        .find({}, { projection: { _id: 0 } })
        .sort({ createdAt: -1 })
        .toArray();
      return res.json(dbOrders);
    } catch (e) {
      console.warn('MongoDB orders error:', e);
    }
  }
  res.json(inMemoryStore.orders);
});

// POST Create Order (Checkout)
router.post('/orders', async (req: Request, res: Response) => {
  const orderData: RentalOrder = req.body;
  if (!orderData || !orderData.items || orderData.items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  const newOrder: RentalOrder = {
    ...orderData,
    id: orderData.id || `ord-${Date.now()}`,
    orderNumber: orderData.orderNumber || `RE-${Math.floor(10000 + Math.random() * 90000)}`,
    createdAt: orderData.createdAt || new Date().toISOString().split('T')[0]
  };

  inMemoryStore.orders.unshift(newOrder);

  // Sync inventory stock in memory
  for (const item of newOrder.items) {
    const prod = inMemoryStore.products.find((p) => p.id === item.productId);
    if (prod) {
      prod.availableCount = Math.max(0, prod.availableCount - item.quantity);
      prod.rentedCount += item.quantity;
    }
  }

  if (dbState.isConnected && dbState.db) {
    try {
      await dbState.db.collection('orders').insertOne(newOrder as any);
      for (const item of newOrder.items) {
        await dbState.db.collection('products').updateOne(
          { id: item.productId },
          {
            $inc: {
              availableCount: -item.quantity,
              rentedCount: item.quantity
            }
          }
        );
      }
    } catch (err) {
      console.warn('MongoDB order insert failed:', err);
    }
  }

  res.status(201).json(newOrder);
});

// PUT Update Order Status
router.put('/orders/:id/status', async (req: Request, res: Response) => {
  const { status } = req.body;
  const order = inMemoryStore.orders.find((o) => o.id === req.params.id);
  if (order) {
    order.status = status;
    if (status === 'active') {
      order.trackingSteps = order.trackingSteps.map((s) => ({ ...s, completed: true }));
    }
  }

  if (dbState.isConnected && dbState.db) {
    try {
      await dbState.db.collection('orders').updateOne({ id: req.params.id }, { $set: { status } });
    } catch (e) {
      console.warn('MongoDB update status error:', e);
    }
  }

  res.json(order || { id: req.params.id, status });
});

// POST Extend Order Tenure
router.post('/orders/:id/extend', async (req: Request, res: Response) => {
  const { additionalMonths } = req.body;
  const monthsToAdd: RentalTenure = Number(additionalMonths) as RentalTenure;

  const targetOrder = inMemoryStore.orders.find((o) => o.id === req.params.id);
  if (targetOrder) {
    const endDate = new Date(targetOrder.tenureEndDate);
    endDate.setMonth(endDate.getMonth() + monthsToAdd);
    targetOrder.tenureMonths += monthsToAdd;
    targetOrder.tenureEndDate = endDate.toISOString().split('T')[0];
  }

  if (dbState.isConnected && dbState.db) {
    try {
      const dbOrder = await dbState.db.collection<RentalOrder>('orders').findOne({ id: req.params.id });
      if (dbOrder) {
        const endDate = new Date(dbOrder.tenureEndDate);
        endDate.setMonth(endDate.getMonth() + monthsToAdd);
        const newEndDate = endDate.toISOString().split('T')[0];
        await dbState.db.collection('orders').updateOne(
          { id: req.params.id },
          {
            $inc: { tenureMonths: monthsToAdd },
            $set: { tenureEndDate: newEndDate }
          }
        );
      }
    } catch (e) {
      console.warn('MongoDB extend error:', e);
    }
  }

  res.json(targetOrder || { id: req.params.id, additionalMonths });
});

// POST Request Relocation
router.post('/orders/:id/relocate', async (req: Request, res: Response) => {
  const { newAddress, moveDate } = req.body;
  const order = inMemoryStore.orders.find((o) => o.id === req.params.id);
  if (order) {
    order.deliveryAddress = newAddress;
    order.trackingSteps.push({
      title: 'Relocation Scheduled',
      description: `Free moving crew booked for ${moveDate}`,
      date: moveDate,
      completed: true
    });
  }

  if (dbState.isConnected && dbState.db) {
    try {
      await dbState.db.collection('orders').updateOne(
        { id: req.params.id },
        {
          $set: { deliveryAddress: newAddress },
          $push: {
            trackingSteps: {
              title: 'Relocation Scheduled',
              description: `Free moving crew booked for ${moveDate}`,
              date: moveDate,
              completed: true
            }
          } as any
        }
      );
    } catch (e) {
      console.warn('MongoDB relocate error:', e);
    }
  }

  res.json(order || { id: req.params.id, newAddress, moveDate });
});

// POST Schedule Return (initiates return damage claim)
router.post('/orders/:id/return', async (req: Request, res: Response) => {
  const { returnDate, returnReason } = req.body;
  const order = inMemoryStore.orders.find((o) => o.id === req.params.id);
  if (order) order.status = 'return_requested';

  const newClaim: ReturnDamageClaim = {
    id: `clm-${Date.now()}`,
    orderId: order?.id || req.params.id,
    orderNumber: order?.orderNumber || 'RE-00000',
    productTitle: order?.items.map((i) => i.title).join(', ') || 'Rental Return',
    customerName: order?.customerName || 'Subscriber',
    returnDate: returnDate || new Date().toISOString().split('T')[0],
    conditionReport: 'mint',
    originalDeposit: order?.totalDeposit || 1500,
    damageDeduction: 0,
    refundAmount: order?.totalDeposit || 1500,
    claimStatus: 'pending_inspection',
    damageNotes: `Return scheduled for ${returnDate}. Reason: ${returnReason || 'Tenure completed'}`
  };

  inMemoryStore.claims.unshift(newClaim);

  if (dbState.isConnected && dbState.db) {
    try {
      await dbState.db.collection('orders').updateOne(
        { id: req.params.id },
        { $set: { status: 'return_requested' } }
      );
      await dbState.db.collection('claims').insertOne(newClaim as any);
    } catch (e) {
      console.warn('MongoDB return schedule error:', e);
    }
  }

  res.json({ order, claim: newClaim });
});

export default router;
