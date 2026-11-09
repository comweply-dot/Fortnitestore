import { Product, AccountListing, Order, SupportTicket, StoreSettings } from '../types';
import { buildFullCatalog, INITIAL_ACCOUNT_LISTINGS } from '../data/initialCatalog';

export const API_BASE = '/api';

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'FORTNITE STORE',
  supportEmail: 'support@fortnitestore.gg',
  supportDiscord: 'discord.gg/fortnitestore',
  supportHours: '24/7 Dedicated Gaming Support · Average response time < 15 mins',
  trc20Address: 'THDha3vFBE4Lov5McPep6czmtqPsoLuAk5',
  bep20Address: '0x70685190F17B71dFB0DACb802751dEA2dBd5fAFA',
  announcementNotice: '⚡ FAST USDT DISPATCH: All V-Bucks packages & skins dispatched within 10–30 mins after USDT on-chain review!',
  fulfillmentGuarantee: '100% Genuine Epic Games Locker Delivery · Zero Password Required',
  giftingInstructions: 'Gift delivery requires adding the store fulfillment bot on Epic Games and waiting 48 hours per Epic Games gifting policy, or instant delivery via 16-digit voucher key code.',
  itemShopResetTimer: '00:00:00 UTC',
  wallets: {
    USDT_TRC20: 'THDha3vFBE4Lov5McPep6czmtqPsoLuAk5',
    USDT_BEP20: '0x70685190F17B71dFB0DACb802751dEA2dBd5fAFA'
  }
};

export const api = {
  // Products
  async getProducts(params?: {
    category?: string;
    subcategory?: string;
    rarity?: string;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.set('category', params.category);
      if (params?.subcategory) searchParams.set('subcategory', params.subcategory);
      if (params?.rarity) searchParams.set('rarity', params.rarity);
      if (params?.search) searchParams.set('search', params.search);
      if (params?.sort) searchParams.set('sort', params.sort);
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));

      const res = await fetch(`${API_BASE}/products?${searchParams.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback to embedded catalog for static hosting (e.g. Vercel static or GoDaddy public_html)
    }

    let items = buildFullCatalog();
    if (params?.category && params.category !== 'all') {
      items = items.filter(p => p.category.toLowerCase() === params.category!.toLowerCase());
    }
    if (params?.subcategory && params.subcategory !== 'all') {
      items = items.filter(p => p.subcategory?.toLowerCase() === params.subcategory!.toLowerCase());
    }
    if (params?.rarity && params.rarity !== 'all') {
      items = items.filter(p => p.rarity.toLowerCase() === params.rarity!.toLowerCase());
    }
    if (params?.search) {
      const term = params.search.toLowerCase();
      items = items.filter(p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
    }
    const limit = params?.limit || 24;
    const page = params?.page || 1;
    const start = (page - 1) * limit;
    const paginated = items.slice(start, start + limit);
    return {
      products: paginated,
      total: items.length,
      page,
      totalPages: Math.ceil(items.length / limit)
    };
  },

  async getProduct(id: string): Promise<{ product: Product; related: Product[] }> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const all = buildFullCatalog();
    const product = all.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    const related = all.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    return { product, related };
  },

  // Accounts
  async getAccounts(): Promise<{ accounts: AccountListing[] }> {
    try {
      const res = await fetch(`${API_BASE}/accounts`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return { accounts: INITIAL_ACCOUNT_LISTINGS };
  },

  async getAccount(id: string): Promise<{ account: AccountListing }> {
    try {
      const res = await fetch(`${API_BASE}/accounts/${id}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const account = INITIAL_ACCOUNT_LISTINGS.find(a => a.id === id);
    if (!account) throw new Error('Account listing not found');
    return { account };
  },

  // Orders
  async createOrder(orderData: {
    customerName: string;
    customerEmail: string;
    epicId: string;
    platform: string;
    items: Array<{ productId: string; quantity: number }>;
    selectedNetwork: 'USDT_TRC20' | 'USDT_BEP20';
    customerNotes?: string;
  }): Promise<{ order: Order; duplicatePrevented?: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to place order');
    return data;
  },

  async getOrder(id: string): Promise<{ order: Order }> {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(id)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Order lookup failed');
    return data;
  },

  async submitPayment(orderId: string, txHash: string, network?: string, paymentScreenshot?: string): Promise<{ order: Order; message: string }> {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ txHash, network, paymentScreenshot })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit payment hash');
    return data;
  },

  // Support
  async submitSupportTicket(ticket: {
    name: string;
    email: string;
    orderId?: string;
    subject: string;
    message: string;
  }): Promise<{ ticket: SupportTicket; message: string }> {
    const res = await fetch(`${API_BASE}/support`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit ticket');
    return data;
  },

  // Settings
  async getSettings(): Promise<{ settings: StoreSettings }> {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback for static builds
    }
    return { settings: DEFAULT_SETTINGS };
  },

  // Admin API
  async adminLogin(password: string): Promise<{ success: boolean; token: string }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Admin login failed');
    return data;
  },

  async getAdminOrders(token: string): Promise<{ orders: Order[] }> {
    const res = await fetch(`${API_BASE}/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async updateAdminOrder(
    token: string,
    orderId: string,
    updates: { paymentStatus?: string; orderStatus?: string; adminFulfillmentNotes?: string }
  ): Promise<{ order: Order }> {
    const res = await fetch(`${API_BASE}/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update order');
    return res.json();
  },

  async getAdminStats(token: string): Promise<{
    totalRevenue: number;
    totalOrders: number;
    pendingVerification: number;
    openTickets: number;
    totalProducts: number;
    totalAccounts: number;
  }> {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to load admin stats');
    return res.json();
  },

  async getAdminTickets(token: string): Promise<{ tickets: SupportTicket[] }> {
    const res = await fetch(`${API_BASE}/admin/support`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to load tickets');
    return res.json();
  },

  async updateAdminTicket(
    token: string,
    ticketId: string,
    updates: { status?: string; adminReply?: string }
  ): Promise<{ ticket: SupportTicket }> {
    const res = await fetch(`${API_BASE}/admin/support/${ticketId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update ticket');
    return res.json();
  },

  async addAdminProduct(token: string, product: Partial<Product>): Promise<{ product: Product }> {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to add product');
    return res.json();
  },

  async updateAdminProduct(token: string, id: string, product: Partial<Product>): Promise<{ product: Product }> {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },

  async deleteAdminProduct(token: string, id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
  },

  async exportCatalog(token: string): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/admin/catalog/export`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to export catalog');
    return res.json();
  },

  async importCatalog(token: string, products: Product[]): Promise<{ count: number; message: string }> {
    const res = await fetch(`${API_BASE}/admin/catalog/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ products })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to import catalog');
    return data;
  },

  // Admin Accounts API
  async addAdminAccount(token: string, accountData: Partial<AccountListing>): Promise<{ account: AccountListing }> {
    const res = await fetch(`${API_BASE}/admin/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(accountData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create account listing');
    return data;
  },

  async updateAdminAccount(token: string, id: string, accountData: Partial<AccountListing>): Promise<{ account: AccountListing }> {
    const res = await fetch(`${API_BASE}/admin/accounts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(accountData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update account listing');
    return data;
  },

  async deleteAdminAccount(token: string, id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/admin/accounts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete account listing');
    return data;
  },

  // Admin Settings & QR API
  async updateAdminSettings(token: string, settings: Partial<StoreSettings>): Promise<{ settings: StoreSettings }> {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(settings)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update store settings');
    return data;
  }
};
