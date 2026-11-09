import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { api } from '../services/api';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Package, 
  Coins, 
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface TrackOrderViewProps {
  initialOrderId?: string;
  onGoToPayment: (order: Order) => void;
  onContactSupport: (orderId?: string) => void;
}

export const TrackOrderView: React.FC<TrackOrderViewProps> = ({
  initialOrderId,
  onGoToPayment,
  onContactSupport
}) => {
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialOrderId) {
      lookupOrder(initialOrderId);
    }
  }, [initialOrderId]);

  const lookupOrder = async (idToLookUp: string) => {
    if (!idToLookUp.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.getOrder(idToLookUp.trim());
      setOrder(res.order);
    } catch (err: any) {
      setErrorMsg(err.message || 'Order not found. Please verify your Order ID format (e.g. FS-849201).');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    lookupOrder(orderIdInput);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Payment Confirmed':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/60';
      case 'Processing':
      case 'Awaiting Verification':
      case 'Payment Submitted':
        return 'text-amber-400 border-amber-500/40 bg-amber-950/60';
      case 'Payment Failed':
      case 'Cancelled':
        return 'text-red-400 border-red-500/40 bg-red-950/60';
      default:
        return 'text-slate-300 border-slate-700 bg-slate-900';
    }
  };

  // Progression steps calculation
  const getStepState = (stepIndex: number, currentStatus: string) => {
    const statuses = [
      'Order Created',
      'Awaiting Payment',
      'Payment Submitted',
      'Payment Confirmed',
      'Processing',
      'Completed'
    ];
    const currentIndex = statuses.indexOf(currentStatus);
    if (currentStatus === 'Payment Failed' || currentStatus === 'Cancelled') {
      return 'failed';
    }
    if (currentIndex >= stepIndex) return 'completed';
    if (currentIndex === stepIndex - 1) return 'current';
    return 'pending';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Title & Search bar */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="font-display text-3xl font-black text-white">
          Track Your Order
        </h1>
        <p className="text-sm text-slate-400">
          Enter your unique Order ID (e.g., <code className="text-purple-300 font-mono">FS-849201</code>) to view real-time blockchain payment verification and digital delivery updates.
        </p>

        <form onSubmit={handleSearch} className="pt-4 flex gap-2 max-w-md mx-auto">
          <input
            type="text"
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            placeholder="Enter Order ID (e.g. FS-849201)"
            className="flex-1 px-4 py-3 rounded-xl bg-[#0B0F1D] border border-[#232F4A] font-mono text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 uppercase"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50 shrink-0"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Track</span>
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Order Details Display */}
      {order && (
        <div className="mt-10 rounded-2xl bg-[#0D1222] border border-[#212E4A] p-6 sm:p-8 space-y-8 shadow-2xl animate-fadeIn">
          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E2943]">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Order Tracking Record
              </div>
              <h2 className="font-display text-2xl font-black text-white mt-0.5">
                {order.id}
              </h2>
              <div className="text-xs text-slate-400 mt-1">
                Placed on {new Date(order.createdAt).toLocaleString()} · Recipient: <span className="text-slate-300">{order.customerName}</span> ({order.customerEmailMasked || order.customerEmail})
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              <div className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wide flex items-center gap-2 ${getStatusColor(order.orderStatus)}`}>
                <span>{order.orderStatus}</span>
              </div>
              <div className="text-xs text-slate-400">
                Payment: <strong className="text-white">{order.paymentStatus}</strong>
              </div>
            </div>
          </div>

          {/* Fulfillment Status Banner */}
          {order.adminFulfillmentNotes && (
            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-600/40 space-y-1">
              <div className="text-xs font-bold text-purple-300 uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Official Delivery Update & Fulfillment Notes:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-mono">
                {order.adminFulfillmentNotes}
              </p>
            </div>
          )}

          {/* Stepper Status Progression */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Delivery Pipeline Progression
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                { title: 'Order Placed', desc: 'ID Generated', step: 0 },
                { title: 'USDT Sent', desc: order.txHash ? 'TxHash Logged' : 'Awaiting Hash', step: 2 },
                { title: 'Verified', desc: order.paymentStatus === 'Payment confirmed.' ? 'Blockchain Confirmed' : 'In Review', step: 3 },
                { title: 'Delivered', desc: order.orderStatus === 'Completed' ? 'Synced to Locker' : 'Queued', step: 5 }
              ].map((s, idx) => {
                const state = getStepState(s.step, order.orderStatus);
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      state === 'completed'
                        ? 'bg-[#10192E] border-emerald-500/40 text-emerald-300'
                        : state === 'current'
                        ? 'bg-[#151E36] border-purple-500/60 text-purple-200 ring-1 ring-purple-500/40'
                        : 'bg-[#090D17] border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Step 0{idx + 1}
                    </div>
                    <div className="text-xs font-bold mt-1 text-white">
                      {s.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {s.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment & Blockchain Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#090D17] border border-[#172033] space-y-2 text-xs">
              <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                Cryptocurrency Settlement Details
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Selected Network:</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {order.selectedNetwork === 'USDT_TRC20' ? 'USDT TRC20 (TRON)' : 'USDT BEP20 (BNB Chain)'}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Amount:</span>
                <span className="font-bold text-yellow-400 tabular-nums">
                  {order.totalAmount.toFixed(2)} USDT (${order.totalAmount.toFixed(2)} USD)
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 block text-[10px]">Receiving Wallet Address:</span>
                <span className="font-mono text-[11px] text-slate-300 break-all select-all">
                  {order.receivingAddress}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#090D17] border border-[#172033] space-y-2 text-xs">
              <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                Transaction Verification Status
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Customer Submitted TxHash:</span>
                {order.txHash ? (
                  <div className="font-mono text-[11px] text-purple-300 break-all select-all mt-0.5">
                    {order.txHash}
                  </div>
                ) : (
                  <div className="text-amber-400 font-medium mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>No transaction hash submitted yet.</span>
                  </div>
                )}
              </div>

              {order.txSubmittedAt && (
                <div className="text-[11px] text-slate-400">
                  Submitted: {new Date(order.txSubmittedAt).toLocaleString()}
                </div>
              )}

              {/* Action if awaiting payment */}
              {order.paymentStatus === 'Awaiting payment' && (
                <div className="pt-2">
                  <button
                    onClick={() => onGoToPayment(order)}
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Complete USDT Transfer / Submit TxID</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Purchased Package & Cosmetics Breakdown
            </div>
            <div className="divide-y divide-slate-800/80 rounded-xl bg-[#090D17] border border-[#172033] p-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-11 h-11 rounded-lg object-cover bg-black" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.name}</h4>
                      <p className="text-slate-400 text-[11px]">
                        Quantity: {item.quantity} · {item.deliveryMethod || 'Epic locker gift delivery'}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-yellow-400 tabular-nums text-sm">
                    ${(item.price * item.quantity).toFixed(2)} USD
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Need Assistance */}
          <div className="pt-4 border-t border-[#1E2943] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <span>Have questions or need manual priority expedite?</span>
            <button
              onClick={() => onContactSupport(order.id)}
              className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline"
            >
              Contact Support for Order #{order.id} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
