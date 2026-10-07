import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { UserRentalsPortal } from './components/UserRentalsPortal';
import { AdminConsole } from './components/AdminConsole';
import { PRDDocModal } from './components/PRDDocModal';
import { HowItWorks } from './components/HowItWorks';
import { Footer } from './components/Footer';

import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_MAINTENANCE_TICKETS,
  INITIAL_CLAIMS,
  SERVICE_CITIES
} from './data/initialData';

import {
  Product,
  CartItem,
  RentalOrder,
  MaintenanceTicket,
  ReturnDamageClaim,
  ServiceCity,
  RentalTenure,
  ProductCategory
} from './types';

import { api } from './services/api';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<
    'catalog' | 'bundles' | 'how-it-works' | 'my-rentals' | 'admin' | 'prd'
  >('catalog');
  const [userRole, setUserRole] = useState<'customer' | 'admin_vendor'>('customer');
  const [selectedCity, setSelectedCity] = useState('Bengaluru');

  // Backend Synchronization status
  const [apiSynced, setApiSynced] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Core Data States (hydrated with localStorage or initial seeds)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('rentease_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<RentalOrder[]>(() => {
    const saved = localStorage.getItem('rentease_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [tickets, setTickets] = useState<MaintenanceTicket[]>(() => {
    const saved = localStorage.getItem('rentease_tickets');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE_TICKETS;
  });

  const [claims, setClaims] = useState<ReturnDamageClaim[]>(() => {
    const saved = localStorage.getItem('rentease_claims');
    return saved ? JSON.parse(saved) : INITIAL_CLAIMS;
  });

  const [cities, setCities] = useState<ServiceCity[]>(() => {
    const saved = localStorage.getItem('rentease_cities');
    return saved ? JSON.parse(saved) : SERVICE_CITIES;
  });

  // Shopping Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('rentease_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isPrdOpen, setIsPrdOpen] = useState(false);

  // Filter & Search states for Catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ProductCategory>('all');
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high'>('recommended');

  // Synchronize state with Backend REST API on mount
  const syncWithBackend = useCallback(async () => {
    setIsSyncing(true);
    try {
      const health = await api.checkHealth();
      if (health) {
        setApiSynced(true);
        const [backendProducts, backendOrders, backendTickets, backendClaims, backendCities] =
          await Promise.all([
            api.getProducts(),
            api.getOrders(),
            api.getTickets(),
            api.getClaims(),
            api.getCities()
          ]);

        if (backendProducts?.length) setProducts(backendProducts);
        if (backendOrders?.length) setOrders(backendOrders);
        if (backendTickets?.length) setTickets(backendTickets);
        if (backendClaims?.length) setClaims(backendClaims);
        if (backendCities?.length) setCities(backendCities);
      } else {
        setApiSynced(false);
      }
    } catch (e) {
      console.warn('Backend sync encountered an issue, running with local cache fallback:', e);
      setApiSynced(false);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    syncWithBackend();
  }, [syncWithBackend]);

  // Sync to LocalStorage as resilient cache
  useEffect(() => {
    localStorage.setItem('rentease_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('rentease_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('rentease_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('rentease_claims', JSON.stringify(claims));
  }, [claims]);

  useEffect(() => {
    localStorage.setItem('rentease_cities', JSON.stringify(cities));
  }, [cities]);

  useEffect(() => {
    localStorage.setItem('rentease_cart', JSON.stringify(cart));
  }, [cart]);

  // Cart operations
  const handleAddToCart = (product: Product, tenure: RentalTenure) => {
    const currentRent =
      tenure === 3
        ? product.monthlyRent3m
        : tenure === 6
        ? product.monthlyRent6m
        : product.monthlyRent12m;

    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id && item.tenure === tenure
      );
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        productId: product.id,
        title: product.title,
        image: product.image,
        category: product.category,
        tenure,
        monthlyRent: currentRent,
        securityDeposit: product.securityDeposit,
        quantity: 1
      };
      return [...prev, newItem];
    });
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateCartTenure = (id: string, newTenure: RentalTenure) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const prod = products.find((p) => p.id === item.productId);
          if (!prod) return { ...item, tenure: newTenure };
          const rent =
            newTenure === 3
              ? prod.monthlyRent3m
              : newTenure === 6
              ? prod.monthlyRent6m
              : prod.monthlyRent12m;
          return {
            ...item,
            tenure: newTenure,
            monthlyRent: rent
          };
        }
        return item;
      })
    );
  };

  // Place Order (Synchronized with Backend API)
  const handlePlaceOrder = async (newOrder: RentalOrder) => {
    setIsSyncing(true);
    // Optimistic UI update
    setOrders((prev) => [newOrder, ...prev]);
    setProducts((prev) =>
      prev.map((p) => {
        const orderedItem = newOrder.items.find((i) => i.productId === p.id);
        if (orderedItem) {
          return {
            ...p,
            availableCount: Math.max(0, p.availableCount - orderedItem.quantity),
            rentedCount: p.rentedCount + orderedItem.quantity
          };
        }
        return p;
      })
    );
    setCart([]);

    try {
      const serverOrder = await api.createOrder(newOrder);
      if (serverOrder) {
        setOrders((prev) => prev.map((o) => (o.id === newOrder.id ? serverOrder : o)));
        setApiSynced(true);
      }
    } catch (err) {
      console.warn('Backend order sync fallback to local cache:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // User Portal Actions (Synchronized with Backend API)
  const handleCreateTicket = async (newTicket: MaintenanceTicket) => {
    setIsSyncing(true);
    setTickets((prev) => [newTicket, ...prev]);

    try {
      const serverTicket = await api.createTicket(newTicket);
      if (serverTicket) {
        setTickets((prev) => prev.map((t) => (t.id === newTicket.id ? serverTicket : t)));
        setApiSynced(true);
      }
    } catch (err) {
      console.warn('Backend ticket sync fallback to local cache:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExtendTenure = async (orderId: string, additionalMonths: RentalTenure) => {
    setIsSyncing(true);
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const endDate = new Date(ord.tenureEndDate);
          endDate.setMonth(endDate.getMonth() + additionalMonths);
          return {
            ...ord,
            tenureMonths: ord.tenureMonths + additionalMonths,
            tenureEndDate: endDate.toISOString().split('T')[0]
          };
        }
        return ord;
      })
    );

    try {
      await api.extendOrderTenure(orderId, additionalMonths);
      setApiSynced(true);
    } catch (err) {
      console.warn('Backend tenure extension sync fallback:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleScheduleReturn = async (orderId: string, date: string, reason: string) => {
    setIsSyncing(true);
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: 'return_requested' as const } : ord))
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      const newClaim: ReturnDamageClaim = {
        id: `clm-${Date.now()}`,
        orderId: targetOrder.id,
        orderNumber: targetOrder.orderNumber,
        productTitle: targetOrder.items.map((i) => i.title).join(', '),
        customerName: targetOrder.customerName,
        returnDate: date,
        conditionReport: 'mint',
        originalDeposit: targetOrder.totalDeposit,
        damageDeduction: 0,
        refundAmount: targetOrder.totalDeposit,
        claimStatus: 'pending_inspection',
        damageNotes: `Return scheduled for ${date}. Reason: ${reason}`
      };
      setClaims((prev) => [newClaim, ...prev]);
    }

    try {
      const res = await api.scheduleReturn(orderId, date, reason);
      if (res?.claim) {
        setClaims((prev) => [res.claim, ...prev.filter((c) => c.orderId !== orderId)]);
        setApiSynced(true);
      }
    } catch (err) {
      console.warn('Backend return schedule fallback:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRequestRelocation = async (orderId: string, newAddress: string, moveDate: string) => {
    setIsSyncing(true);
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            deliveryAddress: newAddress,
            trackingSteps: [
              ...ord.trackingSteps,
              {
                title: 'Relocation Scheduled',
                description: `Free moving crew booked for ${moveDate}`,
                date: moveDate,
                completed: true
              }
            ]
          };
        }
        return ord;
      })
    );

    try {
      await api.requestRelocation(orderId, newAddress, moveDate);
      setApiSynced(true);
    } catch (err) {
      console.warn('Backend relocation sync fallback:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Admin Actions (Synchronized with Backend API)
  const handleAddProduct = async (newProduct: Product) => {
    setIsSyncing(true);
    setProducts((prev) => [newProduct, ...prev]);

    try {
      const serverProd = await api.createProduct(newProduct);
      if (serverProd) {
        setProducts((prev) => prev.map((p) => (p.id === newProduct.id ? serverProd : p)));
        setApiSynced(true);
      }
    } catch {
      // Product is safely preserved in local state
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: RentalOrder['status']) => {
    setIsSyncing(true);
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = { ...ord, status };
          if (status === 'active') {
            updated.trackingSteps = updated.trackingSteps.map((s) => ({ ...s, completed: true }));
          }
          return updated;
        }
        return ord;
      })
    );

    try {
      await api.updateOrderStatus(orderId, status);
      setApiSynced(true);
    } catch (err) {
      console.warn('Backend order status sync fallback:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateTicketStatus = async (
    ticketId: string,
    status: MaintenanceTicket['status'],
    technicianName?: string,
    notes?: string
  ) => {
    setIsSyncing(true);
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status,
            technicianName: technicianName || t.technicianName,
            resolutionNotes: notes || t.resolutionNotes
          };
        }
        return t;
      })
    );

    try {
      await api.updateTicket(ticketId, status, technicianName, notes);
      setApiSynced(true);
    } catch (err) {
      console.warn('Backend ticket update sync fallback:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleResolveClaim = async (
    claimId: string,
    status: ReturnDamageClaim['claimStatus'],
    deduction: number,
    notes: string
  ) => {
    setIsSyncing(true);
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          return {
            ...c,
            claimStatus: status,
            damageDeduction: deduction,
            refundAmount: Math.max(0, c.originalDeposit - deduction),
            damageNotes: notes
          };
        }
        return c;
      })
    );

    try {
      await api.resolveClaim(claimId, status, deduction, notes);
      setApiSynced(true);
    } catch (err) {
      console.warn('Backend claim resolution sync fallback:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleCityOperational = async (cityId: string) => {
    setIsSyncing(true);
    setCities((prev) =>
      prev.map((c) => (c.id === cityId ? { ...c, isAvailable: !c.isAvailable } : c))
    );

    try {
      await api.toggleCity(cityId);
      setApiSynced(true);
    } catch (err) {
      console.warn('Backend city toggle sync fallback:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Filtering products
  const filteredProducts = products.filter((p) => {
    if (activeTab === 'bundles') {
      return p.category === 'bundles';
    }
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesSubCategory =
      subCategoryFilter === 'all' || p.subCategory === subCategoryFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSubCategory && matchesSearch;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_low') return a.monthlyRent6m - b.monthlyRent6m;
    if (sortBy === 'price_high') return b.monthlyRent6m - a.monthlyRent6m;
    return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
      
      {/* 3-Zone Top Navigation Bar with REST API Sync Indicator */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'prd') {
            setIsPrdOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        openCart={() => setIsCartOpen(true)}
        userRole={userRole}
        setUserRole={setUserRole}
        cities={cities}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        apiSynced={apiSynced}
        isSyncing={isSyncing}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* VIEW 1 & 2: STOREFRONT CATALOG & BUNDLES */}
        {(activeTab === 'catalog' || activeTab === 'bundles') && (
          <div className="space-y-10">
            {/* Hero Banner (Only shown on catalog home) */}
            {activeTab === 'catalog' && (
              <Hero
                selectedCity={selectedCity}
                onExploreCatalog={() => {
                  const el = document.getElementById('catalog-products-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                onExploreBundles={() => {
                  setActiveTab('bundles');
                }}
              />
            )}

            {/* Catalog Container */}
            <div id="catalog-products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
              
              {/* Header Title & Tab Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                    <span>{selectedCity} Hub</span>
                    <span aria-hidden="true">·</span>
                    <span>Free Assembly</span>
                    <span aria-hidden="true">·</span>
                    <span>100% Refundable Security Deposit</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    {activeTab === 'bundles'
                      ? 'Curated Room Bundles'
                      : 'Furniture & Appliance Catalog'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 max-w-xl">
                    {activeTab === 'bundles'
                      ? 'Pre-configured home bundles curated for students, interns, and remote professionals with consolidated billing and extra savings.'
                      : 'Browse individual high-grade furniture and smart appliances. Select 3, 6, or 12-month rental plans with zero repair charges.'}
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search sofa, bed, fridge, desk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 shadow-xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Strip (Only on main catalog) */}
              {activeTab === 'catalog' && (
                <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                  {/* Category Segmented Control */}
                  <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 rounded-lg">
                    <button
                      onClick={() => {
                        setCategoryFilter('all');
                        setSubCategoryFilter('all');
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                        categoryFilter === 'all'
                          ? 'bg-white text-slate-900 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All Items ({products.length})
                    </button>
                    <button
                      onClick={() => {
                        setCategoryFilter('furniture');
                        setSubCategoryFilter('all');
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                        categoryFilter === 'furniture'
                          ? 'bg-white text-slate-900 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Furniture ({products.filter((p) => p.category === 'furniture').length})
                    </button>
                    <button
                      onClick={() => {
                        setCategoryFilter('appliances');
                        setSubCategoryFilter('all');
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                        categoryFilter === 'appliances'
                          ? 'bg-white text-slate-900 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Appliances ({products.filter((p) => p.category === 'appliances').length})
                    </button>
                    <button
                      onClick={() => {
                        setCategoryFilter('bundles');
                        setSubCategoryFilter('all');
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                        categoryFilter === 'bundles'
                          ? 'bg-white text-slate-900 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Room Bundles ({products.filter((p) => p.category === 'bundles').length})
                    </button>
                  </div>

                  {/* Subcategory & Sort options */}
                  <div className="flex items-center gap-3">
                    {categoryFilter === 'furniture' && (
                      <select
                        value={subCategoryFilter}
                        onChange={(e) => setSubCategoryFilter(e.target.value)}
                        className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
                      >
                        <option value="all">All Furniture Types</option>
                        <option value="bed">Beds &amp; Mattresses</option>
                        <option value="sofa">Sofas &amp; Couches</option>
                        <option value="desk">Work Desks</option>
                        <option value="chair">Ergo Chairs</option>
                        <option value="table">Dining Tables</option>
                      </select>
                    )}

                    {categoryFilter === 'appliances' && (
                      <select
                        value={subCategoryFilter}
                        onChange={(e) => setSubCategoryFilter(e.target.value)}
                        className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
                      >
                        <option value="all">All Appliance Types</option>
                        <option value="refrigerator">Refrigerators</option>
                        <option value="washing_machine">Washing Machines</option>
                        <option value="tv">Smart TVs</option>
                      </select>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <select
                        value={sortBy}
                        onChange={(e) =>
                          setSortBy(e.target.value as 'recommended' | 'price_low' | 'price_high')
                        }
                        className="text-xs bg-transparent border-0 text-slate-800 font-semibold focus:outline-none cursor-pointer"
                      >
                        <option value="recommended">Featured Picks</option>
                        <option value="price_low">Rent: Low to High</option>
                        <option value="price_high">Rent: High to Low</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Product Grid */}
              {sortedProducts.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    No matching rental products found
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try searching with another keyword or reset the filter to explore all available furniture and appliances.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('all');
                      setSubCategoryFilter('all');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={(p) => setSelectedProductForModal(p)}
                      onAddToCart={(p, tenure) => handleAddToCart(p, tenure)}
                    />
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* VIEW 3: HOW IT WORKS */}
        {activeTab === 'how-it-works' && (
          <HowItWorks onStartBrowsing={() => setActiveTab('catalog')} />
        )}

        {/* VIEW 4: MY ACTIVE RENTALS PORTAL */}
        {activeTab === 'my-rentals' && (
          <UserRentalsPortal
            orders={orders}
            tickets={tickets}
            onCreateTicket={handleCreateTicket}
            onExtendTenure={handleExtendTenure}
            onScheduleReturn={handleScheduleReturn}
            onRequestRelocation={handleRequestRelocation}
            onBrowseMore={() => setActiveTab('catalog')}
          />
        )}

        {/* VIEW 5: ADMIN & VENDOR CONSOLE */}
        {activeTab === 'admin' && (
          <AdminConsole
            products={products}
            orders={orders}
            tickets={tickets}
            claims={claims}
            cities={cities}
            onAddProduct={handleAddProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onResolveClaim={handleResolveClaim}
            onToggleCityOperational={handleToggleCityOperational}
          />
        )}
      </main>

      {/* Product Detail Modal (PDP) */}
      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={(p, tenure) => handleAddToCart(p, tenure)}
        onRentNow={(p, tenure) => {
          handleAddToCart(p, tenure);
          setSelectedProductForModal(null);
          setIsCartOpen(true);
        }}
        selectedCity={selectedCity}
      />

      {/* Cart Drawer & Checkout Flow */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onUpdateTenure={handleUpdateCartTenure}
        onPlaceOrder={handlePlaceOrder}
        selectedCity={selectedCity}
        cities={cities}
      />

      {/* Project Requirements & PRD Modal */}
      <PRDDocModal isOpen={isPrdOpen} onClose={() => setIsPrdOpen(false)} />

      {/* Clean Domain Footer */}
      <Footer
        cities={cities}
        onOpenPrd={() => setIsPrdOpen(true)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
