import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, inMemoryStore, type Product } from './_db.ts';

function parseProductRoute(req: VercelRequest) {
  const url = new URL(req.url || '', 'http://localhost');
  const parts = url.pathname.split('/').filter(Boolean);
  const baseIdx = parts.indexOf('products');
  const query = req.query || {};
  if (baseIdx === -1) {
    return { id: (query.id as string) || '' };
  }
  const id = parts[baseIdx + 1] || (query.id as string) || '';
  return { id };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = await getDb();
  const { id: productId } = parseProductRoute(req);

  // 1. Single Product GET
  if (req.method === 'GET' && productId) {
    if (db) {
      try {
        const prod = await db.collection<Product>('products').findOne({ id: productId }, { projection: { _id: 0 } });
        if (prod) return res.status(200).json(prod);
      } catch (err) {
        console.warn('MongoDB single product error:', err);
      }
    }
    const memProd = inMemoryStore.products.find((p) => p.id === productId);
    if (!memProd) return res.status(404).json({ error: 'Product not found' });
    return res.status(200).json(memProd);
  }

  // 2. All Products GET
  if (req.method === 'GET') {
    const { category, subCategory, search } = req.query || {};

    if (db) {
      try {
        const query: any = {};
        if (category && category !== 'all') query.category = category;
        if (subCategory && subCategory !== 'all') query.subCategory = subCategory;
        if (search && typeof search === 'string') {
          query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } },
            { subCategory: { $regex: search, $options: 'i' } }
          ];
        }
        const dbProducts = await db
          .collection<Product>('products')
          .find(query, { projection: { _id: 0 } })
          .toArray();
        return res.status(200).json(dbProducts || []);
      } catch (err) {
        console.warn('MongoDB query notice:', err);
      }
    }

    // Direct database mode: return empty array if no data exists in MongoDB Atlas
    return res.status(200).json([]);
  }

  // 3. POST Create Product
  if (req.method === 'POST') {
    const body = req.body || {};
    const newProd: Product = {
      id: body.id || `prod-${Date.now()}`,
      title: body.title || 'Custom Rental Asset',
      category: body.category || 'furniture',
      subCategory: body.subCategory || 'sofa',
      description: body.description || '',
      features: body.features || ['Free Doorstep Assembly', 'Zero Maintenance Guarantee'],
      image: body.image || '/src/assets/images/product_scandinavian_sofa_1791088510891.jpg',
      monthlyRent3m: Number(body.monthlyRent3m) || 999,
      monthlyRent6m: Number(body.monthlyRent6m) || 849,
      monthlyRent12m: Number(body.monthlyRent12m) || 699,
      securityDeposit: Number(body.securityDeposit) || 1200,
      specs: body.specs || { condition: 'Brand New', warranty: '100% Free repair and wear replacement' },
      stockCount: Number(body.stockCount) || 10,
      availableCount: Number(body.stockCount) || 10,
      rentedCount: 0,
      isPopular: Boolean(body.isPopular),
      featured: false
    };

    inMemoryStore.products.unshift(newProd);

    if (db) {
      try {
        await db.collection('products').insertOne({ ...newProd } as any);
      } catch (err) {
        console.warn('MongoDB save notice:', err);
      }
    }

    return res.status(201).json(newProd);
  }

  // 4. DELETE Product by ID
  if (req.method === 'DELETE' && productId) {
    inMemoryStore.products = inMemoryStore.products.filter((p) => p.id !== productId);
    if (db) {
      try {
        await db.collection('products').deleteOne({ id: productId });
      } catch (err) {
        console.warn('MongoDB delete product error:', err);
      }
    }
    return res.status(200).json({ success: true, deletedId: productId });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
