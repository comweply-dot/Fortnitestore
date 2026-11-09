import React, { useState, useEffect } from 'react';
import { Product, AccountListing, CartItem, Order, StoreSettings, CosmeticCategory, CosmeticRarity } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VBucksSection } from './components/VBucksSection';
import { ProductCard } from './components/ProductCard';
import { AccountCard } from './components/AccountCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AccountDetailModal } from './components/AccountDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { PaymentView } from './components/PaymentView';
import { TrackOrderView } from './components/TrackOrderView';
import { SupportView } from './components/SupportView';
import { PoliciesModal } from './components/PoliciesModal';
import { AdminDashboard } from './components/AdminDashboard';
import { GiftsSection } from './components/GiftsSection';
import { ItemShopView } from './components/ItemShopView';
import { Footer } from './components/Footer';
import { 
  ShieldCheck, 
  Search, 
  Coins, 
  Lock, 
  Check, 
  ArrowRight, 
  Filter, 
  HelpCircle, 
  Sparkles,
  Zap,
  Flame,
  Gift,
  X
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<
    'home' | 'item-shop' | 'catalog' | 'vbucks' | 'gifts' | 'accounts' | 'track' | 'support' | 'payment' | 'admin'
  >('home');

  // Products and Accounts state
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [accounts, setAccounts] = useState<AccountListing[]>([]);
  const [settings, setSettings] = useState<StoreSettings | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Catalog Filtering & Search
  const [selectedCategory, setSelectedCategory] = useState<CosmeticCategory | 'all'>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [catalogPage, setCatalogPage] = useState(1);
  const [catalogLimit] = useState(24);

  // Global Search Modal
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Cart State (Persisted in localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vbs_cart_items') || localStorage.getItem('fs_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Detail Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<AccountListing | null>(null);
  const [activePolicy, setActivePolicy] = useState<'refund' | 'terms' | 'privacy' | 'payment-guide' | null>(null);

  // Active Order (for Payment and Tracking)
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | undefined>(undefined);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vbs_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cartItems]);

  // Load initial store data
  useEffect(() => {
    const initStore = async () => {
      try {
        const [prodData, accData, setData] = await Promise.all([
          api.getProducts({ limit: 150 }),
          api.getAccounts(),
          api.getSettings()
        ]);
        setAllProducts(prodData.products);
        setAccounts(accData.accounts);
        setSettings(setData.settings);
      } catch (err) {
        console.error('Error initializing store data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    initStore();
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1, isGift = false, giftRecipientEpicId?: string, giftMessage?: string) => {
    setCartItems(prev => {
      const existing = prev.find(item => !item.isAccount && item.product.id === product.id && item.isGift === isGift);
      if (existing) {
        return prev.map(item =>
          !item.isAccount && item.product.id === product.id && item.isGift === isGift
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, isGift, giftRecipientEpicId, giftMessage, isAccount: false }];
    });
    setIsCartOpen(true);
  };

  const handleAddAccountToCart = (account: AccountListing) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.isAccount && item.account?.id === account.id);
      if (existing) return prev;
      return [
        ...prev,
        {
          product: {
            id: account.id,
            name: account.title,
            category: 'bundles',
            cosmeticType: 'Bundle',
            rarity: 'Legendary',
            price: account.price,
            description: account.description,
            image: account.screenshots[0] || '/src/assets/images/gaming_account_showcase_1793465508903.jpg',
            inStock: true,
            isSampleVerified: true,
            deliveryMethod: 'Full email access transfer'
          },
          quantity: 1,
          isAccount: true,
          account
        }
      ];
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = (product: Product, quantity = 1) => {
    handleAddToCart(product, quantity);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleBuyNowAccount = (account: AccountListing) => {
    handleAddAccountToCart(account);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(item => {
          const id = item.isAccount && item.account ? item.account.id : item.product.id;
          if (id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems(prev =>
      prev.filter(item => {
        const id = item.isAccount && item.account ? item.account.id : item.product.id;
        return id !== productId;
      })
    );
  };

  // Order created callback from checkout
  const handleOrderCreated = (order: Order) => {
    setActiveOrder(order);
    setCartItems([]);
    setCurrentView('payment');
  };

  // V-Bucks packages (exact packages from database)
  const vbucksPackages = allProducts.filter(p => p.category === 'vbucks');
  // Giftable products
  const giftableProducts = allProducts.filter(p => p.isGiftable);
  // Cosmetics excluding V-Bucks
  const cosmeticsList = allProducts.filter(p => p.category !== 'vbucks');

  // Filtered Cosmetics for catalog view
  const filteredCosmetics = cosmeticsList.filter(item => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchRarity = selectedRarity === 'all' || item.rarity === selectedRarity;
    const matchSearch =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.cosmeticType && item.cosmeticType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.subcategory && item.subcategory.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchRarity && matchSearch;
  });

  // Sorting
  const sortedCosmetics = [...filteredCosmetics].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const totalCatalogPages = Math.ceil(sortedCosmetics.length / catalogLimit) || 1;
  const paginatedCosmetics = sortedCosmetics.slice(0, catalogPage * catalogLimit);

  // Cart total count
  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#06080F] text-slate-100 font-body">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        selectedCategory={selectedCategory}
        onNavigate={(view, cat) => {
          setCurrentView(view as any);
          if (cat) {
            setSelectedCategory(cat);
            setCatalogPage(1);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onSearchClick={() => setIsSearchModalOpen(true)}
      />

      {/* Global Quick Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center p-4 pt-20 animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#0C1122] border border-[#212E4A] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-purple-400" />
                <h3 className="font-display font-bold text-lg text-white">
                  Search V BUCK STORE Catalog
                </h3>
              </div>
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to search skins, pickaxes, emotes, gliders, wraps..."
                className="w-full px-4 py-3 pl-11 rounded-xl bg-[#06080F] border border-[#232F4A] text-sm text-white focus:outline-none focus:border-purple-500 font-medium"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            {searchQuery.trim() && (
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
                {allProducts
                  .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()))
                  .slice(0, 8)
                  .map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedProduct(p);
                        setIsSearchModalOpen(false);
                      }}
                      className="p-3 hover:bg-[#12192D] flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover bg-black" />
                        <div>
                          <div className="text-xs font-bold text-white">{p.name}</div>
                          <div className="text-[10px] text-purple-400">{p.rarity} · {p.cosmeticType}</div>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-yellow-400">
                        ${p.price.toFixed(2)} USD
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div className="flex justify-between items-center pt-2 text-xs text-slate-400">
              <span>Press ESC to exit</span>
              <button
                onClick={() => {
                  setIsSearchModalOpen(false);
                  setCurrentView('catalog');
                }}
                className="text-purple-400 hover:underline font-semibold"
              >
                View in Full Catalog →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Router */}
      <main className="flex-1">
        {/* VIEW 1: HOMEPAGE */}
        {currentView === 'home' && (
          <div>
            {/* Hero Banner */}
            <Hero
              onShopNow={() => {
                const el = document.getElementById('vbucks-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onBrowseProducts={() => {
                setCurrentView('catalog');
                setSelectedCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewGifts={() => {
                setCurrentView('gifts');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Featured V-Bucks Packages Section */}
            <VBucksSection
              packages={vbucksPackages}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />

            {/* Daily Item Shop Teaser */}
            <section className="py-16 bg-[#080B14] border-y border-[#172033]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#1A2234]">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Live Daily Rotation</span>
                    </div>
                    <h2 className="font-display text-3xl font-extrabold text-white">
                      Today's Featured Drops
                    </h2>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentView('item-shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <span>Open Full Daily Item Shop</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {cosmeticsList
                    .filter(c => c.featured || c.isDaily)
                    .slice(0, 4)
                    .map((item) => (
                      <ProductCard
                        key={item.id}
                        product={item}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                        onSelect={(p) => setSelectedProduct(p)}
                      />
                    ))}
                </div>
              </div>
            </section>

            {/* Curated Gifts Section Showcase */}
            <section className="py-16 bg-[#06080F]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#1A2234]">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pink-400 mb-1">
                      <Gift className="w-3.5 h-3.5" />
                      <span>Dedicated Gifting System</span>
                    </div>
                    <h2 className="font-display text-3xl font-extrabold text-white">
                      Send Gifts to Friends & Squad Mates
                    </h2>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentView('gifts');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 text-sm font-bold text-pink-400 hover:text-pink-300 transition-colors"
                  >
                    <span>Browse All Gift Options</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {giftableProducts.slice(0, 3).map((item) => (
                    <ProductCard
                      key={item.id}
                      product={item}
                      onAddToCart={handleAddToCart}
                      onBuyNow={handleBuyNow}
                      onSelect={(p) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Verified Gaming Accounts Showcase */}
            <section className="py-16 bg-[#080B14] border-t border-[#172033]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#1A2234]">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
                      Full Ownership Handover
                    </div>
                    <h2 className="font-display text-3xl font-extrabold text-white">
                      Verified Gaming Accounts
                    </h2>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentView('accounts');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>View All Accounts</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {accounts.slice(0, 3).map((acc) => (
                    <AccountCard
                      key={acc.id}
                      account={acc}
                      onSelect={(a) => setSelectedAccount(a)}
                      onBuyNow={handleBuyNowAccount}
                    />
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: DAILY ITEM SHOP */}
        {currentView === 'item-shop' && (
          <ItemShopView
            products={allProducts}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {/* VIEW 3: DEDICATED GIFTS SECTION */}
        {currentView === 'gifts' && (
          <GiftsSection
            giftableProducts={giftableProducts}
            onSelectGift={(prod, recipientEpicId, msg) => {
              handleAddToCart(prod, 1, true, recipientEpicId, msg);
            }}
            onOpenProductModal={(p) => setSelectedProduct(p)}
          />
        )}

        {/* VIEW 4: V-BUCKS STORE */}
        {currentView === 'vbucks' && (
          <div className="py-6">
            <VBucksSection
              packages={vbucksPackages}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />
          </div>
        )}

        {/* VIEW 5: COSMETICS CATALOG (100+ Items across all categories) */}
        {currentView === 'catalog' && (
          <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
            {/* Catalog Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1A2234]">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">
                  100+ Verified Gaming Assets
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                  Cosmetics & Skins Catalog
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Character outfits, pickaxes, gliders, emotes, back blings, wraps, and bundles.
                </p>
              </div>

              <div className="text-xs text-slate-400">
                Showing <strong className="text-white">{sortedCosmetics.length}</strong> items
              </div>
            </div>

            {/* Filter and Search Controls */}
            <div className="space-y-4 bg-[#0D1222] p-5 rounded-2xl border border-[#1E2940]">
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="relative w-full sm:w-96">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search skins, pickaxes, emotes by name..."
                    className="w-full px-4 py-2.5 pl-10 rounded-xl bg-[#070A12] border border-[#232F4A] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <span className="text-xs text-slate-400 whitespace-nowrap">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-[#070A12] border border-[#232F4A] text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Alphabetical (A-Z)</option>
                    <option value="newest">New Arrivals</option>
                  </select>
                </div>
              </div>

              {/* Category Segmented Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400 mr-2 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Category:</span>
                </span>
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'skins', label: 'Skins & Outfits' },
                  { id: 'pickaxes', label: 'Pickaxes' },
                  { id: 'gliders', label: 'Gliders' },
                  { id: 'emotes', label: 'Emotes & Dances' },
                  { id: 'backblings', label: 'Back Blings' },
                  { id: 'wraps', label: 'Wraps & Accessories' },
                  { id: 'bundles', label: 'Bundles & Packs' },
                  { id: 'gifts', label: 'Gifts' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSelectedCategory(tab.id as any);
                      setCatalogPage(1);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                      selectedCategory === tab.id
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-[#141B2D] text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Rarity Filter */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs text-slate-400 mr-2">Rarity:</span>
                {['all', 'Mythic', 'Legendary', 'Epic', 'Rare', 'Uncommon', 'Icon', 'Marvel', 'DC', 'Gaming Legends', 'Anime', 'Star Wars'].map(rar => (
                  <button
                    key={rar}
                    onClick={() => {
                      setSelectedRarity(rar);
                      setCatalogPage(1);
                    }}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                      selectedRarity === rar
                        ? 'bg-slate-700 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {rar === 'all' ? 'All Rarities' : rar}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Grid */}
            {paginatedCosmetics.length === 0 ? (
              <div className="py-20 text-center space-y-3 bg-[#0D1222] rounded-2xl border border-[#1E2940]">
                <h3 className="font-display font-bold text-lg text-white">No cosmetics found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try clearing your search query or switching categories.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedRarity('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-purple-600 text-xs font-bold text-white rounded-lg"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {paginatedCosmetics.map(item => (
                  <ProductCard
                    key={item.id}
                    product={item}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    onSelect={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            )}

            {/* Load More Pagination */}
            {catalogPage < totalCatalogPages && (
              <div className="text-center pt-8">
                <button
                  onClick={() => setCatalogPage(prev => prev + 1)}
                  className="px-8 py-3.5 bg-[#141B2D] hover:bg-[#1E2943] text-white font-bold text-xs rounded-xl border border-[#273556] transition-all hover:scale-105 shadow-md"
                >
                  Load More Cosmetics ({sortedCosmetics.length - paginatedCosmetics.length} remaining)
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 6: GAMING ACCOUNTS */}
        {currentView === 'accounts' && (
          <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1A2234]">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
                  Full Email Access & Verified Stats
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                  Gaming Account Listings
                </h1>
                <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                  Each account includes genuine screenshot verification, permanent email ownership transfer, and verified platform compatibility.
                </p>
              </div>
              <div className="text-xs text-slate-400">
                Active Listings: <strong className="text-cyan-400">{accounts.length}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map(acc => (
                <AccountCard
                  key={acc.id}
                  account={acc}
                  onSelect={(a) => setSelectedAccount(a)}
                  onBuyNow={handleBuyNowAccount}
                />
              ))}
            </div>
          </div>
        )}

        {/* VIEW 7: ORDER TRACKING */}
        {currentView === 'track' && (
          <TrackOrderView
            initialOrderId={trackingOrderId}
            onGoToPayment={(order) => {
              setActiveOrder(order);
              setCurrentView('payment');
            }}
            onContactSupport={(orderId) => {
              setTrackingOrderId(orderId);
              setCurrentView('support');
            }}
          />
        )}

        {/* VIEW 8: SUPPORT & FAQ */}
        {currentView === 'support' && (
          <SupportView
            initialOrderId={trackingOrderId}
            settings={settings}
            onOpenPolicy={(policy) => setActivePolicy(policy)}
          />
        )}

        {/* VIEW 9: USDT PAYMENT VIEW */}
        {currentView === 'payment' && activeOrder && (
          <PaymentView
            order={activeOrder}
            onOrderUpdated={(updated) => setActiveOrder(updated)}
            onNavigateHome={() => setCurrentView('home')}
            onTrackOrder={(orderId) => {
              setTrackingOrderId(orderId);
              setCurrentView('track');
            }}
          />
        )}

        {/* VIEW 10: ADMIN DASHBOARD */}
        {currentView === 'admin' && (
          <AdminDashboard
            onExit={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onStartShopping={() => setCurrentView('catalog')}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderCreated={handleOrderCreated}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onSelectRelated={(p) => setSelectedProduct(p)}
        relatedProducts={cosmeticsList
          .filter(c => selectedProduct && c.id !== selectedProduct.id && c.category === selectedProduct.category)
          .slice(0, 4)}
      />

      {/* Account Detail Modal */}
      <AccountDetailModal
        account={selectedAccount}
        onClose={() => setSelectedAccount(null)}
        onBuyNow={handleBuyNowAccount}
      />

      {/* Policies Modal */}
      <PoliciesModal
        policyType={activePolicy}
        onClose={() => setActivePolicy(null)}
      />

      {/* Global Footer */}
      <Footer
        onNavigate={(view) => {
          setCurrentView(view as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPolicy={(policy) => setActivePolicy(policy)}
        settings={settings}
      />
    </div>
  );
}
