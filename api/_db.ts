import { MongoClient, Db } from 'mongodb';

export function cleanMongoUri(raw?: string): string {
  const fallback =
    'mongodb+srv://saunnddryasr_db_user:sand11@cluster0.kk44seh.mongodb.net/rentease?retryWrites=true&w=majority&appName=Cluster0';
  if (!raw) return fallback;
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^MONGODB_URI\s*=\s*/i, '');
  cleaned = cleaned.replace(/^["'\\]+|["'\\]+$/g, '').replace(/\\"/g, '');
  cleaned = cleaned.replace(/<YOUR_PASSWORD>|<db_password>/g, 'sand11');
  if (!cleaned.startsWith('mongodb://') && !cleaned.startsWith('mongodb+srv://')) {
    return fallback;
  }
  return cleaned;
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getDb(): Promise<Db | null> {
  if (cachedDb) return cachedDb;
  try {
    const uri = cleanMongoUri(process.env.MONGODB_URI);
    const client = new MongoClient(uri, {
      connectTimeoutMS: 3500,
      serverSelectionTimeoutMS: 3500,
      maxPoolSize: 10
    });
    await client.connect();
    cachedClient = client;
    cachedDb = client.db('rentease');
    return cachedDb;
  } catch (err) {
    console.warn('MongoDB connection notice:', err);
    return null;
  }
}

export interface Product {
  id: string;
  title: string;
  category: string;
  subCategory: string;
  description: string;
  features: string[];
  image: string;
  monthlyRent3m: number;
  monthlyRent6m: number;
  monthlyRent12m: number;
  securityDeposit: number;
  specs: {
    dimensions?: string;
    material?: string;
    color?: string;
    condition: string;
    warranty: string;
  };
  stockCount: number;
  availableCount: number;
  rentedCount: number;
  isPopular: boolean;
  featured: boolean;
}

export interface RentalOrder {
  id: string;
  orderNumber: string;
  items: Array<{
    product: Product;
    tenureMonths: number;
    monthlyRent: number;
    securityDeposit: number;
    quantity: number;
  }>;
  totalMonthlyRent: number;
  totalSecurityDeposit: number;
  deliveryFee: number;
  startDate: string;
  endDate: string;
  status: 'pending' | 'scheduled' | 'active' | 'completed' | 'cancelled';
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  createdAt: string;
}

export interface MaintenanceTicket {
  id: string;
  orderId: string;
  orderNumber: string;
  productTitle: string;
  issueCategory: string;
  issueCategoryLabel: string;
  description: string;
  priority: 'low' | 'normal' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  preferredDate: string;
  technicianName?: string;
  resolutionNotes?: string;
  createdAt: string;
}

export interface ReturnDamageClaim {
  id: string;
  orderId: string;
  orderNumber: string;
  productTitle: string;
  customerName: string;
  returnDate: string;
  conditionReport: 'mint' | 'normal_wear' | 'damaged';
  originalDeposit: number;
  damageDeduction: number;
  refundAmount: number;
  claimStatus: 'pending_inspection' | 'approved_refund' | 'deposit_deducted';
  damageNotes: string;
}

export interface ServiceCity {
  id: string;
  name: string;
  state: string;
  pinCodes: string[];
  activeHubs: number;
  isAvailable: boolean;
  estDeliveryHours: string;
}

// In-Memory Data Fallback Store
export const inMemoryStore = {
  products: [
    {
      id: 'prod-sofa-nordic',
      title: 'Nordic 3-Seater Pebble Sofa',
      category: 'furniture',
      subCategory: 'sofa',
      description: 'Minimalist Scandinavian 3-seater sofa with breathable linen upholstery.',
      features: ['Free Doorstep Assembly', 'Zero Maintenance Guarantee', 'Washable Upholstery'],
      image: '/src/assets/images/product_scandinavian_sofa_1791088510891.jpg',
      monthlyRent3m: 1199,
      monthlyRent6m: 999,
      monthlyRent12m: 849,
      securityDeposit: 1500,
      specs: { dimensions: '82W x 34D x 31H in', material: 'Solid Oak Frame', color: 'Pebble Grey', condition: 'Brand New', warranty: 'Full Repair & Replacement' },
      stockCount: 14,
      availableCount: 12,
      rentedCount: 2,
      isPopular: true,
      featured: true
    },
    {
      id: 'prod-bed-queen-haven',
      title: 'Haven Queen Platform Bed with Storage',
      category: 'furniture',
      subCategory: 'bed',
      description: 'Sturdy engineered wood bed frame with pneumatic under-bed storage.',
      features: ['Includes Orthopedic Mattress', 'Hydraulic Easy-Lift', 'Anti-Creak Joinery'],
      image: '/src/assets/images/product_queen_storage_bed_1791088528069.jpg',
      monthlyRent3m: 1399,
      monthlyRent6m: 1199,
      monthlyRent12m: 999,
      securityDeposit: 1800,
      specs: { dimensions: '64W x 84L x 42H in', material: 'Solid Teak & Engineered Wood', color: 'Warm Walnut', condition: 'Certified Mint', warranty: 'Zero Fee Wear & Tear' },
      stockCount: 10,
      availableCount: 8,
      rentedCount: 2,
      isPopular: true,
      featured: true
    },
    {
      id: 'prod-fridge-samsung-260',
      title: 'Frost-Free Inverter Refrigerator (260L)',
      category: 'appliances',
      subCategory: 'refrigerator',
      description: 'Double door frost-free refrigerator with digital inverter technology.',
      features: ['Free Annual Deep Servicing', 'Stabilizer-Free Operation', 'Energy Star Rated'],
      image: '/src/assets/images/product_smart_refrigerator_1791088541075.jpg',
      monthlyRent3m: 1299,
      monthlyRent6m: 1099,
      monthlyRent12m: 899,
      securityDeposit: 2000,
      specs: { dimensions: '558W x 674D x 1545H mm', color: 'Dazzle Steel', condition: 'Brand New', warranty: 'Comprehensive Onsite Repair' },
      stockCount: 12,
      availableCount: 9,
      rentedCount: 3,
      isPopular: true,
      featured: true
    },
    {
      id: 'prod-wm-lg-7kg',
      title: 'Smart Inverter Front Load Washer (7.0 Kg)',
      category: 'appliances',
      subCategory: 'washing_machine',
      description: 'Fully automatic front-loading washing machine with steam wash and allergy care.',
      features: ['Free Professional Installation', 'Free Detergent Starter Kit', 'Zero Maintenance Plan'],
      image: '/src/assets/images/product_washing_machine_1791088551584.jpg',
      monthlyRent3m: 1149,
      monthlyRent6m: 949,
      monthlyRent12m: 799,
      securityDeposit: 1800,
      specs: { dimensions: '600W x 440D x 850H mm', color: 'Platinum Silver', condition: 'Brand New', warranty: '100% Free Doorstep Support' },
      stockCount: 16,
      availableCount: 13,
      rentedCount: 3,
      isPopular: true,
      featured: false
    }
  ] as Product[],
  orders: [
    {
      id: 'ord-1001',
      orderNumber: 'ORD-882194',
      items: [
        {
          product: {
            id: 'prod-sofa-nordic',
            title: 'Nordic 3-Seater Pebble Sofa',
            category: 'furniture',
            subCategory: 'sofa',
            description: '',
            features: [],
            image: '/src/assets/images/product_scandinavian_sofa_1791088510891.jpg',
            monthlyRent3m: 1199,
            monthlyRent6m: 999,
            monthlyRent12m: 849,
            securityDeposit: 1500,
            specs: { condition: 'Brand New', warranty: 'Full' },
            stockCount: 10,
            availableCount: 8,
            rentedCount: 2,
            isPopular: true,
            featured: true
          },
          tenureMonths: 12,
          monthlyRent: 849,
          securityDeposit: 1500,
          quantity: 1
        }
      ],
      totalMonthlyRent: 849,
      totalSecurityDeposit: 1500,
      deliveryFee: 0,
      startDate: '2026-03-01',
      endDate: '2027-02-28',
      status: 'active',
      deliveryAddress: {
        street: '402 Green Glen Heights, Bellandur',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560103'
      },
      createdAt: '2026-02-27T10:30:00.000Z'
    }
  ] as RentalOrder[],
  tickets: [
    {
      id: 'tkt-001',
      orderId: 'ord-1001',
      orderNumber: 'ORD-882194',
      productTitle: 'Nordic 3-Seater Pebble Sofa',
      issueCategory: 'general_servicing',
      issueCategoryLabel: 'Complimentary Fabric Deep Cleaning',
      description: 'Scheduled semi-annual professional upholstery steam clean.',
      priority: 'normal',
      status: 'open',
      preferredDate: '2026-10-12',
      createdAt: '2026-10-02T09:15:00.000Z'
    }
  ] as MaintenanceTicket[],
  claims: [] as ReturnDamageClaim[],
  cities: [
    {
      id: 'blr',
      name: 'Bengaluru',
      state: 'Karnataka',
      pinCodes: ['560001', '560034', '560100', '560103'],
      activeHubs: 5,
      isAvailable: true,
      estDeliveryHours: '24-48 hrs'
    },
    {
      id: 'mum',
      name: 'Mumbai',
      state: 'Maharashtra',
      pinCodes: ['400001', '400050', '400076'],
      activeHubs: 4,
      isAvailable: true,
      estDeliveryHours: '24-48 hrs'
    },
    {
      id: 'del',
      name: 'Delhi NCR',
      state: 'Delhi',
      pinCodes: ['110001', '122001', '201301'],
      activeHubs: 6,
      isAvailable: true,
      estDeliveryHours: '24-48 hrs'
    }
  ] as ServiceCity[]
};
