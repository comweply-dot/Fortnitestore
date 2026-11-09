import React, { useState } from 'react';
import { Product } from '../types';
import { X, ShoppingBag, ArrowRight, ShieldCheck, Check, Plus, Minus } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onBuyNow: (product: Product, quantity?: number) => void;
  onSelectRelated: (product: Product) => void;
  relatedProducts?: Product[];
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onSelectRelated,
  relatedProducts = []
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleQtyChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(10, prev + delta)));
  };

  const totalPrice = (product.price * quantity).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0B0F1D] border border-[#232F4A] rounded-2xl shadow-2xl overflow-hidden my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
          {/* Left: Product Image */}
          <div className="relative bg-[#060911] p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#1C263D]">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black/40">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-[#0B0F1D]/80 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-bold text-purple-400 border border-purple-500/30">
                {product.rarity}
              </div>
            </div>
          </div>

          {/* Right: Details & Purchase Module */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              {/* Category & Status */}
              <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider mb-2">
                <span>{product.category}</span>
                <span>·</span>
                <span>{product.subcategory || 'Fortnite Item'}</span>
              </div>

              <h2 className="font-display text-2xl font-black text-white">
                {product.name}
              </h2>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-3xl font-black text-white tabular-nums">
                  ${product.price.toFixed(2)} USD
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-500 line-through tabular-nums">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {product.description}
              </p>

              {/* Fulfillment Method */}
              <div className="mt-5 p-3 rounded-xl bg-[#12192D] border border-[#212E4A] space-y-1.5 text-xs text-slate-300">
                <div className="font-semibold text-purple-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Fulfillment Method:</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {product.deliveryMethod || 'Dispatched via certified digital gift voucher or automated friend gift. 100% genuine Epic Games locker synchronization.'}
                </p>
                <div className="pt-1 flex items-center gap-2 text-emerald-400 text-[11px]">
                  <Check className="w-3.5 h-3.5" />
                  <span>Zero Epic Games password required</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Select Quantity:</span>
                <div className="flex items-center bg-[#151D30] rounded-lg border border-[#232F4A] p-0.5">
                  <button
                    onClick={() => handleQtyChange(-1)}
                    className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white rounded"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-white tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQtyChange(1)}
                    className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white rounded"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {quantity > 1 && (
                <div className="mt-2 text-right text-xs text-slate-400">
                  Total: <span className="font-bold text-white">${totalPrice} USD</span>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="mt-6 pt-4 border-t border-slate-800 space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="py-3 px-4 bg-[#172036] hover:bg-[#202D4C] text-slate-200 hover:text-white text-xs font-bold rounded-xl border border-[#273556] transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => {
                    onBuyNow(product, quantity);
                    onClose();
                  }}
                  className="py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Buy Now (${totalPrice})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products strip */}
        {relatedProducts.length > 0 && (
          <div className="p-4 sm:p-6 bg-[#090D17] border-t border-[#1C263D]">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Related Cosmetics
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedProducts.map(rel => (
                <button
                  key={rel.id}
                  onClick={() => onSelectRelated(rel)}
                  className="p-2 rounded-lg bg-[#0E1424] hover:bg-[#151D33] border border-[#1A2338] text-left transition-colors flex items-center gap-2.5 group"
                >
                  <img src={rel.image} alt={rel.name} className="w-10 h-10 rounded object-cover shrink-0" />
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white group-hover:text-purple-400 truncate">
                      {rel.name}
                    </div>
                    <div className="text-[11px] text-yellow-400 font-semibold tabular-nums">
                      ${rel.price.toFixed(2)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
