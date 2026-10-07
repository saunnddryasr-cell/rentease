import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, inMemoryStore, type Product } from './_db.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = await getDb();

  if (req.method === 'GET') {
    const { category, subCategory, search } = req.query;

    if (db) {
      try {
        const query: any = {};
        if (category && category !== 'all') query.category = category;
        if (subCategory && subCategory !== 'all') query.subCategory = subCategory;
        if (search && typeof search === 'string') {
          query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ];
        }
        const dbProducts = await db
          .collection<Product>('products')
          .find(query, { projection: { _id: 0 } })
          .toArray();
        if (dbProducts.length > 0) {
          return res.status(200).json(dbProducts);
        }
      } catch (err) {
        console.warn('MongoDB query notice:', err);
      }
    }

    let result = [...inMemoryStore.products];
    if (category && category !== 'all') {
      result = result.filter((p) => p.category === category);
    }
    if (subCategory && subCategory !== 'all') {
      result = result.filter((p) => p.subCategory === subCategory);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    return res.status(200).json(result);
  }

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

  return res.status(405).json({ error: 'Method Not Allowed' });
}
