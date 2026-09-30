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
  AlertTriangle,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  KOFI_CONFIG,
  addSupporter,
  syncSupportersFromSupabase,
  containsLink,
  sanitizeReviewMessage,
  sanitizeInput
} from '../../config/kofi';
import { submitSupporter, isPaymentIdAlreadyUsed } from '../../lib/supabase';

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
  // 3. 'payment_success' -> Verification details: requires Ko-fi Transaction ID, validates no links, allows review edits
  // 4. 'payment_failed' -> Animated failure/cancelled window
  // 5. 'submitted_pending' -> Clean confirmation that review is submitted for verification before public listing
  const [step, setStep] = useState<
    'payment' | 'awaiting_return' | 'payment_success' | 'payment_failed' | 'submitted_pending'
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
  const [kofiEmail, setKofiEmail] = useState<string>('');

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

  // Check if inputs contain prohibited links or URLs
  const nameHasLink = containsLink(supporterName);
  const messageHasLink = containsLink(supporterMessage);
  const hasProhibitedLink = nameHasLink || messageHasLink;

  // STEP 1 -> STEP 2: Proceed to Pay on Ko-fi
  const handleProceedToPayment = () => {
    setFormError('');
    if (hasProhibitedLink) {
      setFormError('Links and website URLs are not allowed in reviews or names.');
      return;
    }
    // Open Ko-fi payment in a new tab
    window.open(KOFI_CONFIG.url, '_blank', 'noopener,noreferrer');
    // Transition to awaiting confirmation state
    setStep('awaiting_return');
  };

  // User confirms they completed payment on Ko-fi -> Open Verification Screen
  const handleConfirmPaid = () => {
    setIsVerifiedSession(true);
    setStep('payment_success');
  };

  // User confirms they didn't pay / closed tab -> Open Animated Failure Window
  const handleConfirmCancelled = () => {
    setIsVerifiedSession(false);
    setStep('payment_failed');
  };

  // STEP 3 -> Submit Verified Review for Admin Approval
  const handleSubmitVerifiedReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Strict guard: Must have an active payment session
    if (!isVerifiedSession) {
      setFormError('Payment verification required before submitting a review.');
      setStep('payment');
      return;
    }

    // 1. Validate Link Security
    if (nameHasLink || messageHasLink) {
      setFormError('Links and URLs are strictly prohibited in reviews to prevent spam.');
      return;
    }

    const finalName = sanitizeInput(supporterName.trim(), 80);
    if (!finalName) {
      setFormError('Please enter your name or alias.');
      return;
    }

    // 2. Validate Ko-fi Transaction / Receipt ID (Anti-Fraud)
    const rawRef = kofiRef.trim();
    if (!rawRef) {
      setFormError('Please enter your Ko-fi Transaction ID or Order ID from your receipt.');
      return;
    }

    if (rawRef.length < 5) {
      setFormError('Please enter a valid Ko-fi Transaction ID (at least 5 characters).');
      return;
    }

    const lowerRef = rawRef.toLowerCase();
    const fakeKeywords = ['test', 'fake', 'none', '12345', '123456', 'kofi', 'paid', 'null', 'n/a'];
    if (fakeKeywords.includes(lowerRef)) {
      setFormError('Please provide your authentic Ko-fi transaction ID from your receipt.');
      return;
    }

    setSubmitting(true);

    try {
      // 3. Check if transaction ID has already been claimed
      const alreadyUsed = await isPaymentIdAlreadyUsed(rawRef);
      if (alreadyUsed) {
        setFormError('This Ko-fi Transaction ID has already been submitted for verification.');
        setSubmitting(false);
        return;
      }

      const finalAmount = currentAmount > 0 ? currentAmount : 50;
      const cleanMessage = supporterMessage.trim() ? sanitizeReviewMessage(supporterMessage.trim(), 350) : undefined;
      const combinedRef = kofiEmail.trim() ? `${rawRef} (${kofiEmail.trim()})` : rawRef;

      // 4. Submit to Supabase with verified: false (Pending Admin Verification)
      // This guarantees no unverified review can ever appear on the public leaderboard without approval
      await submitSupporter({
        name: finalName,
        amount: finalAmount,
        cups: estimatedCups,
        rating: starRating,
        message: cleanMessage,
        paymentId: combinedRef,
        verified: false,
      });

      // 5. Update local cache as unverified (does not show on public leaderboard)
      addSupporter(
        finalName,
        finalAmount,
        estimatedCups,
        starRating,
        cleanMessage,
        combinedRef,
        false
      );

      // Resync
      await syncSupportersFromSupabase();

      // Reset verification session to prevent re-submitting
      setIsVerifiedSession(false);
      setStep('submitted_pending');

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#f59e0b', '#38bdf8', '#34d399'],
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

            {/* Prohibited Link Warning */}
            {hasProhibitedLink && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2 animate-shake">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Web links and URLs are not permitted in reviews or names.</span>
              </div>
            )}

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
                2. Your Name or Alias <span className="text-white/35 text-[10px] font-normal">(No links allowed)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Rivera, DevKunal"
                value={supporterName}
                onChange={(e) => setSupporterName(e.target.value)}
                className={`w-full h-10 px-3.5 rounded-2xl liquid-glass-input text-xs ${
                  nameHasLink ? 'border-rose-500/60 focus:border-rose-500' : ''
                }`}
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-white/80">
                  4. Write Review / Feedback <span className="text-white/35 text-[10px] font-normal">(Optional)</span>
                </label>
                <span className="text-[10px] text-white/40">No URLs/links</span>
              </div>
              <textarea
                rows={2}
                placeholder="Share your experience or what you love about RyperDeck..."
                value={supporterMessage}
                onChange={(e) => setSupporterMessage(e.target.value)}
                className={`w-full p-3 rounded-2xl liquid-glass-input text-xs resize-none ${
                  messageHasLink ? 'border-rose-500/60 focus:border-rose-500' : ''
                }`}
              />
            </div>

            {/* 5. Fixed Premium Pay Button */}
            <div className="pt-1">
              <button
                type="button"
                disabled={hasProhibitedLink}
                onClick={handleProceedToPayment}
                className="w-full h-12 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-black font-bold text-[14px] flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_8px_25px_rgba(245,158,11,0.4)] hover:shadow-[0_12px_35px_rgba(245,158,11,0.6)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Coffee className="w-4 h-4 text-black shrink-0" />
                <span>Pay ₹{currentAmount || 50} on Ko-fi</span>
                <ExternalLink className="w-4 h-4 text-black/70 shrink-0" />
              </button>
            </div>

            <div className="mt-3 text-center text-[11px] text-white/40 leading-relaxed font-light">
              Clicking opens Ko-fi in a new tab. After payment, return here with your Transaction ID to submit your review.
            </div>
          </div>
        )}

        {/* ── STAGE 2: AWAITING PAYMENT OUTCOME ────────────────────────────── */}
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
              We opened <span className="text-white font-medium">ko-fi.com/ryper</span> in a new tab. Please select your outcome below:
            </p>

            {/* Outcome Buttons */}
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

        {/* ── STAGE 3: PAYMENT VERIFICATION & REVIEW SUBMISSION ───────────── */}
        {step === 'payment_success' && isVerifiedSession && (
          <form onSubmit={handleSubmitVerifiedReview} className="space-y-4 animate-scale-in">
            {/* Header Badge */}
            <div className="text-center pt-1 pb-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto mb-2 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-300 block font-mono">
                Verify Ko-fi Contribution
              </span>
              <h3 className="text-[20px] font-bold text-white tracking-tight">
                Submit Review with Payment Proof
              </h3>
              <p className="text-xs text-white/50 font-light mt-0.5">
                Amount: <strong className="text-amber-300">₹{currentAmount || 50}</strong> ({estimatedCups} {estimatedCups === 1 ? 'cup' : 'cups'})
              </p>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs animate-shake">
                {formError}
              </div>
            )}

            {/* Prohibited Link Warning */}
            {hasProhibitedLink && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Web links and URLs are not permitted in reviews.</span>
              </div>
            )}

            {/* 1. Mandatory Ko-fi Transaction ID / Order ID (Anti-Fraud Gate) */}
            <div className="p-3 rounded-2xl bg-amber-500/[0.07] border border-amber-400/30">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Ko-fi Transaction ID or Order ID</span>
                  <span className="text-amber-400">*</span>
                </label>
                <span className="text-[10px] text-amber-300/60 font-mono">Required</span>
              </div>
              <input
                type="text"
                required
                placeholder="e.g. 0a1b2c3d or Order ID from your Ko-fi receipt"
                value={kofiRef}
                onChange={(e) => setKofiRef(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl liquid-glass-input text-xs font-mono"
              />
              <p className="text-[10px] text-white/40 mt-1 leading-normal">
                Check your Ko-fi receipt email or payment confirmation screen for your unique reference.
              </p>
            </div>

            {/* 2. Supporter Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-white/80">
                  Supporter Name <span className="text-amber-400">*</span>
                </label>
                <span className="text-[10px] text-white/40">No links</span>
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

            {/* 3. Star Rating */}
            <div className="p-2.5 rounded-2xl bg-white/[0.025] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-1">
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
                      className={`w-5 h-5 transition-all duration-200 ${
                        (hoverRating || starRating) >= star
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]'
                          : 'text-white/20'
                      } ${poppedStar === star ? 'star-pop' : ''}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Review Comment (Clean of links) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-white/80">
                  Review &amp; Feedback <span className="text-white/35 text-[10px] font-normal">(Optional)</span>
                </label>
                <span className="text-[10px] text-white/40">No links</span>
              </div>
              <textarea
                rows={2}
                placeholder="Share your experience using RyperDeck..."
                value={supporterMessage}
                onChange={(e) => setSupporterMessage(e.target.value)}
                className="w-full p-2.5 rounded-2xl liquid-glass-input text-xs resize-none"
              />
            </div>

            {/* 5. Ko-fi Email / Nickname (Optional for matching) */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">
                Ko-fi Account Email or Name <span className="text-white/35 text-[10px] font-normal">(Helps instant verification)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. yourname@gmail.com or Ko-fi username"
                value={kofiEmail}
                onChange={(e) => setKofiEmail(e.target.value)}
                className="w-full h-10 px-3.5 rounded-2xl liquid-glass-input text-xs"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || hasProhibitedLink}
                className="w-full h-12 rounded-full liquid-glass-btn-primary bg-white hover:bg-white/90 text-black font-bold text-[13px] flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.25)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Verifying Details...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Submit Review for Verification</span>
                  </>
                )}
              </button>
            </div>
            
            <p className="text-[10px] text-center text-white/40 leading-relaxed font-light">
              To protect community integrity, reviews are checked against our Ko-fi creator transactions before going live on the Leaderboard.
            </p>
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
              It looks like your Ko-fi contribution was not finished. You were <span className="text-white font-medium">not charged</span>, and your review has not been published.
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

        {/* ── STAGE 5: SUBMITTED FOR VERIFICATION (ANTI-FRAUD CONFIRMATION) ── */}
        {step === 'submitted_pending' && (
          <div className="text-center py-6 animate-scale-in">
            <div className="relative w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-pulse-ring" />
              <div className="w-14 h-14 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.3)]">
                <Clock className="w-8 h-8" />
              </div>
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 mb-1 block font-mono">
              Submission Received ✓
            </span>

            <h3 className="text-[22px] font-bold text-white mb-2">
              Thank You, {supporterName}!
            </h3>

            <p className="text-[13px] text-white/70 max-w-sm mx-auto leading-relaxed mb-4 font-light">
              Your contribution of <strong className="text-amber-300">₹{currentAmount || 50}</strong> and <strong className="text-amber-300">{starRating}★</strong> review have been submitted with Reference ID:
            </p>

            <div className="inline-block px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] font-mono text-xs text-cyan-300 mb-5">
              {kofiRef}
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.025] border border-white/[0.08] max-w-sm mx-auto text-left mb-6">
              <div className="flex items-start gap-2.5 text-[11px] text-white/60 leading-relaxed font-light">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  To prevent fraudulent reviews, submissions are verified against our official Ko-fi ledger before appearing live on the Community Hall of Fame. Thank you for your support!
                </span>
              </div>
            </div>

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
                Back to RyperDeck
              </button>
            </div>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
};
