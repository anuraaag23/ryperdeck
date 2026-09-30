import React, { useState, useEffect } from 'react';
import { Coffee, Heart, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { LiquidGlassCard } from '../LiquidGlass/LiquidGlassCard';
import { getStoredCoffeeStats, syncSupportersFromSupabase, CoffeeStats } from '../../config/kofi';
import { CoffeeSupportModal } from './CoffeeSupportModal';

interface CoffeeSupportCardProps {
  className?: string;
  headline?: string;
  subhead?: string;
}

export const CoffeeSupportCard: React.FC<CoffeeSupportCardProps> = ({
  className = '',
  headline = 'Buy developer a cup of coffee',
  subhead = 'Keep RyperDeck 100% free, open, and fast. Every cup helps us maintain zero-latency Windows drivers and server updates.',
}) => {
  const [stats, setStats] = useState<CoffeeStats>(getStoredCoffeeStats());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInitialAmount, setSelectedInitialAmount] = useState<number>(100);

  useEffect(() => {
    syncSupportersFromSupabase();
    const handleUpdate = (e: any) => {
      if (e.detail) setStats(e.detail);
    };
    window.addEventListener('ryperdeck_coffee_updated', handleUpdate);
    return () => window.removeEventListener('ryperdeck_coffee_updated', handleUpdate);
  }, []);

  const openWithAmount = (amount: number) => {
    setSelectedInitialAmount(amount);
    setModalOpen(true);
  };

  return (
    <>
      <LiquidGlassCard
        className={`p-8 sm:p-10 border border-amber-500/25 bg-gradient-to-b from-[#14120f]/85 to-[#070709]/95 ${className}`}
        glowColor="rgba(245, 158, 11, 0.16)"
      >
        {/* Subtle Warm Amber Refraction Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-8 h-8 rounded-xl liquid-glass-icon-pod liquid-glass-icon-pod-amber text-amber-400 text-sm">
                ☕
              </span>
              <span className="liquid-glass-badge liquid-glass-badge-amber">
                Community Funded
              </span>
            </div>

            <h3 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight leading-tight mb-2">
              {headline}
            </h3>

            <p className="text-[14px] text-white/50 leading-relaxed font-light mb-6">
              {subhead}
            </p>

            {/* Live Automated Counter */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.035] border border-white/[0.1] text-xs shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-white/40">Live Counter:</span>
              <span className="font-mono font-bold text-white">
                ₹{stats.totalAmountInr.toLocaleString()}
              </span>
              <span className="text-white/20">•</span>
              <span className="text-amber-300 font-medium">
                {stats.totalCups} cups gifted
              </span>
              <span className="text-white/20">•</span>
              <span className="text-white/40">
                {stats.supporterCount} supporters
              </span>
            </div>
          </div>

          {/* Quick Pay Action Buttons */}
          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <div className="flex items-center gap-2">
              {[50, 100, 250].map((amt) => (
                <button
                  key={amt}
                  onClick={() => openWithAmount(amt)}
                  className="px-4 py-1.5 rounded-full liquid-glass-btn-secondary text-xs font-semibold text-white/90 active:scale-95 cursor-pointer"
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <button
              onClick={() => openWithAmount(100)}
              className="liquid-glass-btn liquid-glass-btn-amber h-12 px-7 text-[13px] font-bold flex items-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.3)]"
            >
              <span>Buy Developer a Coffee</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <span className="text-[11px] text-white/35 font-light">
              Official Ko-fi Page • Cards, UPI & PayPal
            </span>
          </div>
        </div>
      </LiquidGlassCard>

      <CoffeeSupportModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultAmount={selectedInitialAmount}
      />
    </>
  );
};
