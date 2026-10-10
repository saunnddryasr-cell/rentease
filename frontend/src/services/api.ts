import {
  Product,
  RentalOrder,
  MaintenanceTicket,
  ReturnDamageClaim,
  ServiceCity,
  RentalTenure
} from '../types';

export interface BackendHealth {
  status: string;
  service: string;
  database?: {
    type: string;
    connected: boolean;
    cluster: string;
    database: string;
    status: string;
  };
  timestamp: string;
  activeRentals: number;
  totalProducts: number;
}

export interface KpiData {
  mrr: number;
  activeRentals: number;
  productUtilizationRate: number;
  customerRetentionRate: number;
  avgResolutionSlaHours: number;
  totalOrders: number;
  totalTickets: number;
  openTickets: number;
  operationalCities: number;
}

export function getApiBase(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('rentease_api_url');
    if (custom && custom.trim()) {
      return custom.trim().replace(/\/+$/, '');
    }
  }
  const envUrl = (import.meta.env?.VITE_API_URL as string) || '';
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  // When running on frontend-virid-iota-76.vercel.app without an explicit VITE_API_URL,
  // seamlessly connect to the live backend instance
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return 'https://rentease-backend-indol.vercel.app/api';
  }
  return '/api';
}

export function setApiBase(url: string): void {
  if (typeof window !== 'undefined') {
    if (!url || !url.trim()) {
      localStorage.removeItem('rentease_api_url');
    } else {
      localStorage.setItem('rentease_api_url', url.trim().replace(/\/+$/, ''));
    }
  }
}

export function getEndpointUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const base = getApiBase();
  if (base.startsWith('http://') || base.startsWith('https://')) {
    return `${base}${cleanPath}`;
  }
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}${base}${cleanPath}`;
}

async function parseJsonResponse<T>(res: Response, errorLabel: string): Promise<T> {
  if (!res.ok) {
    throw new Error(`${errorLabel}: Server returned HTTP ${res.status}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    if (text.includes('<!doctype') || text.includes('<html')) {
      throw new Error(`${errorLabel}: Received HTML response. Ensure backend is deployed.`);
    }
    throw new Error(`${errorLabel}: Non-JSON response`);
  }
  return await res.json();
}

