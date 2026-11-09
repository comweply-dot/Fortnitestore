import React from 'react';
import { ShieldCheck, Coins, Lock, HelpCircle } from 'lucide-react';
import { StoreSettings } from '../types';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenPolicy: (policy: 'refund' | 'terms' | 'privacy' | 'payment-guide') => void;
  settings?: StoreSettings;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenPolicy,
  settings
}) => {
  const supportEmail = settings?.supportEmail || 'support@fortnitestore.gg';
  const supportDiscord = settings?.supportDiscord || 'discord.gg/fortnitestore';

  return (
    <footer className="bg-[#05070D] border-t border-[#161D2E] text-slate-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Main 4-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-black text-white text-xs">
                FS
              </div>
              <span className="font-display font-black text-white text-base tracking-wider uppercase">
                FORTNITE STORE
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Premium digital e-commerce gaming marketplace for official Fortnite V-Bucks packages, legendary cosmetic loadouts, pickaxes, and verified gaming accounts.
            </p>
            <div className="text-[11px] text-slate-500">
              © {new Date().getFullYear()} FORTNITE STORE. All rights reserved.
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <div className="font-display font-bold text-slate-200 text-sm uppercase tracking-wider">
              Store Catalog
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('vbucks')}
                  className="hover:text-yellow-400 transition-colors"
                >
                  V-Bucks Store (from $11.50)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cosmetics')}
                  className="hover:text-purple-400 transition-colors"
                >
                  Fortnite Skins & Outfits
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cosmetics')}
                  className="hover:text-purple-400 transition-colors"
                >
                  Pickaxes & Harvesting Tools
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('accounts')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Full Access Gaming Accounts
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Orders */}
          <div className="space-y-2.5">
            <div className="font-display font-bold text-slate-200 text-sm uppercase tracking-wider">
              Order & Payment
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('track')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Track Existing Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('payment-guide')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  USDT (TRC20 / BEP20) Payment Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('support')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Customer Support Ticket
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-purple-400 transition-colors"
                >
                  Staff Admin Login
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="space-y-2.5">
            <div className="font-display font-bold text-slate-200 text-sm uppercase tracking-wider">
              Policies & Compliance
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onOpenPolicy('refund')}
                  className="hover:text-white transition-colors"
                >
                  Refund & Cancellation Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('terms')}
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('privacy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy & Data Policy
                </button>
              </li>
              <li>
                <a
                  href="/api/download-source-zip"
                  download="fortnite-vbuck-store-source.zip"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors inline-flex items-center gap-1"
                >
                  <span>Download Source (.ZIP)</span>
                </a>
              </li>
              <li>
                <div className="text-[11px] text-slate-500 pt-1">
                  Contact: <span className="text-slate-400">{supportEmail}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Strip */}
        <div className="pt-8 border-t border-slate-900 text-[11px] text-slate-500 leading-relaxed space-y-2">
          <p>
            <strong>Trademark Notice:</strong> FORTNITE STORE is an independent gaming marketplace. Fortnite, V-Bucks, and associated cosmetic trademarks or copyrights are property of Epic Games, Inc. This site is not sponsored, authorized, or affiliated with Epic Games, Inc. Purchases are fulfilled via digital redemption codes or certified gift delivery protocols.
          </p>
          <p>
            <strong>Payment Notice:</strong> Settlements are processed exclusively in Tether (USDT) on TRON (TRC20) and BNB Smart Chain (BEP20). We never solicit private wallet keys, passwords, or seed phrases.
          </p>
        </div>
      </div>
    </footer>
  );
};
