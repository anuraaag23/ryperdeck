import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getTopSupporters, SupporterReview } from '../../config/razorpay';
import { Star, MessageSquare, X, Award } from 'lucide-react';
import { CoffeeSupportModal } from './CoffeeSupportModal';

export const TopSupportersBar: React.FC = () => {
  const [topSupporters, setTopSupporters] = useState<SupporterReview[]>(getTopSupporters(4));
  const [selectedSupporter, setSelectedSupporter] = useState<SupporterReview | null>(null);
  const [coffeeModalOpen, setCoffeeModalOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setTopSupporters(getTopSupporters(4));
    };
    window.addEventListener('ryperdeck_supporters_updated', handleUpdate);
    return () => window.removeEventListener('ryperdeck_supporters_updated', handleUpdate);
  }, []);

  useEffect(() => {
    if (selectedSupporter) {
      window.dispatchEvent(
        new CustomEvent('ryperdeck_coffee_modal_state', { detail: { open: true } })
      );
      return () => {
        window.dispatchEvent(
          new CustomEvent('ryperdeck_coffee_modal_state', { detail: { open: false } })
        );
      };
    }
  }, [selectedSupporter]);

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return '👑 #1';
      case 1:
        return '🥈 #2';
      case 2:
        return '🥉 #3';
      default:
        return '🎖️ #4';
    }
  };

  if (topSupporters.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center gap-2 mt-4">
          <button
            onClick={() => setCoffeeModalOpen(true)}
            className="group inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/[0.08] hover:bg-amber-500/[0.15] border border-amber-400/30 hover:border-amber-400/60 transition-all text-xs cursor-pointer active:scale-95 shadow-[0_4px_16px_rgba(245,158,11,0.15)]"
          >
            <span className="text-amber-400">☕</span>
            <span className="font-semibold text-white/90 group-hover:text-white">Be the first supporter</span>
            <span className="text-amber-400/80 font-mono text-[11px]">— Buy developer a coffee</span>
          </button>
        </div>
        <CoffeeSupportModal
          isOpen={coffeeModalOpen}
          onClose={() => setCoffeeModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2.5 mt-4">
      {/* Top 4 Members Strip */}
      <div className="flex items-center gap-2.5 flex-wrap justify-center">
        <span className="text-[11px] text-white/40 uppercase tracking-widest font-mono mr-1">
          Top Supporters:
        </span>

        {topSupporters.map((supporter, idx) => (
          <button
            key={supporter.id}
            onClick={() => setSelectedSupporter(supporter)}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-md border border-white/[0.1] hover:border-amber-400/50 transition-all text-xs active:scale-95 shadow-[0_4px_15px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)]"
            title="Click to view comment and 5-star review"
          >
            <span className="text-[10px] font-bold text-amber-400">
              {getRankBadge(idx)}
            </span>
            <span className="font-semibold text-white/90 group-hover:text-white">
              {supporter.name}
            </span>
            <span className="text-[11px] font-mono text-white/80">
              ₹{supporter.amount.toLocaleString()}
            </span>
            <span className="flex items-center text-amber-400 text-[10px]">
              ★ {supporter.rating}
            </span>
          </button>
        ))}
      </div>

      <span className="text-[10px] text-white/35 tracking-wide font-light">
        Tap any member to read their verified review & comment
      </span>

      {/* Supporter Review Modal */}
      {selectedSupporter && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-fadeIn"
          style={{ zIndex: 9999999 }}
        >
          <div className="relative w-full max-w-md rounded-[32px] bg-[#090a12]/95 border border-white/[0.15] p-7 sm:p-8 shadow-[0_40px_100px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.3)]">
            {/* Close Button */}
            <button
              onClick={() => setSelectedSupporter(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.12] text-white/50 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Supporter Header */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-2xl liquid-glass-icon-pod liquid-glass-icon-pod-amber text-xl font-bold text-white shadow-lg">
                {selectedSupporter.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-white">
                    {selectedSupporter.name}
                  </h4>
                  {selectedSupporter.badge && (
                    <span className="liquid-glass-badge liquid-glass-badge-amber text-[10px]">
                      {selectedSupporter.badge}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-white/45 mt-0.5">
                  <span className="font-mono text-cyan-300 font-semibold">
                    ₹{selectedSupporter.amount.toLocaleString()} contributed
                  </span>
                  <span>•</span>
                  <span>{selectedSupporter.cups} cups gifted</span>
                </div>
              </div>
            </div>

            {/* 5-Star Rating */}
            <div className="flex items-center gap-1.5 mb-5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
              <span className="text-xs text-white/50 mr-2">Verified Rating:</span>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < selectedSupporter.rating
                      ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                      : 'text-white/20'
                  }`}
                />
              ))}
              <span className="text-xs font-bold text-amber-300 ml-1.5">
                {selectedSupporter.rating}.0 / 5.0
              </span>
            </div>

            {/* Comment Body */}
            <div className="mb-6 p-4 rounded-2xl bg-black/60 border border-white/[0.08] relative">
              <MessageSquare className="w-4 h-4 text-cyan-400 absolute top-4 left-4" />
              <p className="text-sm text-white/85 leading-relaxed pl-7 font-light italic">
                "{selectedSupporter.message || 'Proud to support RyperDeck Windows companion development!'}"
              </p>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedSupporter(null);
                  setCoffeeModalOpen(true);
                }}
                className="w-full h-11 rounded-full liquid-glass-btn-amber text-xs font-bold flex items-center justify-center gap-2"
              >
                <span>Join the Leaderboard</span>
                <span>☕</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Coffee Payment Modal */}
      <CoffeeSupportModal
        isOpen={coffeeModalOpen}
        onClose={() => setCoffeeModalOpen(false)}
      />
    </div>
  );
};
