import React, { useState } from 'react';
import { api } from '../services/api';
import { StoreSettings } from '../types';
import { 
  HelpCircle, 
  Send, 
  Check, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  MessageSquare, 
  Clock, 
  ShieldCheck,
  FileText
} from 'lucide-react';

interface SupportViewProps {
  initialOrderId?: string;
  settings?: StoreSettings;
  onOpenPolicy: (policy: 'refund' | 'terms' | 'privacy' | 'payment-guide') => void;
}

export const SupportView: React.FC<SupportViewProps> = ({
  initialOrderId,
  settings,
  onOpenPolicy
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState(initialOrderId || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How are V-Bucks packages delivered to my Fortnite account?',
      a: 'V-Bucks are fulfilled via authentic 16-digit digital redemption voucher codes delivered directly to your email address and Order Tracking screen, or through our automated friend-gifting bot system. Simply redeem your code at epicgames.com/redeem while logged into your Epic Games account. All platforms (PC, PS5/PS4, Xbox, Nintendo Switch, and Mobile) automatically synchronize their V-Bucks balances.'
    },
    {
      q: 'Do you ever need my Epic Games password or login credentials?',
      a: 'ABSOLUTELY NEVER. We will never ask for your Epic Games password, 2FA backup codes, or console logins. We only ask for your public Epic Games Display Name / Gamer Tag so our delivery system can verify your recipient account.'
    },
    {
      q: 'How do I pay using USDT (TRC20 vs. BEP20)?',
      a: 'We accept only Tether (USDT) on two verified blockchain networks: TRC20 (TRON) and BEP20 (BNB Smart Chain). When checking out, select the network that corresponds to your withdrawal wallet or exchange (e.g. Binance, OKX, Trust Wallet, MetaMask, TronLink). After sending the exact USDT amount to the official receiving address, copy your Transaction Hash (TxID) and submit it on your order page.'
    },
    {
      q: 'What happens if I send USDT on the wrong network?',
      a: 'Cryptocurrency transactions are permanent and irreversible. If you select TRC20 and send BEP20 tokens (or vice versa), the transaction cannot be retrieved automatically. Always double check your network before confirming any blockchain withdrawal.'
    },
    {
      q: 'How long does payment verification and order fulfillment take?',
      a: 'After you submit your Transaction Hash, our verification system and on-duty administrator inspect the on-chain transfer. Payment verification typically takes 5 to 20 minutes. Once marked "Payment confirmed", digital codes are dispatched instantly, while gift deliveries are processed within 15–30 minutes.'
    },
    {
      q: 'How are Full Access Gaming Accounts transferred?',
      a: 'Account listings are authenticated by our team. After payment verification, you receive complete ownership credentials for the native Outlook or Gmail address bound to the account. You can then change the password, enable your own 2FA, and link your preferred PlayStation, Xbox, or PC credentials.'
    },
    {
      q: 'What is your Refund & Cancellation Policy?',
      a: 'Due to the immutable nature of digital game codes and cryptocurrency transactions, orders cannot be cancelled once digital voucher codes are redeemed or account credentials transferred. However, if a code is verified as invalid before redemption or if delivery fails within 24 hours, a full USDT refund is issued to your designated wallet address.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSubmittedSuccess(null);

    try {
      const res = await api.submitSupportTicket({
        name: name.trim(),
        email: email.trim(),
        orderId: orderId.trim() || undefined,
        subject: subject.trim(),
        message: message.trim()
      });
      setSubmittedSuccess(`Support ticket #${res.ticket.id} submitted successfully! Our gaming specialists typically respond within 15–30 minutes.`);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const supportEmail = settings?.supportEmail || 'support@fortnitestore.gg';
  const supportDiscord = settings?.supportDiscord || 'discord.gg/fortnitestore';
  const supportHours = settings?.supportHours || '24/7 Dedicated Gaming Support · Average response time < 15 mins';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          Customer Service & Gaming Helpdesk
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-white">
          Support & Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-400">
          Have questions about your V-Bucks order, blockchain USDT verification, or account delivery? Our team is available 24/7.
        </p>
      </div>

      {/* Contact Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-[#0D1222] border border-[#1E2940] flex items-start gap-4">
          <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400 shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Email Support</div>
            <div className="text-sm font-bold text-white mt-1 break-all">{supportEmail}</div>
            <div className="text-[11px] text-slate-500 mt-1">Direct inquiries & corporate escalations</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1222] border border-[#1E2940] flex items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Discord Community</div>
            <div className="text-sm font-bold text-cyan-400 mt-1">{supportDiscord}</div>
            <div className="text-[11px] text-slate-500 mt-1">Live staff tickets & community vouching</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1222] border border-[#1E2940] flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Operating Hours</div>
            <div className="text-sm font-bold text-white mt-1">24 Hours / 7 Days</div>
            <div className="text-[11px] text-emerald-400 mt-1">{supportHours}</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Ticket Form & FAQs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Support Ticket Submission Form */}
        <div className="lg:col-span-6 rounded-2xl bg-[#0D1222] border border-[#212E4A] p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-purple-400" />
            <h2 className="font-display font-bold text-xl text-white">
              Open a Support Request
            </h2>
          </div>

          {submittedSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{submittedSuccess}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Smith"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#070A12] border border-[#232F4A] text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#070A12] border border-[#232F4A] text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Order ID (if inquiry relates to an existing purchase)
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. FS-849201"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#070A12] border border-[#232F4A] text-xs text-white focus:outline-none focus:border-purple-500 font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Subject <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Need assistance with V-Bucks code redemption"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#070A12] border border-[#232F4A] text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Detailed Message <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your question or issue in detail..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#070A12] border border-[#232F4A] text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Sending Request...' : 'Submit Support Ticket'}</span>
            </button>
          </form>
        </div>

        {/* FAQs Accordion */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-yellow-400" />
            <h2 className="font-display font-bold text-xl text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-[#0D1222] border border-[#1E2940] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-display font-semibold text-sm text-slate-200 hover:text-white flex items-center justify-between gap-3"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-purple-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Policy Triggers */}
          <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
            <button
              onClick={() => onOpenPolicy('refund')}
              className="p-3 rounded-lg bg-[#0D1222] border border-[#1E2940] text-slate-300 hover:text-white hover:border-purple-500/50 text-left transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Refund & Cancellation Policy</span>
            </button>

            <button
              onClick={() => onOpenPolicy('terms')}
              className="p-3 rounded-lg bg-[#0D1222] border border-[#1E2940] text-slate-300 hover:text-white hover:border-cyan-500/50 text-left transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Terms of Service & Rules</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
