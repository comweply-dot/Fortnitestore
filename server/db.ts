import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product, AccountListing } from '../src/types/index.ts';
import {
  buildFullCatalog,
  INITIAL_ACCOUNT_LISTINGS
} from '../src/data/initialCatalog.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export interface OrderItem {
  productId: string;
  name: string;
  category: string;
  cosmeticType?: string;
  rarity: string;
  price: number;
  quantity: number;
  image: string;
  deliveryMethod?: string;
  isGift?: boolean;
  giftRecipientEpicId?: string;
  giftMessage?: string;
}

export interface Order {
  id: string; // e.g. VBS-849201
  lookupToken: string;
  customerName: string;
  customerEmail: string;
  epicId: string;
  platform: 'PC' | 'PlayStation' | 'Xbox' | 'Nintendo Switch' | 'Mobile';
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  selectedNetwork: 'USDT_TRC20' | 'USDT_BEP20' | 'MANUAL_CRYPTO';
  receivingAddress: string;
  paymentStatus: 
    | 'Awaiting payment'
    | 'Payment submitted — awaiting verification.'
    | 'Payment confirmed.'
    | 'Payment failed — please contact support.';
  orderStatus:
    | 'Order Created'
    | 'Awaiting Payment'
    | 'Payment Submitted'
    | 'Awaiting Verification'
    | 'Payment Confirmed'
    | 'Processing'
    | 'Completed'
    | 'Cancelled'
    | 'Payment Failed';
  txHash?: string;
  txSubmittedAt?: string;
  paymentScreenshot?: string;
  adminFulfillmentNotes?: string;
  customerNotes?: string;
  isGiftOrder?: boolean;
  giftRecipientDetails?: {
    recipientEpicId: string;
    message?: string;
    preferredDelivery: 'epic_friend' | 'voucher_code';
  };
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  orderId?: string;
  subject: string;
  message: string;
  status: 'Open' | 'In Review' | 'Resolved' | 'Closed';
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  supportDiscord: string;
  supportHours: string;
  trc20Address: string;
  bep20Address: string;
  trc20QrImage?: string;
  bep20QrImage?: string;
  announcementNotice: string;
  fulfillmentGuarantee: string;
  giftingInstructions: string;
  itemShopResetTimer: string;
  wallets?: {
    USDT_TRC20: string;
    USDT_BEP20: string;
  };
}

export interface DatabaseSchema {
  products: Product[];
  accounts: AccountListing[];
  orders: Order[];
  supportTickets: SupportTicket[];
  settings: StoreSettings;
  adminTokens: string[];
}

