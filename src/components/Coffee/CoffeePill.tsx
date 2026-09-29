import React, { useState, useEffect } from 'react';
import { getStoredCoffeeStats, CoffeeStats } from '../../config/razorpay';
import { CoffeeSupportModal } from './CoffeeSupportModal';

export const CoffeePill: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [stats, setStats] = useState<CoffeeStats>(getStoredCoffeeStats());
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) setStats(e.detail);
    };
    window.addEventListener('ryperdeck_coffee_updated', handleUpdate);
    return () => window.removeEventListener('ryperdeck_coffee_updated', handleUpdate);
  }, []);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-pill-amber text-[12px] font-semibold active:scale-95 cursor-pointer ${className}`}
      >
        <span>☕</span>
        <span>Buy Developer a Coffee</span>
        <span className="text-white/30">•</span>
        <span className="font-mono text-white/80">₹{stats.totalAmountInr.toLocaleString()}</span>
      </button>

      <CoffeeSupportModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};
