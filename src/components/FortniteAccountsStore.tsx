import React, { useState, useMemo } from 'react';
import {
  Search,
  ShieldCheck,
  Eye,
  X,
  Check,
  ShoppingCart,
  Filter,
  Coins,
  Sparkles,
  Hammer,
  Zap
} from 'lucide-react';
import { AccountListing, Product } from '../types';
import cosmeticsRaw from '../data/fortniteCosmetics.json';
import { FortniteCosmeticsCatalog } from './FortniteCosmeticsCatalog';

interface CompactCosmetic {
  id: string;
  name: string;
  type: string;
  rarity: string;
  icon: string;
}

const COSMETICS_POOL = cosmeticsRaw as CompactCosmetic[];

const RARITY_STYLES: Record<string, string> = {
  legendary: 'from-amber-500 to-orange-700 border-amber-400',
  epic: 'from-purple-500 to-indigo-800 border-purple-400',
  rare: 'from-sky-400 to-blue-700 border-sky-300',
  uncommon: 'from-emerald-400 to-green-700 border-emerald-300',
  common: 'from-slate-500 to-slate-700 border-slate-400',
  marvel: 'from-red-600 to-red-900 border-red-400',
  icon: 'from-cyan-400 to-teal-700 border-cyan-300',
  dc: 'from-blue-600 to-slate-900 border-blue-400',
  gaminglegends: 'from-indigo-500 to-violet-900 border-indigo-300',
  starwars: 'from-slate-700 to-black border-amber-300',
  dark: 'from-fuchsia-600 to-purple-950 border-fuchsia-400',
  frozen: 'from-cyan-300 to-blue-800 border-cyan-200',
  lava: 'from-orange-500 to-red-900 border-orange-400',
  default: 'from-slate-600 to-slate-800 border-slate-400'
};

type LockerCategory = 'outfit' | 'backpack' | 'pickaxe' | 'glider' | 'emote';

interface GeneratedAccount {
  id: string;
  title: string;
  tier: 'BUDGET' | 'MEDIUM' | 'HIGH';
  rarity: string;
  category: LockerCategory;
  price: number;
  vbucks: number;
  totalSkins: number;
  totalPickaxes: number;
  totalGliders: number;
  totalEmotes: number;
  platform: string;
  featuredOutfit: CompactCosmetic;
  previewOutfits: CompactCosmetic[];
  locker: Record<LockerCategory, CompactCosmetic[]>;
}

interface FortniteAccountsStoreProps {
  onBuyAccount: (account: AccountListing) => void;
  backendAccounts?: AccountListing[];
  onSelectBackendAccount?: (account: AccountListing) => void;
  onAddProductToCart?: (product: Product, quantity?: number, isGift?: boolean) => void;
  onBuyProductNow?: (product: Product, quantity?: number) => void;
}

