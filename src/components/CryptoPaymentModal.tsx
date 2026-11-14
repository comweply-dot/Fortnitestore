import React, { useState, useEffect } from 'react';
import { Copy, Check, QrCode, ShieldCheck, X, AlertTriangle, Loader2, ExternalLink } from 'lucide-react';
import { CartItem, Order } from '../types';
import { api } from '../services/api';

const OFFICIAL_WALLET_ADDRESSES = {
  TRC20: 'THDha3vFBE4Lov5McPep6czmtqPsoLuAk5',
  BEP20: '0x70685190F17B71dFB0DACb802751dEA2dBd5fAFA'
};

const OFFICIAL_QR_IMAGES = {
  TRC20: '/assets/qr/usdt_trc20_qr.jpg',
  BEP20: '/assets/qr/usdt_bep20_qr.jpg'
};

export interface CryptoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemTitle?: string;
  amount: number;
  bep20Address?: string;
  trc20Address?: string;
  bep20QrImage?: string;
  trc20QrImage?: string;
  orderItem?: CartItem;
  onOrderSubmitted?: (order: Order) => void;
  onTrackOrder?: (orderId: string) => void;
}

export const CryptoPaymentModal: React.FC<CryptoPaymentModalProps> = ({
  isOpen,
  onClose,
  itemTitle,
  amount,
  bep20Address,
  trc20Address,
  bep20QrImage,
  trc20QrImage,
  orderItem,
  onOrderSubmitted,
  onTrackOrder
}) => {
  const [network, setNetwork] = useState<'TRC20' | 'BEP20'>('TRC20');
  const [copied, setCopied] = useState(false);
  const [txId, setTxId] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [epicId, setEpicId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCopied(false);
      setTxId('');
      setErrorMsg(null);
      setSubmittedOrder(null);
    }
  }, [isOpen, itemTitle, amount]);

  if (!isOpen) return null;

  const resolvedTrc20 = trc20Address?.trim() || OFFICIAL_WALLET_ADDRESSES.TRC20;
  const resolvedBep20 = bep20Address?.trim() || OFFICIAL_WALLET_ADDRESSES.BEP20;

  const activeAddress = network === 'BEP20' ? resolvedBep20 : resolvedTrc20;

  // Use the verified local QR image when address matches the official wallet; otherwise generate exact QR for custom admin wallet
  const qrImageUrl =
    network === 'BEP20'
      ? resolvedBep20 === OFFICIAL_WALLET_ADDRESSES.BEP20
        ? bep20QrImage || OFFICIAL_QR_IMAGES.BEP20
        : `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(activeAddress)}`
      : resolvedTrc20 === OFFICIAL_WALLET_ADDRESSES.TRC20
      ? trc20QrImage || OFFICIAL_QR_IMAGES.TRC20
      : `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(activeAddress)}`;

  const fallbackQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(activeAddress)}`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(activeAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVerifyOrder = async () => {
    setErrorMsg(null);
    const trimmedTx = txId.trim();
    if (!trimmedTx || trimmedTx.length < 16) {
      setErrorMsg('Please paste a valid Transaction ID (TxHash, minimum 16 characters) after completing the payment.');
      return;
    }

    const emailToUse = customerEmail.trim();
    if (emailToUse && (!emailToUse.includes('@') || !emailToUse.includes('.'))) {
      setErrorMsg('Please enter a valid delivery email address or leave blank if paying directly.');
      return;
    }

    const selectedNetCode = network === 'BEP20' ? 'USDT_BEP20' : 'USDT_TRC20';

    if (!orderItem) {
      setSubmittedOrder({
        id: `VBS-${Math.random().toString(16).slice(2, 8).toUpperCase()}`,
        lookupToken: '',
        customerName: 'Direct Crypto Buyer',
        customerEmail: emailToUse || 'customer@fortnitestore.local',
        epicId: epicId.trim() || 'DirectCheckout',
        platform: 'PC',
        items: [],
        totalAmount: Number(amount),
        currency: 'USD',
        selectedNetwork: selectedNetCode,
        receivingAddress: activeAddress,
        paymentStatus: 'Payment submitted — awaiting verification.',
        orderStatus: 'Awaiting Verification',
        txHash: trimmedTx,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const productId =
        orderItem.isAccount && orderItem.account
          ? orderItem.account.id
          : orderItem.product.id;

      const created = await api.createOrder({
        customerName: epicId.trim() || 'Direct Buyer',
        customerEmail: emailToUse || 'buyer@fortnitestore.local',
        epicId: epicId.trim() || 'PendingDeliveryID',
        platform: 'PC',
        items: [
          {
            productId,
            quantity: orderItem.quantity
          }
        ],
        selectedNetwork: selectedNetCode
      });

      const submitted = await api.submitPayment(created.order.id, trimmedTx, selectedNetCode);
      setSubmittedOrder(submitted.order);
      onOrderSubmitted?.(submitted.order);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to submit payment verification. Please verify your TxHash and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedAmount = Number(amount || 0).toFixed(2);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-md p-6 relative shadow-2xl text-white my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close crypto checkout"
          className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-red-500 rounded-xl text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400 uppercase mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>USDT Crypto Checkout</span>
        </div>
        <h3 className="font-display text-xl font-black text-white pr-8">
          {itemTitle || 'Fortnite Order'}
        </h3>
        <p className="text-sm text-slate-400 mt-0.5">
          Amount to Pay:{' '}
          <span className="text-emerald-400 font-extrabold text-base tabular-nums">
            ${formattedAmount} USDT
          </span>
        </p>

        {submittedOrder ? (
          <div className="mt-5 p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-display text-base font-black text-white">
                Your payment has been submitted for verification.
              </h4>
              <p className="text-xs text-slate-300 mt-1.5">
                Order ID:{' '}
                <strong className="text-cyan-300 font-mono">{submittedOrder.id}</strong> &bull; Network:{' '}
                <strong className="text-white">{network}</strong>
              </p>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Your credentials / V-Bucks / cosmetics will be delivered shortly once blockchain confirmations complete.
              </p>
            </div>
            <div className="flex gap-2.5 pt-1">
              {onTrackOrder && (
                <button
                  onClick={() => {
                    onClose();
                    onTrackOrder(submittedOrder.id);
                  }}
                  className="flex-1 py-2.5 px-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Track Order</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Network Selector Tabs: TRC20 vs BEP20 */}
            <div className="grid grid-cols-2 gap-2 mt-5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
              {(['TRC20', 'BEP20'] as const).map((net) => (
                <button
                  key={net}
                  type="button"
                  onClick={() => {
                    setNetwork(net);
                    setCopied(false);
                  }}
                  className={`py-2.5 rounded-lg text-xs font-black tracking-wider transition cursor-pointer ${
                    network === net
                      ? 'bg-sky-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  USDT ({net})
                </button>
              ))}
            </div>

            {/* Live Scannable QR Code Display */}
            <div className="mt-4 flex flex-col items-center bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <div className="bg-white p-2.5 rounded-xl shadow-lg">
                <img
                  src={qrImageUrl}
                  alt={`${network} QR Code`}
                  className="w-44 h-44 object-contain"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (img.src !== fallbackQrUrl) img.src = fallbackQrUrl;
                  }}
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-2.5 flex items-center gap-1 text-center">
                <QrCode className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Scan with Binance, Trust Wallet, or Bybit ({network})</span>
              </span>
            </div>

            {/* Wallet Address + Copy Button */}
            <div className="mt-4">
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">
                {network} Wallet Address
              </label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-xl p-2.5">
                <input
                  type="text"
                  readOnly
                  value={activeAddress}
                  className="w-full bg-transparent text-xs font-mono text-sky-300 focus:outline-none select-all"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 transition cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Delivery Info + Transaction Hash Input */}
            <div className="mt-3.5 space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="email"
                  placeholder="Delivery Email (optional)"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
                <input
                  type="text"
                  placeholder="Epic Games ID (optional)"
                  value={epicId}
                  onChange={(e) => setEpicId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <input
                type="text"
                placeholder="Paste Transaction ID / TxHash after paying..."
                value={txId}
                onChange={(e) => {
                  setTxId(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {errorMsg && (
              <div className="mt-3 p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleVerifyOrder}
              disabled={isSubmitting}
              className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-black text-sm py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>SUBMITTING VERIFICATION...</span>
                </>
              ) : (
                <span>I HAVE PAID &bull; VERIFY ORDER</span>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CryptoPaymentModal;
