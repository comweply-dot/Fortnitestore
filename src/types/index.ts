export type CosmeticCategory = 
  | 'vbucks'
  | 'skins'
  | 'pickaxes'
  | 'gliders'
  | 'emotes'
  | 'backblings'
  | 'wraps'
  | 'bundles'
  | 'gifts';

export type CosmeticRarity =
  | 'Common'
  | 'Uncommon'
  | 'Rare'
  | 'Epic'
  | 'Legendary'
  | 'Mythic'
  | 'Icon'
  | 'Marvel'
  | 'DC'
  | 'Gaming Legends'
  | 'Star Wars'
  | 'Anime'
  | 'Dark Series'
  | 'Frozen Series'
  | 'Lava Series'
  | 'Shadow Series';

export type CosmeticType =
  | 'Outfit'
  | 'Pickaxe'
  | 'Glider'
  | 'Emote'
  | 'Back Bling'
  | 'Wrap'
  | 'Contrail'
  | 'Music Pack'
  | 'Loading Screen'
  | 'Bundle'
  | 'V-Bucks Pack';

export interface Product {
  id: string;
  name: string;
  category: CosmeticCategory;
  subcategory?: string;
  cosmeticType: CosmeticType;
  rarity: CosmeticRarity;
  price: number;
  originalPrice?: number;
  vbucksEquivalent?: number;
  description: string;
  image: string;
  inStock: boolean;
  featured?: boolean;
  isDaily?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isGiftable?: boolean;
  releaseChapter?: string;
  gender?: 'Female' | 'Male' | 'Mecha' | 'Unspecified';
  deliveryMethod: string;
  isSampleVerified: boolean;
  tags?: string[];
}

export interface AccountListing {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  accountLevel: number;
  totalOutfits: number;
  totalPickaxes: number;
  totalGliders: number;
  totalEmotes: number;
  totalVBucksBalance: number;
  featuredCosmetics: string[];
  platformLinkable: {
    pc: boolean;
    psn: boolean;
    xbox: boolean;
    switch: boolean;
  };
  hasSaveTheWorld: boolean;
  hasFullEmailAccess: boolean;
  status: 'Available' | 'Reserved' | 'Sold' | 'Awaiting Images';
  hasVerifiedLockerImages?: boolean;
  skinsOwned?: string[];
  pickaxesOwned?: string[];
  glidersOwned?: string[];
  emotesOwned?: string[];
  description: string;
  screenshots: string[];
  deliveryTerms: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  isGift?: boolean;
  giftRecipientEpicId?: string;
  giftMessage?: string;
  isAccount?: boolean;
  account?: AccountListing;
}

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
  customerEmailMasked?: string;
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
