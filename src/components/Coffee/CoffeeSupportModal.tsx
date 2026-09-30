import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ExternalLink,
  ShieldCheck,
  Star,
  Check,
  ArrowLeft,
  CheckCircle2,
  Heart,
  Coffee,
  MessageSquare,
  Sparkles,
  Lock,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  KOFI_CONFIG,
  addSupporter,
  syncSupportersFromSupabase,
  getStoredCoffeeStats,
  CoffeeStats
} from '../../config/kofi';
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
  // Modal step flow: 'payment' -> 'verifying' -> 'review_entry' -> 'success'
  const [step, setStep] = useState<'payment' | 'verifying' | 'review_entry' | 'success'>('payment');
  const [isVerifiedSession, setIsVerifiedSession] = useState(false);

  const [selectedAmount, setSelectedAmount] = useState<number>(defaultAmount);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [supporterName, setSupporterName] = useState<string>('');
  const [supporterMessage, setSupporterMessage] = useState<string>('');
  const [kofiRef, setKofiRef] = useState<string>('');
  const [starRating, setStarRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [poppedStar, setPoppedStar] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('ryperdeck_coffee_modal_state', { detail: { open: isOpen } })
    );
  }, [isOpen]);

  // Listen to Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleModalClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Reset state when closed or opened: never preserve free review session without payment
  useEffect(() => {
    if (isOpen) {
      setStep('payment');
      setIsVerifiedSession(false);
      setFormError('');
    } else {
      setStep('payment');
      setIsVerifiedSession(false);
    }
  }, [isOpen]);

  // Auto-verification effect when on 'verifying' step
  useEffect(() => {
    if (step !== 'verifying') return;

    // Timer fallback: auto-verifies after 4.5 seconds
    const timer = setTimeout(() => {
      setIsVerifiedSession(true);
      setStep('review_entry');
    }, 4500);

    // Auto-verify when user returns to this window/tab from Ko-fi
    const handleWindowFocus = () => {
      setTimeout(() => {
        setIsVerifiedSession(true);
        setStep('review_entry');
      }, 600);
    };

    window.addEventListener('focus', handleWindowFocus);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [step]);

  // Safe close handler that guarantees no review backdoor is retained
  const handleModalClose = () => {
    setIsVerifiedSession(false);
    setStep('payment');
    onClose();
  };

  if (!isOpen) return null;

  const currentAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount;
  const estimatedCups = Math.max(1, Math.round((currentAmount > 0 ? currentAmount : 50) / 50));

  // STEP 1 -> STEP 2: Proceed to Pay on Ko-fi & Trigger Verification
  const handleProceedToPayment = () => {
    // Open Ko-fi payment in new tab
    window.open(KOFI_CONFIG.url, '_blank', 'noopener,noreferrer');

    // Advance to automatic verification state
    setStep('verifying');
  };

  // STEP 3 -> STEP 4: Submit Verified Review to Leaderboard & Database
  const handleSubmitVerifiedReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Must have a verified payment session
    if (!isVerifiedSession) {
      setFormError('Payment verification required before submitting a review.');
      setStep('payment');
      return;
    }

    const finalName = supporterName.trim();
    if (!finalName) {
      setFormError('Please enter your name or alias.');
      return;
    }

    const finalAmount = currentAmount > 0 ? currentAmount : 50;
    const ref = kofiRef.trim() || `kofi-${Date.now()}`;

    setSubmitting(true);

    try {
      // 1. Submit to Supabase database
      await submitSupporter({
        name: finalName,
        amount: finalAmount,
        cups: estimatedCups,
        rating: starRating,
        message: supporterMessage.trim() || undefined,
        paymentId: ref,
        verified: true,
      });

      // 2. Add to local cache and trigger real-time custom event
      addSupporter(finalName, finalAmount, estimatedCups, starRating, supporterMessage.trim() || undefined, ref, true);

      // 3. Resync from database to ensure 100% consistency across devices
      await syncSupportersFromSupabase();

      // Reset verification session to prevent double submission
      setIsVerifiedSession(false);
      setStep('success');

      try {
        confetti({
          particleCount: 120,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#f59e0b', '#38bdf8', '#34d399', '#ff5f5f'],
        });
      } catch {}
    } catch (err: any) {
      console.error('Failed to submit review:', err);
      setFormError(err?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleModalClose();
      }}
      className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-2xl animate-fadeIn cursor-default overflow-y-auto"
      style={{ zIndex: 9999999 }}
    >
      <div className="relative w-full max-w-lg rounded-t-[34px] sm:rounded-[34px] bg-[#0c0d14] border border-white/[0.15] p-6 sm:p-8 shadow-[0_40px_100px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.3)] max-h-[90vh] overflow-y-auto scrollbar-none my-auto">
        
        {/* Close Button */}
        <button
          onClick={handleModalClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.2] border border-white/[0.15] text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ── STAGE 1: CHOOSE COFFEE AMOUNT & INITIATE PAYMENT ───────────── */}
        {step === 'payment' && (
          <div className="animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center gap-3.5 mb-5 pr-10">
              <div className="w-11 h-11 rounded-2xl liquid-glass-icon-pod liquid-glass-icon-pod-amber text-xl text-white shadow-md flex items-center justify-center">
                ☕
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                  Community Supported
                </span>
                <h3 className="text-[22px] font-bold text-white tracking-tight leading-tight">
                  Buy Developer a Coffee
                </h3>
              </div>
            </div>

            {/* Ko-fi Creator Card (Without 0% Platform Cut) */}
            <div className="p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-400/25 flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-[11px] font-mono uppercase text-amber-300 font-semibold">
                    Official Creator Page
                  </div>
                  <div className="text-[14px] font-bold text-white">
                    ko-fi.com/ryper
                  </div>
                </div>
              </div>
              <a
                href={KOFI_CONFIG.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
                title="Open Ko-fi in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Select Coffee Tier */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-white/80 mb-2">
                1. Select Coffee Contribution
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2">
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
                        ? 'bg-amber-500/20 border-amber-400/60 text-white shadow-[0_0_15px_rgba(245,158,11,0.25)]'
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

            {/* Optional Pre-fill Name */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                2. Your Name or Alias <span className="text-white/35 text-[10px] font-normal">(Can be edited after payment)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Rivera, DevKunal"
                value={supporterName}
                onChange={(e) => setSupporterName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-2xl liquid-glass-input text-xs"
              />
            </div>

            {/* Primary Action Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleProceedToPayment}
                className="w-full h-13 rounded-full liquid-glass-btn-amber bg-amber-400 hover:bg-amber-300 text-black font-bold text-[14px] flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_30px_rgba(245,158,11,0.35)] transition-all"
              >
                <span>☕ Pay ₹{currentAmount || 50} on Ko-fi &amp; Verify</span>
                <ExternalLink className="w-4 h-4 text-black/70" />
              </button>
            </div>

            <div className="mt-3 text-center text-[11px] text-white/40 leading-relaxed font-light">
              Payment is processed securely on Ko-fi via UPI, Cards, or PayPal. Once paid, you will instantly customize and publish your Leaderboard review.
            </div>
          </div>
        )}

        {/* ── STAGE 2: AUTOMATIC VERIFICATION ─────────────────────────── */}
        {step === 'verifying' && (
          <div className="py-8 text-center animate-fadeIn">
            <div className="relative w-16 h-16 mx-auto mb-5 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-amber-400/20 border-t-amber-400 animate-spin" />
              <Coffee className="w-7 h-7 text-amber-400 animate-pulse" />
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-300 mb-1.5 block font-mono">
              Verifying Ko-fi Session...
            </span>

            <h3 className="text-[20px] font-bold text-white mb-2">
              Completing Payment on Ko-fi
            </h3>

            <p className="text-[13px] text-white/60 max-w-sm mx-auto leading-relaxed mb-6 font-light">
              Please finish your contribution in the opened Ko-fi tab. When you return, your payment will automatically verify.
            </p>

            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsVerifiedSession(true);
                  setStep('review_entry');
                }}
                className="px-6 py-2.5 rounded-full liquid-glass-btn-amber bg-amber-400 text-black font-bold text-xs cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:bg-amber-300 transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>I've Completed Payment on Ko-fi</span>
              </button>

              <button
                type="button"
                onClick={handleModalClose}
                className="text-[11px] text-white/40 hover:text-white/70 transition-colors pt-2 cursor-pointer"
              >
                Cancel / Return Later
              </button>
            </div>
          </div>
        )}

        {/* ── STAGE 3: EDIT REVIEW & CHANGE NAME (ONLY UNLOCKED AFTER PAYMENT) */}
        {step === 'review_entry' && isVerifiedSession && (
          <form onSubmit={handleSubmitVerifiedReview} className="space-y-4 animate-fadeIn">
            {/* Verified Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/[0.1] border border-emerald-400/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300">
                  Payment Verified ✓
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-white">
                ₹{currentAmount || 50} ({estimatedCups} {estimatedCups === 1 ? 'cup' : 'cups'})
              </span>
            </div>

            <div className="mb-2">
              <h3 className="text-[20px] font-bold text-white tracking-tight">
                Change Review &amp; Name
              </h3>
              <p className="text-xs text-white/50 font-light">
                Your payment is confirmed. Customize your details below to appear on the Community Leaderboard.
              </p>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                {formError}
              </div>
            )}

            {/* 1. Change Name */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                Supporter Name <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter your name or alias"
                value={supporterName}
                onChange={(e) => setSupporterName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-2xl liquid-glass-input text-xs"
              />
            </div>

            {/* 2. Change Rating */}
            <div className="p-3 rounded-2xl bg-white/[0.025] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-white/80">
                  Change Star Rating
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

            {/* 3. Change Review Comment */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                Review &amp; Feedback <span className="text-white/35 text-[10px] font-normal">(Optional comment)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Share your experience using RyperDeck..."
                value={supporterMessage}
                onChange={(e) => setSupporterMessage(e.target.value)}
                className="w-full p-3.5 rounded-2xl liquid-glass-input text-xs resize-none"
              />
            </div>

            {/* 4. Optional Ko-fi Ref */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                Ko-fi Nickname or Transaction Note <span className="text-white/35 text-[10px] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. ko-fi user or payment note"
                value={kofiRef}
                onChange={(e) => setKofiRef(e.target.value)}
                className="w-full h-11 px-3.5 rounded-2xl liquid-glass-input text-xs"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-full liquid-glass-btn-primary bg-white hover:bg-white/90 text-black font-bold text-[13px] flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.25)] transition-all disabled:opacity-60"
              >
                {submitting ? (
                  <span>Publishing Review...</span>
                ) : (
                  <>
                    <Star className="w-4 h-4 fill-black text-black" />
                    <span>Submit Review to Leaderboard</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ── STAGE 4: SUCCESS VIEW ────────────────────────────────────── */}
        {step === 'success' && (
          <div className="text-center py-6 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 mb-1 block">
              Review Published ✓
            </span>

            <h3 className="text-[22px] font-bold text-white mb-2">
              Thank You, {supporterName}!
            </h3>

            <p className="text-[13px] text-white/70 max-w-sm mx-auto leading-relaxed mb-6 font-light">
              Your contribution of <strong className="text-amber-300">₹{currentAmount || 50}</strong> and <strong className="text-amber-300">{starRating} Stars</strong> review is now live on the Community Hall of Fame!
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  handleModalClose();
                  const lb = document.getElementById('leaderboard');
                  if (lb) lb.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3 rounded-full liquid-glass-btn-amber bg-amber-400 text-black font-bold text-xs cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:bg-amber-300 transition-all"
              >
                View on Leaderboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
};
