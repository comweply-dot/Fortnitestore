import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingBag, ArrowRight, ShieldCheck, Info, Check, Plus, Minus } from 'lucide-react';

interface VBucksSectionProps {
  packages: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onBuyNow: (product: Product, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
}

function EpicVBucksBanner({ amount }: { amount: number | string }) {
  // Coin stack height automatically adjusts based on V-Bucks amount
  const num = parseInt(String(amount).replace(/[^0-9]/g, ''), 10) || 1000;
  const stacks = num <= 1000 ? 2 : num <= 2800 ? 3 : num <= 5000 ? 4 : 5;

  return (
    <div className="relative w-full h-44 bg-gradient-to-br from-[#22c55e] via-[#16a34a] to-[#052e16] flex flex-col items-center justify-between p-3 overflow-hidden select-none">
      {/* Epic Store Starburst Rays */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-conic-gradient(from 0deg, rgba(255,255,255,0.4) 0deg 12deg, transparent 12deg 24deg)'
        }}
      />

      {/* Bold White FORTNITE Header */}
      <span
        className="relative z-10 text-2xl font-black tracking-wider text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.5)]"
        style={{ fontFamily: 'Impact, sans-serif' }}
      >
        FORTNITE
      </span>

      {/* Silver-Blue V-Bucks Coin Stack SVG */}
      <svg viewBox="0 0 220 130" className="relative z-10 w-40 h-24 drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)]">
        <defs>
          <linearGradient id="vbFace" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="55%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="vbRim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="vbBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>

        {/* Left Stack */}
        <g transform="translate(45, 28)">
          {[...Array(stacks + 2)].map((_, idx) => (
            <g key={idx} transform={`translate(0, ${44 - idx * 8})`}>
              <ellipse cx="26" cy="11" rx="24" ry="9" fill="#1e293b" />
              <ellipse cx="26" cy="8" rx="24" ry="9" fill="url(#vbFace)" stroke="#cbd5e1" strokeWidth="1" />
              <ellipse cx="26" cy="8" rx="16" ry="5.5" fill="url(#vbBlue)" />
            </g>
          ))}
        </g>

        {/* Right Stack */}
        <g transform="translate(120, 20)">
          {[...Array(stacks + 3)].map((_, idx) => (
            <g key={idx} transform={`translate(0, ${52 - idx * 8})`}>
              <ellipse cx="26" cy="11" rx="24" ry="9" fill="#1e293b" />
              <ellipse cx="26" cy="8" rx="24" ry="9" fill="url(#vbFace)" stroke="#cbd5e1" strokeWidth="1" />
              <ellipse cx="26" cy="8" rx="16" ry="5.5" fill="url(#vbBlue)" />
            </g>
          ))}
        </g>

        {/* Center Extra Stack for Higher Packs */}
        {stacks >= 3 && (
          <g transform="translate(82, 14)">
            {[...Array(stacks + 3)].map((_, idx) => (
              <g key={idx} transform={`translate(0, ${54 - idx * 8})`}>
                <ellipse cx="26" cy="11" rx="24" ry="9" fill="#1e293b" />
                <ellipse cx="26" cy="8" rx="24" ry="9" fill="url(#vbFace)" stroke="#cbd5e1" strokeWidth="1" />
                <ellipse cx="26" cy="8" rx="16" ry="5.5" fill="url(#vbBlue)" />
              </g>
            ))}
          </g>
        )}

        {/* Front Tilted V-Buck Coin */}
        <g transform="translate(106, 82) rotate(-14)">
          <circle cx="2" cy="4" r="28" fill="#0f172a" />
          <circle cx="0" cy="0" r="28" fill="url(#vbFace)" stroke="url(#vbRim)" strokeWidth="3.5" />
          <circle cx="0" cy="0" r="19" fill="url(#vbBlue)" stroke="#bae6fd" strokeWidth="1.5" />
          <path d="M-9 -8 L-3 -8 L0 4 L3 -8 L9 -8 L3 10 L-3 10 Z" fill="#ffffff" />
        </g>
      </svg>

      {/* Bottom V-Bucks Amount Text */}
      <span className="relative z-10 text-xs font-black tracking-wider text-white uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
        {num.toLocaleString()} V-BUCKS
      </span>
    </div>
  );
}

