import type {
  Product,
  RentalOrder,
  MaintenanceTicket,
  ReturnDamageClaim,
  ServiceCity
} from '../types/index.ts';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-sofa-nordic',
    title: 'Nordic 3-Seater Pebble Sofa',
    category: 'furniture',
    subCategory: 'sofa',
    description: 'Minimalist Scandinavian 3-seater sofa crafted with textured breathable linen upholstery, high-resilience foam cushioning, and tapered solid oak wooden legs.',
    features: [
      'High-density 32D ergonomic foam support',
      'Solid kiln-dried natural oak timber legs',
      'Stain-resistant textured fabric weave',
      'Free deep-cleaning session every 6 months'
    ],
    image: '/frontend/assets/images/product_scandinavian_sofa_1791088510891.jpg',
    monthlyRent3m: 1199,
    monthlyRent6m: 1049,
    monthlyRent12m: 899,
    securityDeposit: 1500,
    specs: {
      dimensions: '82" W x 34" D x 32" H',
      material: 'Kiln-Dried Solid Oak & Textured Linen',
      color: 'Pebble Heather Grey',
      condition: 'Certified Mint',
      warranty: '100% Free repair & wear replacement'
    },
    stockCount: 14,
    availableCount: 9,
    rentedCount: 5,
    isPopular: true,
    featured: true
  },
  {
    id: 'prod-bed-kyoto',
    title: 'Kyoto Queen Platform Bed Frame',
    category: 'furniture',
    subCategory: 'bed',
    description: 'Japanese-inspired low platform bed frame made of solid American walnut with an integrated soft-padded headboard.',
    features: [
      'Solid kiln-dried American walnut construction',
      'Noiseless interlocking slatted mattress base',
      'Padded oatmeal linen ergonomic headboard',
      'Zero-tool doorstep assembly included'
    ],
    image: '/frontend/assets/images/product_queen_storage_bed_1791088528069.jpg',
    monthlyRent3m: 1399,
    monthlyRent6m: 1199,
    monthlyRent12m: 999,
    securityDeposit: 1800,
    specs: {
      dimensions: '64" W x 84" L x 38" H (Queen)',
      material: 'Solid Walnut Wood & Cotton-Linen',
      color: 'Natural Walnut & Oatmeal',
      condition: 'Certified Mint',
      warranty: 'Full structural warranty & free relocation'
    },
    stockCount: 18,
    availableCount: 11,
    rentedCount: 7,
    isPopular: true,
    featured: true
  },
  {
    id: 'prod-fridge-smart-inverter',
    title: 'Frost-Free 265L Smart Inverter Refrigerator',
    category: 'appliances',
    subCategory: 'refrigerator',
    description: 'Titanium-finish double-door refrigerator equipped with smart inverter compressor technology and multi-airflow cooling vents.',
    features: [
      'Multi-airflow surround cooling technology',
      'Smart inverter compressor with whisper-quiet operation',
      'Toughened glass shelves rated up to 175kg',
      'Annual free maintenance & gas charge included'
    ],
    image: '/frontend/assets/images/product_smart_refrigerator_1791088541075.jpg',
    monthlyRent3m: 1299,
    monthlyRent6m: 1149,
    monthlyRent12m: 949,
    securityDeposit: 1600,
    specs: {
      capacity: '265 Litres (Double Door)',
      energyRating: '4-Star Energy Efficient Inverter',
      dimensions: '550 x 650 x 1550 mm',
      condition: 'Certified Mint',
      warranty: 'Doorstep repair within 24 hours guaranteed'
    },
    stockCount: 22,
    availableCount: 15,
    rentedCount: 7,
    isPopular: true,
    featured: true
  },
  {
    id: 'prod-washer-frontload',
    title: 'Aura 7kg Direct-Drive Front Load Washer',
    category: 'appliances',
    subCategory: 'washing_machine',
    description: 'Direct-drive inverter front-load washing machine featuring 15 intelligent fabric programs and steam hygiene wash.',
    features: [
      '6 Motion Direct Drive gentle drum mechanics',
      'Steam allergy care & high-temperature sterilization',
      'Digital touch dial with cycle delay timer',
      'Free plumbing kit & doorstep inlet connection'
    ],
    image: '/frontend/assets/images/product_washing_machine_1791088551584.jpg',
    monthlyRent3m: 1249,
    monthlyRent6m: 1099,
    monthlyRent12m: 899,
    securityDeposit: 1500,
    specs: {
      capacity: '7.0 kg Front Load',
      energyRating: '5-Star Energy Certified',
      dimensions: '600 x 560 x 850 mm',
      condition: 'Brand New',
      warranty: 'Zero maintenance fee & free technician check'
    },
    stockCount: 16,
    availableCount: 8,
    rentedCount: 8,
    isPopular: true,
    featured: true
  },
  {
    id: 'prod-tv-4k-smart',
    title: '50" 4K Ultra HD Frameless Smart LED TV',
    category: 'appliances',
    subCategory: 'tv',
    description: 'Bezel-less 50-inch 4K HDR display with Dolby Vision, immersive sound output, and preloaded apps.',
    features: [
      '4K Ultra HD (3840 x 2160) IPS panel',
      'Dolby Vision & 24W Dolby Audio speakers',
      'Google TV OS with Google Assistant voice remote',
      'Wall mount installation or table stand included'
    ],
    image: '/frontend/assets/images/hero_modern_rental_living_1791088495163.jpg',
    monthlyRent3m: 1499,
    monthlyRent6m: 1299,
    monthlyRent12m: 1099,
    securityDeposit: 2000,
    specs: {
      dimensions: '50-inch Diagonal Display',
      energyRating: 'A+ Energy Efficiency',
      condition: 'Certified Mint',
      warranty: 'Full panel cover & free wall mount bracket'
    },
    stockCount: 12,
    availableCount: 6,
    rentedCount: 6,
    isPopular: false,
    featured: true
  },
  {
    id: 'prod-desk-ergonomic-pro',
    title: 'Apex Motorized Sit-Stand Oak Desk',
    category: 'furniture',
    subCategory: 'desk',
    description: 'Electric dual-motor adjustable standing desk with solid oak tabletop and digital memory presets.',
    features: [
      'Dual silent electric motors (70cm - 120cm height range)',
      '4 memory programmable height buttons',
      'Solid oak bevelled surface with anti-scratch coating',
      'Integrated surge-protected power strip holder'
    ],
    image: '/frontend/assets/images/product_scandinavian_sofa_1791088510891.jpg',
    monthlyRent3m: 999,
    monthlyRent6m: 849,
    monthlyRent12m: 699,
    securityDeposit: 1200,
    specs: {
      dimensions: '48" W x 28" D x 28"-48" H',
      material: 'Solid Oak Wood & Heavy Gauge Steel',
      color: 'Natural Oak / Matte Charcoal',
      condition: 'Certified Mint',
      warranty: 'Motor & electrical mechanism guaranteed'
    },
    stockCount: 20,
    availableCount: 14,
    rentedCount: 6,
    isPopular: true,
    featured: false
  },
  {
    id: 'prod-chair-ergonomic-mesh',
    title: 'ErgoComfort High-Back Breathable Task Chair',
    category: 'furniture',
    subCategory: 'chair',
    description: 'Full ergonomic task chair with 3D adjustable armrests, adaptive lumbar pillow support, and ventilated Korean mesh backrest.',
    features: [
      'Self-calibrating weight-sensitive tilt mechanism',
      'Class-4 BIFMA certified gas lift cylinder',
      'High-breathability German elastomeric mesh',
      'Smooth silent polyurethane roller casters'
    ],
    image: '/frontend/assets/images/product_queen_storage_bed_1791088528069.jpg',
    monthlyRent3m: 599,
    monthlyRent6m: 499,
    monthlyRent12m: 399,
    securityDeposit: 800,
    specs: {
      dimensions: '26" W x 26" D x 44"-48" H',
      material: 'Reinforced Nylon & Elastic Mesh',
      color: 'Onyx Black',
      condition: 'Brand New',
      warranty: 'Lifetime mechanism support'
    },
    stockCount: 25,
    availableCount: 17,
    rentedCount: 8,
    isPopular: false,
    featured: false
  },
  {
    id: 'prod-dining-solid-wood',
    title: 'Alba 4-Seater Solid Oak Dining Set',
    category: 'furniture',
    subCategory: 'table',
    description: 'Warm oak 4-seater dining table paired with four comfortable upholstered chairs.',
    features: [
      'Hand-finished warm oak dining tabletop',
      '4 matching curved ergonomic backrest chairs',
      'Water and heat-resistant polyurethane clear coat',
      'Rounded safety edge profile'
    ],
    image: '/frontend/assets/images/product_scandinavian_sofa_1791088510891.jpg',
    monthlyRent3m: 1099,
    monthlyRent6m: 949,
    monthlyRent12m: 799,
    securityDeposit: 1400,
    specs: {
      dimensions: '44" L x 32" W x 30" H',
      material: 'Solid White Oak & Fabric Seats',
      color: 'Natural White Oak',
      condition: 'Certified Mint',
      warranty: 'Free surface repolishing upon renewal'
    },
    stockCount: 10,
    availableCount: 6,
    rentedCount: 4,
    isPopular: false,
    featured: false
  },
  {
    id: 'prod-bundle-student-starter',
    title: '1BHK Student Essential Starter Bundle',
    category: 'bundles',
    subCategory: 'bundle',
    description: 'Complete living bundle designed specifically for university students and relocating interns. Includes Bed Frame + Refrigerator (265L) + Study Desk & Task Chair.',
    features: [
      'Includes 4 flagship essentials in 1 consolidated delivery',
      'Bundled 20% discount compared to renting individually',
      'Free zero-cost relocation if you change apartments',
      'Single monthly consolidated billing invoice'
    ],
    image: '/frontend/assets/images/hero_modern_rental_living_1791088495163.jpg',
    monthlyRent3m: 3499,
    monthlyRent6m: 2999,
    monthlyRent12m: 2499,
    securityDeposit: 3500,
    specs: {
      capacity: '4 Premium Furniture & Appliance Items',
      condition: 'Certified Mint',
      warranty: 'Comprehensive zero-hassle maintenance package'
    },
    stockCount: 8,
    availableCount: 4,
    rentedCount: 4,
    isPopular: true,
    featured: true
  },
  {
    id: 'prod-bundle-wfh-executive',
    title: 'Work-From-Home Executive Suite Bundle',
    category: 'bundles',
    subCategory: 'bundle',
    description: 'Professional remote work suite. Includes Motorized Sit-Stand Desk + ErgoComfort High-Back Mesh Chair + 50" Smart 4K Display.',
    features: [
      'Complete ergonomic workstation certified for 10+ hr workdays',
      'Over 25% savings over separate standalone rentals',
      'Pre-assembled cable raceway and power sockets',
      'Priority 12-hour support SLA'
    ],
    image: '/frontend/assets/images/hero_modern_rental_living_1791088495163.jpg',
    monthlyRent3m: 2699,
    monthlyRent6m: 2299,
    monthlyRent12m: 1899,
    securityDeposit: 2800,
    specs: {
      capacity: '3 Professional Ergonomic Items',
      condition: 'Brand New',
      warranty: 'Priority 12-hour support SLA'
    },
    stockCount: 6,
    availableCount: 3,
    rentedCount: 3,
    isPopular: false,
    featured: true
  }
];

