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
  Coffee
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  KOFI_CONFIG,
  addSupporter,
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
  const [selectedAmount, setSelectedAmount] = useState<number>(defaultAmount);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [supporterName, setSupporterName] = useState<string>('');
  const [supporterMessage, setSupporterMessage] = useState<string>('');
  const [paymentRef, setPaymentRef] = useState<string>('');
  const [starRating, setStarRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [poppedStar, setPoppedStar] = useState<number>(0);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('ryperdeck_coffee_modal_state', { detail: { open: isOpen } })
    );
  }, [isOpen]);
  const [stats, setStats] = useState<CoffeeStats>(getStoredCoffeeStats());

  // Modal steps: 'details' | 'success'
  const [step, setStep] = useState<'details' | 'success'>('details');

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
      setPaymentRef('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount;
  const estimatedCups = Math.max(1, Math.round(currentAmount / 50));

  // Handle Ko-fi payment & review submission
  const handleSupportOnKofi = () => {
    const finalAmount = currentAmount > 0 ? currentAmount : 100;
    const finalName = supporterName.trim() || 'Anonymous Supporter';
    const ref = paymentRef.trim() || `kofi-${Date.now()}`;

    // Open Ko-fi in a new tab
    window.open(KOFI_CONFIG.url, '_blank', 'noopener,noreferrer');

    // Register supporter locally and in Supabase
    addSupporter(finalName, finalAmount, estimatedCups, starRating, supporterMessage, ref);
    submitSupporter({
      name: finalName,
      amount: finalAmount,
      cups: estimatedCups,
      rating: starRating,
      message: supporterMessage,
      paymentId: ref,
    });

    setStep('success');

    try {
      confetti({
        particleCount: 120,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#f59e0b', '#38bdf8', '#34d399', '#ff5f5f'],
      });
    } catch {
      // Confetti fallback
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
      <div className="relative w-full max-w-lg rounded-t-[34px] sm:rounded-[34px] bg-[#0c0d14] border border-white/[0.15] p-6 sm:p-8 shadow-[0_40px_100px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.3)] max-h-[88vh] overflow-y-auto scrollbar-none my-auto">
        
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
              <div className="w-11 h-11 rounded-2xl liquid-glass-icon-pod liquid-glass-icon-pod-amber text-xl text-white shadow-md flex items-center justify-center">
                ☕
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                  Support the Developer
                </span>
                <h3 className="text-[22px] font-bold text-white tracking-tight leading-tight">
                  Buy a Coffee on Ko-fi
                </h3>
              </div>
            </div>

            {/* Verified Ko-fi Creator Badge */}
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass-badge text-white/70">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official Ko-fi Page:</span>
              <a
                href={KOFI_CONFIG.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 font-mono font-medium hover:underline inline-flex items-center gap-1"
              >
                {KOFI_CONFIG.handle}
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
                        ? 'bg-amber-500/20 border-amber-400/60 text-white shadow-[0_0_20px_rgba(245,158,11,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)]'
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
                3. Your Name <span className="text-white/30 text-[10px] font-normal">(Shown on Leaderboard)</span>
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
            <div className="mb-3.5">
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

            {/* Step 5: Optional Ko-fi Nickname / Note */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                5. Ko-fi Name or Note <span className="text-white/30 text-[10px] font-normal">(Optional reference)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. @your_kofi_name or payment note"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                className="w-full h-11 px-3.5 rounded-2xl liquid-glass-input text-xs"
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
                <span>Cancel</span>
              </button>

              <button
                type="button"
                onClick={handleSupportOnKofi}
                className="w-2/3 h-12 rounded-full liquid-glass-btn-amber bg-amber-400 hover:bg-amber-300 text-black font-bold text-[13px] flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_30px_rgba(245,158,11,0.35)] transition-all"
              >
                <span>☕ Support on Ko-fi</span>
                <ExternalLink className="w-3.5 h-3.5 text-black/70" />
              </button>
            </div>

            <div className="mt-3 text-center text-[10px] text-white/35">
              Opens ko-fi.com/ryper in a secure tab • Your review &amp; rating will be published on the Community Leaderboard
            </div>
          </div>
        )}

        {/* STEP: SUCCESSFUL PAYMENT & REVIEW SUBMISSION */}
        {step === 'success' && (
          <div className="text-center py-6 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 mb-1 block">
              Review Added ✓
            </span>

            <h3 className="text-[22px] font-bold text-white mb-2">
              Thank You for Supporting!
            </h3>

            <p className="text-[13px] text-white/60 max-w-sm mx-auto leading-relaxed mb-6 font-light">
              Your contribution of <strong className="text-amber-300">₹{currentAmount || 100}</strong> ({estimatedCups} cups) and <strong className="text-amber-300">{starRating} Stars</strong> review is now live on the Community Leaderboard.
            </p>

            <div className="mb-6 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-[12px] text-white/70 max-w-sm mx-auto">
              <p className="mb-2">If your Ko-fi tab didn't open automatically, you can complete your contribution here:</p>
              <a
                href={KOFI_CONFIG.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-amber-300 font-mono font-medium hover:underline text-xs"
              >
                <span>ko-fi.com/ryper</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

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
