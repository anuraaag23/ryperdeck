import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ExternalLink,
  ShieldCheck,
  Star,
  Check,
  CheckCircle2,
  XCircle,
  Coffee,
  Sparkles,
  RotateCcw,
  Loader2,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  KOFI_CONFIG,
  addSupporter,
  syncSupportersFromSupabase
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
  // Modal flow states:
  // 1. 'payment' -> Choose amount, enter name, rate 1-5 stars, write optional review, click Pay
  // 2. 'awaiting_return' -> Ko-fi opened in new tab. Prompt: Did you complete your payment?
  // 3. 'payment_success' -> Animated success window. Shows pre-filled name/rating/review with option to edit, then Submit
  // 4. 'payment_failed' -> Animated failure/cancelled window. Reassures no charge, allows Try Again or Close
  // 5. 'published' -> Final thank-you confirmation with confetti
  const [step, setStep] = useState<
    'payment' | 'awaiting_return' | 'payment_success' | 'payment_failed' | 'published'
  >('payment');

  const [isVerifiedSession, setIsVerifiedSession] = useState(false);

  // Form states
  const [selectedAmount, setSelectedAmount] = useState<number>(defaultAmount);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [supporterName, setSupporterName] = useState<string>('');
  const [starRating, setStarRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [poppedStar, setPoppedStar] = useState<number>(0);
  const [supporterMessage, setSupporterMessage] = useState<string>('');
  const [kofiRef, setKofiRef] = useState<string>('');

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Notify header/other components of modal state
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

  // Reset verification and step whenever modal closes or opens fresh
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

  // Safe close handler: prevents any lingering review submission backdoor
  const handleModalClose = () => {
    setIsVerifiedSession(false);
    setStep('payment');
    setFormError('');
    onClose();
  };

  if (!isOpen) return null;

  const currentAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount;
  const estimatedCups = Math.max(1, Math.round((currentAmount > 0 ? currentAmount : 50) / 50));

  // STEP 1 -> STEP 2: Proceed to Pay on Ko-fi
  const handleProceedToPayment = () => {
    setFormError('');
    // Open Ko-fi payment in a new tab
    window.open(KOFI_CONFIG.url, '_blank', 'noopener,noreferrer');
    // Transition to awaiting confirmation state (NO auto-verification timers or focus assumptions)
    setStep('awaiting_return');
  };

  // User confirms they completed payment on Ko-fi -> Open Animated Success Window
  const handleConfirmPaid = () => {
    setIsVerifiedSession(true);
    setStep('payment_success');
  };

  // User confirms they didn't pay / closed tab -> Open Animated Failure Window
  const handleConfirmCancelled = () => {
    setIsVerifiedSession(false);
    setStep('payment_failed');
  };

  // STEP 3 -> Publish Review: Submit Verified Review to Leaderboard & Database
  const handleSubmitVerifiedReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Strict guard: Must have an active verified payment session
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
      // 1. Submit to Supabase database with verified flag
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
      addSupporter(
        finalName,
        finalAmount,
        estimatedCups,
        starRating,
        supporterMessage.trim() || undefined,
        ref,
        true
      );

      // 3. Resync from database to ensure consistency
      await syncSupportersFromSupabase();

      // Reset verification session to prevent double submission
      setIsVerifiedSession(false);
      setStep('published');

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
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.2] border border-white/[0.15] text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ── STAGE 1: AMOUNT, NAME, RATING & OPTIONAL REVIEW ────────────── */}
        {step === 'payment' && (
          <div className="animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center gap-3.5 mb-5 pr-10">
              <div className="w-11 h-11 rounded-2xl liquid-glass-icon-pod liquid-glass-icon-pod-amber text-amber-400 shadow-md flex items-center justify-center">
                <Coffee className="w-5 h-5" />
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

            {/* Official Ko-fi Creator Badge */}
            <div className="p-3.5 rounded-2xl bg-amber-500/[0.08] border border-amber-400/25 flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-[10px] font-mono uppercase text-amber-300 font-semibold tracking-wider">
                    Official Creator Page
                  </div>
                  <div className="text-[13px] font-bold text-white">
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

            {/* 1. Select Coffee Tier */}
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
                  className="w-full h-10 pl-7 pr-3 rounded-2xl liquid-glass-input text-xs"
                />
              </div>
            </div>

            {/* 2. Your Name or Alias */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                2. Your Name or Alias <span className="text-white/35 text-[10px] font-normal">(Editable after payment)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Rivera, DevKunal"
                value={supporterName}
                onChange={(e) => setSupporterName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-2xl liquid-glass-input text-xs"
              />
            </div>

            {/* 3. Rate RyperDeck (Interactive 1-5 Stars) */}
            <div className="mb-4 p-3 rounded-2xl bg-white/[0.025] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-white/80">
                  3. Rate RyperDeck <span className="text-white/35 text-[10px] font-normal">(Optional)</span>
                </label>
                <span className="text-xs font-mono font-bold text-amber-300">
                  {starRating}.0 / 5.0 ★
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
                    className="p-1 cursor-pointer transition-transform active:scale-125"
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

            {/* 4. Write Review / Feedback (Optional) */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                4. Write Review / Feedback <span className="text-white/35 text-[10px] font-normal">(Optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Share your experience or what you love about RyperDeck..."
                value={supporterMessage}
                onChange={(e) => setSupporterMessage(e.target.value)}
                className="w-full p-3 rounded-2xl liquid-glass-input text-xs resize-none"
              />
            </div>

            {/* 5. Fixed Premium Pay Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleProceedToPayment}
                className="w-full h-12 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-black font-bold text-[14px] flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_8px_25px_rgba(245,158,11,0.4)] hover:shadow-[0_12px_35px_rgba(245,158,11,0.6)] active:scale-[0.98] transition-all"
              >
                <Coffee className="w-4 h-4 text-black shrink-0" />
                <span>Pay ₹{currentAmount || 50} on Ko-fi</span>
                <ExternalLink className="w-4 h-4 text-black/70 shrink-0" />
              </button>
            </div>

            <div className="mt-3 text-center text-[11px] text-white/40 leading-relaxed font-light">
              Clicking opens Ko-fi in a new tab. After completing or closing your payment, return here to finalize and publish your review.
            </div>
          </div>
        )}

        {/* ── STAGE 2: AWAITING PAYMENT OUTCOME (NO BLIND AUTO-VERIFY) ─────── */}
        {step === 'awaiting_return' && (
          <div className="py-6 text-center animate-scale-in">
            {/* Animated Radar Pulse */}
            <div className="relative w-18 h-18 mx-auto mb-5 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-amber-400/30 animate-pulse-ring" />
              <div className="absolute -inset-2 rounded-full border border-amber-400/15 animate-ping opacity-30" />
              <div className="w-14 h-14 rounded-2xl liquid-glass-icon-pod liquid-glass-icon-pod-amber text-amber-400 flex items-center justify-center shadow-lg">
                <Coffee className="w-7 h-7 animate-pulse text-amber-400" />
              </div>
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-300 mb-1.5 block font-mono">
              Waiting for Ko-fi...
            </span>

            <h3 className="text-[20px] font-bold text-white mb-2">
              Did you complete your payment?
            </h3>

            <p className="text-[13px] text-white/60 max-w-sm mx-auto leading-relaxed mb-6 font-light">
              We opened <span className="text-white font-medium">ko-fi.com/ryper</span> in a new tab for you. Please let us know the outcome below:
            </p>

            {/* Two Distinct Animated Outcome Buttons */}
            <div className="flex flex-col gap-3 max-w-xs mx-auto mb-4">
              <button
                type="button"
                onClick={handleConfirmPaid}
                className="w-full h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Yes, Payment Completed</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmCancelled}
                className="w-full h-11 rounded-full bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.12] text-white/80 hover:text-white font-semibold text-xs cursor-pointer transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <X className="w-4 h-4 text-rose-400" />
                <span>No, Cancelled / Didn't Pay</span>
              </button>
            </div>

            {/* Reopen Ko-fi if tab was closed accidentally */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => window.open(KOFI_CONFIG.url, '_blank', 'noopener,noreferrer')}
                className="text-[11px] text-amber-400/80 hover:text-amber-300 underline underline-offset-4 transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <span>Re-open Ko-fi payment tab</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* ── STAGE 3: ANIMATED SUCCESSFUL PAYMENT WINDOW ─────────────────── */}
        {step === 'payment_success' && isVerifiedSession && (
          <form onSubmit={handleSubmitVerifiedReview} className="space-y-4 animate-scale-in">
            {/* Animated Checkmark Pod */}
            <div className="text-center pt-1 pb-2">
              <div className="relative w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-pulse-ring" />
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.35)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400 mb-1 block font-mono">
                Payment Confirmed ✓
              </span>
              <h3 className="text-[21px] font-bold text-white tracking-tight">
                Payment Successful!
              </h3>
              <p className="text-xs text-white/60 font-light mt-1">
                Contributed <strong className="text-emerald-300">₹{currentAmount || 50}</strong> ({estimatedCups} {estimatedCups === 1 ? 'cup' : 'cups'}). Customize your review below before publishing.
              </p>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                {formError}
              </div>
            )}

            {/* Change Name */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-white/80">
                  Supporter Name <span className="text-emerald-400">*</span>
                </label>
                <span className="text-[10px] text-white/40">You can edit this</span>
              </div>
              <input
                type="text"
                required
                placeholder="Enter your name or alias"
                value={supporterName}
                onChange={(e) => setSupporterName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-2xl liquid-glass-input text-xs"
              />
            </div>

            {/* Change Rating */}
            <div className="p-3 rounded-2xl bg-white/[0.025] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-white/80">
                  Star Rating
                </label>
                <span className="text-xs font-mono font-bold text-amber-300">
                  {starRating}.0 / 5.0 ★
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

            {/* Change Review Comment */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-white/80">
                  Review &amp; Feedback <span className="text-white/35 text-[10px] font-normal">(Optional)</span>
                </label>
                <span className="text-[10px] text-white/40">You can edit this</span>
              </div>
              <textarea
                rows={2}
                placeholder="Share your experience using RyperDeck..."
                value={supporterMessage}
                onChange={(e) => setSupporterMessage(e.target.value)}
                className="w-full p-3 rounded-2xl liquid-glass-input text-xs resize-none"
              />
            </div>

            {/* Optional Ko-fi Nickname / Payment note */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                Ko-fi Nickname or Transaction Note <span className="text-white/35 text-[10px] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. ko-fi user or payment note"
                value={kofiRef}
                onChange={(e) => setKofiRef(e.target.value)}
                className="w-full h-10 px-3.5 rounded-2xl liquid-glass-input text-xs"
              />
            </div>

            {/* Submit Review to Leaderboard */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-full liquid-glass-btn-primary bg-white hover:bg-white/90 text-black font-bold text-[13px] flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.25)] transition-all disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Publishing Review...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Submit Review to Leaderboard</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ── STAGE 4: ANIMATED UNSUCCESSFUL PAYMENT WINDOW ───────────────── */}
        {step === 'payment_failed' && (
          <div className="py-6 text-center animate-scale-in">
            {/* Animated Failure Icon */}
            <div className="relative w-16 h-16 mx-auto mb-4 flex items-center justify-center animate-shake">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-[0_0_25px_rgba(244,63,94,0.25)]">
                <XCircle className="w-9 h-9" />
              </div>
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-widest text-rose-400 mb-1 block font-mono">
              Payment Not Completed
            </span>

            <h3 className="text-[20px] font-bold text-white mb-2">
              Payment Cancelled or Incomplete
            </h3>

            <p className="text-[13px] text-white/60 max-w-sm mx-auto leading-relaxed mb-6 font-light">
              It looks like your Ko-fi contribution was not finished. You were <span className="text-white font-medium">not charged</span>, and your review has not been published to the leaderboard.
            </p>

            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => setStep('payment')}
                className="w-full h-11 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Payment Again</span>
              </button>

              <button
                type="button"
                onClick={handleModalClose}
                className="w-full h-10 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-white/70 hover:text-white font-medium text-xs cursor-pointer transition-all active:scale-95"
              >
                Close Window
              </button>
            </div>
          </div>
        )}

        {/* ── STAGE 5: PUBLISHED CONFIRMATION ────────────────────────────── */}
        {step === 'published' && (
          <div className="text-center py-6 animate-scale-in">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 mb-1 block font-mono">
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