export const INITIAL_ORDERS: RentalOrder[] = [
  {
    id: 'ord-10294',
    orderNumber: 'RE-84210',
    createdAt: '2026-08-15',
    customerName: 'Sarah Chen',
    customerEmail: 'sarah.chen@techcorp.io',
    customerPhone: '+91 98452 11094',
    city: 'Bengaluru',
    deliveryAddress: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103',
    deliveryDate: '2026-08-17',
    deliverySlot: 'Morning (09:00 AM – 01:00 PM)',
    items: [
      {
        id: 'cart-item-1',
        productId: 'prod-bed-kyoto',
        title: 'Kyoto Queen Platform Bed Frame',
        image: '/frontend/assets/images/product_queen_storage_bed_1791088528069.jpg',
        category: 'furniture',
        tenure: 6,
        monthlyRent: 1199,
        securityDeposit: 1800,
        quantity: 1
      },
      {
        id: 'cart-item-2',
        productId: 'prod-fridge-smart-inverter',
        title: 'Frost-Free 265L Smart Inverter Refrigerator',
        image: '/frontend/assets/images/product_smart_refrigerator_1791088541075.jpg',
        category: 'appliances',
        tenure: 6,
        monthlyRent: 1149,
        securityDeposit: 1600,
        quantity: 1
      }
    ],
    totalMonthlyRent: 2348,
    totalDeposit: 3400,
    status: 'active',
    tenureMonths: 6,
    tenureEndDate: '2027-02-17',
    trackingSteps: [
      { title: 'Order Confirmed', description: 'Deposit and initial monthly rent paid', date: 'Aug 15, 2026', completed: true },
      { title: 'KYC Verified', description: 'Digital government ID verification passed', date: 'Aug 15, 2026', completed: true },
      { title: 'Dispatched from Hub', description: 'Items loaded from Bellandur Central Depot', date: 'Aug 17, 2026', completed: true },
      { title: 'Delivered & Installed', description: 'Doorstep assembly complete by technician Rohit', date: 'Aug 17, 2026', completed: true }
    ],
    kycVerified: true
  },
  {
    id: 'ord-10295',
    orderNumber: 'RE-84228',
    createdAt: '2026-09-28',
    customerName: 'Sarah Chen',
    customerEmail: 'sarah.chen@techcorp.io',
    customerPhone: '+91 98452 11094',
    city: 'Bengaluru',
    deliveryAddress: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103',
    deliveryDate: '2026-10-05',
    deliverySlot: 'Afternoon (02:00 PM – 06:00 PM)',
    items: [
      {
        id: 'cart-item-3',
        productId: 'prod-sofa-nordic',
        title: 'Nordic 3-Seater Pebble Sofa',
        image: '/frontend/assets/images/product_scandinavian_sofa_1791088510891.jpg',
        category: 'furniture',
        tenure: 12,
        monthlyRent: 899,
        securityDeposit: 1500,
        quantity: 1
      }
    ],
    totalMonthlyRent: 899,
    totalDeposit: 1500,
    status: 'scheduled',
    tenureMonths: 12,
    tenureEndDate: '2027-10-05',
    trackingSteps: [
      { title: 'Order Confirmed', description: 'Deposit received, order placed successfully', date: 'Sep 28, 2026', completed: true },
      { title: 'Quality Inspection', description: 'Furniture steam sanitized and packed', date: 'Oct 02, 2026', completed: true },
      { title: 'Scheduled for Delivery', description: 'Slot booked for Oct 05, 02:00 PM', date: 'Oct 05, 2026', completed: false },
      { title: 'Doorstep Setup', description: 'Free positioning and leveling', date: 'Oct 05, 2026', completed: false }
    ],
    kycVerified: true
  }
];

