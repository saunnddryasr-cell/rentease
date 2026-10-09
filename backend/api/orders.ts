import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, inMemoryStore, type RentalOrder, type ReturnDamageClaim } from './_db.ts';

function parseOrderRoute(req: VercelRequest) {
  const url = new URL(req.url || '', 'http://localhost');
  const parts = url.pathname.split('/').filter(Boolean);
  const baseIdx = parts.indexOf('orders');
  const query = req.query || {};
  if (baseIdx === -1) {
    return { id: (query.id as string) || '', action: (query.action as string) || '' };
  }
  const id = parts[baseIdx + 1] || (query.id as string) || '';
  const action = parts[baseIdx + 2] || (query.action as string) || '';
  return { id, action };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = await getDb();
  const { id: orderId, action } = parseOrderRoute(req);

  // 1. GET Orders
  if (req.method === 'GET') {
    if (orderId) {
      if (db) {
        try {
          const dbOrder = await db.collection<RentalOrder>('orders').findOne({ id: orderId }, { projection: { _id: 0 } });
          if (dbOrder) return res.status(200).json(dbOrder);
        } catch (e) {
          console.warn('MongoDB get single order error:', e);
        }
      }
      const order = inMemoryStore.orders.find((o) => o.id === orderId);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      return res.status(200).json(order);
    }

    if (db) {
      try {
        const dbOrders = await db
          .collection<RentalOrder>('orders')
          .find({}, { projection: { _id: 0 } })
          .sort({ createdAt: -1 })
          .toArray();
        if (dbOrders.length > 0) return res.status(200).json(dbOrders);
      } catch (err) {
        console.warn('MongoDB orders error:', err);
      }
    }
    return res.status(200).json(inMemoryStore.orders);
  }

  // 2. PUT Update Status (/api/orders/:id/status or /api/orders/:id)
  if (req.method === 'PUT') {
    const { status } = req.body || {};
    const order = inMemoryStore.orders.find((o) => o.id === orderId);
    if (order && status) {
      order.status = status;
    }

    if (db && orderId && status) {
      try {
        await db.collection('orders').updateOne({ id: orderId }, { $set: { status } });
      } catch (e) {
        console.warn('MongoDB update status error:', e);
      }
    }

    return res.status(200).json(order || { id: orderId, status });
  }

  // 3. POST Routes (Create Order, Extend, Relocate, Return)
  if (req.method === 'POST') {
    // 3a. Extend Tenure (/api/orders/:id/extend)
    if (action === 'extend' && orderId) {
      const { additionalMonths } = req.body || {};
      const monthsToAdd = Number(additionalMonths) || 3;
      const targetOrder = inMemoryStore.orders.find((o) => o.id === orderId);
      let updatedEndDate = '';

      if (targetOrder) {
        const currentEnd = new Date(targetOrder.endDate);
        currentEnd.setMonth(currentEnd.getMonth() + monthsToAdd);
        targetOrder.endDate = currentEnd.toISOString().split('T')[0];
        updatedEndDate = targetOrder.endDate;
      }

      if (db && updatedEndDate) {
        try {
          await db.collection('orders').updateOne({ id: orderId }, { $set: { endDate: updatedEndDate } });
        } catch (e) {
          console.warn('MongoDB extend error:', e);
        }
      }

      return res.status(200).json(targetOrder || { id: orderId, extendedBy: monthsToAdd });
    }

    // 3b. Request Relocation (/api/orders/:id/relocate)
    if (action === 'relocate' && orderId) {
      const { newAddress, moveDate } = req.body || {};
      const targetOrder = inMemoryStore.orders.find((o) => o.id === orderId);
      if (targetOrder && newAddress) {
        targetOrder.deliveryAddress = {
          street: newAddress,
          city: targetOrder.deliveryAddress.city,
          state: targetOrder.deliveryAddress.state,
          pincode: targetOrder.deliveryAddress.pincode,
          landmark: `Relocation on ${moveDate || 'Scheduled date'}`
        };
      }

      if (db && targetOrder) {
        try {
          await db.collection('orders').updateOne(
            { id: orderId },
            { $set: { deliveryAddress: targetOrder.deliveryAddress } }
          );
        } catch (e) {
          console.warn('MongoDB relocate error:', e);
        }
      }

      return res.status(200).json(targetOrder || { id: orderId, relocated: true });
    }

    // 3c. Schedule Return (/api/orders/:id/return)
    if (action === 'return' && orderId) {
      const { returnDate, returnReason } = req.body || {};
      const targetOrder = inMemoryStore.orders.find((o) => o.id === orderId);
      if (targetOrder) {
        targetOrder.status = 'completed';
      }

      const claim: ReturnDamageClaim = {
        id: `clm-${Date.now()}`,
        orderId,
        orderNumber: targetOrder?.orderNumber || `ORD-${orderId}`,
        productTitle: targetOrder?.items[0]?.product?.title || 'Rental Asset',
        customerName: 'Verified Tenant',
        returnDate: returnDate || new Date().toISOString().split('T')[0],
        conditionReport: 'mint',
        originalDeposit: targetOrder?.totalSecurityDeposit || 1500,
        damageDeduction: 0,
        refundAmount: targetOrder?.totalSecurityDeposit || 1500,
        claimStatus: 'pending_inspection',
        damageNotes: returnReason || 'End of rental cycle regular handover'
      };

      inMemoryStore.claims.unshift(claim);

      if (db) {
        try {
          await db.collection('orders').updateOne({ id: orderId }, { $set: { status: 'completed' } });
          await db.collection('claims').insertOne({ ...claim } as any);
        } catch (e) {
          console.warn('MongoDB return claim insert error:', e);
        }
      }

      return res.status(200).json({ order: targetOrder, claim });
    }

    // 3d. Create New Order (/api/orders)
    const newOrder: RentalOrder = req.body;
    if (!newOrder.id) {
      newOrder.id = `ord-${Date.now()}`;
    }
    inMemoryStore.orders.unshift(newOrder);

    // Sync inventory stock
    for (const item of newOrder.items || []) {
      const prod = inMemoryStore.products.find((p) => p.id === item.product?.id);
      if (prod) {
        prod.availableCount = Math.max(0, prod.availableCount - (item.quantity || 1));
        prod.rentedCount += item.quantity || 1;
      }
    }

    if (db) {
      try {
        await db.collection('orders').insertOne({ ...newOrder } as any);
        for (const item of newOrder.items || []) {
          if (item.product?.id) {
            await db.collection('products').updateOne(
              { id: item.product.id },
              {
                $inc: {
                  availableCount: -(item.quantity || 1),
                  rentedCount: item.quantity || 1
                }
              }
            );
          }
        }
      } catch (err) {
        console.warn('MongoDB insert order error:', err);
      }
    }

    return res.status(201).json(newOrder);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
