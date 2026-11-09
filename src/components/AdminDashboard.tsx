import React, { useState, useEffect } from 'react';
import { Order, Product, AccountListing, SupportTicket, StoreSettings, CosmeticCategory, CosmeticRarity, CosmeticType } from '../types';
import { api } from '../services/api';
import { 
  Shield, 
  Lock, 
  Check, 
  Clock, 
  AlertTriangle, 
  Search, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  LogOut, 
  RefreshCw,
  Coins,
  Package,
  MessageSquare,
  DollarSign,
  TrendingUp,
  UserCheck,
  Download,
  Upload,
  Gift,
  Image as ImageIcon,
  Maximize2,
  QrCode,
  X
} from 'lucide-react';

interface AdminDashboardProps {
  onExit: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('fs_admin_token') || null;
  });
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Data
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'accounts' | 'wallets' | 'support' | 'catalog-io' | 'export'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [accounts, setAccounts] = useState<AccountListing[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [stats, setStats] = useState<{
    totalRevenue: number;
    totalOrders: number;
    pendingVerification: number;
    openTickets: number;
    totalProducts: number;
    totalAccounts: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Search & Filter
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Editing order state
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editPaymentStatus, setEditPaymentStatus] = useState<string>('');
  const [editOrderStatus, setEditOrderStatus] = useState<string>('');
  const [editFulfillmentNotes, setEditFulfillmentNotes] = useState<string>('');

  // Add product form modal state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<CosmeticCategory>('skins');
  const [newProdCosmeticType, setNewProdCosmeticType] = useState<CosmeticType>('Outfit');
  const [newProdRarity, setNewProdRarity] = useState<CosmeticRarity>('Epic');
  const [newProdPrice, setNewProdPrice] = useState('14.50');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('/src/assets/images/featured_skin_renegade_1793465508685.jpg');
  const [newProdIsGiftable, setNewProdIsGiftable] = useState(true);
  const [newProdIsDaily, setNewProdIsDaily] = useState(false);

  // Add Account form state
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccTitle, setNewAccTitle] = useState('');
  const [newAccPrice, setNewAccPrice] = useState('149.00');
  const [newAccOriginalPrice, setNewAccOriginalPrice] = useState('199.00');
  const [newAccLevel, setNewAccLevel] = useState('1200');
  const [newAccOutfits, setNewAccOutfits] = useState('210');
  const [newAccPickaxes, setNewAccPickaxes] = useState('115');
  const [newAccGliders, setNewAccGliders] = useState('85');
  const [newAccEmotes, setNewAccEmotes] = useState('140');
  const [newAccVBucks, setNewAccVBucks] = useState('2400');
  const [newAccFeatured, setNewAccFeatured] = useState('Black Knight, The Reaper, Floss');
  const [newAccDesc, setNewAccDesc] = useState('');
  const [newAccScreenshots, setNewAccScreenshots] = useState('/src/assets/images/gaming_account_showcase_1793465508903.jpg');
  const [newAccStatus, setNewAccStatus] = useState<'Available' | 'Awaiting Images'>('Available');
  const [newAccPC, setNewAccPC] = useState(true);
  const [newAccPSN, setNewAccPSN] = useState(true);
  const [newAccXbox, setNewAccXbox] = useState(true);
  const [newAccSwitch, setNewAccSwitch] = useState(true);

  // QR & Wallet Settings State
  const [editTrc20Addr, setEditTrc20Addr] = useState('');
  const [editBep20Addr, setEditBep20Addr] = useState('');
  const [editTrc20Qr, setEditTrc20Qr] = useState('/assets/qr/usdt_trc20_qr.jpg');
  const [editBep20Qr, setEditBep20Qr] = useState('/assets/qr/usdt_bep20_qr.jpg');
  const [settingsSavedMsg, setSettingsSavedMsg] = useState<string | null>(null);

  // Payment proof lightbox modal
  const [selectedProofImage, setSelectedProofImage] = useState<string | null>(null);

  // Catalog I/O state
  const [importJsonText, setImportJsonText] = useState('');
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    if (authToken) {
      loadDashboardData(authToken);
    }
  }, [authToken]);

  const loadDashboardData = async (token: string) => {
    setIsLoading(true);
    try {
      const [ordersRes, statsRes, productsRes, accountsRes, ticketsRes, settingsRes] = await Promise.all([
        api.getAdminOrders(token),
        api.getAdminStats(token),
        api.getProducts({ limit: 200 }),
        api.getAccounts(),
        api.getAdminTickets(token),
        api.getSettings()
      ]);
      setOrders(ordersRes.orders);
      setStats(statsRes);
      setProducts(productsRes.products);
      setAccounts(accountsRes.accounts);
      setTickets(ticketsRes.tickets);
      if (settingsRes.settings) {
        setSettings(settingsRes.settings);
        setEditTrc20Addr(settingsRes.settings.trc20Address || '');
        setEditBep20Addr(settingsRes.settings.bep20Address || '');
        setEditTrc20Qr(settingsRes.settings.trc20QrImage || '/assets/qr/usdt_trc20_qr.jpg');
        setEditBep20Qr(settingsRes.settings.bep20QrImage || '/assets/qr/usdt_bep20_qr.jpg');
      }
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      if (err.message?.includes('Unauthorized')) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const res = await api.adminLogin(password);
      setAuthToken(res.token);
      localStorage.setItem('fs_admin_token', res.token);
    } catch (err: any) {
      setLoginError(err.message || 'Incorrect password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('fs_admin_token');
  };

  const startEditOrder = (order: Order) => {
    setEditingOrderId(order.id);
    setEditPaymentStatus(order.paymentStatus);
    setEditOrderStatus(order.orderStatus);
    setEditFulfillmentNotes(order.adminFulfillmentNotes || '');
  };

  const saveOrderUpdate = async (orderId: string) => {
    if (!authToken) return;
    try {
      const res = await api.updateAdminOrder(authToken, orderId, {
        paymentStatus: editPaymentStatus,
        orderStatus: editOrderStatus,
        adminFulfillmentNotes: editFulfillmentNotes
      });
      setOrders(prev => prev.map(o => (o.id === orderId ? res.order : o)));
      setEditingOrderId(null);
      const statsRes = await api.getAdminStats(authToken);
      setStats(statsRes);
    } catch (err: any) {
      alert('Error updating order: ' + err.message);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    try {
      const res = await api.addAdminProduct(authToken, {
        name: newProdName,
        category: newProdCategory,
        cosmeticType: newProdCosmeticType,
        rarity: newProdRarity,
        price: parseFloat(newProdPrice),
        description: newProdDesc,
        image: newProdImage,
        inStock: true,
        isGiftable: newProdIsGiftable,
        isDaily: newProdIsDaily
      });
      setProducts(prev => [res.product, ...prev]);
      setShowAddProduct(false);
      setNewProdName('');
      setNewProdDesc('');
    } catch (err: any) {
      alert('Failed to add product: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product?')) return;
    if (!authToken) return;
    try {
      await api.deleteAdminProduct(authToken, id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert('Failed to delete product: ' + err.message);
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    try {
      const shots = newAccScreenshots
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const featured = newAccFeatured
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const res = await api.addAdminAccount(authToken, {
        title: newAccTitle,
        price: parseFloat(newAccPrice),
        originalPrice: newAccOriginalPrice ? parseFloat(newAccOriginalPrice) : undefined,
        accountLevel: parseInt(newAccLevel, 10) || 100,
        totalOutfits: parseInt(newAccOutfits, 10) || 50,
        totalPickaxes: parseInt(newAccPickaxes, 10) || 30,
        totalGliders: parseInt(newAccGliders, 10) || 20,
        totalEmotes: parseInt(newAccEmotes, 10) || 40,
        totalVBucksBalance: parseInt(newAccVBucks, 10) || 0,
        featuredCosmetics: featured,
        platformLinkable: { pc: newAccPC, psn: newAccPSN, xbox: newAccXbox, switch: newAccSwitch },
        hasSaveTheWorld: true,
        hasFullEmailAccess: true,
        status: newAccStatus,
        description: newAccDesc || 'Verified Fortnite account with authentic locker items.',
        screenshots: shots.length > 0 ? shots : ['/src/assets/images/gaming_account_showcase_1793465508903.jpg'],
        deliveryTerms: 'Immediate native email and 2FA credentials handover.'
      });

      setAccounts(prev => [res.account, ...prev]);
      setShowAddAccount(false);
      setNewAccTitle('');
      setNewAccDesc('');
    } catch (err: any) {
      alert('Failed to add account listing: ' + err.message);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!confirm('Are you sure you want to delete this account listing?')) return;
    if (!authToken) return;
    try {
      await api.deleteAdminAccount(authToken, id);
      setAccounts(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      alert('Failed to delete account: ' + err.message);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    try {
      setSettingsSavedMsg(null);
      const res = await api.updateAdminSettings(authToken, {
        trc20Address: editTrc20Addr,
        bep20Address: editBep20Addr,
        trc20QrImage: editTrc20Qr,
        bep20QrImage: editBep20Qr
      });
      setSettings(res.settings);
      setSettingsSavedMsg('Wallet addresses and QR settings updated successfully.');
      setTimeout(() => setSettingsSavedMsg(null), 4000);
    } catch (err: any) {
      alert('Failed to update settings: ' + err.message);
    }
  };

  // Export catalog to JSON file download
  const handleExportCatalog = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vbuckstore_catalog_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import catalog from JSON text
  const handleImportCatalog = async () => {
    if (!authToken) return;
    setImportError(null);
    setImportMessage(null);
    try {
      const parsed = JSON.parse(importJsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('Imported JSON must be an array of products');
      }
      const res = await api.importCatalog(authToken, parsed);
      setImportMessage(res.message);
      setProducts(parsed);
      setImportJsonText('');
    } catch (err: any) {
      setImportError(err.message || 'Invalid JSON syntax');
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.epicId.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.txHash && o.txHash.toLowerCase().includes(orderSearch.toLowerCase()));

    const matchesStatus = orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter || o.paymentStatus === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Login Gate
  if (!authToken) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#06080F]">
        <div className="w-full max-w-md p-8 rounded-2xl bg-[#0D1222] border border-[#212E4A] shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl font-black text-white">
              V BUCK STORE Admin
            </h1>
            <p className="text-xs text-slate-400">
              Owner-only product catalog management, order fulfillment, and blockchain payment verification.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Admin Security Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator passcode..."
                  className="w-full px-4 py-3 rounded-xl bg-[#070A12] border border-[#232F4A] text-sm text-white focus:outline-none focus:border-purple-500 pl-10"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all disabled:opacity-50"
            >
              {isLoggingIn ? 'Verifying Authorization...' : 'Sign In as Owner'}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800/80 text-center space-y-2">
            <div className="text-[11px] text-slate-400">
              Default password: <code className="text-purple-300 font-mono font-bold">FortniteAdmin2026!</code>
            </div>
            <button
              type="button"
              onClick={() => setPassword('FortniteAdmin2026!')}
              className="text-xs text-cyan-400 hover:underline"
            >
              Fill Default Admin Credentials
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E2943]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-black text-white">
              V BUCK STORE Management Portal
            </h1>
            <p className="text-xs text-slate-400">
              Authenticated session · Catalog management, order fulfillment, and JSON I/O
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href="/api/download-source-zip"
            download="fortnite-vbuck-store-source.zip"
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg transition-all shadow-md flex items-center gap-1.5"
            title="Download full project source code archive (.zip)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Source (.ZIP)</span>
          </a>
          <button
            onClick={() => authToken && loadDashboardData(authToken)}
            disabled={isLoading}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 bg-red-950/60 hover:bg-red-900/60 border border-red-800/80 text-red-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
          <button
            onClick={onExit}
            className="px-3.5 py-2 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-lg"
          >
            Exit to Storefront
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-[#0D1222] border border-[#1E2940]">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Revenue</div>
            <div className="text-2xl font-black text-yellow-400 tabular-nums mt-1">
              ${stats.totalRevenue.toFixed(2)} USDT
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#0D1222] border border-[#1E2940]">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Orders</div>
            <div className="text-2xl font-black text-white tabular-nums mt-1">
              {stats.totalOrders}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#0D1222] border border-[#1E2940]">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Pending Review</div>
            <div className="text-2xl font-black text-amber-400 tabular-nums mt-1">
              {stats.pendingVerification}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#0D1222] border border-[#1E2940]">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Catalog Items</div>
            <div className="text-2xl font-black text-cyan-400 tabular-nums mt-1">
              {stats.totalProducts}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#0D1222] border border-[#1E2940] col-span-2 lg:col-span-1">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Open Tickets</div>
            <div className="text-2xl font-black text-purple-400 tabular-nums mt-1">
              {stats.openTickets}
            </div>
          </div>
        </div>
      )}

      {/* Tab Controls */}
      <div className="flex flex-wrap border-b border-slate-800 gap-4 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Orders & Payments ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'products'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Catalog Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog-io')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'catalog-io'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Catalog Import & Export</span>
        </button>

        <button
          onClick={() => setActiveTab('accounts')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'accounts'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Gaming Accounts ({accounts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wallets')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'wallets'
              ? 'border-yellow-500 text-yellow-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Crypto Wallets & QRs</span>
        </button>

        <button
          onClick={() => setActiveTab('support')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'support'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Support Tickets ({tickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'export'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Export & Deploy (.ZIP)</span>
        </button>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0D1222] p-4 rounded-xl border border-[#1E2940]">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search by Order ID, Epic ID, Email, or TxHash..."
                className="w-full px-3.5 py-2 pl-9 rounded-lg bg-[#070A12] border border-[#232F4A] text-xs text-white focus:outline-none focus:border-purple-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 whitespace-nowrap">Filter Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#070A12] border border-[#232F4A] text-xs text-white"
              >
                <option value="all">All Orders</option>
                <option value="Payment submitted — awaiting verification.">Awaiting Verification</option>
                <option value="Awaiting payment">Awaiting Payment</option>
                <option value="Payment confirmed.">Payment Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Payment failed — please contact support.">Payment Failed</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-[#1E2940] bg-[#0D1222] overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#090D18] text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-[#1E2940]">
                <tr>
                  <th className="p-4">Order Ref & Date</th>
                  <th className="p-4">Customer & Epic Tag</th>
                  <th className="p-4">Items & Amount</th>
                  <th className="p-4">Network & TxHash</th>
                  <th className="p-4">Payment & Order Status</th>
                  <th className="p-4">Fulfillment Notes</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No orders found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isEditing = editingOrderId === order.id;
                    const explorerUrl = order.txHash
                      ? order.selectedNetwork === 'USDT_TRC20'
                        ? `https://tronscan.org/#/transaction/${order.txHash}`
                        : `https://bscscan.com/tx/${order.txHash}`
                      : null;

                    return (
                      <tr key={order.id} className="hover:bg-[#12192D] transition-colors">
                        <td className="p-4 align-top">
                          <span className="font-mono font-bold text-white block text-sm">
                            {order.id}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          {order.isGiftOrder && (
                            <span className="text-[10px] text-pink-400 font-bold flex items-center gap-1 mt-1">
                              <Gift className="w-3 h-3" />
                              <span>Gift Order</span>
                            </span>
                          )}
                        </td>

                        <td className="p-4 align-top">
                          <div className="font-semibold text-white">{order.customerName}</div>
                          <div className="text-[11px] text-slate-400">{order.customerEmail}</div>
                          <div className="text-[11px] text-purple-300 font-mono font-semibold">
                            Epic: {order.epicId} ({order.platform})
                          </div>
                          {order.giftRecipientDetails && (
                            <div className="text-[10px] text-pink-300 font-mono mt-1">
                              To: {order.giftRecipientDetails.recipientEpicId}
                            </div>
                          )}
                        </td>

                        <td className="p-4 align-top">
                          <div className="space-y-1">
                            {order.items.map((i, idx) => (
                              <div key={idx} className="text-slate-300 truncate max-w-[180px]">
                                {i.quantity}x {i.name}
                              </div>
                            ))}
                          </div>
                          <div className="mt-1 font-black text-yellow-400 tabular-nums">
                            ${order.totalAmount.toFixed(2)} USD
                          </div>
                        </td>

                        <td className="p-4 align-top max-w-[200px]">
                          <span className="text-[10px] font-mono text-cyan-400 block font-semibold">
                            {order.selectedNetwork}
                          </span>
                          {order.txHash ? (
                            <div className="mt-1">
                              <span className="font-mono text-[11px] text-slate-300 break-all block">
                                {order.txHash.slice(0, 16)}...
                              </span>
                              {explorerUrl && (
                                <a
                                  href={explorerUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1 mt-0.5"
                                >
                                  <span>View on Explorer</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] text-amber-500">No TxHash yet</span>
                          )}

                          {order.paymentScreenshot && (
                            <button
                              type="button"
                              onClick={() => setSelectedProofImage(order.paymentScreenshot!)}
                              className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-[10px] text-purple-200 font-semibold transition-colors"
                            >
                              <ImageIcon className="w-3 h-3 text-purple-400" />
                              <span>View Payment Proof</span>
                            </button>
                          )}
                        </td>

                        <td className="p-4 align-top">
                          {isEditing ? (
                            <div className="space-y-2">
                              <div>
                                <label className="text-[10px] text-slate-400 block">Payment Status:</label>
                                <select
                                  value={editPaymentStatus}
                                  onChange={(e) => setEditPaymentStatus(e.target.value)}
                                  className="w-full text-xs bg-black border border-slate-700 rounded p-1 text-white"
                                >
                                  <option value="Awaiting payment">Awaiting payment</option>
                                  <option value="Payment submitted — awaiting verification.">Payment submitted — awaiting verification.</option>
                                  <option value="Payment confirmed.">Payment confirmed.</option>
                                  <option value="Payment failed — please contact support.">Payment failed — please contact support.</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-[10px] text-slate-400 block">Order Status:</label>
                                <select
                                  value={editOrderStatus}
                                  onChange={(e) => setEditOrderStatus(e.target.value)}
                                  className="w-full text-xs bg-black border border-slate-700 rounded p-1 text-white"
                                >
                                  <option value="Order Created">Order Created</option>
                                  <option value="Awaiting Payment">Awaiting Payment</option>
                                  <option value="Payment Submitted">Payment Submitted</option>
                                  <option value="Awaiting Verification">Awaiting Verification</option>
                                  <option value="Payment Confirmed">Payment Confirmed</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Cancelled">Cancelled</option>
                                  <option value="Payment Failed">Payment Failed</option>
                                </select>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="text-[11px] font-semibold text-white">
                                {order.orderStatus}
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                {order.paymentStatus}
                              </div>
                            </div>
                          )}
                        </td>

                        <td className="p-4 align-top max-w-[220px]">
                          {isEditing ? (
                            <textarea
                              rows={3}
                              value={editFulfillmentNotes}
                              onChange={(e) => setEditFulfillmentNotes(e.target.value)}
                              placeholder="e.g. Voucher code: ABCD-1234-EFGH emailed to customer."
                              className="w-full text-xs bg-black border border-slate-700 rounded p-1 text-white font-mono"
                            />
                          ) : (
                            <div className="text-[11px] text-slate-300 font-mono">
                              {order.adminFulfillmentNotes || 'None'}
                            </div>
                          )}
                        </td>

                        <td className="p-4 align-top text-right whitespace-nowrap">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => saveOrderUpdate(order.id)}
                                className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold"
                                title="Save changes"
                              >
                                <Save className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingOrderId(null)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                                title="Cancel"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEditOrder(order)}
                              className="p-1.5 bg-[#1C263F] hover:bg-[#253354] text-slate-200 rounded text-xs flex items-center gap-1 ml-auto"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Update</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS CATALOG */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h2 className="font-display font-bold text-lg text-white">
              Cosmetics & V-Bucks Catalog ({products.length} Items)
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCatalog}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
              <button
                onClick={() => setShowAddProduct(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.slice(0, 36).map((prod) => (
              <div key={prod.id} className="p-3.5 rounded-xl bg-[#0D1222] border border-[#1E2940] flex gap-3 items-center justify-between">
                <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded object-cover bg-black shrink-0" />
                <div className="flex-1 min-w-0 pr-2">
                  <div className="text-[10px] text-purple-400 uppercase font-semibold">{prod.rarity} · {prod.cosmeticType}</div>
                  <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                  <div className="text-xs font-bold text-yellow-400 tabular-nums">${prod.price.toFixed(2)} USD</div>
                </div>
                <button
                  onClick={() => handleDeleteProduct(prod.id)}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                  title="Delete product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CATALOG IMPORT & EXPORT */}
      {activeTab === 'catalog-io' && (
        <div className="space-y-6 max-w-4xl">
          <div className="p-6 rounded-2xl bg-[#0D1222] border border-[#1E2940] space-y-4">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-cyan-400" />
              <span>Catalog Import & Export (JSON)</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export verified catalog data or batch-import hundreds of products using valid JSON format. All products persist to the server database.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleExportCatalog}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow"
              >
                <Download className="w-4 h-4" />
                <span>Download Current Catalog JSON ({products.length} items)</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Paste Catalog JSON to Import:
              </label>
              <textarea
                rows={8}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='[ { "id": "...", "name": "...", "category": "skins", "price": 15.00, ... } ]'
                className="w-full p-3 rounded-xl bg-black border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
              />

              {importMessage && (
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300">
                  {importMessage}
                </div>
              )}
              {importError && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-300">
                  {importError}
                </div>
              )}

              <button
                onClick={handleImportCatalog}
                disabled={!importJsonText.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow disabled:opacity-50"
              >
                Import & Replace Catalog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0D1222] border border-[#212E4A] rounded-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-white">Add New Cosmetic</h3>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Master Chief"
                  className="w-full px-3 py-2 rounded bg-black border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded bg-black border border-slate-700 text-xs text-white"
                  >
                    <option value="skins">Skins / Outfits</option>
                    <option value="pickaxes">Pickaxes</option>
                    <option value="gliders">Gliders</option>
                    <option value="emotes">Emotes</option>
                    <option value="backblings">Back Blings</option>
                    <option value="wraps">Wraps & Accessories</option>
                    <option value="bundles">Bundles</option>
                    <option value="gifts">Gifts</option>
                    <option value="vbucks">V-Bucks</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Price (USD)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-black border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProdIsGiftable}
                    onChange={(e) => setNewProdIsGiftable(e.target.checked)}
                    className="accent-purple-500"
                  />
                  <span>Giftable</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProdIsDaily}
                    onChange={(e) => setNewProdIsDaily(e.target.checked)}
                    className="accent-purple-500"
                  />
                  <span>Daily Item Shop Rotation</span>
                </label>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="px-4 py-2 bg-slate-800 text-xs text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-xs text-white font-bold rounded"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: ACCOUNTS MANAGEMENT */}
      {activeTab === 'accounts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0D1222] p-4 rounded-xl border border-[#1E2940]">
            <div>
              <h2 className="font-display font-bold text-lg text-white">
                Fortnite Account Listings ({accounts.length})
              </h2>
              <p className="text-xs text-slate-400">
                Manage genuine account inventories, real locker screenshots, and verified statistics.
              </p>
            </div>
            <button
              onClick={() => setShowAddAccount(true)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-lg shadow transition-all flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Account Listing</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map(acc => (
              <div key={acc.id} className="p-5 rounded-xl bg-[#0D1222] border border-[#1E2940] flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-mono text-cyan-400 font-bold text-xs">{acc.id}</span>
                      <h4 className="text-sm font-bold text-white mt-0.5 leading-snug">{acc.title}</h4>
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                      acc.status === 'Available'
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                        : acc.status === 'Awaiting Images'
                        ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}>
                      {acc.status}
                    </span>
                  </div>

                  {/* Screenshots preview strip */}
                  <div className="flex gap-2 my-2 overflow-x-auto pb-1">
                    {acc.screenshots.slice(0, 4).map((shot, sIdx) => (
                      <img
                        key={sIdx}
                        src={shot}
                        alt="Locker screenshot"
                        className="w-16 h-12 object-cover rounded border border-slate-700 bg-black shrink-0"
                      />
                    ))}
                    {acc.screenshots.length > 4 && (
                      <div className="w-16 h-12 rounded border border-slate-800 bg-black/60 flex items-center justify-center text-[10px] text-slate-400 shrink-0">
                        +{acc.screenshots.length - 4} more
                      </div>
                    )}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 text-[11px] bg-[#070A12] p-2.5 rounded-lg border border-slate-800/80 my-2">
                    <div>
                      <span className="text-slate-500 block">Level</span>
                      <strong className="text-white">{acc.accountLevel}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Outfits</span>
                      <strong className="text-yellow-400">{acc.totalOutfits}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">V-Bucks</span>
                      <strong className="text-cyan-400">{acc.totalVBucksBalance || 0} VB</strong>
                    </div>
                  </div>

                  {/* Featured items */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {acc.featuredCosmetics.map((c, cIdx) => (
                      <span key={cIdx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-base font-black text-cyan-400">
                    ${acc.price.toFixed(2)} USD
                  </div>
                  <button
                    onClick={() => handleDeleteAccount(acc.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded transition-colors text-xs flex items-center gap-1"
                    title="Delete Account"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: WALLETS & QR CODES MANAGEMENT */}
      {activeTab === 'wallets' && (
        <div className="space-y-6">
          <div className="bg-[#0D1222] p-6 rounded-xl border border-[#1E2940] space-y-2">
            <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-yellow-400" />
              <span>Official Crypto Wallets & QR Code Management</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Verify the receiving USDT addresses and the original QR code images. The system strictly serves the TRON QR for TRC20 and the Binance Smart Chain QR for BEP20 with zero cropping.
            </p>
          </div>

          {settingsSavedMsg && (
            <div className="p-3.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{settingsSavedMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* USDT TRC20 Card */}
              <div className="p-6 rounded-2xl bg-[#080B14] border border-[#1E2940] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <h3 className="font-display font-bold text-white text-base">USDT TRC20 (TRON)</h3>
                  </div>
                  <span className="text-[10px] font-mono text-red-400 bg-red-950/60 border border-red-800/60 px-2 py-0.5 rounded">
                    Active TRC20
                  </span>
                </div>

                {/* QR Preview Box */}
                <div className="flex flex-col items-center p-4 bg-[#0D1222] rounded-xl border border-[#1E2940]">
                  <div className="w-44 h-44 bg-white p-2.5 rounded-xl border-2 border-slate-700 flex items-center justify-center shadow-lg">
                    <img
                      src={editTrc20Qr}
                      alt="TRC20 QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-2 font-mono">
                    Original TRON Red Logo QR
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      TRC20 Receiving Address:
                    </label>
                    <input
                      type="text"
                      value={editTrc20Addr}
                      onChange={(e) => setEditTrc20Addr(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#070A12] border border-[#232F4A] font-mono text-xs text-cyan-300"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      QR Image Path / URL:
                    </label>
                    <input
                      type="text"
                      value={editTrc20Qr}
                      onChange={(e) => setEditTrc20Qr(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#070A12] border border-[#232F4A] font-mono text-xs text-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* USDT BEP20 Card */}
              <div className="p-6 rounded-2xl bg-[#080B14] border border-[#1E2940] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <h3 className="font-display font-bold text-white text-base">USDT BEP20 (BNB Chain)</h3>
                  </div>
                  <span className="text-[10px] font-mono text-yellow-400 bg-yellow-950/60 border border-yellow-800/60 px-2 py-0.5 rounded">
                    Active BEP20
                  </span>
                </div>

                {/* QR Preview Box */}
                <div className="flex flex-col items-center p-4 bg-[#0D1222] rounded-xl border border-[#1E2940]">
                  <div className="w-44 h-44 bg-white p-2.5 rounded-xl border-2 border-slate-700 flex items-center justify-center shadow-lg">
                    <img
                      src={editBep20Qr}
                      alt="BEP20 QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-2 font-mono">
                    Original Binance Cube Logo QR
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      BEP20 Receiving Address:
                    </label>
                    <input
                      type="text"
                      value={editBep20Addr}
                      onChange={(e) => setEditBep20Addr(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#070A12] border border-[#232F4A] font-mono text-xs text-cyan-300"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      QR Image Path / URL:
                    </label>
                    <input
                      type="text"
                      value={editBep20Qr}
                      onChange={(e) => setEditBep20Qr(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#070A12] border border-[#232F4A] font-mono text-xs text-slate-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Receiving Addresses & QR Settings</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: SUPPORT TICKETS */}
      {activeTab === 'support' && (
        <div className="space-y-4">
          <h2 className="font-display font-bold text-lg text-white">
            Customer Support Queue ({tickets.length})
          </h2>
          {tickets.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-[#0D1222] rounded-xl border border-[#1E2940]">
              No support tickets currently.
            </div>
          ) : (
            tickets.map(t => (
              <div key={t.id} className="p-4 rounded-xl bg-[#0D1222] border border-[#1E2940] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-purple-400 font-bold text-xs">{t.id}</span>
                  <span className="text-xs text-slate-400">{new Date(t.createdAt).toLocaleString()}</span>
                </div>
                <div className="text-xs text-slate-300">
                  <strong>{t.name}</strong> ({t.email}) {t.orderId && `· Order #${t.orderId}`}
                </div>
                <div className="text-xs font-bold text-white">{t.subject}</div>
                <p className="text-xs text-slate-400 bg-black/40 p-2.5 rounded font-mono">{t.message}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 6: SOURCE CODE EXPORT & HOSTING DEPLOYMENT */}
      {activeTab === 'export' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#0D1526] to-[#0A1020] border border-emerald-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
                <Download className="w-3.5 h-3.5" />
                <span>Production ZIP Archive Ready</span>
              </div>
              <h2 className="font-display font-black text-xl text-white">
                Download Complete Website Source Code
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Includes all frontend & backend source files, 105+ item master catalog, exact V-Bucks tiers, Express server, atomic JSON database, Tailwind styles, 7 high-res 3D assets, configuration files, and GoDaddy / Vercel deployment setups.
              </p>
            </div>
            <a
              href="/api/download-source-zip"
              download="fortnite-vbuck-store-source.zip"
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 group hover:scale-[1.02]"
            >
              <Download className="w-5 h-5 text-slate-950 group-hover:translate-y-0.5 transition-transform" />
              <span>Download Source Code (.ZIP)</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* GoDaddy Deployment Card */}
            <div className="p-5 rounded-xl bg-[#0D1222] border border-[#1E2940] space-y-3">
              <div className="w-9 h-9 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-black text-sm">
                GD
              </div>
              <h3 className="font-display font-bold text-white text-sm">
                Deploy to GoDaddy
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Use your custom domain registered on GoDaddy:
              </p>
              <ul className="text-[11px] text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong className="text-white">GoDaddy VPS:</strong> Upload source, run <code className="bg-black/40 px-1 py-0.5 rounded text-purple-300">npm install</code>, and start with PM2.</li>
                <li><strong className="text-white">cPanel:</strong> Use "Setup Node.js App" with startup file <code className="bg-black/40 px-1 py-0.5 rounded text-purple-300">server.ts</code>.</li>
                <li><strong className="text-white">DNS:</strong> Point A Record (@) to your hosting server IP.</li>
              </ul>
            </div>

            {/* Vercel 1-Click Card */}
            <div className="p-5 rounded-xl bg-[#0D1222] border border-[#1E2940] space-y-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-sm">
                ▲
              </div>
              <h3 className="font-display font-bold text-white text-sm">
                Deploy to Vercel
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deploy in seconds with pre-configured <code className="text-cyan-300 font-mono">vercel.json</code>:
              </p>
              <ul className="text-[11px] text-slate-300 space-y-1.5 list-disc list-inside">
                <li>Push source to GitHub.</li>
                <li>Import into Vercel dashboard.</li>
                <li>Auto-detects Vite: runs <code className="bg-black/40 px-1 py-0.5 rounded text-cyan-300">npm run build</code>.</li>
                <li>Add your GoDaddy domain in Vercel Domains.</li>
              </ul>
            </div>

            {/* Local / VPS Commands */}
            <div className="p-5 rounded-xl bg-[#0D1222] border border-[#1E2940] space-y-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black text-sm">
                ⚡
              </div>
              <h3 className="font-display font-bold text-white text-sm">
                Quick CLI Commands
              </h3>
              <div className="bg-[#070A12] p-3 rounded-lg border border-[#172033] font-mono text-[11px] text-slate-300 space-y-1">
                <div><span className="text-slate-500"># Install</span></div>
                <div className="text-emerald-400">npm install</div>
                <div className="pt-1"><span className="text-slate-500"># Dev mode</span></div>
                <div className="text-cyan-400">npm run dev</div>
                <div className="pt-1"><span className="text-slate-500"># Production</span></div>
                <div className="text-yellow-400">npm run build</div>
                <div className="text-purple-400">npm run start</div>
              </div>
            </div>
          </div>

          {/* Archive Verification & File Manifest */}
          <div className="p-5 rounded-xl bg-[#0D1222] border border-[#1E2940] space-y-3">
            <h3 className="font-display font-bold text-white text-sm flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Included Project Files & Archive Manifest</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-black/40 rounded border border-slate-800">
                <div className="text-slate-400 font-semibold">Frontend</div>
                <div className="text-white font-bold mt-1">17 Components + Types</div>
              </div>
              <div className="p-3 bg-black/40 rounded border border-slate-800">
                <div className="text-slate-400 font-semibold">Master Catalog</div>
                <div className="text-cyan-400 font-bold mt-1">105+ Verified Items</div>
              </div>
              <div className="p-3 bg-black/40 rounded border border-slate-800">
                <div className="text-slate-400 font-semibold">V-Bucks Store</div>
                <div className="text-yellow-400 font-bold mt-1">10 Tiered Packages</div>
              </div>
              <div className="p-3 bg-black/40 rounded border border-slate-800">
                <div className="text-slate-400 font-semibold">Backend DB</div>
                <div className="text-purple-400 font-bold mt-1">Express + Atomic JSON</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Proof Lightbox Modal */}
      {selectedProofImage && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedProofImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-[#0A0E1A] border border-[#212E4A] rounded-2xl p-4 flex flex-col items-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <ImageIcon className="w-4 h-4" />
                <span>Customer Payment Proof Screenshot</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProofImage(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-auto flex items-center justify-center bg-black/80 rounded-xl p-2 border border-slate-800">
              <img
                src={selectedProofImage}
                alt="Payment proof screenshot"
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
              />
            </div>

            <div className="w-full flex items-center justify-between pt-3 mt-2 text-xs text-slate-400">
              <span>Verify TxID on blockchain explorer before updating order to "Payment confirmed."</span>
              <button
                type="button"
                onClick={() => setSelectedProofImage(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {showAddAccount && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0D1222] border border-[#212E4A] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-cyan-400" />
                <span>Add Fortnite Account Listing</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddAccount(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAccount} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="text-xs text-slate-300 block mb-1 font-semibold">Account Title / Headline *</label>
                <input
                  type="text"
                  required
                  value={newAccTitle}
                  onChange={(e) => setNewAccTitle(e.target.value)}
                  placeholder="e.g. OG Renegade Raider + Black Knight (Full Access / PC & PSN)"
                  className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-semibold">Price (USD) *</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={newAccPrice}
                    onChange={(e) => setNewAccPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Original / Compare Price (USD)</label>
                  <input
                    type="number"
                    step="1"
                    value={newAccOriginalPrice}
                    onChange={(e) => setNewAccOriginalPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Level</label>
                  <input
                    type="number"
                    value={newAccLevel}
                    onChange={(e) => setNewAccLevel(e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-black border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Outfits</label>
                  <input
                    type="number"
                    value={newAccOutfits}
                    onChange={(e) => setNewAccOutfits(e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-black border border-slate-700 text-xs text-yellow-400 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Pickaxes</label>
                  <input
                    type="number"
                    value={newAccPickaxes}
                    onChange={(e) => setNewAccPickaxes(e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-black border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Gliders</label>
                  <input
                    type="number"
                    value={newAccGliders}
                    onChange={(e) => setNewAccGliders(e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-black border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">V-Bucks</label>
                  <input
                    type="number"
                    value={newAccVBucks}
                    onChange={(e) => setNewAccVBucks(e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-black border border-slate-700 text-xs text-cyan-400 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-semibold">Listing Status</label>
                <select
                  value={newAccStatus}
                  onChange={(e) => setNewAccStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
                >
                  <option value="Available">Available (Ready for purchase)</option>
                  <option value="Awaiting Images">Awaiting Images (Marked as awaiting admin screenshots)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-semibold">Featured Items / Outfits (comma separated)</label>
                <input
                  type="text"
                  value={newAccFeatured}
                  onChange={(e) => setNewAccFeatured(e.target.value)}
                  placeholder="e.g. Renegade Raider, Black Knight, Travis Scott, Leviathan Axe"
                  className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-semibold">
                  Real Locker Screenshots URLs (One per line)
                </label>
                <p className="text-[11px] text-slate-500 mb-1">
                  Enter valid image paths or URLs of genuine locker captures. If left empty, listing will be marked as "Awaiting Images".
                </p>
                <textarea
                  rows={3}
                  value={newAccScreenshots}
                  onChange={(e) => setNewAccScreenshots(e.target.value)}
                  placeholder="/src/assets/images/gaming_account_showcase_1793465508903.jpg&#10;https://..."
                  className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 font-mono text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-semibold">Description & Handover Details</label>
                <textarea
                  rows={2}
                  value={newAccDesc}
                  onChange={(e) => setNewAccDesc(e.target.value)}
                  placeholder="Full native email credentials provided immediately upon payment verification."
                  className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
                <span className="font-semibold text-slate-400">Linkable Platforms:</span>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" checked={newAccPC} onChange={(e) => setNewAccPC(e.target.checked)} className="accent-cyan-500" />
                  <span>PC</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" checked={newAccPSN} onChange={(e) => setNewAccPSN(e.target.checked)} className="accent-cyan-500" />
                  <span>PlayStation</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" checked={newAccXbox} onChange={(e) => setNewAccXbox(e.target.checked)} className="accent-cyan-500" />
                  <span>Xbox</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" checked={newAccSwitch} onChange={(e) => setNewAccSwitch(e.target.checked)} className="accent-cyan-500" />
                  <span>Switch</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddAccount(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs text-white font-bold rounded-lg shadow"
                >
                  Save Account Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