export const INITIAL_MAINTENANCE_TICKETS: MaintenanceTicket[] = [
  {
    id: 'tkt-401',
    orderId: 'ord-10294',
    orderNumber: 'RE-84210',
    productTitle: 'Frost-Free 265L Smart Inverter Refrigerator',
    issueCategory: 'cooling_issue',
    issueCategoryLabel: 'Temperature Calibration / Cooling',
    description: 'Chiller tray cooling seems slightly mild on the default dial setting. Requesting routine sensor inspection.',
    priority: 'normal',
    status: 'in_progress',
    preferredDate: '2026-10-06',
    technicianName: 'Suresh Kumar (Appliance Tech #18)',
    resolutionNotes: 'Technician dispatched with thermocouple probe; scheduled for visit.',
    createdAt: '2026-10-02'
  },
  {
    id: 'tkt-400',
    orderId: 'ord-10294',
    orderNumber: 'RE-84210',
    productTitle: 'Kyoto Queen Platform Bed Frame',
    issueCategory: 'general_servicing',
    issueCategoryLabel: 'Doorstep Relocation & Re-tightening',
    description: 'Bed frame bolt tightening following room rearrangement.',
    priority: 'low',
    status: 'resolved',
    preferredDate: '2026-09-05',
    technicianName: 'Manish Verma (Assembly Specialist)',
    resolutionNotes: 'All joint bolts inspected and torqued to 25Nm.',
    createdAt: '2026-09-02'
  }
];

