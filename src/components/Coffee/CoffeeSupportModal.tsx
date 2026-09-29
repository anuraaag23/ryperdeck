import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  ShieldCheck,
  Star,
  Check,
  ArrowLeft,
  AlertCircle,
  RefreshCcw,
  CheckCircle2,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  RAZORPAY_CONFIG,
  addSupporter,
  getStoredCoffeeStats,
  CoffeeStats
} from '../../config/razorpay';
import { submitSupporter } from '../../lib/supabase';

interface CoffeeSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAmount?: number;
}

export const CoffeeSupportModal: React.FC<CoffeeSupportModalProps> = ({
  isOpen,
  onClose,
  defaultAmount = 100,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(defaultAmount);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [supporterName, setSupporterName] = useState<string>('');
  const [supporterMessage, setSupporterMessage] = useState<string>('');
  const [starRating, setStarRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [poppedStar, setPoppedStar] = useState<number>(0);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('ryperdeck_coffee_modal_state', { detail: { open: isOpen } })
    );
  }, [isOpen]);
  const [stats, setStats] = useState<CoffeeStats>(getStoredCoffeeStats());

  // Payment states: 'details' | 'processing' | 'success' | 'failed'
  const [step, setStep] = useState<'details' | 'processing' | 'success' | 'failed'>('details');
  const [paymentError, setPaymentError] = useState<string>('');
  const [verifiedPaymentId, setVerifiedPaymentId] = useState<string>('');

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) setStats(e.detail);
    };
    window.addEventListener('ryperdeck_coffee_updated', handleUpdate);
    return () => window.removeEventListener('ryperdeck_coffee_updated', handleUpdate);
  }, []);

  // Listen to Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setPaymentError('');
      setVerifiedPaymentId('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount;
  const estimatedCups = Math.max(1, Math.round(currentAmount / 50));

  // Trigger real Razorpay payment
  const handlePay = () => {
    const finalAmount = currentAmount > 0 ? currentAmount : 100;
    const finalName = supporterName.trim() || 'Anonymous Supporter';

    setStep('processing');
    setPaymentError('');

    // Check if Razorpay Standard Checkout SDK is loaded
    const RazorpayClass = (window as any).Razorpay;

    // If Razorpay API Key ID is provided (from .env or config)
    if (RazorpayClass && RAZORPAY_CONFIG.keyId) {
      try {
        const options = {
          key: RAZORPAY_CONFIG.keyId,
          amount: finalAmount * 100, // paise (100 INR = 10000 paise)
          currency: 'INR',
          name: 'RyperDeck',
          description: `Buy Developer ${estimatedCups} Coffee${estimatedCups > 1 ? 's' : ''}`,
          image: '/logo.png',
          handler: function (response: any) {
            // ONLY FIRES IF PAYMENT ACTUALLY SUCCEEDED AT RAZORPAY!
            if (response && response.razorpay_payment_id) {
              const pid = response.razorpay_payment_id;
              setVerifiedPaymentId(pid);
              addSupporter(finalName, finalAmount, estimatedCups, starRating, supporterMessage, pid);
              submitSupporter({
                name: finalName,
                amount: finalAmount,
                cups: estimatedCups,
                rating: starRating,
                message: supporterMessage,
                paymentId: pid,
              });
              setStep('success');
              confetti({
                particleCount: 120,
                spread: 85,
                origin: { y: 0.6 },
                colors: ['#ffffff', '#f59e0b', '#38bdf8', '#34d399'],
              });
            } else {
              setPaymentError('Payment confirmation missing from gateway.');
              setStep('failed');
            }
          },
          modal: {
            ondismiss: function () {
              // User closed the popup without paying
              setPaymentError('Payment was cancelled or closed before completing.');
              setStep('failed');
            },
          },
          prefill: {
            name: finalName,
          },
          theme: {
            color: '#050508',
          },
        };

        const rzp = new RazorpayClass(options);

        rzp.on('payment.failed', function (response: any) {
          const desc = response.error?.description || response.error?.reason || 'Transaction failed. Please try again.';
          setPaymentError(desc);
          setStep('failed');
        });

        rzp.open();
        return;
      } catch (err: any) {
        console.error('Razorpay invocation failed:', err);
        setPaymentError(err?.message || 'Failed to open Razorpay gateway.');
        setStep('failed');
        return;
      }
    }

    // Fallback: If no Razorpay Key ID is configured yet
    // Direct link to official payment URL
    window.open(RAZORPAY_CONFIG.paymentUrl, '_blank', 'noopener,noreferrer');
    setPaymentError(
      'Razorpay direct popup requires VITE_RAZORPAY_KEY_ID in .env. A secure tab was opened at razorpay.me/@ryper.'
    );
    setStep('failed');
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[999999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-2xl animate-fadeIn cursor-default"
    >
      <div className="relative w-full max-w-lg rounded-t-[34px] sm:rounded-[34px] bg-[#0c0d14] border border-white/[0.15] p-6 sm:p-8 shadow-[0_40px_100px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.3)] max-h-[90vh] overflow-y-auto scrollbar-none">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.2] border border-white/[0.15] text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: Details & Amount Selection */}
        {step === 'details' && (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3.5 mb-2 pr-10">
              <div className="w-11 h-11 rounded-2xl liquid-glass-icon-pod text-xl text-white shadow-md">
                ☕
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                  Support the Developer
                </span>
                <h3 className="text-[22px] font-bold text-white tracking-tight leading-tight">
                  Buy a Coffee &amp; Review
                </h3>
              </div>
            </div>

            {/* Verified Razorpay Gateway Badge */}
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass-badge text-white/70">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Razorpay Verified:</span>
              <a
                href={RAZORPAY_CONFIG.paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-mono font-medium hover:underline inline-flex items-center gap-1"
              >
                {RAZORPAY_CONFIG.handle}
                <ExternalLink className="w-3 h-3 text-white/60" />
              </a>
            </div>

            {/* Step 1: Select Coffee Amount */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-white/80 mb-2">
                1. Select Contribution Amount
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2.5">
                {[
                  { amount: 50, cups: '1 Cup', label: '₹50' },
                  { amount: 100, cups: '2 Cups', label: '₹100' },
                  { amount: 250, cups: 'Snacks & Coffee', label: '₹250' },
                ].map((tier) => (
                  <button
                    key={tier.amount}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(tier.amount);
                      setCustomAmount('');
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedAmount === tier.amount && !customAmount
                        ? 'bg-white/20 border-white/60 text-white shadow-[0_0_20px_rgba(255,255,255,0.2),inset_0_1px_1px_rgba(255,255,255,0.4)]'
                        : 'bg-white/[0.025] border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="text-[14px] font-bold text-white">{tier.label}</div>
                    <div className="text-[10px] text-white/40">{tier.cups}</div>
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 font-mono text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="Or enter custom amount (e.g. 500, 1000)"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    if (e.target.value) setSelectedAmount(parseInt(e.target.value, 10) || 0);
                  }}
                  className="w-full h-11 pl-7 pr-3 rounded-2xl liquid-glass-input text-xs"
                />
              </div>
            </div>

            {/* Step 2: Rate the App (5 Stars) */}
            <div className="mb-4 p-3.5 rounded-2xl bg-white/[0.025] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-white/80">
                  2. Rate RyperDeck (5 Stars)
                </label>
                <span className="text-xs font-mono font-bold text-amber-300">
                  {starRating}.0 / 5.0
                </span>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      setStarRating(star);
                      setPoppedStar(star);
                      setTimeout(() => setPoppedStar(0), 400);
                    }}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 cursor-pointer"
                    aria-label={`${star} Stars`}
                  >
                    <Star
                      className={`w-6 h-6 transition-all duration-200 ${
                        (hoverRating || starRating) >= star
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]'
                          : 'text-white/20'
                      } ${poppedStar === star ? 'star-pop' : ''}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Your Name */}
            <div className="mb-3.5">
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                3. Your Name <span className="text-white/30 text-[10px] font-normal">(Shown on Leaderboard upon verified payment)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Rivera, DevKunal"
                value={supporterName}
                onChange={(e) => setSupporterName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-2xl liquid-glass-input text-xs"
              />
            </div>

            {/* Step 4: Optional Comment / Review */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                4. Write a Comment <span className="text-white/30 text-[10px] font-normal">(Optional review)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Share your experience or feedback..."
                value={supporterMessage}
                onChange={(e) => setSupporterMessage(e.target.value)}
                className="w-full p-3.5 rounded-2xl liquid-glass-input text-xs resize-none"
              />
            </div>

            {/* Action Row */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 h-12 rounded-full liquid-glass-btn-secondary text-white/70 hover:text-white font-medium text-[13px] flex items-center justify-center gap-1.5 cursor-pointer border border-white/10 hover:border-white/25"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handlePay}
                className="w-2/3 h-12 rounded-full liquid-glass-btn-primary bg-white text-black font-bold text-[13px] flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:bg-white/90"
              >
                <Lock className="w-3.5 h-3.5 text-black" />
                <span>Pay ₹{currentAmount || 100}</span>
              </button>
            </div>

            <div className="mt-3 text-center text-[10px] text-white/30">
              Verified through official Razorpay gateway • Reviews published only upon real successful payment
            </div>
          </div>
        )}

        {/* STEP: PROCESSING / WAITING */}
        {step === 'processing' && (
          <div className="py-12 text-center animate-fadeIn">
            <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin mx-auto mb-4" />
            <h3 className="text-[18px] font-bold text-white mb-2">Connecting to Razorpay...</h3>
            <p className="text-[12px] text-white/50 max-w-xs mx-auto">
              Please complete the transaction in the Razorpay window.
            </p>
          </div>
        )}

        {/* STEP: SUCCESSFUL PAYMENT WINDOW */}
        {step === 'success' && (
          <div className="text-center py-6 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 mb-1 block">
              Payment Verified ✓
            </span>

            <h3 className="text-[22px] font-bold text-white mb-2">
              Thank You for Supporting!
            </h3>

            <p className="text-[13px] text-white/60 max-w-sm mx-auto leading-relaxed mb-6 font-light">
              Your contribution of <strong className="text-cyan-300">₹{currentAmount || 100}</strong> ({estimatedCups} cups) has been verified. Your review with <strong className="text-amber-300">{starRating} Stars</strong> is now live on the Community Leaderboard!
            </p>

            {verifiedPaymentId && (
              <div className="mb-6 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] inline-block text-[11px] font-mono text-white/50">
                Razorpay ID: <span className="text-white/80">{verifiedPaymentId}</span>
              </div>
            )}

            <div>
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 rounded-full liquid-glass-btn-primary bg-white text-black font-bold text-xs cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                View on Leaderboard
              </button>
            </div>
          </div>
        )}

        {/* STEP: FAILED / CANCELLED PAYMENT WINDOW */}
        {step === 'failed' && (
          <div className="text-center py-6 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg">
              <AlertCircle className="w-8 h-8" />
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-wider text-red-400 mb-1 block">
              Payment Not Completed
            </span>

            <h3 className="text-[22px] font-bold text-white mb-2">
              Payment Cancelled or Failed
            </h3>

            <p className="text-[13px] text-white/60 max-w-sm mx-auto leading-relaxed mb-6 font-light">
              {paymentError || 'The transaction was not completed. No review or supporter entry has been added.'}
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-white/90 transition-all"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white/70 hover:text-white text-xs font-medium cursor-pointer transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
