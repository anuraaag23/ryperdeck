import React, { useState, useEffect } from 'react';
import { CoffeeSupportModal } from './CoffeeSupportModal';
import { getStoredCoffeeStats, CoffeeStats } from '../../config/razorpay';

export const FloatingCoffeeWidget: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isExternalModalOpen, setIsExternalModalOpen] = useState(false);
  const [stats, setStats] = useState<CoffeeStats>(getStoredCoffeeStats());
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) setStats(e.detail);
    };
    const handleModalState = (e: any) => {
      setIsExternalModalOpen(!!e.detail?.open);
    };

    window.addEventListener('ryperdeck_coffee_updated', handleUpdate);
    window.addEventListener('ryperdeck_coffee_modal_state', handleModalState);
    return () => {
      window.removeEventListener('ryperdeck_coffee_updated', handleUpdate);
      window.removeEventListener('ryperdeck_coffee_modal_state', handleModalState);
    };
  }, []);

  const isHidden = modalOpen || isExternalModalOpen;

  return (
    <>
      <div
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 pointer-events-auto transition-all duration-300 ${
          isHidden
            ? 'opacity-0 pointer-events-none scale-75 translate-y-4'
            : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        <button
          onClick={() => setModalOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative flex items-center gap-3 px-4 py-2.5 rounded-full liquid-glass-panel border border-white/[0.18] hover:border-white/40 shadow-[0_16px_40px_rgba(0,0,0,0.85),inset_0_1px_1.5px_rgba(255,255,255,0.35)] cursor-pointer transition-all duration-300 animate-float-coffee active:scale-95"
          aria-label="Buy Developer a Coffee"
          title="Buy developer a coffee"
        >
          {/* Coffee Cup with Animated Steam */}
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.08] border border-white/[0.12] text-base shrink-0 shadow-inner">
            {/* Steam wisps rising */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
              <span className="w-0.5 h-2 bg-white/60 rounded-full animate-steam-1" />
              <span className="w-0.5 h-2.5 bg-white/80 rounded-full animate-steam-2" />
              <span className="w-0.5 h-2 bg-white/60 rounded-full animate-steam-3" />
            </div>
            <span>☕</span>
          </div>

          {/* Text and stats */}
          <div className="flex flex-col text-left pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-bold text-white tracking-tight group-hover:text-white transition-colors">
                Buy Coffee
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[10px] font-mono text-white/50 leading-none mt-0.5">
              ₹{stats.totalAmountInr.toLocaleString()} · {stats.totalCups} cups
            </span>
          </div>

          {/* Interactive expansion glow */}
          <div className="absolute inset-0 rounded-full bg-white/[0.03] group-hover:bg-white/[0.08] transition-colors pointer-events-none" />
        </button>
      </div>

      <CoffeeSupportModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};
