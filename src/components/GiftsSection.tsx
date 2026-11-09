import React, { useState } from 'react';
import { Product } from '../types';
import { Gift, Heart, Send, Check, Info, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface GiftsSectionProps {
  giftableProducts: Product[];
  onSelectGift: (product: Product, recipientEpicId?: string, giftMessage?: string) => void;
  onOpenProductModal: (product: Product) => void;
}

export const GiftsSection: React.FC<GiftsSectionProps> = ({
  giftableProducts,
  onSelectGift,
  onOpenProductModal
}) => {
  const [selectedGiftProduct, setSelectedGiftProduct] = useState<Product | null>(null);
  const [recipientEpicId, setRecipientEpicId] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [deliveryType, setDeliveryType] = useState<'voucher_code' | 'epic_friend'>('voucher_code');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const openGiftModal = (product: Product) => {
    setSelectedGiftProduct(product);
    setRecipientEpicId('');
    setGiftMessage('');
    setErrorMsg(null);
  };

  const handleConfirmGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEpicId.trim()) {
      setErrorMsg('Please enter your friend\'s Epic Games ID or Gamer Tag.');
      return;
    }
    if (selectedGiftProduct) {
      onSelectGift(selectedGiftProduct, recipientEpicId.trim(), giftMessage.trim());
      setSelectedGiftProduct(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-10 animate-fadeIn">
      {/* Gifts Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#2B1B47] shadow-2xl bg-[#120B24]">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-400 bg-pink-950/40 px-3 py-1 rounded-full border border-pink-500/30">
              <Gift className="w-3.5 h-3.5" />
              <span>Official Cosmetic Gifting Protocol</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              Gift Outfits, Bundles & <br />
              <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                Battle Passes to Friends
              </span>
            </h1>

            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Surprise your duo partner or squad mates with legendary character skins, exclusive gift bundles, and seasonal passes. Dispatched cleanly without needing your friend's password.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 bg-[#1A1230] p-2.5 rounded-lg border border-purple-900/40">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant digital gift redemption key OR bot delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-[#1A1230] p-2.5 rounded-lg border border-purple-900/40">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Custom celebratory message included</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 flex justify-center">
            <img
              src="/src/assets/images/gifts_section_showcase_1793467008345.jpg"
              alt="Fortnite Gift Box Showcase"
              className="w-full max-w-md rounded-xl shadow-2xl border border-purple-500/30 object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Gifting Requirements & Limitations Disclosure */}
      <div className="p-5 rounded-2xl bg-[#0D1222] border border-[#1E2940] text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
          <Info className="w-4 h-4" />
          <span>Epic Games Gifting Policy & Fulfillment Instructions</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          In strict compliance with transparency guidelines: Gifting in Fortnite requires an established Epic Games friendship when utilizing in-game gifting bots (minimum 48-hour mutual friendship mandated by Epic Games protocol). Alternatively, selecting <strong>"Instant Digital Voucher Code"</strong> delivers a 16-digit voucher redemption code directly to you so your friend can redeem it immediately at <span className="text-pink-300 font-mono">epicgames.com/redeem</span> with zero waiting period.
        </p>
      </div>

      {/* Curated Gift Packages Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#1A2234]">
          <div>
            <h2 className="font-display text-2xl font-black text-white">
              Curated Gift Packages & Bundles
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Popular gift packages ready for immediate dispatch.
            </p>
          </div>
          <span className="text-xs text-slate-400">
            {giftableProducts.length} giftable items available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {giftableProducts.map((prod) => (
            <div
              key={prod.id}
              className="rounded-2xl bg-[#0D1222] border border-[#1F2B48] hover:border-pink-500/50 p-5 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-950/20 group"
            >
              <div>
                {/* Image */}
                <div 
                  onClick={() => onOpenProductModal(prod)}
                  className="relative w-full aspect-video rounded-xl overflow-hidden bg-black cursor-pointer mb-4 border border-slate-800"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-bold text-pink-400 border border-pink-500/30 flex items-center gap-1">
                    <Gift className="w-3 h-3" />
                    <span>Giftable</span>
                  </div>
                </div>

                <div className="text-[11px] text-purple-400 uppercase font-semibold">
                  {prod.rarity} · {prod.cosmeticType}
                </div>

                <h3 
                  onClick={() => onOpenProductModal(prod)}
                  className="font-display text-lg font-bold text-white mt-1 group-hover:text-pink-400 transition-colors cursor-pointer"
                >
                  {prod.name}
                </h3>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {prod.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800">
                <div className="flex items-baseline justify-between mb-3">
                  <div className="text-xl font-black text-yellow-400 tabular-nums">
                    ${prod.price.toFixed(2)} USD
                  </div>
                  {prod.originalPrice && (
                    <span className="text-xs text-slate-500 line-through tabular-nums">
                      ${prod.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => openGiftModal(prod)}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  <span>Send as Gift</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recipient Gifting Modal */}
      {selectedGiftProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0E1324] border border-[#253252] rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-400" />
                <h3 className="font-display font-bold text-lg text-white">
                  Send Gift to Friend
                </h3>
              </div>
              <button
                onClick={() => setSelectedGiftProduct(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Product summary */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#080B14] border border-slate-800">
              <img src={selectedGiftProduct.image} alt={selectedGiftProduct.name} className="w-14 h-14 rounded-lg object-cover bg-black" />
              <div>
                <div className="text-sm font-bold text-white">{selectedGiftProduct.name}</div>
                <div className="text-xs text-yellow-400 font-bold">${selectedGiftProduct.price.toFixed(2)} USD</div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleConfirmGift} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Friend's Epic Games Display Name / Gamer Tag <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={recipientEpicId}
                  onChange={(e) => setRecipientEpicId(e.target.value)}
                  placeholder="e.g. SquadLeader_99"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-[#232F4A] text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Gift Delivery Method
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('voucher_code')}
                    className={`p-2.5 rounded-lg border text-left transition-colors ${
                      deliveryType === 'voucher_code'
                        ? 'border-pink-500 bg-pink-950/40 text-white'
                        : 'border-slate-800 bg-[#080B14] text-slate-400'
                    }`}
                  >
                    <div className="font-bold">Instant Voucher Key</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">No 48h wait required.</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('epic_friend')}
                    className={`p-2.5 rounded-lg border text-left transition-colors ${
                      deliveryType === 'epic_friend'
                        ? 'border-pink-500 bg-pink-950/40 text-white'
                        : 'border-slate-800 bg-[#080B14] text-slate-400'
                    }`}
                  >
                    <div className="font-bold">Epic Direct Gift</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Bot friend invite required.</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Custom Gift Card Message (Optional)
                </label>
                <textarea
                  rows={2}
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="e.g. GG on the victory royale yesterday! Enjoy the new skin!"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080B14] border border-[#232F4A] text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Add Gift to Cart (${selectedGiftProduct.price.toFixed(2)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
