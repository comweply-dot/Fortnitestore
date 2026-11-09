import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Lock, Coins, Sparkles, Gift } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
  onBrowseProducts: () => void;
  onViewGifts: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onShopNow,
  onBrowseProducts,
  onViewGifts
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#06080F] via-[#0B0F1F] to-[#06080F] py-12 md:py-20 border-b border-[#172033]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/3 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 bg-purple-950/40 px-3 py-1 rounded-full border border-purple-500/30">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              <span>Premium AAA Fortnite-Inspired Gaming Storefront</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] text-balance">
              WELCOME TO <br />
              <span className="bg-gradient-to-r from-yellow-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
                V BUCK STORE
              </span>
            </h1>

            <p className="font-display text-xl sm:text-2xl font-semibold text-slate-200">
              Your Ultimate Gaming Marketplace for V-Bucks, Outfits & Gifts
            </p>

            <p className="text-base text-slate-400 max-w-xl leading-relaxed">
              Explore authentic V-Bucks currency packages, daily rotated cosmetic drops, pickaxes, gliders, emotes, weapon wraps, and direct gift delivery. Secure on-chain USDT settlement with guaranteed zero-password protocol.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onShopNow}
                className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 transition-all flex items-center gap-2.5 group"
              >
                <span>V-Bucks Packages</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onBrowseProducts}
                className="px-6 py-3.5 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white font-semibold rounded-xl border border-slate-700 hover:border-slate-600 transition-all"
              >
                Browse All 100+ Skins
              </button>

              <button
                onClick={onViewGifts}
                className="px-5 py-3.5 text-pink-400 hover:text-pink-300 text-sm font-semibold hover:underline flex items-center gap-1.5"
              >
                <Gift className="w-4 h-4" />
                <span>Send a Gift</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Password Required</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>USDT TRC20 & BEP20</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Trackable Order Status</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#252E47] shadow-2xl shadow-purple-950/50 bg-[#111726]">
              <img
                src="/src/assets/images/hero_fortnite_store_1793465506972.jpg"
                alt="V BUCK STORE Key Art"
                className="w-full h-auto aspect-video lg:aspect-[4/3] object-cover hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-transparent to-transparent opacity-80" />
              
              {/* Highlight callout on image */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-[#0F1424]/90 backdrop-blur-md border border-[#27324E] flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-yellow-400 uppercase tracking-wide">Featured Package</div>
                  <div className="text-sm font-bold text-white">5,000 V-Bucks Vault</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-yellow-400 tabular-nums">$36.99</div>
                  <div className="text-[10px] text-slate-400">Save 20% vs retail</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
