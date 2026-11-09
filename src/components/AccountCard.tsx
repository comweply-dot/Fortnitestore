import React from 'react';
import { AccountListing } from '../types';
import { ShieldCheck, Eye, ArrowRight, Image as ImageIcon } from 'lucide-react';

interface AccountCardProps {
  account: AccountListing;
  onSelect: (account: AccountListing) => void;
  onBuyNow: (account: AccountListing) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onSelect,
  onBuyNow
}) => {
  return (
    <div className="rounded-xl bg-[#0D1222] border border-[#1E2940] hover:border-cyan-500/50 flex flex-col justify-between overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/20 group">
      {/* Account Hero Thumbnail & Screenshot Preview */}
      <div 
        onClick={() => onSelect(account)}
        className="relative w-full aspect-video bg-[#070A12] overflow-hidden cursor-pointer"
      >
        <img
          src={account.screenshots[0] || '/src/assets/images/gaming_account_showcase_1793465508903.jpg'}
          alt={account.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1222] via-transparent to-transparent opacity-75" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs gap-1">
          <span className="font-mono text-cyan-400 font-semibold tracking-wider">
            {account.id}
          </span>
          {account.status === 'Awaiting Images' || !account.screenshots || account.screenshots.length === 0 ? (
            <span className="bg-amber-950/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-amber-300 font-bold flex items-center gap-1 border border-amber-500/50">
              <span>Awaiting Admin Locker Images</span>
            </span>
          ) : (
            <span className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[11px] text-slate-300 flex items-center gap-1 border border-slate-700">
              <ImageIcon className="w-3 h-3 text-cyan-400" />
              <span>{account.screenshots.length} Screenshots</span>
            </span>
          )}
        </div>

        {/* Level, Outfits & V-Bucks count ticker */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-xs text-slate-300">
          <span className="font-semibold text-white">
            Level {account.accountLevel}
          </span>
          <div className="flex items-center gap-2">
            {account.totalVBucksBalance !== undefined && account.totalVBucksBalance > 0 && (
              <span className="text-cyan-300 font-bold bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-500/30 text-[10px]">
                {account.totalVBucksBalance.toLocaleString()} VB
              </span>
            )}
            <span className="text-yellow-400 font-bold">
              {account.totalOutfits} Outfits
            </span>
          </div>
        </div>
      </div>

      {/* Account Specs */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <button
            onClick={() => onSelect(account)}
            className="text-left font-display font-bold text-base text-slate-100 hover:text-cyan-400 transition-colors line-clamp-2"
          >
            {account.title}
          </button>

          {/* Quick Key Cosmetics */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {account.featuredCosmetics.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="text-[11px] text-slate-300 bg-[#141B2D] px-2 py-0.5 rounded border border-[#232F4A]"
              >
                {item}
              </span>
            ))}
            {account.featuredCosmetics.length > 3 && (
              <span className="text-[11px] text-slate-400 px-1 py-0.5">
                +{account.featuredCosmetics.length - 3} more
              </span>
            )}
          </div>

          {/* Platform Linkability */}
          <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
            <span className="text-slate-500">Platforms:</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              {account.platformLinkable.pc && <span className="text-cyan-300">PC</span>}
              {account.platformLinkable.psn && <span className="text-blue-300">PSN</span>}
              {account.platformLinkable.xbox && <span className="text-emerald-300">Xbox</span>}
              {account.platformLinkable.switch && <span className="text-red-300">Switch</span>}
            </div>
            {account.hasFullEmailAccess && (
              <span className="ml-auto text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Full Email</span>
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 pt-3 border-t border-[#172033]">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Account Price</div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-cyan-400 tabular-nums">
                  ${account.price.toFixed(2)}
                </span>
                {account.originalPrice && (
                  <span className="text-xs text-slate-500 line-through tabular-nums">
                    ${account.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-400">
              {account.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelect(account)}
              className="py-2 px-2 bg-[#172036] hover:bg-[#202D4C] text-slate-200 hover:text-white text-xs font-semibold rounded-lg border border-[#273556] transition-colors flex items-center justify-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>

            <button
              onClick={() => onBuyNow(account)}
              className="py-2 px-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1"
            >
              <span>Buy Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
