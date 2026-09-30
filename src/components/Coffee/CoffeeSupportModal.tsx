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
  Lock
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
  const [activeTab, setActiveTab] = useState<'kofi' | 'review'>('kofi');
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
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasOpenedKofi, setHasOpenedKofi] = useState(false);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('ryperdeck_coffee_modal_state', { detail: { open: isOpen } })
    );
  }, [isOpen]);

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
      setActiveTab('kofi');
      setIsSuccess(false);
      setFormError('');
      setHasOpenedKofi(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount;
  const estimatedCups = Math.max(1, Math.round(currentAmount / 50));

  // Open Ko-fi tab without automatically creating a fake review
  const handleOpenKofi = () => {
    window.open(KOFI_CONFIG.url, '_blank', 'noopener,noreferrer');
    setHasOpenedKofi(true);
  };

  // Submit real review to Supabase & Leaderboard
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const finalName = supporterName.trim();
    if (!finalName) {
      setFormError('Please enter your name or alias to appear on the Leaderboard.');
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

      setIsSuccess(true);

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
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-2xl animate-fadeIn cursor-default overflow-y-auto"
      style={{ zIndex: 9999999 }}
    >
      <div className="relative w-full max-w-lg rounded-t-[34px] sm:rounded-[34px] bg-[#0c0d14] border border-white/[0.15] p-6 sm:p-8 shadow-[0_40px_100px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.3)] max-h-[90vh] overflow-y-auto scrollbar-none my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.2] border border-white/[0.15] text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

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
              Support on Ko-fi
            </h3>
          </div>
        </div>

        {/* Navigation Tabs */}
        {!isSuccess && (
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('kofi')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'kofi'
                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>1. Donate on Ko-fi</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('review')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'review'
                  ? 'bg-white text-black shadow-md shadow-white/20'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Star className="w-3 h-3" />
              <span>2. Post Review / Rating</span>
            </button>
          </div>
        )}

        {/* ── TAB 1: SUPPORT ON KO-FI ──────────────────────────────────── */}
        {!isSuccess && activeTab === 'kofi' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Ko-fi Verified Creator Card */}
            <div className="p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-400/25 flex items-center justify-between">
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
              <span className="liquid-glass-badge liquid-glass-badge-amber text-[10px]">
                0% Platform Cut
              </span>
            </div>

            <p className="text-[13px] text-white/70 leading-relaxed font-light">
              RyperDeck is 100% free, private, and open for Windows users. You can donate or buy developer coffees on our official Ko-fi page using <strong>UPI, Cards, or PayPal</strong>.
            </p>

            {/* Coffee Amount Suggestions */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-2">
                Choose Coffee Tier to donate on Ko-fi:
              </label>
              <div className="grid grid-cols-3 gap-2">
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
            </div>

            {/* Direct Open Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleOpenKofi}
                className="w-full h-12 rounded-full liquid-glass-btn-amber bg-amber-400 hover:bg-amber-300 text-black font-bold text-[14px] flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_30px_rgba(245,158,11,0.35)] transition-all"
              >
                <span>☕ Open ko-fi.com/ryper to Donate</span>
                <ExternalLink className="w-4 h-4 text-black/70" />
              </button>
            </div>

            {/* Helper Notice for After Donating */}
            <div className={`p-4 rounded-2xl border transition-all ${hasOpenedKofi ? 'bg-emerald-500/[0.1] border-emerald-400/30' : 'bg-white/[0.02] border-white/[0.06]'}`}>
              <div className="flex items-start gap-3">
                <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${hasOpenedKofi ? 'text-emerald-400' : 'text-white/40'}`} />
                <div>
                  <div className="text-[12px] font-semibold text-white mb-1">
                    {hasOpenedKofi ? 'Step 2: Add your review to the Leaderboard' : 'Already donated on Ko-fi?'}
                  </div>
                  <p className="text-[11px] text-white/60 leading-relaxed font-light mb-2.5">
                    Whether you donate now or donated earlier, submit your name, rating, and feedback to feature on our on-page Leaderboard.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('review')}
                    className="text-xs font-bold text-amber-300 hover:text-amber-200 inline-flex items-center gap-1.5 underline cursor-pointer"
                  >
                    <span>👉 Click here to enter your review &amp; name</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: SUBMIT SUPPORTER REVIEW ──────────────────────────── */}
        {!isSuccess && activeTab === 'review' && (
          <form onSubmit={handleSubmitReview} className="space-y-4 animate-fadeIn">
            {formError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                {formError}
              </div>
            )}

            {/* 1. Name */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                1. Your Name / Alias <span className="text-amber-400">*</span> <span className="text-white/35 text-[10px] font-normal">(Shown on Community Leaderboard)</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex, TechStreamer, GamerXYZ"
                value={supporterName}
                onChange={(e) => setSupporterName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-2xl liquid-glass-input text-xs"
              />
            </div>

            {/* 2. Amount / Cups */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-white/80">
                  2. Contribution Amount
                </label>
                <span className="text-xs font-mono text-cyan-300">
                  ₹{currentAmount || 50} ({estimatedCups} {estimatedCups === 1 ? 'cup' : 'cups'})
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[50, 100, 250, 500].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      selectedAmount === amt && !customAmount
                        ? 'bg-amber-400 text-black border-amber-400 shadow-sm'
                        : 'bg-white/[0.03] border-white/[0.08] text-white/70 hover:text-white'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Rating */}
            <div className="p-3 rounded-2xl bg-white/[0.025] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-white/80">
                  3. Rate RyperDeck (5 Stars)
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

            {/* 4. Optional Message */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                4. Your Review / Feedback <span className="text-white/35 text-[10px] font-normal">(Optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Share your thoughts or why you love RyperDeck..."
                value={supporterMessage}
                onChange={(e) => setSupporterMessage(e.target.value)}
                className="w-full p-3.5 rounded-2xl liquid-glass-input text-xs resize-none"
              />
            </div>

            {/* 5. Ko-fi Name or Reference */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                5. Ko-fi Username or Reference <span className="text-white/35 text-[10px] font-normal">(Optional, for verification)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. ko-fi name or transaction note"
                value={kofiRef}
                onChange={(e) => setKofiRef(e.target.value)}
                className="w-full h-11 px-3.5 rounded-2xl liquid-glass-input text-xs"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('kofi')}
                className="w-1/3 h-12 rounded-full liquid-glass-btn-secondary text-white/70 hover:text-white font-medium text-[13px] flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="w-2/3 h-12 rounded-full liquid-glass-btn-primary bg-white text-black font-bold text-[13px] flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:bg-white/90 disabled:opacity-60"
              >
                {submitting ? (
                  <span>Saving Review...</span>
                ) : (
                  <>
                    <Star className="w-4 h-4 fill-black text-black" />
                    <span>Publish Review to Leaderboard</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ── SUCCESS VIEW ────────────────────────────────────────────── */}
        {isSuccess && (
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
                  onClose();
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
