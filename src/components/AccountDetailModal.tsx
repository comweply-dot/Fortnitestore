import React, { useState } from 'react';
import { AccountListing } from '../types';
import { X, ShieldCheck, Check, AlertTriangle, ArrowRight, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface AccountDetailModalProps {
  account: AccountListing | null;
  onClose: () => void;
  onBuyNow: (account: AccountListing) => void;
}

export const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
  account,
  onClose,
  onBuyNow
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!account) return null;

  const currentImage = account.screenshots[activeImageIdx] || '/src/assets/images/gaming_account_showcase_1793465508903.jpg';

  const nextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % account.screenshots.length);
  };

  const prevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + account.screenshots.length) % account.screenshots.length);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#0B0F1D] border border-[#232F4A] rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto">
          {/* Left Column: Screenshot Gallery */}
          <div className="lg:col-span-7 bg-[#070A12] p-4 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1C263D]">
            <div>
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-mono text-cyan-400 font-bold tracking-wider">
                  LISTING: {account.id}
                </span>
                <span className="text-slate-400">
                  Image {activeImageIdx + 1} of {account.screenshots.length}
                </span>
              </div>

              {/* Main Screenshot Preview */}
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-[#1A2338] group">
                <img
                  src={currentImage}
                  alt={`${account.title} screenshot ${activeImageIdx + 1}`}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    isZoomed ? 'scale-150 cursor-zoom-out' : 'group-hover:scale-105 cursor-zoom-in'
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                  referrerPolicy="no-referrer"
                />

                {/* Next/Prev Navigation */}
                {account.screenshots.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-opacity opacity-80 hover:opacity-100"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-opacity opacity-80 hover:opacity-100"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="absolute bottom-2 right-2 p-1.5 rounded-md bg-black/60 hover:bg-black text-slate-300 text-xs flex items-center gap-1"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{isZoomed ? 'Reset Zoom' : 'Zoom'}</span>
                </button>
              </div>

              {/* Thumbnail Strip */}
              {account.screenshots.length > 1 && (
                <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
                  {account.screenshots.map((shot, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveImageIdx(idx);
                        setIsZoomed(false);
                      }}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIdx === idx
                          ? 'border-cyan-400 scale-105'
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={shot} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Platform Rules Notice */}
            <div className="mt-6 p-3 rounded-xl bg-[#0E1528] border border-[#212E4A] text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Platform Notice & Transfer Terms:</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Upon verified USDT payment, you receive full ownership of the linked email credentials. Fortnite accounts are transferred in strict compliance with safety guidelines. All previous sessions are securely terminated and 2FA is reset to your personal phone/email.
              </p>
            </div>
          </div>

          {/* Right Column: Account Specifications & Handover */}
          <div className="lg:col-span-5 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>VERIFIED GAMING ACCOUNT</span>
                <span className={`font-semibold px-2 py-0.5 rounded text-[11px] border ${
                  account.status === 'Available'
                    ? 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40'
                    : 'text-amber-300 bg-amber-950/80 border-amber-500/50'
                }`}>
                  {account.status}
                </span>
              </div>

              {account.status === 'Awaiting Images' && (
                <div className="mb-3 p-2.5 rounded-lg bg-amber-950/60 border border-amber-500/40 text-[11px] text-amber-300">
                  ⚠️ <strong>Awaiting Admin Locker Images:</strong> Screenshots for this verified listing are being captured and verified by the administrator. Contact support or live chat if you require immediate previews.
                </div>
              )}

              <h2 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">
                {account.title}
              </h2>

              {/* Price display */}
              <div className="mt-4 pb-4 border-b border-slate-800 flex items-baseline gap-3">
                <span className="text-3xl font-black text-cyan-400 tabular-nums">
                  ${account.price.toFixed(2)} USD
                </span>
                {account.originalPrice && (
                  <span className="text-sm text-slate-500 line-through tabular-nums">
                    ${account.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-2.5 my-4">
                <div className="p-2.5 rounded-lg bg-[#12192D] border border-[#1E2943]">
                  <div className="text-[10px] text-slate-400 uppercase">Account Level</div>
                  <div className="text-base font-bold text-white">{account.accountLevel}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#12192D] border border-[#1E2943]">
                  <div className="text-[10px] text-slate-400 uppercase">Total Outfits</div>
                  <div className="text-base font-bold text-yellow-400">{account.totalOutfits}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#12192D] border border-[#1E2943]">
                  <div className="text-[10px] text-slate-400 uppercase">Pickaxes</div>
                  <div className="text-base font-bold text-cyan-400">{account.totalPickaxes}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#12192D] border border-[#1E2943]">
                  <div className="text-[10px] text-slate-400 uppercase">V-Bucks Balance</div>
                  <div className="text-base font-bold text-amber-400">{account.totalVBucksBalance} VB</div>
                </div>
              </div>

              {/* Platform Linkability */}
              <div className="space-y-2 mb-4">
                <div className="text-xs font-semibold text-slate-300">Linkable Platforms:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300 bg-[#12192D] px-2.5 py-1.5 rounded">
                    <Check className={`w-3.5 h-3.5 ${account.platformLinkable.pc ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>PC Linkable: {account.platformLinkable.pc ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 bg-[#12192D] px-2.5 py-1.5 rounded">
                    <Check className={`w-3.5 h-3.5 ${account.platformLinkable.psn ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>PSN Linkable: {account.platformLinkable.psn ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 bg-[#12192D] px-2.5 py-1.5 rounded">
                    <Check className={`w-3.5 h-3.5 ${account.platformLinkable.xbox ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>Xbox Linkable: {account.platformLinkable.xbox ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 bg-[#12192D] px-2.5 py-1.5 rounded">
                    <Check className={`w-3.5 h-3.5 ${account.platformLinkable.switch ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>Switch Linkable: {account.platformLinkable.switch ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              {/* Handover Conditions */}
              <div className="space-y-1.5 text-xs text-slate-300 mb-6">
                <div className="text-xs font-semibold text-slate-300">Delivery & Security:</div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{account.deliveryTerms}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  onBuyNow(account);
                  onClose();
                }}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/30 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>Proceed to Checkout (${account.price.toFixed(2)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
