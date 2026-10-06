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

const RAW_API_BASE = (import.meta.env?.VITE_API_URL as string) || '/api';
const API_BASE = RAW_API_BASE.replace(/\/+$/, '');

function getEndpointUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (API_BASE.startsWith('http://') || API_BASE.startsWith('https://')) {
    return `${API_BASE}${cleanPath}`;
  }
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}${API_BASE}${cleanPath}`;
}

export const api = {
  // Check Backend Connection Health
  async checkHealth(): Promise<BackendHealth | null> {
    try {
      const res = await fetch(getEndpointUrl('/health'));
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.warn('Backend API connection check failed:', e);
      return null;
    }
  },

  // Products
  async getProducts(params?: { category?: string; subCategory?: string; search?: string }): Promise<Product[]> {
    const url = new URL(getEndpointUrl('/products'));
    if (params?.category) url.searchParams.set('category', params.category);
    if (params?.subCategory) url.searchParams.set('subCategory', params.subCategory);
    if (params?.search) url.searchParams.set('search', params.search);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch products from backend');
    return await res.json();
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch(getEndpointUrl('/products'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to add product');
    return await res.json();
  },

  // Orders
  async getOrders(): Promise<RentalOrder[]> {
    const res = await fetch(getEndpointUrl('/orders'));
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
  },

  async createOrder(order: RentalOrder): Promise<RentalOrder> {
    const res = await fetch(getEndpointUrl('/orders'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (!res.ok) throw new Error('Failed to place order');
    return await res.json();
  },

  async updateOrderStatus(orderId: string, status: RentalOrder['status']): Promise<RentalOrder> {
    const res = await fetch(getEndpointUrl(`/orders/${orderId}/status`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return await res.json();
  },

  async extendOrderTenure(orderId: string, additionalMonths: RentalTenure): Promise<RentalOrder> {
    const res = await fetch(getEndpointUrl(`/orders/${orderId}/extend`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ additionalMonths })
    });
    if (!res.ok) throw new Error('Failed to extend tenure');
    return await res.json();
  },

  async requestRelocation(orderId: string, newAddress: string, moveDate: string): Promise<RentalOrder> {
    const res = await fetch(getEndpointUrl(`/orders/${orderId}/relocate`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newAddress, moveDate })
    });
    if (!res.ok) throw new Error('Failed to request relocation');
    return await res.json();
  },

  async scheduleReturn(orderId: string, returnDate: string, returnReason: string): Promise<{ order: RentalOrder; claim: ReturnDamageClaim }> {
    const res = await fetch(getEndpointUrl(`/orders/${orderId}/return`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnDate, returnReason })
    });
    if (!res.ok) throw new Error('Failed to schedule return');
    return await res.json();
  },

  // Maintenance Tickets
  async getTickets(): Promise<MaintenanceTicket[]> {
    const res = await fetch(getEndpointUrl('/tickets'));
    if (!res.ok) throw new Error('Failed to fetch tickets');
    return await res.json();
  },

  async createTicket(ticket: Partial<MaintenanceTicket>): Promise<MaintenanceTicket> {
    const res = await fetch(getEndpointUrl('/tickets'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket)
    });
    if (!res.ok) throw new Error('Failed to submit maintenance ticket');
    return await res.json();
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
    if (!res.ok) throw new Error('Failed to update ticket');
    return await res.json();
  },

  // Claims
  async getClaims(): Promise<ReturnDamageClaim[]> {
    const res = await fetch(getEndpointUrl('/claims'));
    if (!res.ok) throw new Error('Failed to fetch claims');
    return await res.json();
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
    if (!res.ok) throw new Error('Failed to resolve claim');
    return await res.json();
  },

  // Cities
  async getCities(): Promise<ServiceCity[]> {
    const res = await fetch(getEndpointUrl('/cities'));
    if (!res.ok) throw new Error('Failed to fetch service cities');
    return await res.json();
  },

  async toggleCity(cityId: string): Promise<ServiceCity> {
    const res = await fetch(getEndpointUrl(`/cities/${cityId}/toggle`), {
      method: 'PUT'
    });
    if (!res.ok) throw new Error('Failed to toggle city status');
    return await res.json();
  },

  // KPIs
  async getKpis(): Promise<KpiData> {
    const res = await fetch(getEndpointUrl('/analytics/kpis'));
    if (!res.ok) throw new Error('Failed to fetch analytics KPIs');
    return await res.json();
  }
};
