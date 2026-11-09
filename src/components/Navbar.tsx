import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, Shield, Gift, Zap, Sparkles, ChevronDown } from 'lucide-react';
import { CosmeticCategory } from '../types';

interface NavbarProps {
  currentView: string;
  selectedCategory: string;
  onNavigate: (view: string, category?: CosmeticCategory | 'all') => void;
  cartCount: number;
  onOpenCart: () => void;
  onSearchClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  selectedCategory,
  onNavigate,
  cartCount,
  onOpenCart,
  onSearchClick
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cosmeticsDropdownOpen, setCosmeticsDropdownOpen] = useState(false);

  const handleNavClick = (view: string, category?: CosmeticCategory | 'all') => {
    onNavigate(view, category);
    setMobileMenuOpen(false);
    setCosmeticsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#06080F]/95 backdrop-blur-md border-b border-[#172033]">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-purple-950 via-[#10172E] to-blue-950 border-b border-purple-900/30 px-4 py-1.5 text-center text-xs font-semibold text-purple-200">
        <span className="inline-flex items-center gap-1.5 flex-wrap justify-center">
          <Zap className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
          <span>V BUCK STORE: Verified Packages, Item Shop Gifting & 100+ Skins · Direct Locker Delivery Protocol</span>
        </span>
      </div>

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left text-slate-100 hover:text-white transition-colors whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500 via-purple-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-600/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#090D18] rounded-[10px] flex items-center justify-center">
              <span className="font-display font-black text-yellow-400 text-base tracking-wider">V</span>
            </div>
          </div>
          <div>
            <span className="font-display text-lg font-black tracking-wider uppercase bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent">
              V BUCK STORE
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => handleNavClick('vbucks')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              currentView === 'vbucks'
                ? 'text-yellow-400 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>V-Bucks</span>
            <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded font-mono font-bold">SALE</span>
          </button>

          <button
            onClick={() => handleNavClick('item-shop')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1 ${
              currentView === 'item-shop'
                ? 'text-purple-400 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Daily Item Shop</span>
          </button>

          {/* Cosmetics Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCosmeticsDropdownOpen(!cosmeticsDropdownOpen)}
              onMouseEnter={() => setCosmeticsDropdownOpen(true)}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1 ${
                currentView === 'catalog'
                  ? 'text-cyan-400 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>Cosmetics</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {cosmeticsDropdownOpen && (
              <div 
                onMouseLeave={() => setCosmeticsDropdownOpen(false)}
                className="absolute top-full left-0 mt-1 w-52 bg-[#0C1122] border border-[#212E4A] rounded-xl shadow-2xl py-2 z-50 animate-fadeIn"
              >
                <button
                  onClick={() => handleNavClick('catalog', 'all')}
                  className="w-full text-left px-3.5 py-2 text-xs text-white hover:bg-purple-950/60 font-semibold flex items-center justify-between"
                >
                  <span>All Products</span>
                  <span className="text-[10px] text-slate-500">100+</span>
                </button>
                <button
                  onClick={() => handleNavClick('catalog', 'skins')}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-purple-950/60 hover:text-white"
                >
                  Skins & Outfits
                </button>
                <button
                  onClick={() => handleNavClick('catalog', 'pickaxes')}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-purple-950/60 hover:text-white"
                >
                  Pickaxes & Harvesting Tools
                </button>
                <button
                  onClick={() => handleNavClick('catalog', 'gliders')}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-purple-950/60 hover:text-white"
                >
                  Gliders
                </button>
                <button
                  onClick={() => handleNavClick('catalog', 'emotes')}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-purple-950/60 hover:text-white"
                >
                  Emotes & Dances
                </button>
                <button
                  onClick={() => handleNavClick('catalog', 'backblings')}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-purple-950/60 hover:text-white"
                >
                  Back Blings
                </button>
                <button
                  onClick={() => handleNavClick('catalog', 'wraps')}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-purple-950/60 hover:text-white"
                >
                  Wraps & Accessories
                </button>
                <button
                  onClick={() => handleNavClick('catalog', 'bundles')}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-purple-950/60 hover:text-white"
                >
                  Bundles & Collections
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavClick('gifts')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              currentView === 'gifts'
                ? 'text-pink-400 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-pink-400" />
            <span>Gifts</span>
          </button>

          <button
            onClick={() => handleNavClick('accounts')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'accounts'
                ? 'text-cyan-400 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Accounts
          </button>

          <button
            onClick={() => handleNavClick('track')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'track'
                ? 'text-blue-400 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Track Order
          </button>

          <button
            onClick={() => handleNavClick('support')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'support'
                ? 'text-emerald-400 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Support
          </button>
        </nav>

        {/* Zone 3: Search, Admin & Cart */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onSearchClick}
            aria-label="Search Catalog"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleNavClick('admin')}
            title="Administrator Portal"
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span className="whitespace-nowrap">Admin</span>
          </button>

          <button
            onClick={onOpenCart}
            aria-label="View Shopping Cart"
            className="relative flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md shadow-purple-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold bg-white text-purple-900 rounded-full tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#1A2234] bg-[#0A0E1A] px-4 pt-3 pb-5 space-y-1.5 animate-fadeIn">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800/70"
          >
            Storefront Home
          </button>
          <button
            onClick={() => handleNavClick('vbucks')}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-yellow-400 hover:bg-slate-800/70 flex items-center justify-between"
          >
            <span>V-Bucks Packages</span>
            <span className="text-xs bg-yellow-400/20 px-2 py-0.5 rounded">From $8.99</span>
          </button>
          <button
            onClick={() => handleNavClick('item-shop')}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-purple-400 hover:bg-slate-800/70 flex items-center justify-between"
          >
            <span>Daily Item Shop</span>
            <span className="text-xs text-purple-300">Live</span>
          </button>
          <button
            onClick={() => handleNavClick('gifts')}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-pink-400 hover:bg-slate-800/70 flex items-center justify-between"
          >
            <span>Gifts Section</span>
            <span className="text-xs text-pink-300">Giftable Items</span>
          </button>
          <div className="pt-2 pb-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3">
            Cosmetics Categories
          </div>
          <div className="grid grid-cols-2 gap-1 px-1">
            <button
              onClick={() => handleNavClick('catalog', 'skins')}
              className="text-left px-2.5 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800"
            >
              Skins & Outfits
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'pickaxes')}
              className="text-left px-2.5 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800"
            >
              Pickaxes
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'gliders')}
              className="text-left px-2.5 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800"
            >
              Gliders
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'emotes')}
              className="text-left px-2.5 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800"
            >
              Emotes & Dances
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'backblings')}
              className="text-left px-2.5 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800"
            >
              Back Blings
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'wraps')}
              className="text-left px-2.5 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800"
            >
              Wraps & Accessories
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'bundles')}
              className="text-left px-2.5 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800"
            >
              Bundles & Packs
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'all')}
              className="text-left px-2.5 py-1.5 rounded text-xs text-purple-300 font-semibold hover:bg-slate-800"
            >
              All 100+ Products
            </button>
          </div>
          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            <button
              onClick={() => handleNavClick('accounts')}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-cyan-400 hover:bg-slate-800/70"
            >
              Verified Accounts
            </button>
            <button
              onClick={() => handleNavClick('track')}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-blue-400 hover:bg-slate-800/70"
            >
              Track Order Status
            </button>
            <button
              onClick={() => handleNavClick('support')}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-emerald-400 hover:bg-slate-800/70"
            >
              Support & FAQ
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/70 flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