export const VBucksSection: React.FC<VBucksSectionProps> = ({
  packages,
  onAddToCart,
  onBuyNow,
  onSelectProduct
}) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const getQty = (id: string) => quantities[id] || 1;

  const handleQtyChange = (id: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[id] || 1;
      const next = Math.max(1, Math.min(20, current + delta));
      return { ...prev, [id]: next };
    });
  };

  return (
    <section id="vbucks-section" className="py-14 bg-[#080B12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#1A2234]">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-1">
              Official Digital Currency
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              V-Bucks Packages & Pricing
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Authentic Fortnite V-Bucks voucher codes with direct account synchronization across all platforms (PC, PS5/PS4, Xbox, Nintendo Switch, Android).
            </p>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-2 bg-[#0E1424] px-3.5 py-2 rounded-lg border border-[#1E293F]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Guaranteed Zero Account Password Request</span>
          </div>
        </div>

        {/* Fulfillment Disclosure Notice */}
        <div className="my-6 p-4 rounded-xl bg-[#0D1222] border border-[#212C45] text-xs text-slate-300 flex items-start gap-3">
          <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-100">
              Fulfillment Method & Platform Delivery Disclosure:
            </p>
            <p className="text-slate-400 leading-relaxed">
              V-Bucks packages are fulfilled via genuine 16-digit digital redemption codes redeemable directly at <span className="text-cyan-300 font-mono">epicgames.com/redeem</span> or via certified automated friend-gift protocol. Purchases are independent of Epic Games; no customer passwords or credentials are ever requested. Delivery takes 10–30 minutes following on-chain USDT payment verification.
            </p>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {packages.map((pkg) => {
            const qty = getQty(pkg.id);
            const lineTotal = (pkg.price * qty).toFixed(2);

            return (
              <div
                key={pkg.id}
                className="relative rounded-2xl bg-[#0D1222] border border-[#1E2940] hover:border-yellow-500/50 p-6 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-500/10 group"
              >
                {/* Popular or Savings Badge */}
                {pkg.isBestSeller && (
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 text-xs font-black uppercase rounded-full shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  {/* Image & Coin Graphic */}
                  <div
                    onClick={() => onSelectProduct(pkg)}
                    className="relative w-full h-44 rounded-xl overflow-hidden cursor-pointer mb-5 border border-[#172033]"
                  >
                    <EpicVBucksBanner amount={pkg.vbucksEquivalent ?? pkg.name} />
                  </div>

                  {/* Title & Description */}
                  <button
                    onClick={() => onSelectProduct(pkg)}
                    className="text-left group-hover:text-yellow-400 transition-colors"
                  >
                    <h3 className="font-display text-2xl font-black text-white">
                      {pkg.name}
                    </h3>
                  </button>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Features */}
                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Multi-platform compatible (PC, PS5, Xbox, Switch)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>16-digit digital voucher code or direct gift</span>
                    </div>
                  </div>
                </div>

                {/* Price & Quantity & Actions */}
                <div className="mt-6 pt-5 border-t border-slate-800">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <div className="text-xs text-slate-400">Exact Price (USD)</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-yellow-400 tabular-nums">
                          ${pkg.price.toFixed(2)}
                        </span>
                        {pkg.originalPrice && (
                          <span className="text-xs text-slate-500 line-through tabular-nums">
                            ${pkg.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center bg-[#151D30] rounded-lg border border-[#232F4A] p-0.5">
                      <button
                        onClick={() => handleQtyChange(pkg.id, -1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700/50 rounded transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-white tabular-nums">
                        {qty}
                      </span>
                      <button
                        onClick={() => handleQtyChange(pkg.id, 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700/50 rounded transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {qty > 1 && (
                    <div className="text-right text-xs text-slate-400 mb-3">
                      Total ({qty}x): <span className="text-white font-bold tabular-nums">${lineTotal} USD</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => onAddToCart(pkg, qty)}
                      className="w-full py-2.5 px-3 bg-[#1A2238] hover:bg-[#232F4C] text-slate-200 hover:text-white text-xs font-semibold rounded-lg border border-[#2D3B5C] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>

                    <button
                      onClick={() => onBuyNow(pkg, qty)}
                      className="w-full py-2.5 px-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 text-xs font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Buy Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
