import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { api } from '../services/api';
import { X, ShieldCheck, AlertTriangle, ArrowRight, Loader2, Coins } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderCreated: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderCreated
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [epicId, setEpicId] = useState('');
  const [platform, setPlatform] = useState<string>('PC');
  const [selectedNetwork, setSelectedNetwork] = useState<'USDT_TRC20' | 'USDT_BEP20'>('USDT_TRC20');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => {
    const price = item.isAccount && item.account ? item.account.price : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form Validation
    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@') || !customerEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address for delivery confirmation.');
      return;
    }
    if (!epicId.trim()) {
      setErrorMessage('Please enter your Fortnite Epic Account ID or Gamer Tag.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        epicId: epicId.trim(),
        platform,
        items: items.map(item => ({
          productId: item.isAccount && item.account ? item.account.id : item.product.id,
          quantity: item.quantity,
          image: item.product.image
        })),
        selectedNetwork,
        customerNotes: customerNotes.trim() || undefined
      };

      const result = await api.createOrder(orderPayload);
      onOrderCreated(result.order);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to initialize order. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0B0F1D] border border-[#232F4A] rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-[#1A243B] flex items-center justify-between bg-[#080B14]">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <h2 className="font-display font-bold text-lg text-white">
              Secure Checkout & Order Placement
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-red-950/60 border border-red-800/80 text-xs text-red-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Order Summary Strip */}
          <div className="p-4 rounded-xl bg-[#0F162A] border border-[#1E2C4C] space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-300">
              <span className="font-semibold uppercase tracking-wider text-purple-400">Order Items:</span>
              <span className="text-slate-400">{items.length} product(s)</span>
            </div>
            <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
              {items.map((item, idx) => {
                const title = item.isAccount && item.account ? item.account.title : item.product.name;
                const price = item.isAccount && item.account ? item.account.price : item.product.price;
                return (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 truncate max-w-[260px]">
                      {item.quantity}x {title}
                    </span>
                    <span className="text-yellow-400 font-bold tabular-nums">
                      ${(price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="pt-2 border-t border-slate-700/60 flex justify-between items-center">
              <span className="text-sm font-bold text-white">Total Amount Due</span>
              <span className="text-xl font-black text-yellow-400 tabular-nums">
                ${totalAmount.toFixed(2)} USD
              </span>
            </div>
          </div>

          {/* Required Fields Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name / Recipient Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#070A12] border border-[#232F4A] text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address (for Receipt & Codes) <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#070A12] border border-[#232F4A] text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Fortnite Epic Games ID / Gamer Tag <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={epicId}
                onChange={(e) => setEpicId(e.target.value)}
                placeholder="e.g. Ninja, Striker_99"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#070A12] border border-[#232F4A] text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
              <span className="text-[10px] text-slate-400">Used strictly for gift delivery & friend invite routing.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Primary Gaming Platform <span className="text-red-400">*</span>
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#070A12] border border-[#232F4A] text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="PC">PC (Epic Games Launcher)</option>
                <option value="PlayStation">PlayStation 5 / PlayStation 4</option>
                <option value="Xbox">Xbox Series X|S / Xbox One</option>
                <option value="Nintendo Switch">Nintendo Switch</option>
                <option value="Mobile">Mobile (Android / Cloud)</option>
              </select>
            </div>
          </div>

          {/* Payment Network Selection */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select USDT Cryptocurrency Payment Network <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  selectedNetwork === 'USDT_TRC20'
                    ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-950/40'
                    : 'bg-[#0E1424] border-[#1E2940] hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="network"
                  value="USDT_TRC20"
                  checked={selectedNetwork === 'USDT_TRC20'}
                  onChange={() => setSelectedNetwork('USDT_TRC20')}
                  className="mt-1 accent-purple-500"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>USDT TRC20</span>
                    <span className="text-[10px] text-purple-300 font-mono">TRON Network</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Low fees (~$1). Fast 2–5 min confirmations.
                  </div>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  selectedNetwork === 'USDT_BEP20'
                    ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-950/40'
                    : 'bg-[#0E1424] border-[#1E2940] hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="network"
                  value="USDT_BEP20"
                  checked={selectedNetwork === 'USDT_BEP20'}
                  onChange={() => setSelectedNetwork('USDT_BEP20')}
                  className="mt-1 accent-blue-500"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>USDT BEP20</span>
                    <span className="text-[10px] text-blue-300 font-mono">BNB Smart Chain</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Minimal gas (~$0.15). Supported on Binance & Trust Wallet.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Order Notes / Preferred Delivery Window (Optional)
            </label>
            <textarea
              rows={2}
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              placeholder="e.g. Please send the voucher code directly to my email address."
              className="w-full px-3.5 py-2 rounded-lg bg-[#070A12] border border-[#232F4A] text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Privacy & Anti-Scam Assurance */}
          <div className="p-3 rounded-lg bg-[#0D1322] border border-[#1A253E] flex items-center gap-2.5 text-xs text-slate-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-[11px] text-slate-400 leading-snug">
              We will <strong className="text-slate-200">never</strong> ask for your Epic Games password or recovery email. Your order generates a permanent Order ID trackable 24/7.
            </span>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-950/60 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Unique Order ID & Setting Up USDT Payment...</span>
              </>
            ) : (
              <>
                <span>Generate Order & View Payment Address</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