export const INITIAL_CLAIMS: ReturnDamageClaim[] = [
  {
    id: 'clm-8801',
    orderId: 'ord-9011',
    orderNumber: 'RE-79102',
    productTitle: 'Aura 7kg Direct-Drive Front Load Washer',
    customerName: 'Anand Kulkarni',
    returnDate: '2026-09-24',
    conditionReport: 'mint',
    originalDeposit: 1500,
    damageDeduction: 0,
    refundAmount: 1500,
    claimStatus: 'approved_refund',
    damageNotes: 'Appliance returned in immaculate condition. Full deposit returned.'
  },
  {
    id: 'clm-8802',
    orderId: 'ord-9120',
    orderNumber: 'RE-80124',
    productTitle: 'Alba 4-Seater Solid Oak Dining Set',
    customerName: 'Priya Sundaram',
    returnDate: '2026-10-01',
    conditionReport: 'normal_wear',
    originalDeposit: 1400,
    damageDeduction: 0,
    refundAmount: 1400,
    claimStatus: 'approved_refund',
    damageNotes: 'Standard light micro-scuffs on tabletop within allowable fair use policy. Zero penalty applied.'
  },
  {
    id: 'clm-8803',
    orderId: 'ord-9233',
    orderNumber: 'RE-81200',
    productTitle: 'Nordic 3-Seater Pebble Sofa',
    customerName: 'Karthik Rao',
    returnDate: '2026-10-03',
    conditionReport: 'damaged',
    originalDeposit: 1500,
    damageDeduction: 450,
    refundAmount: 1050,
    claimStatus: 'deposit_deducted',
    damageNotes: 'Permanent ink stain across right armrest. Deduction of ₹450 assessed with customer consent.'
  }
];

