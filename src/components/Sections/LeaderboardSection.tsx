import React, { useState, useEffect } from 'react';
import { LiquidGlassCard } from '../LiquidGlass/LiquidGlassCard';
import { getStoredSupporters, SupporterReview } from '../../config/kofi';
import { Star, Trophy, Award, MessageSquare, Coffee, ExternalLink } from 'lucide-react';
import { CoffeeSupportModal } from '../Coffee/CoffeeSupportModal';

export const LeaderboardSection: React.FC = () => {
  const [supporters, setSupporters] = useState<SupporterReview[]>(getStoredSupporters());
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setSupporters(getStoredSupporters());
    };
    window.addEventListener('ryperdeck_supporters_updated', handleUpdate);
    return () => window.removeEventListener('ryperdeck_supporters_updated', handleUpdate);
  }, []);

  const rankedSupporters = [...supporters].sort((a, b) => b.amount - a.amount);
  const reviews = supporters.filter(s => s.message);

  return (
    <section id="leaderboard" className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-6 bg-black border-t border-white/[0.05] overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-amber-500/06 blur-[180px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="liquid-glass-badge liquid-glass-badge-amber">
              Supporter Leaderboard & Reviews
            </span>
          </div>
          <h2 className="text-[28px] sm:text-[42px] md:text-[52px] font-bold tracking-[-0.03em] leading-tight text-white mb-4">
            Community Hall of Fame.
          </h2>
          <p className="text-[15px] sm:text-[17px] text-white/50 max-w-lg mx-auto leading-relaxed font-light">
            Every cup of coffee powers new Windows companion updates, zero-latency drivers, and free custom layouts.
          </p>

          <div className="mt-7">
            <button
              onClick={() => setModalOpen(true)}
              className="liquid-glass-btn liquid-glass-btn-amber h-11 px-7 text-xs font-bold gap-2 cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.3)]"
            >
              <span>☕ Buy Developer a Coffee & Join Leaderboard</span>
            </button>
          </div>
        </div>

        {/* Dual Layout: Top Leaderboard Table + Live Reviews Wall */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Ranked Leaderboard Table (7 Cols) */}
          <LiquidGlassCard className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl liquid-glass-icon-pod liquid-glass-icon-pod-amber">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  </span>
                  <h3 className="text-[18px] font-bold text-white tracking-tight">
                    Top Contributors
                  </h3>
                </div>
                <span className="liquid-glass-badge font-mono text-[10px]">
                  {rankedSupporters.length} Backers
                </span>
              </div>

              {/* Supporter Rows */}
              {rankedSupporters.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                  <div className="w-12 h-12 rounded-2xl liquid-glass-icon-pod liquid-glass-icon-pod-amber flex items-center justify-center text-2xl">
                    ☕
                  </div>
                  <p className="text-[15px] font-semibold text-white/80">Be the first supporter!</p>
                  <p className="text-[13px] text-white/40 max-w-xs leading-relaxed">
                    Every coffee powers new features, faster updates, and keeps RyperDeck free forever.
                  </p>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="mt-2 liquid-glass-btn liquid-glass-btn-amber h-10 px-6 text-xs font-bold gap-2 cursor-pointer"
                  >
                    <span>☕ Buy a Coffee</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 max-h-[460px] overflow-y-auto scrollbar-none pr-1">
                  {rankedSupporters.map((s, idx) => {
                    return (
                      <div
                        key={s.id}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                          idx === 0
                            ? 'bg-amber-500/[0.1] border-amber-400/40 shadow-[0_4px_20px_rgba(245,158,11,0.15)]'
                            : idx === 1
                            ? 'bg-white/[0.035] border-white/[0.12]'
                            : idx === 2
                            ? 'bg-white/[0.025] border-white/[0.09]'
                            : 'bg-white/[0.015] border-white/[0.05]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Rank Badge */}
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                              idx === 0
                                ? 'bg-amber-400 text-black shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                                : idx === 1
                                ? 'bg-white/20 text-white'
                                : idx === 2
                                ? 'bg-amber-700/40 text-amber-200'
                                : 'bg-white/05 text-white/40'
                            }`}
                          >
                            #{idx + 1}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[14px] font-semibold text-white">
                                {s.name}
                              </span>
                              {s.badge && (
                                <span className="liquid-glass-badge liquid-glass-badge-amber text-[9px] py-0 px-2">
                                  {s.badge}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-white/45">
                              <span className="text-amber-400 flex items-center">
                                ★ {s.rating}.0
                              </span>
                              <span>•</span>
                              <span>{s.cups} cups gifted</span>
                            </div>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="text-right">
                          <div className="text-[14px] font-mono font-bold text-cyan-300">
                            ₹{s.amount.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-white/35">
                            Verified Support
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/[0.06] mt-6 flex items-center justify-between text-[11px] text-white/35">
              <span>Automatically updated after every payment</span>
              <a href="https://ko-fi.com/ryper" target="_blank" rel="noopener noreferrer" className="text-amber-300/80 hover:text-amber-300 hover:underline">
                via ko-fi.com/ryper
              </a>
            </div>
          </LiquidGlassCard>

          {/* Right Column: Verified Reviews Wall (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/45 flex items-center gap-2">
                <span className="w-5 h-5 rounded-lg liquid-glass-icon-pod liquid-glass-icon-pod-cyan">
                  <MessageSquare className="w-3 h-3 text-cyan-400" />
                </span>
                <span>Verified User Reviews ({reviews.length})</span>
              </span>
            </div>

            <div className="flex flex-col gap-3.5 max-h-[540px] overflow-y-auto scrollbar-none pr-1">
              {reviews.length === 0 ? (
                <div className="p-8 rounded-2xl liquid-glass-panel-subtle text-center flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full liquid-glass-icon-pod liquid-glass-icon-pod-cyan flex items-center justify-center text-cyan-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h4 className="text-[14px] font-semibold text-white/90">No reviews yet</h4>
                  <p className="text-[12px] text-white/40 max-w-xs leading-relaxed font-light">
                    Be the first supporter to leave a 5-star review! Your feedback and rating will be proudly featured right here.
                  </p>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="mt-1 px-4 py-1.5 rounded-full liquid-glass-btn text-xs font-semibold text-cyan-300 border border-cyan-400/30 hover:border-cyan-400/60 bg-cyan-500/[0.06] hover:bg-cyan-500/[0.12] transition-all cursor-pointer"
                  >
                    Write the First Review
                  </button>
                </div>
              ) : (
                reviews.map((r) => (
                  <div
                    key={r.id}
                    className="p-5 rounded-2xl liquid-glass-panel-subtle hover:border-white/[0.15] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full liquid-glass-icon-pod text-[11px] font-bold text-white">
                          {r.name.charAt(0)}
                        </div>
                        <span className="text-[13px] font-semibold text-white">
                          {r.name}
                        </span>
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center text-amber-400 text-xs">
                        {[...Array(r.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
                        ))}
                      </div>
                    </div>

                    <p className="text-[12px] text-white/75 leading-relaxed font-light italic mb-3.5">
                      "{r.message}"
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-white/35 font-mono pt-2.5 border-t border-white/[0.04]">
                      <span className="text-cyan-400/90 font-semibold">
                        ₹{r.amount.toLocaleString()} Contribution
                      </span>
                      <span>Verified Supporter</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <CoffeeSupportModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
};
