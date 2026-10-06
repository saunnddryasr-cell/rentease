export type ProductCategory = 'furniture' | 'appliances' | 'bundles';

export type SubCategory =
  | 'bed'
  | 'sofa'
  | 'table'
  | 'refrigerator'
  | 'washing_machine'
  | 'tv'
  | 'desk'
  | 'chair'
  | 'microwave'
  | 'bundle';

export type RentalTenure = 3 | 6 | 12;

export interface ProductSpecs {
  dimensions?: string;
  material?: string;
  color?: string;
  energyRating?: string;
  capacity?: string;
  condition: 'Brand New' | 'Certified Mint' | 'Refurbished Grade A';
  warranty: string;
}

export interface Product {
  id: string;
  title: string;
  category: ProductCategory;
  subCategory: SubCategory;
  description: string;
  features: string[];
  image: string;
  monthlyRent3m: number;
  monthlyRent6m: number;
  monthlyRent12m: number;
  securityDeposit: number;
  specs: ProductSpecs;
  stockCount: number;
  availableCount: number;
  rentedCount: number;
  isPopular?: boolean;
  featured?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  image: string;
  category: ProductCategory;
  tenure: RentalTenure;
  monthlyRent: number;
  securityDeposit: number;
  quantity: number;
}

export type OrderStatus = 'scheduled' | 'out_for_delivery' | 'active' | 'return_requested' | 'returned';

export interface TrackingStep {
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

export interface RentalOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  city: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliverySlot: string;
  items: CartItem[];
  totalMonthlyRent: number;
  totalDeposit: number;
  status: OrderStatus;
  tenureMonths: number;
  tenureEndDate: string;
  trackingSteps: TrackingStep[];
  kycVerified: boolean;
}

export type TicketStatus = 'open' | 'in_progress' | 'resolved';
export type TicketPriority = 'low' | 'normal' | 'urgent';

export interface MaintenanceTicket {
  id: string;
  orderId: string;
  orderNumber: string;
  productTitle: string;
  issueCategory: 'cooling_issue' | 'mechanical_defect' | 'physical_wear' | 'electrical_failure' | 'general_servicing';
  issueCategoryLabel: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  preferredDate: string;
  technicianName?: string;
  resolutionNotes?: string;
  createdAt: string;
}

export type ClaimStatus = 'pending_inspection' | 'approved_refund' | 'deposit_deducted';

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
  claimStatus: ClaimStatus;
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
