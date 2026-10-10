import express from 'express';
import type { Request, Response } from 'express';
import { dbState, inMemoryStore } from '../config/db.ts';
import type { Product } from '../types/index.ts';

const router = express.Router();

// GET all products
router.get('/products', async (req: Request, res: Response) => {
  const { category, subCategory, search } = req.query;

  if (dbState.isConnected && dbState.db) {
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
      const dbProducts = await dbState.db
        .collection<Product>('products')
        .find(query, { projection: { _id: 0 } })
        .toArray();
      return res.json(dbProducts || []);
    } catch (err) {
      console.warn('MongoDB query notice:', err);
    }
  }

  // If database is empty or disconnected, return empty array (no mock data)
  return res.json([]);
});

// GET single product by ID
router.get('/products/:id', async (req: Request, res: Response) => {
  if (dbState.isConnected && dbState.db) {
    try {
      const prod = await dbState.db
        .collection<Product>('products')
        .findOne({ id: req.params.id }, { projection: { _id: 0 } });
      if (prod) return res.json(prod);
    } catch (e) {
      console.warn('MongoDB findOne error:', e);
    }
  }

  const product = inMemoryStore.products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST Create Product (Admin inventory)
router.post('/products', async (req: Request, res: Response) => {
  const newProduct: Product = {
    id: req.body.id || `prod-${Date.now()}`,
    title: req.body.title || 'Untitled Rental Asset',
    category: req.body.category || 'furniture',
    subCategory: req.body.subCategory || 'sofa',
    description: req.body.description || 'Verified rental furniture/appliance item.',
    features: req.body.features || ['Free Doorstep Assembly', 'Zero Maintenance Guarantee'],
    image: req.body.image || '/src/assets/images/product_scandinavian_sofa_1791088510891.jpg',
    monthlyRent3m: Number(req.body.monthlyRent3m) || 999,
    monthlyRent6m: Number(req.body.monthlyRent6m) || 849,
    monthlyRent12m: Number(req.body.monthlyRent12m) || 749,
    securityDeposit: Number(req.body.securityDeposit) || 1200,
    specs: req.body.specs || {
      condition: 'Brand New',
      warranty: '100% Free repair and wear replacement'
    },
    stockCount: Number(req.body.stockCount) || 10,
    availableCount: Number(req.body.availableCount) || 10,
    rentedCount: 0,
    isPopular: !!req.body.isPopular,
    featured: !!req.body.featured
  };

  inMemoryStore.products.unshift(newProduct);

  if (dbState.isConnected && dbState.db) {
    try {
      await dbState.db.collection('products').insertOne(newProduct as any);
    } catch (err) {
      console.warn('MongoDB insert product failed:', err);
    }
  }

  res.status(201).json(newProduct);
});

// PUT Update Product
router.put('/products/:id', async (req: Request, res: Response) => {
  const idx = inMemoryStore.products.findIndex((p) => p.id === req.params.id);
  if (idx !== -1) {
    inMemoryStore.products[idx] = { ...inMemoryStore.products[idx], ...req.body };
  }

  if (dbState.isConnected && dbState.db) {
    try {
      await dbState.db.collection('products').updateOne({ id: req.params.id }, { $set: req.body });
    } catch (e) {
      console.warn('MongoDB update product error:', e);
    }
  }

  res.json(inMemoryStore.products[idx] || { id: req.params.id, ...req.body });
});

export default router;
