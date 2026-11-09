import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  onStartShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onStartShopping
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => {
    const price = item.isAccount && item.account ? item.account.price : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0B0F1D] border-l border-[#1F2B45] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-[#1A243B] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-400" />
              <h2 className="font-display font-bold text-lg text-white">
                Your Shopping Cart
              </h2>
              <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full tabular-nums">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#12192D] flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white">Your cart is empty</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    You haven’t added any V-Bucks, skins, or accounts to your cart yet.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onStartShopping();
                  }}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors"
                >
                  Explore Store Products
                </button>
              </div>
            ) : (
              items.map((item) => {
                const id = item.isAccount && item.account ? item.account.id : item.product.id;
                const title = item.isAccount && item.account ? item.account.title : item.product.name;
                const price = item.isAccount && item.account ? item.account.price : item.product.price;
                const image = item.isAccount && item.account 
                  ? (item.account.screenshots[0] || '/src/assets/images/gaming_account_showcase_1793465508903.jpg')
                  : item.product.image;
                const category = item.isAccount ? 'Gaming Account' : item.product.category;

                return (
                  <div
                    key={id}
                    className="p-3.5 rounded-xl bg-[#0F1528] border border-[#1E2943] flex gap-3.5 items-center justify-between group"
                  >
                    <img
                      src={image}
                      alt={title}
                      className="w-16 h-16 rounded-lg object-cover bg-black shrink-0"
                    />

                    <div className="flex-1 min-w-0 pr-2">
                      <div className="text-[10px] text-purple-400 uppercase tracking-wider font-semibold">
                        {category}
                      </div>
                      <h4 className="text-xs font-bold text-white truncate">
                        {title}
                      </h4>
                      <div className="text-xs font-bold text-yellow-400 tabular-nums mt-0.5">
                        ${price.toFixed(2)} USD
                      </div>

                      {/* Quantity Controls (disabled for single accounts) */}
                      {!item.isAccount && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center bg-[#182138] rounded border border-[#263557]">
                            <button
                              onClick={() => onUpdateQuantity(id, -1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-white tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(id, 1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end justify-between self-stretch">
                      <button
                        onClick={() => onRemoveItem(id)}
                        className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="text-xs font-black text-white tabular-nums">
                        ${(price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Checkout Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#1A243B] bg-[#0A0D18] space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-semibold text-white">
                    ${subtotal.toFixed(2)} USD
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Payment Network</span>
                  <span className="text-cyan-400 font-medium">USDT (TRC20 / BEP20)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Processing Fee</span>
                  <span className="text-emerald-400 font-semibold">$0.00 (Zero Fee)</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm">
                  <span className="font-bold text-white">Order Total</span>
                  <span className="font-black text-yellow-400 text-lg tabular-nums">
                    ${subtotal.toFixed(2)} USD
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Epic credentials needed · Real-time order tracking</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-950/50 transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
