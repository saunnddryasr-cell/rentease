import { MongoClient, Db } from 'mongodb';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_MAINTENANCE_TICKETS,
  INITIAL_CLAIMS,
  SERVICE_CITIES
} from '../data/seedData.ts';
import type {
  Product,
  RentalOrder,
  MaintenanceTicket,
  ReturnDamageClaim,
  ServiceCity
} from '../types/index.ts';

// In-Memory state fallback
export const inMemoryStore = {
  products: [...INITIAL_PRODUCTS] as Product[],
  orders: [...INITIAL_ORDERS] as RentalOrder[],
  tickets: [...INITIAL_MAINTENANCE_TICKETS] as MaintenanceTicket[],
  claims: [...INITIAL_CLAIMS] as ReturnDamageClaim[],
  cities: [...SERVICE_CITIES] as ServiceCity[]
};

export interface DatabaseState {
  client: MongoClient | null;
  db: Db | null;
  isConnected: boolean;
  statusMessage: string;
  cluster: string;
  database: string;
  externalBackend: string;
  frontendUrl: string;
}

export function cleanMongoUri(raw?: string): string {
  const defaultUri =
    'mongodb+srv://saunnddryasr_db_user:sand11@cluster0.kk44seh.mongodb.net/rentease?retryWrites=true&w=majority&appName=Cluster0';
  if (!raw) return defaultUri;
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^MONGODB_URI\s*=\s*/i, '');
  cleaned = cleaned.replace(/^["'\\]+|["'\\]+$/g, '').replace(/\\"/g, '');
  cleaned = cleaned.replace(/<YOUR_PASSWORD>|<db_password>/g, 'sand11');
  if (!cleaned.startsWith('mongodb://') && !cleaned.startsWith('mongodb+srv://')) {
    return defaultUri;
  }
  // If the user's URI does not specify retryWrites or database, ensure safe parameters
  if (cleaned.includes('cluster0.kk44seh.mongodb.net') && !cleaned.includes('retryWrites=')) {
    if (cleaned.includes('?')) {
      cleaned = cleaned.replace('?', '?retryWrites=true&w=majority&');
    } else {
      cleaned = `${cleaned}?retryWrites=true&w=majority`;
    }
  }
  return cleaned;
}

export function cleanBackendUrl(raw?: string): string {
  const fallback = 'https://rentease-backend-indol.vercel.app';
  if (!raw) return fallback;
  let cleaned = raw.trim().replace(/^BACKEND_API_URL\s*=\s*/i, '').replace(/^["']|["']$/g, '');
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) return fallback;
  return cleaned;
}

export function cleanFrontendUrl(raw?: string): string {
  const fallback = 'https://frontend-virid-iota-76.vercel.app';
  if (!raw) return fallback;
  let cleaned = raw.trim().replace(/^FRONTEND_URL\s*=\s*/i, '').replace(/^["']|["']$/g, '');
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) return fallback;
  return cleaned;
}

export const dbState: DatabaseState = {
  client: null,
  db: null,
  isConnected: false,
  statusMessage: 'Initializing connection...',
  cluster: 'cluster0.kk44seh.mongodb.net',
  database: 'rentease',
  externalBackend: cleanBackendUrl(process.env.BACKEND_API_URL),
  frontendUrl: cleanFrontendUrl(process.env.FRONTEND_URL)
};

export async function connectToDatabase(): Promise<DatabaseState> {
  if (dbState.isConnected && dbState.db) {
    return dbState;
  }

  const uri = cleanMongoUri(process.env.MONGODB_URI);

  try {
    console.log('[Backend DB] Connecting to MongoDB Atlas cluster...');
    const client = new MongoClient(uri, {
      connectTimeoutMS: 4000,
      serverSelectionTimeoutMS: 4000,
      maxPoolSize: 10
    });

    await client.connect();
    const db = client.db('rentease');

    dbState.client = client;
    dbState.db = db;
    dbState.isConnected = true;
    dbState.statusMessage = 'Connected to MongoDB Atlas (cluster0.kk44seh.mongodb.net / database: rentease)';
    console.log('[Backend DB] Connected to MongoDB Atlas database: rentease (100% dynamic mode)');
  } catch (err: any) {
    console.warn('[Backend DB] MongoDB Atlas connection notice:', err?.message || err);
    dbState.isConnected = false;
    dbState.statusMessage = `MongoDB notice: ${err?.message || 'Network delay'}. Running in-memory cached mode.`;
  }

  return dbState;
}