export const SERVICE_CITIES: ServiceCity[] = [
  {
    id: 'city-blr',
    name: 'Bengaluru',
    state: 'Karnataka',
    pinCodes: ['560001', '560034', '560100', '560103', '560066', '560037', '560029'],
    activeHubs: 4,
    isAvailable: true,
    estDeliveryHours: 'Within 24 Hours'
  },
  {
    id: 'city-bom',
    name: 'Mumbai',
    state: 'Maharashtra',
    pinCodes: ['400001', '400050', '400076', '400098', '400053'],
    activeHubs: 3,
    isAvailable: true,
    estDeliveryHours: 'Within 36 Hours'
  },
  {
    id: 'city-del',
    name: 'Delhi-NCR',
    state: 'Delhi / Haryana',
    pinCodes: ['110001', '122001', '122018', '201301', '110019'],
    activeHubs: 5,
    isAvailable: true,
    estDeliveryHours: 'Within 24 Hours'
  },
  {
    id: 'city-pnq',
    name: 'Pune',
    state: 'Maharashtra',
    pinCodes: ['411001', '411014', '411057', '411028'],
    activeHubs: 2,
    isAvailable: true,
    estDeliveryHours: 'Within 48 Hours'
  },
  {
    id: 'city-hyd',
    name: 'Hyderabad',
    state: 'Telangana',
    pinCodes: ['500001', '500032', '500081', '500084'],
    activeHubs: 3,
    isAvailable: true,
    estDeliveryHours: 'Within 24 Hours'
  }
];
