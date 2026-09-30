import React, { useState, useEffect, useRef } from 'react';
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
  Clock,
  RefreshCw,
  Send
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
import {
  submitSupporter,
  checkForAutoVerifiedPayment,
  updateSupporter
} from '../../lib/supabase';

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
  // 2. 'auto_verifying' -> Live real-time polling: automatically detects when payment is completed on Ko-fi (NO transaction ID required!)
  // 3. 'payment_success' -> Animated success: payment detected automatically, review live on Leaderboard!
  // 4. 'payment_failed' -> Animated failure: no payment was detected, no charge, no review published
  // 5. 'submitted_pending' -> Fallback if webhook delayed: submitted for 1-click creator approval without transaction ID
  const [step, setStep] = useState<
    'payment' | 'auto_verifying' | 'payment_success' | 'payment_failed' | 'submitted_pending'
  >('payment');

  // Form states
  const [selectedAmount, setSelectedAmount] = useState<number>(defaultAmount);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [supporterName, setSupporterName] = useState<string>('');
  const [starRating, setStarRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [poppedStar, setPoppedStar] = useState<number>(0);
  const [supporterMessage, setSupporterMessage] = useState<string>('');

  // Auto-verification tracking state
  const [paymentInitiatedAt, setPaymentInitiatedAt] = useState<number>(0);
  const [pollCountdown, setPollCountdown] = useState<number>(45);
  const [pollAttempts, setPollAttempts] = useState<number>(0);
  const [isManualChecking, setIsManualChecking] = useState<boolean>(false);
  const [verifiedRecordId, setVerifiedRecordId] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Notify header of modal state
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

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('payment');
      setFormError('');
      setPollCountdown(45);
      setPollAttempts(0);
      setVerifiedRecordId(null);
    } else {
      setStep('payment');
      clearTimers();
    }
  }, [isOpen]);

  const clearTimers = () => {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
  };

  // Safe close handler
  const handleModalClose = () => {
    clearTimers();
    setStep('payment');
    setFormError('');
    onClose();
  };

  const currentAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount;
  const estimatedCups = Math.max(1, Math.round((currentAmount > 0 ? currentAmount : 50) / 50));

  // Check if inputs contain prohibited links or URLs
  const nameHasLink = containsLink(supporterName);
  const messageHasLink = containsLink(supporterMessage);
  const hasProhibitedLink = nameHasLink || messageHasLink;

  // ── AUTOMATIC PAYMENT VERIFICATION POLLING ────────────────────────────────
  useEffect(() => {
    if (step !== 'auto_verifying' || paymentInitiatedAt === 0) return;

    // 1. Countdown timer
    countdownTimerRef.current = setInterval(() => {
      setPollCountdown((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 2. Poll Supabase every 2.5 seconds for incoming Ko-fi webhook verification
    const pollForVerification = async () => {
      setPollAttempts((a) => a + 1);
      const res = await checkForAutoVerifiedPayment(
        paymentInitiatedAt,
        supporterName,
        currentAmount
      );

      if (res.verified && res.supporter) {
        // MATCH FOUND! Ko-fi webhook arrived and verified payment!
        clearTimers();
        setVerifiedRecordId(res.supporter.id || null);

        // Update the supporter record with user's custom rating and message if provided
        if (res.supporter.id) {
          const cleanMsg = supporterMessage.trim()
            ? sanitizeReviewMessage(supporterMessage.trim(), 350)
            : undefined;
          await updateSupporter(res.supporter.id, {
            rating: starRating,
            message: cleanMsg,
            name: supporterName.trim()
              ? sanitizeInput(supporterName.trim(), 80)
              : res.supporter.name,
          });
        }

        // Resync global cache so Leaderboard immediately updates
        await syncSupportersFromSupabase();

        // Advance automatically to Success view
        setStep('payment_success');

        try {
          confetti({
            particleCount: 120,
            spread: 85,
            origin: { y: 0.6 },
            colors: ['#ffffff', '#f59e0b', '#38bdf8', '#34d399', '#ff5f5f'],
          });
        } catch {}
      }
    };

    // Initial check right away
    pollForVerification();

    // Regular interval check
    pollTimerRef.current = setInterval(pollForVerification, 2500);

    return () => clearTimers();
  }, [step, paymentInitiatedAt, supporterName, currentAmount, starRating, supporterMessage]);

  if (!isOpen) return null;

  // STEP 1 -> STEP 2: Proceed to Pay on Ko-fi & Start Auto-Verification
  const handleProceedToPayment = () => {
    setFormError('');
    if (hasProhibitedLink) {
      setFormError('Links and website URLs are not allowed in reviews or names.');
      return;
    }

    const now = Date.now();
    setPaymentInitiatedAt(now);
    setPollCountdown(45);
    setPollAttempts(0);

    // Open Ko-fi payment in a new tab
    window.open(KOFI_CONFIG.url, '_blank', 'noopener,noreferrer');

    // Automatically transition to the auto-verification state
    setStep('auto_verifying');
  };

  // User manually triggers a check
  const handleManualCheckNow = async () => {
    setIsManualChecking(true);
    const res = await checkForAutoVerifiedPayment(
      paymentInitiatedAt || Date.now() - 60000,
      supporterName,
      currentAmount
    );

    if (res.verified && res.supporter) {
      clearTimers();
      setVerifiedRecordId(res.supporter.id || null);

      if (res.supporter.id) {
        const cleanMsg = supporterMessage.trim()
          ? sanitizeReviewMessage(supporterMessage.trim(), 350)
          : undefined;
        await updateSupporter(res.supporter.id, {
          rating: starRating,
          message: cleanMsg,
          name: supporterName.trim()
            ? sanitizeInput(supporterName.trim(), 80)
            : res.supporter.name,
        });
      }

      await syncSupportersFromSupabase();
      setStep('payment_success');

      try {
        confetti({
          particleCount: 120,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#f59e0b', '#38bdf8', '#34d399', '#ff5f5f'],
        });
      } catch {}
    } else {
      setFormError('Payment not detected yet. Please ensure you completed payment on Ko-fi.');
      setTimeout(() => setFormError(''), 4000);
    }
    setIsManualChecking(false);
  };

  // Fallback: User completed payment on Ko-fi, but webhook is taking time
  // Allows submitting for 1-click creator approval without requiring a transaction ID
  const handleSubmitForCreatorApproval = async () => {
    setSubmitting(true);
    setFormError('');

    try {
      const finalName = sanitizeInput(supporterName.trim(), 80) || 'Anonymous Supporter';
      const cleanMessage = supporterMessage.trim()
        ? sanitizeReviewMessage(supporterMessage.trim(), 350)
        : undefined;

      await submitSupporter({
        name: finalName,
        amount: currentAmount > 0 ? currentAmount : 50,
        cups: estimatedCups,
        rating: starRating,
        message: cleanMessage,
        paymentId: `kofi-auto-${Date.now()}`,
        verified: false, // Submitted for creator 1-click verification in Admin Panel
      });

      addSupporter(
        finalName,
        currentAmount > 0 ? currentAmount : 50,
        estimatedCups,
        starRating,
        cleanMessage,
        `kofi-auto-${Date.now()}`,
        false
      );

      await syncSupportersFromSupabase();
      clearTimers();
      setStep('submitted_pending');
    } catch (err: any) {
      console.error(err);
      setFormError('Failed to submit. Please try again.');
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
              Payment is processed securely on Ko-fi. After payment, your contribution and review are automatically verified in real-time.
            </div>
          </div>
        )}

        {/* ── STAGE 2: 100% AUTOMATED VERIFICATION IN REAL TIME ───────────── */}
        {step === 'auto_verifying' && (
          <div className="py-6 text-center animate-scale-in">
            {/* Animated Liquid Radar Pod */}
            <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-amber-400/40 animate-pulse-ring" />
              <div className="absolute -inset-2 rounded-full border border-amber-400/20 animate-ping opacity-40" />
              <div className="w-16 h-16 rounded-2xl liquid-glass-icon-pod liquid-glass-icon-pod-amber text-amber-400 flex items-center justify-center shadow-lg">
                <Coffee className="w-8 h-8 animate-pulse text-amber-400" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-[11px] font-semibold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Auto-Detecting Payment...</span>
            </div>

            <h3 className="text-[20px] font-bold text-white mb-2">
              Complete Payment on Ko-fi
            </h3>

            <p className="text-[13px] text-white/60 max-w-sm mx-auto leading-relaxed mb-5 font-light">
              We opened <span className="text-white font-medium">ko-fi.com/ryper</span> in a new tab. Please complete your <strong className="text-amber-300 font-semibold">₹{currentAmount || 50}</strong> contribution there.
            </p>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs max-w-sm mx-auto animate-shake">
                {formError}
              </div>
            )}

            {/* Real-time Status Card */}
            <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.08] max-w-sm mx-auto mb-5 text-left">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-white/60">Live Server Check</span>
                <span className="font-mono text-cyan-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Active ({pollCountdown}s)
                </span>
              </div>
              <p className="text-[11px] text-white/40 leading-relaxed font-light">
                No transaction ID required. As soon as Ko-fi confirms your contribution, this window will automatically unlock and publish your review.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 max-w-xs mx-auto">
              <button
                type="button"
                disabled={isManualChecking}
                onClick={handleManualCheckNow}
                className="w-full h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
              >
                {isManualChecking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Checking Ko-fi Ledger...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>I've Completed Payment — Verify Now</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => window.open(KOFI_CONFIG.url, '_blank', 'noopener,noreferrer')}
                className="w-full h-10 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-amber-300 text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <span>Re-open Ko-fi Payment Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              {/* If after 45s the payment wasn't detected, provide seamless 1-click fallback */}
              {pollCountdown === 0 && (
                <div className="pt-2 animate-fadeIn">
                  <p className="text-[11px] text-white/45 mb-2 leading-relaxed">
                    Paid but webhook taking time? Submit your review directly for 1-click creator approval (no ID required):
                  </p>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmitForCreatorApproval}
                    className="w-full h-10 rounded-full bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/50 text-amber-300 font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review for Creator Approval</span>
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  clearTimers();
                  setStep('payment_failed');
                }}
                className="text-[11px] text-white/40 hover:text-white/70 transition-colors pt-2 cursor-pointer"
              >
                Cancelled / Didn't Pay
              </button>
            </div>
          </div>
        )}

        {/* ── STAGE 3: AUTOMATICALLY VERIFIED (SUCCESS WINDOW) ─────────────── */}
        {step === 'payment_success' && (
          <div className="text-center py-6 animate-scale-in">
            <div className="relative w-18 h-18 mx-auto mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-pulse-ring" />
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <CheckCircle2 className="w-9 h-9" />
              </div>
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 mb-1 block font-mono">
              Payment Automatically Verified ✓
            </span>

            <h3 className="text-[23px] font-bold text-white mb-2">
              Thank You, {supporterName || 'Supporter'}!
            </h3>

            <p className="text-[13px] text-white/70 max-w-sm mx-auto leading-relaxed mb-5 font-light">
              Your contribution of <strong className="text-amber-300">₹{currentAmount || 50}</strong> ({estimatedCups} {estimatedCups === 1 ? 'cup' : 'cups'}) was verified directly from Ko-fi and your review is now live!
            </p>

            {/* Published Review Summary Box */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] max-w-sm mx-auto text-left mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white">
                  {supporterName || 'Anonymous Supporter'}
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  {[...Array(starRating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
              {supporterMessage && (
                <p className="text-xs text-white/70 italic leading-relaxed">
                  "{supporterMessage}"
                </p>
              )}
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
                View on Leaderboard
              </button>
            </div>
          </div>
        )}

        {/* ── STAGE 4: PAYMENT NOT COMPLETED / CANCELLED ──────────────────── */}
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
              No Payment Detected
            </h3>

            <p className="text-[13px] text-white/60 max-w-sm mx-auto leading-relaxed mb-6 font-light">
              We did not receive a completed payment from Ko-fi. You were <span className="text-white font-medium">not charged</span>, and your review was not published.
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

        {/* ── STAGE 5: SUBMITTED FOR CREATOR APPROVAL (NO TRANSACTION ID) ─── */}
        {step === 'submitted_pending' && (
          <div className="text-center py-6 animate-scale-in">
            <div className="relative w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-pulse-ring" />
              <div className="w-14 h-14 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.3)]">
                <Clock className="w-8 h-8" />
              </div>
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 mb-1 block font-mono">
              Submitted for Verification ✓
            </span>

            <h3 className="text-[22px] font-bold text-white mb-2">
              Thank You, {supporterName}!
            </h3>

            <p className="text-[13px] text-white/70 max-w-sm mx-auto leading-relaxed mb-4 font-light">
              Your contribution of <strong className="text-amber-300">₹{currentAmount || 50}</strong> and <strong className="text-amber-300">{starRating}★</strong> review have been submitted to the creator for approval.
            </p>

            <div className="p-3.5 rounded-2xl bg-white/[0.025] border border-white/[0.08] max-w-sm mx-auto text-left mb-6">
              <div className="flex items-start gap-2.5 text-[11px] text-white/60 leading-relaxed font-light">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Our creator will confirm your donation and publish your review to the Community Hall of Fame shortly. Thank you for supporting RyperDeck!
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
