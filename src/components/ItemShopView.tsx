import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Sparkles, Clock, Flame, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

interface ItemShopViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ItemShopView: React.FC<ItemShopViewProps> = ({
  products,
  onAddToCart,
  onBuyNow,
  onSelectProduct
}) => {
  // Reset countdown timer to next 00:00 UTC
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter sections
  const dailyItems = products.filter(p => p.isDaily && p.category !== 'vbucks');
  const featuredItems = products.filter(p => p.featured && p.category !== 'vbucks');
  const bundlesItems = products.filter(p => p.category === 'bundles');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-12 animate-fadeIn">
      {/* Top Banner with Countdown */}
      <div className="relative rounded-2xl overflow-hidden border border-[#212E4A] bg-[#0A0E1A] shadow-2xl">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src="/src/assets/images/item_shop_daily_banner_1793467008264.jpg"
            alt="Item Shop Arena"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#06080F] via-[#06080F]/80 to-transparent" />

          {/* Banner Copy */}
          <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-xs font-bold uppercase tracking-wider text-purple-300">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>Daily Item Shop Rotation</span>
              </div>

              {/* Reset Timer */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-slate-700 text-xs text-slate-200">
                <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Shop Resets in:</span>
                <span className="font-mono font-bold text-white tabular-nums">
                  {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>

            <div className="max-w-xl space-y-2">
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                TODAY'S FEATURED DROPS
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Official cosmetics currently in rotation. All orders are fulfilled through direct locker gift delivery with verified USDT settlement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 1. FEATURED SECTION */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#1A2234]">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-orange-400" />
            <h2 className="font-display text-2xl font-black text-white">
              Featured Items
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {featuredItems.length} featured drops
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredItems.slice(0, 8).map(item => (
            <ProductCard
              key={item.id}
              product={item}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 2. DAILY SECTION */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#1A2234]">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h2 className="font-display text-2xl font-black text-white">
              Daily Rotation
            </h2>
          </div>
          <span className="text-xs text-cyan-400 font-mono">
            Refreshes at 00:00 UTC
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {dailyItems.slice(0, 8).map(item => (
            <ProductCard
              key={item.id}
              product={item}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 3. BUNDLES & SPECIAL COLLECTIONS */}
      {bundlesItems.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#1A2234]">
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h2 className="font-display text-2xl font-black text-white">
                Cosmetic Bundles & Collections
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Save up to 40% vs buying individual pieces
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundlesItems.map(bundle => (
              <ProductCard
                key={bundle.id}
                product={bundle}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