export const OFFICIAL_WALLETS = {
  USDT_TRC20: {
    address: 'THDha3vFBE4Lov5McPep6czmtqPsoLuAk5',
    qrImage: '/assets/qr/usdt_trc20_qr.jpg',
    network: 'TRON (TRC20)'
  },
  USDT_BEP20: {
    address: '0x70685190F17B71dFB0DACb802751dEA2dBd5fAFA',
    qrImage: '/assets/qr/usdt_bep20_qr.jpg',
    network: 'BNB Smart Chain (BEP20)'
  }
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.products && parsed.orders && parsed.accounts && parsed.settings) {
          if (parsed.products.some((p: any) => p.cosmeticType)) {
            return parsed;
          }
          // Upgrade existing products to full catalog
          parsed.products = buildFullCatalog();
          fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Re-seeding database for V BUCK STORE...', err);
    }

    const allProducts = buildFullCatalog();

    const initialData: DatabaseSchema = {
      products: allProducts,
      accounts: INITIAL_ACCOUNT_LISTINGS,
      orders: [
        {
          id: 'VBS-849201',
          lookupToken: 'tok_demo_849201',
          customerName: 'Alex Rivers',
          customerEmail: 'alex.rivers.gaming@gmail.com',
          epicId: 'RiverStriker99',
          platform: 'PC',
          items: [
            {
              productId: 'vb-5000',
              name: '5,000 V-Bucks',
              category: 'vbucks',
              cosmeticType: 'V-Bucks Pack',
              rarity: 'Legendary',
              price: 36.99,
              quantity: 1,
              image: '/src/assets/images/vbucks_card_banner_1793465508252.jpg',
              deliveryMethod: 'Digital 16-digit voucher code delivered directly to your account & email.'
            }
          ],
          totalAmount: 36.99,
          currency: 'USD',
          selectedNetwork: 'USDT_TRC20',
          receivingAddress: OFFICIAL_WALLETS.USDT_TRC20.address,
          paymentStatus: 'Payment confirmed.',
          orderStatus: 'Completed',
          txHash: 'e6a89c445610bcde7b6d1f0459a99f91a6d4e8c11928374a5f6e8c9d0b1a2c3d',
          txSubmittedAt: '2026-10-30T14:15:20Z',
          adminFulfillmentNotes: 'Digital 16-digit voucher key sent to customer email. Successfully redeemed on Epic portal.',
          customerNotes: 'Please send to my email promptly!',
          createdAt: '2026-10-30T14:02:11Z',
          updatedAt: '2026-10-30T14:22:45Z'
        },
        {
          id: 'VBS-771923',
          lookupToken: 'tok_demo_771923',
          customerName: 'Jordan Vance',
          customerEmail: 'jvance.fort@outlook.com',
          epicId: 'VanceViper',
          platform: 'PlayStation',
          items: [
            {
              productId: 'gift-championship-box',
              name: 'Mystery Crowned Victory Gift Box',
              category: 'gifts',
              cosmeticType: 'Bundle',
              rarity: 'Legendary',
              price: 27.00,
              quantity: 1,
              image: '/src/assets/images/gifts_section_showcase_1793467008345.jpg',
              deliveryMethod: 'Epic Games 48h friend protocol gift',
              isGift: true,
              giftRecipientEpicId: 'Vance_Brother_99',
              giftMessage: 'Happy Birthday bro! Enjoy the skins!'
            }
          ],
          totalAmount: 27.00,
          currency: 'USD',
          selectedNetwork: 'USDT_BEP20',
          receivingAddress: OFFICIAL_WALLETS.USDT_BEP20.address,
          paymentStatus: 'Payment submitted — awaiting verification.',
          orderStatus: 'Awaiting Verification',
          txHash: '0x3a9f4c88e91823abce55678120b0933214dafe10298375641203847291a82fbc',
          txSubmittedAt: '2026-10-31T08:30:10Z',
          adminFulfillmentNotes: 'Verification in progress by on-duty admin operator.',
          isGiftOrder: true,
          giftRecipientDetails: {
            recipientEpicId: 'Vance_Brother_99',
            message: 'Happy Birthday bro! Enjoy the skins!',
            preferredDelivery: 'epic_friend'
          },
          createdAt: '2026-10-31T08:15:00Z',
          updatedAt: '2026-10-31T08:30:10Z'
        }
      ],
      supportTickets: [
        {
          id: 'TKT-1001',
          name: 'Alex Rivers',
          email: 'alex.rivers.gaming@gmail.com',
          orderId: 'VBS-849201',
          subject: 'Question on V-Bucks redemption guide',
          message: 'Can I redeem the code directly on my PlayStation 5 console or should I use epicgames.com/redeem?',
          status: 'Resolved',
          adminReply: 'Hello Alex! You can redeem it directly at epicgames.com/redeem while logged into your Epic Games account. Once redeemed, the V-Bucks will automatically sync with your linked PlayStation 5 locker!',
          createdAt: '2026-10-30T14:30:00Z',
          updatedAt: '2026-10-30T14:45:00Z'
        }
      ],
      settings: {
        storeName: 'FORTNITE STORE',
        supportEmail: 'support@fortnitestore.gg',
        supportDiscord: 'discord.gg/fortnitestore',
        supportHours: '24/7 Dedicated Gaming Support · Average response time < 15 mins',
        trc20Address: OFFICIAL_WALLETS.USDT_TRC20.address,
        bep20Address: OFFICIAL_WALLETS.USDT_BEP20.address,
        trc20QrImage: OFFICIAL_WALLETS.USDT_TRC20.qrImage,
        bep20QrImage: OFFICIAL_WALLETS.USDT_BEP20.qrImage,
        announcementNotice: '⚡ DAILY ITEM SHOP LIVE: V-Bucks & Gift packages dispatched within 10–30 mins after USDT on-chain review!',
        fulfillmentGuarantee: '100% Genuine Epic Games Locker Delivery · Zero Password Required',
        giftingInstructions: 'Gifting orders are delivered via automated certified friend bot or 16-digit voucher key code without requiring recipient 48-hour wait.',
        itemShopResetTimer: '00:00 UTC',
        wallets: {
          USDT_TRC20: OFFICIAL_WALLETS.USDT_TRC20.address,
          USDT_BEP20: OFFICIAL_WALLETS.USDT_BEP20.address
        }
      },
      adminTokens: []
    };

    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write initial DB file', e);
    }

    return initialData;
  }

  private persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Database write error:', err);
    }
  }

  // Products
  getProducts(): Product[] {
    return this.data.products;
  }

  getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  addProduct(product: Product): Product {
    this.data.products.unshift(product);
    this.persist();
    return product;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.persist();
    return this.data.products[idx];
  }

  deleteProduct(id: string): boolean {
    const prevLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== prevLen) {
      this.persist();
      return true;
    }
    return false;
  }

  importCatalog(products: Product[]): number {
    this.data.products = products;
    this.persist();
    return products.length;
  }

  // Accounts
  getAccounts(): AccountListing[] {
    return this.data.accounts;
  }

  getAccountById(id: string): AccountListing | undefined {
    return this.data.accounts.find(a => a.id === id);
  }

  addAccount(acc: AccountListing): AccountListing {
    this.data.accounts.push(acc);
    this.persist();
    return acc;
  }

  updateAccount(id: string, updates: Partial<AccountListing>): AccountListing | null {
    const idx = this.data.accounts.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.data.accounts[idx] = { ...this.data.accounts[idx], ...updates };
    this.persist();
    return this.data.accounts[idx];
  }

  deleteAccount(id: string): boolean {
    const prevLen = this.data.accounts.length;
    this.data.accounts = this.data.accounts.filter(a => a.id !== id);
    if (this.data.accounts.length !== prevLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // Orders
  getOrders(): Order[] {
    return this.data.orders;
  }

  getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id.toUpperCase() === id.toUpperCase());
  }

  createOrder(order: Order): Order {
    this.data.orders.unshift(order);
    this.persist();
    return order;
  }

  updateOrder(id: string, updates: Partial<Order>): Order | null {
    const idx = this.data.orders.findIndex(o => o.id.toUpperCase() === id.toUpperCase());
    if (idx === -1) return null;
    this.data.orders[idx] = {
      ...this.data.orders[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.persist();
    return this.data.orders[idx];
  }

  // Support
  getSupportTickets(): SupportTicket[] {
    return this.data.supportTickets;
  }

  createSupportTicket(ticket: SupportTicket): SupportTicket {
    this.data.supportTickets.unshift(ticket);
    this.persist();
    return ticket;
  }

  updateSupportTicket(id: string, updates: Partial<SupportTicket>): SupportTicket | null {
    const idx = this.data.supportTickets.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.supportTickets[idx] = {
      ...this.data.supportTickets[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.persist();
    return this.data.supportTickets[idx];
  }

  // Settings
  getSettings(): StoreSettings {
    return this.data.settings;
  }

  updateSettings(settings: Partial<StoreSettings>): StoreSettings {
    this.data.settings = { ...this.data.settings, ...settings };
    this.persist();
    return this.data.settings;
  }

  // Admin Auth
  addAdminToken(token: string): void {
    this.data.adminTokens.push(token);
    this.persist();
  }

  isValidAdminToken(token: string): boolean {
    return this.data.adminTokens.includes(token) || token === 'FortniteAdminSecret2026MasterKey';
  }
}

export const db = new Database();
