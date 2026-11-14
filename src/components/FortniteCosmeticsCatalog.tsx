import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, ShoppingCart, Check, Gift, Zap, Sparkles } from 'lucide-react';
import { CosmeticCategory, CosmeticRarity, Product } from '../types';
import cosmeticsRaw from '../data/fortniteCosmetics.json';

export interface CatalogCosmeticItem {
  id: string;
  name: string;
  type: 'outfit' | 'pickaxe' | 'glider' | 'emote' | 'backpack';
  rarity: string;
  description?: string;
  icon: string;
}

const LOCAL_COSMETICS = cosmeticsRaw as CatalogCosmeticItem[];

const RARITY_STYLES: Record<string, string> = {
  legendary: 'from-amber-500 to-orange-700 border-amber-400',
  epic: 'from-purple-500 to-indigo-800 border-purple-400',
  rare: 'from-sky-400 to-blue-700 border-sky-300',
  uncommon: 'from-emerald-400 to-green-700 border-emerald-300',
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

export function getCosmeticUsdPrice(type: string, rarity: string): number {
  const r = (rarity || 'common').toLowerCase();
  const t = (type || 'outfit').toLowerCase();

  if (t === 'outfit') {
    if (r === 'legendary') return 14.99;
    if (['marvel', 'dc', 'icon', 'starwars', 'gaminglegends'].includes(r)) return 12.99;
    if (r === 'epic') return 11.99;
    if (r === 'rare') return 9.99;
    if (r === 'uncommon') return 6.99;
    return 8.99;
  }
  if (t === 'pickaxe' || t === 'glider') {
    if (r === 'legendary') return 11.99;
    if (['epic', 'marvel', 'dc', 'icon', 'starwars', 'gaminglegends'].includes(r)) return 9.99;
    if (r === 'rare') return 6.99;
    if (r === 'uncommon') return 4.99;
    return 5.99;
  }
  if (t === 'emote') {
    if (r === 'epic') return 6.99;
    if (['icon', 'marvel', 'dc', 'legendary', 'starwars', 'gaminglegends'].includes(r)) return 5.99;
    if (r === 'rare') return 4.99;
    if (r === 'uncommon') return 2.99;
    return 3.99;
  }
  // backpack
  if (r === 'legendary') return 6.99;
  if (['epic', 'marvel', 'dc', 'icon', 'starwars', 'gaminglegends'].includes(r)) return 5.99;
  if (r === 'rare') return 4.99;
  if (r === 'uncommon') return 2.99;
  return 3.99;
}

const mapCategory = (type: string): CosmeticCategory => {
  switch (type) {
    case 'outfit':
      return 'skins';
    case 'pickaxe':
      return 'pickaxes';
    case 'glider':
      return 'gliders';
    case 'emote':
      return 'emotes';
    case 'backpack':
      return 'backblings';
    default:
      return 'skins';
  }
};

const mapCosmeticType = (type: string): Product['cosmeticType'] => {
  switch (type) {
    case 'outfit':
      return 'Outfit';
    case 'pickaxe':
      return 'Pickaxe';
    case 'glider':
      return 'Glider';
    case 'emote':
      return 'Emote';
    case 'backpack':
      return 'Back Bling';
    default:
      return 'Outfit';
  }
};

const mapRarity = (rarity: string): CosmeticRarity => {
  const r = (rarity || '').toLowerCase();
  if (r === 'legendary') return 'Legendary';
  if (r === 'epic') return 'Epic';
  if (r === 'rare') return 'Rare';
  if (r === 'uncommon') return 'Uncommon';
  if (r === 'marvel') return 'Marvel';
  if (r === 'dc') return 'DC';
  if (r === 'icon') return 'Icon';
  if (r === 'gaminglegends') return 'Gaming Legends';
  if (r === 'starwars') return 'Star Wars';
  return 'Epic';
};

export function catalogItemToProduct(item: CatalogCosmeticItem): Product {
  return {
    id: `COS-${item.type.toUpperCase()}-${item.rarity.toUpperCase()}-${item.id}`,
    name: item.name,
    category: mapCategory(item.type),
    cosmeticType: mapCosmeticType(item.type),
    rarity: mapRarity(item.rarity),
    price: getCosmeticUsdPrice(item.type, item.rarity),
    description: item.description || 'Official Fortnite in-game cosmetic item available for gifting or account delivery.',
    image: item.icon,
    inStock: true,
    isGiftable: true,
    isSampleVerified: true,
    deliveryMethod: 'Direct Gifting Protocol / Epic Friend Delivery (48h Friend Rule Applies)'
  };
}

interface FortniteCosmeticsCatalogProps {
  initialCategory?: 'ALL' | 'outfit' | 'pickaxe' | 'glider' | 'emote' | 'backpack';
  onAddToCart: (product: Product, quantity?: number, isGift?: boolean) => void;
  onBuyNow: (product: Product, quantity?: number) => void;
}

export const FortniteCosmeticsCatalog: React.FC<FortniteCosmeticsCatalogProps> = ({
  initialCategory = 'outfit',
  onAddToCart,
  onBuyNow
}) => {
  const [itemsList, setItemsList] = useState<CatalogCosmeticItem[]>(LOCAL_COSMETICS);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'outfit' | 'pickaxe' | 'glider' | 'emote' | 'backpack'>(initialCategory);
  const [selectedRarity, setSelectedRarity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<CatalogCosmeticItem | null>(null);
  const [visibleLimit, setVisibleLimit] = useState(120);

  useEffect(() => {
    setSelectedCategory(initialCategory);
    setVisibleLimit(120);
  }, [initialCategory]);

  // Background silent refresh from live Fortnite API (instant initial render via local catalog)
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    async function syncLiveCosmetics() {
      try {
        const res = await fetch('https://fortnite-api.com/v2/cosmetics/br', { signal: controller.signal });
        if (!res.ok) return;
        const json = await res.json();
        const raw = json.data || [];
        const allowed = new Set(['outfit', 'pickaxe', 'glider', 'emote', 'backpack']);
        const liveItems: CatalogCosmeticItem[] = raw
          .filter(
            (i: any) =>
              i.images?.icon &&
              i.name &&
              i.name.trim().toUpperCase() !== 'TBD' &&
              allowed.has(i.type?.value)
          )
          .map((i: any) => ({
            id: i.id,
            name: i.name,
            type: i.type.value,
            rarity: (i.rarity?.value || 'common').toLowerCase(),
            description: i.description || 'Official Fortnite in-game cosmetic item.',
            icon: i.images.icon
          }));

        if (liveItems.length > LOCAL_COSMETICS.length) {
          setItemsList(liveItems);
        }
      } catch {
        // Keep fast local verified cosmetics catalog on network timeout
      } finally {
        clearTimeout(timer);
      }
    }

    syncLiveCosmetics();
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return itemsList.filter((item) => {
      const matchesCat = selectedCategory === 'ALL' || item.type === selectedCategory;
      const itemRarity = (item.rarity || 'default').toLowerCase();
      const matchesRarity = selectedRarity === 'ALL' || itemRarity === selectedRarity.toLowerCase();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q));
      return matchesCat && matchesRarity && matchesSearch;
    });
  }, [itemsList, selectedCategory, selectedRarity, searchQuery]);

  const getRarityGradient = (item?: CatalogCosmeticItem | null) => {
    const val = item?.rarity?.toLowerCase() || 'default';
    return RARITY_STYLES[val] || RARITY_STYLES.default;
  };

  const displayedItems = filteredItems.slice(0, visibleLimit);

  return (
    <div className="min-h-screen bg-[#080c14] text-white font-body pb-16 animate-fadeIn">
      {/* Top Banner & Filters Header */}
      <div className="bg-[#0f172a] border-b border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>{itemsList.length.toLocaleString()} Verified Cosmetics Loaded</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-black tracking-tight">
              FORTNITE <span className="text-sky-400">COSMETICS CATALOG</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Live Database &bull; Real-Time High-Definition Item Inspection &amp; Direct Gifting
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search any skin, pickaxe, emote..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleLimit(120);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Real Category Selector Tabs */}
        <div className="max-w-7xl mx-auto mt-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2">
            <Filter className="w-3.5 h-3.5 text-sky-400" />
            <span>SELECT CATEGORY:</span>
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
                onClick={() => {
                  setSelectedCategory(cat.id as any);
                  setVisibleLimit(120);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rarity Filters */}
        <div className="max-w-7xl mx-auto mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {['ALL', 'legendary', 'epic', 'rare', 'uncommon', 'icon', 'marvel', 'dc', 'gaminglegends', 'starwars'].map((rar) => (
              <button
                key={rar}
                onClick={() => {
                  setSelectedRarity(rar);
                  setVisibleLimit(120);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition cursor-pointer ${
                  selectedRarity === rar
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {rar}
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-400 whitespace-nowrap">
            Showing <strong className="text-white">{displayedItems.length}</strong> of{' '}
            <strong className="text-sky-400">{filteredItems.length}</strong> items
          </div>
        </div>
      </div>

      {/* Main Grid displaying Real Items based on Category */}
      {displayedItems.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 mt-10">
          <div className="p-12 rounded-2xl bg-[#111827] border border-slate-800 text-center space-y-3">
            <h3 className="font-display font-bold text-lg text-white">No cosmetics match your filters</h3>
            <p className="text-xs text-slate-400">
              Try resetting your category, rarity, or search query.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedRarity('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-sky-500 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayedItems.map((item) => {
              const price = getCosmeticUsdPrice(item.type, item.rarity);
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`rounded-2xl bg-gradient-to-b ${getRarityGradient(item)} border-2 overflow-hidden flex flex-col justify-between shadow-xl cursor-pointer hover:scale-105 transition duration-200 group`}
                >
                  <div className="aspect-square p-2 flex items-center justify-center relative">
                    <span className="absolute top-2 left-2 bg-black/70 text-[10px] font-bold px-2 py-0.5 rounded uppercase text-sky-300">
                      {item.type}
                    </span>
                    <span className="absolute top-2 right-2 bg-black/75 text-yellow-300 text-[10px] font-black px-1.5 py-0.5 rounded tabular-nums">
                      ${price.toFixed(2)}
                    </span>
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="w-full h-full object-contain drop-shadow-2xl"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="bg-black/85 px-3 py-2 text-center border-t border-white/10">
                    <p className="text-xs font-bold text-white truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{item.rarity || 'Common'}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length > displayedItems.length && (
            <div className="text-center mt-8">
              <button
                onClick={() => setVisibleLimit((prev) => prev + 120)}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-white transition cursor-pointer"
              >
                Load More Cosmetics ({filteredItems.length - displayedItems.length} remaining)
              </button>
            </div>
          )}
        </>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-gradient-to-b from-[#0b2a5b] to-[#061229] border-2 border-sky-400/50 rounded-2xl w-full max-w-md p-6 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              aria-label="Close item detail modal"
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-red-500 rounded-xl text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={`aspect-square rounded-xl bg-gradient-to-b ${getRarityGradient(selectedItem)} border-2 p-4 flex items-center justify-center mb-4`}>
              <img
                src={selectedItem.icon}
                alt={selectedItem.name}
                className="w-full h-full object-contain drop-shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-black text-white">{selectedItem.name}</h2>
                <p className="text-xs text-sky-300 font-semibold uppercase mt-0.5">
                  Rarity: {selectedItem.rarity || 'Standard'} &bull; {selectedItem.type}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 block uppercase">Direct Price</span>
                <span className="text-xl font-black text-yellow-400 tabular-nums">
                  ${getCosmeticUsdPrice(selectedItem.type, selectedItem.rarity).toFixed(2)}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              {selectedItem.description || 'Official Fortnite in-game cosmetic item.'}
            </p>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-emerald-400 font-extrabold text-xs flex items-center gap-1.5">
                <Check className="w-4 h-4 shrink-0" />
                <span>Available for Gifting / Account Add</span>
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  const prod = catalogItemToProduct(selectedItem);
                  setSelectedItem(null);
                  onAddToCart(prod, 1, false);
                }}
                className="flex items-center justify-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs py-3 rounded-xl transition cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>ADD TO CART</span>
              </button>
              <button
                onClick={() => {
                  const prod = catalogItemToProduct(selectedItem);
                  setSelectedItem(null);
                  onBuyNow(prod, 1);
                }}
                className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-3 rounded-xl transition cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>BUY NOW</span>
              </button>
            </div>
            <button
              onClick={() => {
                const prod = catalogItemToProduct(selectedItem);
                setSelectedItem(null);
                onAddToCart(prod, 1, true);
              }}
              className="w-full mt-2.5 flex items-center justify-center gap-1.5 bg-pink-600/20 hover:bg-pink-600/35 border border-pink-500/40 text-pink-200 font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
            >
              <Gift className="w-4 h-4 text-pink-400" />
              <span>SEND AS IN-GAME GIFT TO FRIEND</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