export const api = {
  getApiBase,
  setApiBase,
  getEndpointUrl,

  // Check Backend Connection Health
  async checkHealth(): Promise<BackendHealth | null> {
    try {
      const res = await fetch(getEndpointUrl('/health'));
      if (!res.ok) return null;
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Products
  async getProducts(params?: { category?: string; subCategory?: string; search?: string }): Promise<Product[]> {
    const url = new URL(getEndpointUrl('/products'));
    if (params?.category) url.searchParams.set('category', params.category);
    if (params?.subCategory) url.searchParams.set('subCategory', params.subCategory);
    if (params?.search) url.searchParams.set('search', params.search);

    const res = await fetch(url.toString(), { cache: 'no-store' });
    return await parseJsonResponse<Product[]>(res, 'Failed to fetch products from backend');
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch(getEndpointUrl('/products'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      return await parseJsonResponse<Product>(res, 'Failed to add product');
    } catch (err) {
      console.info('Backend sync unavailable for product creation, saved locally:', err);
      return product as Product;
    }
  },

  // Orders
  async getOrders(): Promise<RentalOrder[]> {
    const res = await fetch(getEndpointUrl('/orders'), { cache: 'no-store' });
    return await parseJsonResponse<RentalOrder[]>(res, 'Failed to fetch orders');
  },

  async createOrder(order: RentalOrder): Promise<RentalOrder> {
    try {
      const res = await fetch(getEndpointUrl('/orders'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      return await parseJsonResponse<RentalOrder>(res, 'Failed to place order');
    } catch (err) {
      console.info('Backend sync unavailable for order placement, saved locally:', err);
      return order;
    }
  },

  async updateOrderStatus(orderId: string, status: RentalOrder['status']): Promise<RentalOrder> {
    try {
      const res = await fetch(getEndpointUrl(`/orders/${orderId}/status`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await parseJsonResponse<RentalOrder>(res, 'Failed to update order status');
    } catch (err) {
      console.info('Backend sync unavailable for order status, updated locally:', err);
      return { id: orderId, status } as any;
    }
  },

  async extendOrderTenure(orderId: string, additionalMonths: RentalTenure): Promise<RentalOrder> {
    const res = await fetch(getEndpointUrl(`/orders/${orderId}/extend`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ additionalMonths })
    });
    return await parseJsonResponse<RentalOrder>(res, 'Failed to extend tenure');
  },

  async requestRelocation(orderId: string, newAddress: string, moveDate: string): Promise<RentalOrder> {
    const res = await fetch(getEndpointUrl(`/orders/${orderId}/relocate`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newAddress, moveDate })
    });
    return await parseJsonResponse<RentalOrder>(res, 'Failed to request relocation');
  },

  async scheduleReturn(orderId: string, returnDate: string, returnReason: string): Promise<{ order: RentalOrder; claim: ReturnDamageClaim }> {
    const res = await fetch(getEndpointUrl(`/orders/${orderId}/return`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnDate, returnReason })
    });
    return await parseJsonResponse<{ order: RentalOrder; claim: ReturnDamageClaim }>(res, 'Failed to schedule return');
  },

  // Maintenance Tickets
  async getTickets(): Promise<MaintenanceTicket[]> {
    const res = await fetch(getEndpointUrl('/tickets'), { cache: 'no-store' });
    return await parseJsonResponse<MaintenanceTicket[]>(res, 'Failed to fetch tickets');
  },

  async createTicket(ticket: Partial<MaintenanceTicket>): Promise<MaintenanceTicket> {
    const res = await fetch(getEndpointUrl('/tickets'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket)
    });
    return await parseJsonResponse<MaintenanceTicket>(res, 'Failed to submit maintenance ticket');
  },

  async updateTicket(
    ticketId: string,
    status: MaintenanceTicket['status'],
    technicianName?: string,
    resolutionNotes?: string
  ): Promise<MaintenanceTicket> {
    const res = await fetch(getEndpointUrl(`/tickets/${ticketId}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, technicianName, resolutionNotes })
    });
    return await parseJsonResponse<MaintenanceTicket>(res, 'Failed to update ticket');
  },

  // Claims
  async getClaims(): Promise<ReturnDamageClaim[]> {
    const res = await fetch(getEndpointUrl('/claims'), { cache: 'no-store' });
    return await parseJsonResponse<ReturnDamageClaim[]>(res, 'Failed to fetch claims');
  },

  async resolveClaim(
    claimId: string,
    claimStatus: ReturnDamageClaim['claimStatus'],
    damageDeduction: number,
    damageNotes: string
  ): Promise<ReturnDamageClaim> {
    const res = await fetch(getEndpointUrl(`/claims/${claimId}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimStatus, damageDeduction, damageNotes })
    });
    return await parseJsonResponse<ReturnDamageClaim>(res, 'Failed to resolve claim');
  },

  // Cities
  async getCities(): Promise<ServiceCity[]> {
    const res = await fetch(getEndpointUrl('/cities'), { cache: 'no-store' });
    return await parseJsonResponse<ServiceCity[]>(res, 'Failed to fetch service cities');
  },

  async toggleCity(cityId: string): Promise<ServiceCity> {
    const res = await fetch(getEndpointUrl(`/cities/${cityId}/toggle`), {
      method: 'PUT'
    });
    return await parseJsonResponse<ServiceCity>(res, 'Failed to toggle city status');
  },

  // KPIs
  async getKpis(): Promise<KpiData> {
    const res = await fetch(getEndpointUrl('/analytics/kpis'), { cache: 'no-store' });
    return await parseJsonResponse<KpiData>(res, 'Failed to fetch analytics KPIs');
  }
};
