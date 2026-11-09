import React, { useState, useRef } from 'react';
import { Order } from '../types';
import { api } from '../services/api';
import { 
  Copy, 
  Check, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  RefreshCw,
  Send,
  Loader2,
  Info,
  Maximize2,
  X,
  Upload,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';

interface PaymentViewProps {
  order: Order;
  onOrderUpdated: (updatedOrder: Order) => void;
  onNavigateHome: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const PaymentView: React.FC<PaymentViewProps> = ({
  order,
  onOrderUpdated,
  onNavigateHome,
  onTrackOrder
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState<'USDT_TRC20' | 'USDT_BEP20'>(
    order.selectedNetwork === 'USDT_BEP20' ? 'USDT_BEP20' : 'USDT_TRC20'
  );
  const [txHashInput, setTxHashInput] = useState(order.txHash || '');
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string | null>(order.paymentScreenshot || null);
  const [screenshotFileName, setScreenshotFileName] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [isSubmittingTx, setIsSubmittingTx] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);
  const [submitErrorMsg, setSubmitErrorMsg] = useState<string | null>(null);
  const [isQrZoomOpen, setIsQrZoomOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Exact Addresses as strictly mandated by prompt
  const TRC20_ADDRESS = "THDha3vFBE4Lov5McPep6czmtqPsoLuAk5";
  const BEP20_ADDRESS = "0x70685190F17B71dFB0DACb802751dEA2dBd5fAFA";

  // Official Authentic QR images uploaded by user (TRON & Binance)
  const TRC20_QR_IMAGE = "/assets/qr/usdt_trc20_qr.jpg";
  const BEP20_QR_IMAGE = "/assets/qr/usdt_bep20_qr.jpg";

  const currentAddress = selectedNetwork === 'USDT_TRC20' ? TRC20_ADDRESS : BEP20_ADDRESS;
  const currentQrImage = selectedNetwork === 'USDT_TRC20' ? TRC20_QR_IMAGE : BEP20_QR_IMAGE;
  const networkDisplayName = selectedNetwork === 'USDT_TRC20' ? 'USDT TRC20 (TRON Network)' : 'USDT BEP20 (BNB Smart Chain)';

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setSubmitErrorMsg('Payment screenshot size must be under 8MB.');
        return;
      }
      setScreenshotFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveScreenshot = () => {
    setScreenshotDataUrl(null);
    setScreenshotFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopy = (text: string, type: 'address' | 'amount') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === 'address') {
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2500);
      } else {
        setCopiedAmount(true);
        setTimeout(() => setCopiedAmount(false), 2500);
      }
    }
  };

  const handleTxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txHashInput.trim() || txHashInput.trim().length < 16) {
      setSubmitErrorMsg('Please enter a valid Transaction Hash / TxID (minimum 16 characters).');
      return;
    }

    setIsSubmittingTx(true);
    setSubmitErrorMsg(null);
    setSubmitSuccessMsg(null);

    try {
      const res = await api.submitPayment(order.id, txHashInput.trim(), selectedNetwork, screenshotDataUrl || undefined);
      onOrderUpdated(res.order);
      setSubmitSuccessMsg('Your payment has been submitted for verification.');
    } catch (err: any) {
      setSubmitErrorMsg(err.message || 'Failed to submit transaction hash. Please try again.');
    } finally {
      setIsSubmittingTx(false);
    }
  };

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.getOrder(order.id);
      onOrderUpdated(res.order);
    } catch (err) {
      console.error('Refresh error', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Status Styling according to exact specifications
  const getStatusBadge = () => {
    switch (order.paymentStatus) {
      case 'Payment confirmed.':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm font-bold">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Payment confirmed.</span>
          </div>
        );
      case 'Payment submitted — awaiting verification.':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300 text-sm font-bold">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Payment submitted — awaiting verification.</span>
          </div>
        );
      case 'Payment failed — please contact support.':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 text-sm font-bold">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>Payment failed — please contact support.</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-sm font-bold">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Awaiting payment</span>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E2943]">
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Order Confirmation & Settlement
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white mt-0.5">
            Order #{order.id}
          </h1>
          <div className="text-xs text-slate-400 mt-1">
            Recipient: <span className="text-slate-200 font-medium">{order.customerName}</span> · Epic ID: <span className="text-purple-300 font-mono font-bold">{order.epicId}</span> ({order.platform})
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-2">
          {getStatusBadge()}
          <button
            onClick={handleRefreshStatus}
            disabled={isRefreshing}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </button>
        </div>
      </div>

      {/* Main Payment Card */}
      <div className="mt-8 rounded-2xl bg-[#0D1222] border border-[#212E4A] p-6 sm:p-8 space-y-8 shadow-2xl">
        {/* Network Selector Tabs */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Step 1: Choose Your USDT Network (TRC20 or BEP20)
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* TRC20 Option */}
            <button
              type="button"
              onClick={() => setSelectedNetwork('USDT_TRC20')}
              className={`p-4 rounded-xl border text-left transition-all relative ${
                selectedNetwork === 'USDT_TRC20'
                  ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-950/40 ring-1 ring-purple-500'
                  : 'bg-[#080B14] border-[#1E2940] hover:border-slate-700 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-display font-bold text-base text-white">
                  USDT TRC20
                </span>
                <span className="text-xs font-mono text-purple-300 bg-purple-900/60 px-2 py-0.5 rounded">
                  TRON
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Recommended for TronLink, OKX, Bybit, Binance TRON withdrawals.
              </p>
              {selectedNetwork === 'USDT_TRC20' && (
                <div className="mt-2 text-xs font-semibold text-purple-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Network Selected</span>
                </div>
              )}
            </button>

            {/* BEP20 Option */}
            <button
              type="button"
              onClick={() => setSelectedNetwork('USDT_BEP20')}
              className={`p-4 rounded-xl border text-left transition-all relative ${
                selectedNetwork === 'USDT_BEP20'
                  ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-950/40 ring-1 ring-blue-500'
                  : 'bg-[#080B14] border-[#1E2940] hover:border-slate-700 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-display font-bold text-base text-white">
                  USDT BEP20
                </span>
                <span className="text-xs font-mono text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded">
                  BNB SMART CHAIN
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Recommended for MetaMask, Trust Wallet, Binance BSC withdrawals.
              </p>
              {selectedNetwork === 'USDT_BEP20' && (
                <div className="mt-2 text-xs font-semibold text-blue-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Network Selected</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* CRITICAL Cross-Chain Warning Notice */}
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/50 flex items-start gap-3.5 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-300 block">
              CRITICAL NETWORK NOTICE — DO NOT MIX TRC20 AND BEP20:
            </span>
            <p className="text-amber-200/90 leading-relaxed">
              You must send USDT strictly using the <strong className="text-white underline">{networkDisplayName}</strong>. TRC20 and BEP20 are completely separate blockchains with incompatible protocols. Sending tokens on the wrong network or sending non-USDT coins will cause permanent loss of funds.
            </p>
          </div>
        </div>

        {/* Step 2: Payment Details with Authentic QR & Address */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Step 2: Scan Official QR or Transfer Exact USDT
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Authentic QR Card */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-[#080B14] border border-[#1E2940] flex flex-col items-center justify-between text-center relative">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {selectedNetwork === 'USDT_TRC20' ? 'TRC20 (TRON)' : 'BEP20 (BNB)'} QR Code
                </span>
                <button
                  type="button"
                  onClick={() => setIsQrZoomOpen(true)}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                  title="Click to enlarge QR code in full screen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Enlarge QR</span>
                </button>
              </div>

              {/* QR Image Container: 100% visible, centered, object-fit: contain, never cropped */}
              <div 
                onClick={() => setIsQrZoomOpen(true)}
                className="w-full max-w-[210px] aspect-square rounded-xl bg-white p-2.5 shadow-xl border-2 border-slate-700/60 hover:border-cyan-500 cursor-pointer transition-all duration-200 relative group/qr flex items-center justify-center my-1"
              >
                <img
                  src={currentQrImage}
                  alt={`Official ${networkDisplayName} QR Code`}
                  className="w-full h-full object-contain"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/qr:opacity-100 rounded-lg flex flex-col items-center justify-center text-white text-xs font-bold transition-opacity backdrop-blur-[1px]">
                  <Maximize2 className="w-6 h-6 mb-1 text-cyan-400" />
                  <span>Click to Enlarge</span>
                </div>
              </div>

              <div className="mt-2 text-[11px] text-slate-400">
                Scan directly with your crypto wallet (Binance, Trust Wallet, OKX, TronLink).
              </div>
            </div>

            {/* Exact Amount & Address Column */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-4">
              {/* Exact Amount Card */}
              <div className="p-4 rounded-xl bg-[#080B14] border border-[#1E2940] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-400 block">Exact Total to Send</span>
                  <div className="text-2xl sm:text-3xl font-black text-yellow-400 tabular-nums">
                    {order.totalAmount.toFixed(2)} USDT
                  </div>
                  <div className="text-xs text-slate-400">
                    Equivalent to ${order.totalAmount.toFixed(2)} USD
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(order.totalAmount.toFixed(2), 'amount')}
                  className="py-2 px-4 bg-[#172036] hover:bg-[#202D4C] text-xs font-semibold text-slate-200 hover:text-white rounded-lg border border-[#273556] transition-colors flex items-center gap-1.5 shrink-0"
                >
                  {copiedAmount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAmount ? 'Copied Amount' : 'Copy Amount'}</span>
                </button>
              </div>

              {/* Receiving Address Card */}
              <div className="p-4 rounded-xl bg-[#080B14] border border-[#1E2940] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">
                    Receiving Wallet Address ({selectedNetwork === 'USDT_TRC20' ? 'TRC20 - TRON' : 'BEP20 - BNB Chain'}):
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                    Verified Receiving Wallet
                  </span>
                </div>

                <div className="p-3 bg-black/60 rounded-lg border border-slate-800 font-mono text-xs sm:text-sm text-cyan-300 break-all select-all font-semibold leading-relaxed">
                  {currentAddress}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                  <span className="text-[11px] text-slate-400">
                    Send only <strong className="text-white">USDT</strong> on the matching chain.
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(currentAddress, 'address')}
                    className="w-full sm:w-auto py-2 px-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-lg shadow transition-all flex items-center justify-center gap-1.5 shrink-0"
                  >
                    {copiedAddress ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedAddress ? 'Address Copied!' : 'Copy Receiving Address'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Submit Transaction Hash & Payment Screenshot */}
        <div className="pt-4 border-t border-[#1E2943] space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Step 3: Submit Transaction Hash (TxID) & Payment Proof
            </div>
            {order.txHash && (
              <span className="text-xs font-mono text-purple-300">
                Hash registered
              </span>
            )}
          </div>

          <form onSubmit={handleTxSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1 font-semibold">
                1. Transaction Hash / TxID (Required):
              </label>
              <input
                type="text"
                value={txHashInput}
                onChange={(e) => setTxHashInput(e.target.value)}
                placeholder={
                  selectedNetwork === 'USDT_TRC20'
                    ? "e.g. 5f9e8a7... (64 hex characters from TRON)"
                    : "e.g. 0x8a7f9b... (66 characters starting with 0x on BSC)"
                }
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#070A12] border border-[#232F4A] font-mono text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Payment Screenshot Upload */}
            <div>
              <label className="block text-xs text-slate-300 mb-1 font-semibold">
                2. Upload Transfer Screenshot / Payment Proof (Recommended):
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleScreenshotChange}
                className="hidden"
                id="payment-screenshot-input"
              />

              {screenshotDataUrl ? (
                <div className="p-3 rounded-xl bg-[#070A12] border border-[#232F4A] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={screenshotDataUrl}
                      alt="Payment screenshot preview"
                      className="w-14 h-14 object-cover rounded-lg border border-slate-700 bg-black shrink-0"
                    />
                    <div className="text-xs text-slate-300 truncate">
                      <div className="font-semibold text-white truncate">
                        {screenshotFileName || 'payment_proof_screenshot.jpg'}
                      </div>
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                        <Check className="w-3 h-3" />
                        <span>Screenshot attached for admin review</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveScreenshot}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors shrink-0"
                    title="Remove screenshot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="payment-screenshot-input"
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-[#232F4A] hover:border-purple-500/80 bg-[#070A12]/50 hover:bg-[#070A12] cursor-pointer transition-all text-center group"
                >
                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-purple-400 mb-1.5 transition-colors" />
                  <span className="text-xs font-semibold text-slate-300 group-hover:text-white">
                    Click to select payment receipt screenshot
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    PNG, JPG, or WEBP up to 8MB
                  </span>
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmittingTx}
              className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-purple-950/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmittingTx ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Submit Payment Verification</span>
            </button>

            {submitSuccessMsg && (
              <div className="p-3.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{submitSuccessMsg}</span>
              </div>
            )}

            {submitErrorMsg && (
              <div className="p-3.5 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{submitErrorMsg}</span>
              </div>
            )}
          </form>

          {/* Verification Protocol Notice */}
          <div className="p-4 rounded-xl bg-[#090D18] border border-[#172033] text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Verification Policy & Timeline:</span>
            </div>
            <p className="leading-relaxed">
              Submitting your transaction hash alerts our verification team to inspect the on-chain transfer. Payment verification typically requires 5–30 minutes depending on blockchain block confirmations. You do not need to stay on this screen—your order status can be checked anytime on the Track Order page using your Order ID <strong className="text-white font-mono">{order.id}</strong>.
            </p>
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="pt-4 border-t border-[#1E2943]">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Ordered Items Breakdown
          </div>
          <div className="divide-y divide-slate-800/80">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <img src={item.image} alt={item.name} className="w-9 h-9 rounded object-cover bg-black" />
                  <div>
                    <span className="font-semibold text-white">{item.name}</span>
                    <span className="text-slate-400 ml-2">x{item.quantity}</span>
                  </div>
                </div>
                <span className="font-bold text-yellow-400 tabular-nums">
                  ${(item.price * item.quantity).toFixed(2)} USD
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation Actions */}
        <div className="pt-4 border-t border-[#1E2943] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onNavigateHome}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Return to Storefront
          </button>

          <button
            onClick={() => onTrackOrder(order.id)}
            className="px-4 py-2 bg-[#172036] hover:bg-[#202D4C] text-slate-200 hover:text-white text-xs font-semibold rounded-lg border border-[#273556] transition-colors flex items-center gap-1.5"
          >
            <span>Open Dedicated Order Tracking</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Full-Screen QR Zoom Lightbox Modal */}
      {isQrZoomOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsQrZoomOpen(false)}
        >
          <div 
            className="relative max-w-sm w-full bg-[#0D1222] border border-[#232F4A] rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsQrZoomOpen(false)}
              className="absolute top-3.5 right-3.5 p-2 text-slate-400 hover:text-white bg-black/50 hover:bg-black rounded-full transition-colors"
              aria-label="Close QR zoom"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="font-display font-bold text-white text-base">
                {networkDisplayName}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Scan with any crypto wallet camera
              </div>
            </div>

            {/* Large centered QR */}
            <div className="w-full max-w-[280px] aspect-square rounded-2xl bg-white p-3 shadow-2xl border-4 border-slate-700 flex items-center justify-center">
              <img
                src={currentQrImage}
                alt={`Full screen ${networkDisplayName} QR Code`}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="w-full p-2.5 bg-black/70 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-300 break-all select-all font-semibold">
              {currentAddress}
            </div>

            <button
              type="button"
              onClick={() => handleCopy(currentAddress, 'address')}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow"
            >
              {copiedAddress ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copiedAddress ? 'Address Copied!' : 'Copy Receiving Address'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
