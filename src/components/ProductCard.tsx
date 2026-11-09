import React from 'react';
import { Product } from '../types';
import { ShoppingBag, ArrowRight, Gift } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onSelect: (product: Product) => void;
  onSendAsGift?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  onSelect,
  onSendAsGift
}) => {
  // Rarity color accents
  const getRarityBadgeStyle = (rarity: string) => {
    switch (rarity) {
      case 'Mythic':
        return 'text-amber-400 border-amber-500/30';
      case 'Legendary':
        return 'text-orange-400 border-orange-500/30';
      case 'Epic':
        return 'text-purple-400 border-purple-500/30';
      case 'Rare':
        return 'text-blue-400 border-blue-500/30';
      case 'Uncommon':
        return 'text-emerald-400 border-emerald-500/30';
      case 'Icon':
        return 'text-teal-400 border-teal-500/30';
      case 'Marvel':
        return 'text-red-400 border-red-500/30';
      case 'DC':
        return 'text-indigo-400 border-indigo-500/30';
      case 'Gaming Legends':
        return 'text-sky-400 border-sky-500/30';
      case 'Anime':
        return 'text-pink-400 border-pink-500/30';
      case 'Star Wars':
        return 'text-yellow-300 border-yellow-400/30';
      default:
        return 'text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="group rounded-xl bg-[#0D1222] border border-[#1A2338] hover:border-[#384870] flex flex-col justify-between overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/20">
      {/* Product Image Area */}
      <div 
        onClick={() => onSelect(product)}
        className="relative w-full aspect-square bg-[#060911] overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/src/assets/images/featured_skin_renegade_1793465508685.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1222] via-transparent to-transparent opacity-60" />

        {/* Clean metadata top bar */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-semibold">
          <span className={`${getRarityBadgeStyle(product.rarity)} uppercase tracking-wider`}>
            {product.rarity}
          </span>
          {product.isGiftable && (
            <span className="text-pink-400 flex items-center gap-1 text-[10px] bg-black/60 px-1.5 py-0.5 rounded border border-pink-500/20">
              <Gift className="w-2.5 h-2.5" />
              <span>Gift</span>
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 uppercase tracking-wider mb-1">
            <span>{product.cosmeticType || product.category}</span>
            {product.subcategory && (
              <>
                <span aria-hidden="true">·</span>
                <span className="truncate">{product.subcategory}</span>
              </>
            )}
          </div>

          <button
            onClick={() => onSelect(product)}
            className="text-left font-display font-bold text-base text-slate-100 hover:text-purple-400 transition-colors line-clamp-1"
          >
            {product.name}
          </button>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 pt-3 border-t border-[#172033]">
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-white tabular-nums">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-500 line-through tabular-nums">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {product.vbucksEquivalent && (
              <span className="text-[11px] font-mono text-yellow-400 font-semibold">
                {product.vbucksEquivalent} VB
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddToCart(product)}
              className="py-2 px-2 bg-[#172036] hover:bg-[#202D4C] text-slate-200 hover:text-white text-xs font-semibold rounded-lg border border-[#273556] transition-colors flex items-center justify-center gap-1"
              title="Add to shopping cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>

            <button
              onClick={() => onBuyNow(product)}
              className="py-2 px-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1"
            >
              <span>Buy Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