export const FortniteAccountsStore: React.FC<FortniteAccountsStoreProps> = ({
  onBuyAccount,
  backendAccounts = [],
  onSelectBackendAccount,
  onAddProductToCart,
  onBuyProductNow
}) => {
  const [storeMode, setStoreMode] = useState<'accounts' | 'cosmetics'>('accounts');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | LockerCategory>('ALL');
  const [selectedRarity, setSelectedRarity] = useState<string>('ALL');
  const [selectedTier, setSelectedTier] = useState<'ALL' | 'BUDGET' | 'MEDIUM' | 'HIGH'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAccount, setActiveAccount] = useState<GeneratedAccount | null>(null);
  const [lockerTab, setLockerTab] = useState<LockerCategory>('outfit');

  // Generate 108 Realistic Accounts with Category/Rarity integration (Instant Load)
  const accounts = useMemo<GeneratedAccount[]>(() => {
    const outfits = COSMETICS_POOL.filter((i) => i.type === 'outfit');
    const backpacks = COSMETICS_POOL.filter((i) => i.type === 'backpack');
    const pickaxes = COSMETICS_POOL.filter((i) => i.type === 'pickaxe');
    const gliders = COSMETICS_POOL.filter((i) => i.type === 'glider');
    const emotes = COSMETICS_POOL.filter((i) => i.type === 'emote');

    const generated: GeneratedAccount[] = [];

    for (let i = 1; i <= 108; i++) {
      let tier: 'BUDGET' | 'MEDIUM' | 'HIGH' = 'BUDGET';
      let price = 10 + (i % 15);
      let count = 15 + (i % 15);

      if (i % 3 === 2) {
        tier = 'MEDIUM';
        price = 35 + (i % 40);
        count = 40 + (i % 30);
      } else if (i % 3 === 0) {
        tier = 'HIGH';
        price = 85 + (i % 150);
        count = 85 + (i % 60);
      }

      const getSlice = (arr: CompactCosmetic[], size: number) => {
        if (!arr.length) return [];
        const safeSize = Math.min(size, arr.length);
        const maxStart = Math.max(1, arr.length - safeSize);
        const start = (i * 17) % maxStart;
        return arr.slice(start, start + safeSize);
      };

      const accOutfits = getSlice(outfits, count);
      const accBackpacks = getSlice(backpacks, Math.floor(count * 0.8));
      const accPickaxes = getSlice(pickaxes, Math.floor(count * 0.7));
      const accGliders = getSlice(gliders, Math.floor(count * 0.6));
      const accEmotes = getSlice(emotes, Math.floor(count * 0.9));

      const mainOutfit = accOutfits[0] || outfits[0];

      generated.push({
        id: `ACC-${6000 + i}`,
        title:
          tier === 'HIGH'
            ? `OG Stacked Locker #${i}`
            : tier === 'MEDIUM'
            ? `Mid-Tier Rare Account #${i}`
            : `Starter Budget Acc #${i}`,
        tier,
        rarity: mainOutfit?.rarity || 'rare',
        category: 'outfit',
        price,
        vbucks: tier === 'HIGH' ? 1800 + ((i * 50) % 2000) : 300 + ((i * 30) % 800),
        totalSkins: accOutfits.length,
        totalPickaxes: accPickaxes.length,
        totalGliders: accGliders.length,
        totalEmotes: accEmotes.length,
        platform: ['PC / PSN / Xbox', 'Full Access Linkable', 'PSN + PC Ready'][i % 3],
        featuredOutfit: mainOutfit,
        previewOutfits: accOutfits.slice(1, 5),
        locker: {
          outfit: accOutfits,
          backpack: accBackpacks,
          pickaxe: accPickaxes,
          glider: accGliders,
          emote: accEmotes
        }
      });
    }
    return generated;
  }, []);

  const filteredAccounts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const targetCat: LockerCategory = selectedCategory === 'ALL' ? 'outfit' : selectedCategory;

    return accounts.filter((acc) => {
      const catItems = acc.locker[targetCat] || [];
      const matchesCategory = catItems.length > 0;
      const matchesTier = selectedTier === 'ALL' || acc.tier === selectedTier;
      const matchesRarity =
        selectedRarity === 'ALL' ||
        catItems.some((item) => item.rarity.toLowerCase() === selectedRarity.toLowerCase());
      const matchesSearch =
        !q ||
        acc.title.toLowerCase().includes(q) ||
        acc.id.toLowerCase().includes(q) ||
        catItems.some((item) => item.name.toLowerCase().includes(q));

      return matchesCategory && matchesTier && matchesRarity && matchesSearch;
    });
  }, [accounts, selectedCategory, selectedRarity, selectedTier, searchQuery]);

  const getRarityStyle = (rarity?: string) => {
    const val = rarity?.toLowerCase() || 'default';
    return RARITY_STYLES[val] || RARITY_STYLES.default;
  };

  const getCardDisplayItems = (acc: GeneratedAccount) => {
    const targetCat: LockerCategory = selectedCategory === 'ALL' ? 'outfit' : selectedCategory;
    const pool = acc.locker[targetCat] || acc.locker.outfit;

    if (selectedRarity !== 'ALL') {
      const rarityMatches = pool.filter((i) => i.rarity.toLowerCase() === selectedRarity.toLowerCase());
      if (rarityMatches.length > 0) {
        const rest = pool.filter((i) => i.id !== rarityMatches[0].id);
        return {
          featured: rarityMatches[0],
          previews: [...rarityMatches.slice(1, 5), ...rest].slice(0, 4)
        };
      }
    }

    return {
      featured: pool[0] || acc.featuredOutfit,
      previews: pool.slice(1, 5)
    };
  };

  const convertToAccountListing = (acc: GeneratedAccount): AccountListing => ({
    id: acc.id,
    title: acc.title,
    price: acc.price,
    accountLevel: 400 + acc.totalSkins * 4,
    totalOutfits: acc.totalSkins,
    totalPickaxes: acc.totalPickaxes,
    totalGliders: acc.totalGliders,
    totalEmotes: acc.totalEmotes,
    totalVBucksBalance: acc.vbucks,
    featuredCosmetics: acc.previewOutfits.map((s) => s.name),
    platformLinkable: {
      pc: true,
      psn: acc.platform.includes('PSN') || acc.platform.includes('Full'),
      xbox: acc.platform.includes('Xbox') || acc.platform.includes('Full'),
      switch: acc.platform.includes('Full')
    },
    hasSaveTheWorld: acc.tier === 'HIGH',
    hasFullEmailAccess: true,
    status: 'Available',
    hasVerifiedLockerImages: true,
    skinsOwned: acc.locker.outfit.map((s) => s.name),
    pickaxesOwned: acc.locker.pickaxe.map((s) => s.name),
    glidersOwned: acc.locker.glider.map((s) => s.name),
    emotesOwned: acc.locker.emote.map((s) => s.name),
    description: `Verified ${acc.tier} Fortnite account (${acc.platform}) with ${acc.totalSkins} outfits and ${acc.vbucks} V-Bucks.`,
    screenshots: [acc.featuredOutfit.icon, ...acc.previewOutfits.map((s) => s.icon)],
    deliveryTerms: 'Instant Delivery • Full Email Access • 2FA Ready',
    createdAt: new Date().toISOString()
  });

  if (storeMode === 'cosmetics') {
    return (
      <div className="bg-[#080c14]">
        <div className="bg-[#0b1120] border-b border-slate-800 px-4 py-3">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStoreMode('accounts')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              >
                108 Verified Accounts (ACC-6001–6108)
              </button>
              <button
                onClick={() => setStoreMode('cosmetics')}
                className="px-4 py-2 rounded-xl text-xs font-black bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20 cursor-pointer"
              >
                Cosmetics Catalog (1,420+ Live Items)
              </button>
            </div>
            <span className="text-xs text-slate-400">Browse Individual Skins, Pickaxes, Gliders, Emotes &amp; Back Blings</span>
          </div>
        </div>
        <FortniteCosmeticsCatalog
          initialCategory="outfit"
          onAddToCart={(prod, qty, gift) => onAddProductToCart?.(prod, qty, gift)}
          onBuyNow={(prod, qty) => onBuyProductNow?.(prod, qty)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-white font-body pb-16 animate-fadeIn">
      {/* Mode Switcher Bar */}
      <div className="bg-[#0b1120] border-b border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStoreMode('accounts')}
              className="px-4 py-2 rounded-xl text-xs font-black bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20 cursor-pointer"
            >
              108 Verified Accounts (ACC-6001–6108)
            </button>
            <button
              onClick={() => setStoreMode('cosmetics')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              Cosmetics Catalog (1,420+ Live Items)
            </button>
          </div>
          <span className="text-xs text-slate-400">Full Access Accounts &bull; In-Game Locker Inspector</span>
        </div>
      </div>

      {/* Top Bar */}
      <div className="bg-[#0f172a] border-b border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Full Access &bull; Verified Real Locker Inventory</span>
            </span>
            <h1 className="font-display text-2xl md:text-3xl font-black tracking-tight">
              FORTNITE <span className="text-sky-400">MARKETPLACE</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              {filteredAccounts.length} Live Verified Accounts &bull; Filter by Category, Rarity, Tier, or Skin Name
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search account ID or item name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Live Category Filters */}
        <div className="max-w-7xl mx-auto mt-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2">
            <Filter className="w-3.5 h-3.5 text-sky-400" />
            <span>CATEGORIES:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ALL', label: 'All Items' },
              { id: 'outfit', label: 'Skins & Outfits' },
              { id: 'pickaxe', label: 'Pickaxes' },
              { id: 'glider', label: 'Gliders' },
              { id: 'emote', label: 'Emotes & Dances' },
              { id: 'backpack', label: 'Back Blings' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rarity & Price Tier Filters */}
        <div className="max-w-7xl mx-auto mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2">
              RARITY:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['ALL', 'Legendary', 'Epic', 'Rare', 'Uncommon', 'Icon', 'Marvel'].map((rar) => (
                <button
                  key={rar}
                  onClick={() => setSelectedRarity(rar)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedRarity === rar
                      ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {rar}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2">
              PRICE TIER:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'ALL', label: `All (${accounts.length})` },
                { id: 'BUDGET', label: 'Budget ($10–$24)' },
                { id: 'MEDIUM', label: 'Medium ($35–$74)' },
                { id: 'HIGH', label: 'Stacked OG ($85+)' }
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedTier === tier.id
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredAccounts.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 mt-10">
          <div className="p-12 rounded-2xl bg-[#111827] border border-slate-800 text-center space-y-3">
            <h3 className="font-display font-bold text-lg text-white">No accounts match your active filters</h3>
            <p className="text-xs text-slate-400">
              Try resetting your rarity, category, or search query to inspect all 108 verified accounts.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedRarity('ALL');
                setSelectedTier('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-sky-500 text-slate-950 font-bold text-xs rounded-lg"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredAccounts.map((acc) => {
            const { featured, previews } = getCardDisplayItems(acc);
            const openTab: LockerCategory = selectedCategory === 'ALL' ? 'outfit' : selectedCategory;

            return (
              <div
                key={acc.id}
                className="bg-[#111827] border border-slate-800 hover:border-sky-500/60 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl group transition"
              >
                <div>
                  <div
                    onClick={() => {
                      setActiveAccount(acc);
                      setLockerTab(openTab);
                    }}
                    className={`relative h-44 bg-gradient-to-br ${getRarityStyle(featured?.rarity)} p-3 flex items-center justify-center cursor-pointer overflow-hidden`}
                  >
                    <span className="absolute top-2.5 left-2.5 bg-black/75 text-white text-[11px] font-bold px-2 py-0.5 rounded font-mono">
                      {acc.id}
                    </span>
                    <span className="absolute top-2.5 right-2.5 bg-sky-500 text-slate-950 text-[11px] font-black px-2 py-0.5 rounded">
                      {acc.totalSkins} SKINS
                    </span>
                    {featured?.icon && (
                      <img
                        src={featured.icon}
                        alt={featured.name}
                        className="h-36 object-contain drop-shadow-lg group-hover:scale-105 transition"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <span className="text-[11px] text-sky-400 font-semibold">{acc.platform}</span>
                    <h3 className="font-display font-bold text-sm text-white line-clamp-1 my-1">{acc.title}</h3>

                    <div className="grid grid-cols-4 gap-1.5 my-3">
                      {previews.map((item, idx) => (
                        <div
                          key={`${item.id}-${idx}`}
                          title={item.name}
                          className={`aspect-square rounded-lg bg-gradient-to-b ${getRarityStyle(item.rarity)} border p-0.5 overflow-hidden`}
                        >
                          <img
                            src={item.icon}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between text-xs text-slate-300 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                      <span className="flex items-center gap-1">
                        <Hammer className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{acc.totalPickaxes}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>{acc.totalEmotes}</span>
                      </span>
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" />
                        <span>{acc.vbucks}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Price</span>
                    <span className="text-xl font-extrabold text-white tabular-nums">${acc.price}.00</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setActiveAccount(acc);
                        setLockerTab(openTab);
                      }}
                      className="flex items-center gap-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs px-2.5 py-2 rounded-xl cursor-pointer transition"
                      title="Inspect Locker"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Locker</span>
                    </button>
                    <button
                      onClick={() => onBuyAccount(convertToAccountListing(acc))}
                      className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-3 py-2 rounded-xl cursor-pointer transition shadow-sm"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Optional Admin-Added Featured Store Listings */}
      {backendAccounts.length > 0 && selectedCategory === 'ALL' && selectedRarity === 'ALL' && selectedTier === 'ALL' && !searchQuery.trim() && (
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>Featured Admin-Verified Store Accounts</span>
            </h2>
            <span className="text-xs text-slate-400">{backendAccounts.length} Admin Verified</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {backendAccounts.map((acc) => (
              <div
                key={acc.id}
                className="bg-[#111827] border border-cyan-500/30 hover:border-cyan-400/70 rounded-2xl p-4 flex flex-col justify-between gap-3 transition shadow-lg"
              >
                <div className="flex gap-3 items-start">
                  <img
                    src={acc.screenshots[0] || '/src/assets/images/gaming_account_showcase_1793465508903.jpg'}
                    alt={acc.title}
                    className="w-20 h-16 rounded-lg object-cover bg-black border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-bold text-cyan-400">{acc.id}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-500/30">
                        {acc.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-xs text-white line-clamp-2 mt-0.5">{acc.title}</h3>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {acc.totalOutfits} Outfits &bull; {acc.totalVBucksBalance} V-Bucks
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-base font-black text-cyan-400">${acc.price.toFixed(2)}</span>
                  <div className="flex gap-2">
                    {onSelectBackendAccount && (
                      <button
                        onClick={() => onSelectBackendAccount(acc)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                      >
                        Details
                      </button>
                    )}
                    <button
                      onClick={() => onBuyAccount(acc)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locker Inspect Modal */}
      {activeAccount && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fadeIn"
          onClick={() => setActiveAccount(null)}
        >
          <div
            className="bg-[#0b2a5b] border-2 border-sky-400/50 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-black/30 border-b border-sky-400/20 flex items-center justify-between">
              <div>
                <span className="bg-sky-500 text-slate-950 font-black text-xs px-2 py-0.5 rounded font-mono">
                  INSPECTING {activeAccount.id}
                </span>
                <h2 className="font-display text-lg font-bold text-white mt-1">
                  {activeAccount.title} - ${activeAccount.price}.00
                </h2>
              </div>
              <button
                onClick={() => setActiveAccount(null)}
                className="p-2 bg-white/10 hover:bg-red-500 rounded-xl text-white cursor-pointer transition"
                aria-label="Close locker modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex gap-2 px-4 py-3 bg-[#071836] border-b border-sky-400/20 overflow-x-auto">
              {(['outfit', 'backpack', 'pickaxe', 'glider', 'emote'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setLockerTab(tab)}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase cursor-pointer whitespace-nowrap transition ${
                    lockerTab === tab
                      ? 'bg-yellow-400 text-slate-950 shadow-md'
                      : 'bg-sky-950 text-sky-200 hover:bg-sky-800 border border-sky-500/20'
                  }`}
                >
                  {tab} ({activeAccount.locker[tab].length})
                </button>
              ))}
            </div>

            <div className="p-4 md:p-6 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {activeAccount.locker[lockerTab]?.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className={`rounded-xl bg-gradient-to-b ${getRarityStyle(item.rarity)} border-2 overflow-hidden flex flex-col justify-between shadow-lg group`}
                >
                  <div className="aspect-square p-1.5 flex items-center justify-center">
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition duration-200"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="bg-black/75 px-2 py-1 text-center">
                    <p className="text-[11px] font-bold text-white truncate" title={item.name}>
                      {item.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-black/40 border-t border-sky-400/20 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
                <Zap className="w-4 h-4" />
                <span>Instant Delivery &bull; Full Email Access</span>
                <Check className="w-4 h-4 ml-1" />
              </span>
              <button
                onClick={() => {
                  const accountListing = convertToAccountListing(activeAccount);
                  setActiveAccount(null);
                  onBuyAccount(accountListing);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm px-6 py-3 rounded-xl cursor-pointer shadow-lg transition"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>BUY NOW (${activeAccount.price})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
