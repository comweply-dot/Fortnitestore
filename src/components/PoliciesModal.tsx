import React from 'react';
import { X, ShieldAlert, CheckCircle2, FileText, Lock } from 'lucide-react';

interface PoliciesModalProps {
  policyType: 'refund' | 'terms' | 'privacy' | 'payment-guide' | null;
  onClose: () => void;
}

export const PoliciesModal: React.FC<PoliciesModalProps> = ({
  policyType,
  onClose
}) => {
  if (!policyType) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0B0F1D] border border-[#232F4A] rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-[#1A243B] flex items-center justify-between bg-[#080B14]">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-purple-400" />
            <h2 className="font-display font-bold text-lg text-white">
              {policyType === 'refund' && 'Refund & Cancellation Policy'}
              {policyType === 'terms' && 'Terms of Service & Platform Limitations'}
              {policyType === 'privacy' && 'Customer Privacy & Data Protection Policy'}
              {policyType === 'payment-guide' && 'Official USDT (TRC20 / BEP20) Payment Guide'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed">
          {policyType === 'refund' && (
            <>
              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-1 text-slate-200">
                <span className="font-bold text-purple-300">1. Digital Nature of Products & Finality</span>
                <p>
                  Fortnite V-Bucks codes, cosmetics gift deliveries, and gaming account ownership transfers are considered intangible digital goods delivered electronically. Once a digital voucher code has been revealed or an account transfer completed, the transaction is finalized.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-white">2. Eligible Refund Conditions</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                  <li><strong>Defective Code:</strong> If a delivered 16-digit voucher code is verified by our system as invalid or already redeemed prior to issuance, you will receive an immediate replacement code or a 100% USDT refund.</li>
                  <li><strong>Non-Delivery:</strong> If we fail to fulfill your digital code or initiate account transfer within 24 hours of on-chain payment confirmation, you are eligible for an immediate full refund.</li>
                  <li><strong>Overpayment:</strong> If you sent more USDT than the required order total, the excess amount can be credited toward another order or refunded minus standard network gas fees.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-white">3. Non-Refundable Scenarios</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                  <li>Transferring cryptocurrency to the wrong blockchain network (e.g. sending BEP20 USDT to our TRC20 address, or vice versa).</li>
                  <li>Providing an incorrect Epic Games Gamer Tag that results in cosmetics being gifted to another player account.</li>
                  <li>Buyer change of mind after receiving and viewing legitimate digital voucher codes.</li>
                </ul>
              </div>
            </>
          )}

          {policyType === 'terms' && (
            <>
              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 space-y-1 text-slate-200">
                <span className="font-bold text-blue-300">Epic Games Trademark Disclaimer</span>
                <p>
                  FORTNITE STORE is an independent e-commerce marketplace and is not endorsed, affiliated, associated, or sponsored by Epic Games, Inc. Fortnite and all related characters and cosmetics are registered trademarks of Epic Games, Inc.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-white">1. Service Scope & Fulfillment</h3>
                <p className="text-slate-400">
                  We supply retail voucher codes obtained through certified retail distribution partners and facilitate direct peer-to-peer gaming account transfers. We do not claim that unofficial purchases are authorized by Epic Games.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-white">2. Customer Account Safety</h3>
                <p className="text-slate-400">
                  FORTNITE STORE never requests your Epic Games password, email login, or sensitive 2FA backup codes. You are responsible for ensuring your personal Epic Games account complies with platform guidelines.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-white">3. Cryptocurrency Settlement</h3>
                <p className="text-slate-400">
                  All transactions are denominated in USD and settled exclusively in Tether (USDT) on TRON (TRC20) or BNB Smart Chain (BEP20). Submitting a transaction hash alerts our team to verify on-chain settlement.
                </p>
              </div>
            </>
          )}

          {policyType === 'privacy' && (
            <>
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-1 text-slate-200">
                <span className="font-bold text-emerald-300">Minimalist Data Collection Philosophy</span>
                <p>
                  We collect strictly the minimum information required to deliver your gaming products: Full Name, Email Address (for order receipts), and Fortnite Display Name (for gift delivery). We do not collect phone numbers, billing addresses, or payment card numbers.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-white">1. Data Security & Storage</h3>
                <p className="text-slate-400">
                  Your order details are stored in an encrypted server database. Order tracking lookups partially mask your email address to prevent exposure to unauthorized third parties.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-white">2. No Third-Party Tracking or Ads</h3>
                <p className="text-slate-400">
                  We do not sell customer information, run advertising trackers, or share your gaming activity with brokers.
                </p>
              </div>
            </>
          )}

          {policyType === 'payment-guide' && (
            <>
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 space-y-1 text-slate-200">
                <span className="font-bold text-amber-300">How to Send USDT (Step-by-Step)</span>
                <p>
                  Tether (USDT) is a stable cryptocurrency pegged 1:1 to the US Dollar ($1 USD = 1 USDT).
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-[#070A12] rounded-lg border border-[#1E2940]">
                  <span className="text-purple-400 font-bold">Network 1: USDT TRC20 (TRON)</span>
                  <p className="text-slate-400 mt-1">
                    Select "TRON (TRC20)" in your exchange withdrawal menu. Paste our receiving address: <code className="text-white font-mono select-all">THDha3vFBE4Lov5McPep6czmtqPsoLuAk5</code>. Typical network fee is ~1 USDT.
                  </p>
                </div>

                <div className="p-3 bg-[#070A12] rounded-lg border border-[#1E2940]">
                  <span className="text-blue-400 font-bold">Network 2: USDT BEP20 (BNB Smart Chain)</span>
                  <p className="text-slate-400 mt-1">
                    Select "BNB Smart Chain (BEP20)" in your exchange withdrawal menu. Paste our receiving address: <code className="text-white font-mono select-all">0x70685190F17B71dFB0DACb802751dEA2dBd5fAFA</code>. Typical network fee is ~$0.15 USD.
                  </p>
                </div>

                <div className="p-3 bg-[#070A12] rounded-lg border border-[#1E2940]">
                  <span className="text-emerald-400 font-bold">Step 3: Copy Your Transaction Hash (TxID)</span>
                  <p className="text-slate-400 mt-1">
                    Once your wallet shows the withdrawal as completed, copy the Transaction Hash (TxID) and submit it on your FORTNITE STORE payment screen to initiate verification!
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#1A243B] bg-[#080B14] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
