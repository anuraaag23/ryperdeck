import React, { useState, useEffect } from 'react';
import { Menu, X, Bug } from 'lucide-react';
import { CoffeeSupportModal } from './Coffee/CoffeeSupportModal';
import { getStoredCoffeeStats, CoffeeStats } from '../config/kofi';

interface NavbarProps {
  onRequestFeature?: () => void;
  onReportBug?: () => void;
  isModalOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onRequestFeature, onReportBug, isModalOpen = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coffeeModalOpen, setCoffeeModalOpen] = useState(false);
  const [isCoffeeModalActive, setIsCoffeeModalActive] = useState(false);
  const [stats, setStats] = useState<CoffeeStats>(getStoredCoffeeStats());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) setStats(e.detail);
    };
    const handleCoffeeModal = (e: any) => {
      setIsCoffeeModalActive(!!e.detail?.open);
    };

    window.addEventListener('ryperdeck_coffee_updated', handleUpdate);
    window.addEventListener('ryperdeck_coffee_modal_state', handleCoffeeModal);
    return () => {
      window.removeEventListener('ryperdeck_coffee_updated', handleUpdate);
      window.removeEventListener('ryperdeck_coffee_modal_state', handleCoffeeModal);
    };
  }, []);

  const shouldHideHeader = isModalOpen || isCoffeeModalActive || coffeeModalOpen;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none transition-all duration-300 ${
          shouldHideHeader
            ? 'opacity-0 pointer-events-none -translate-y-6'
            : 'opacity-100 translate-y-0'
        }`}
      >
        <nav
          className={`pointer-events-auto flex items-center justify-between w-full max-w-5xl px-6 py-2.5 rounded-full transition-all duration-500 ${
            scrolled
              ? 'bg-black/35 backdrop-blur-2xl backdrop-saturate-150 border border-white/[0.16] shadow-[0_15px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.25)]'
              : 'bg-white/[0.05] backdrop-blur-xl backdrop-saturate-150 border border-white/[0.12] shadow-[0_10px_35px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.2)]'
          }`}
        >
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="RyperDeck"
              className="h-7 w-auto object-contain pointer-events-none select-none"
              draggable={false}
            />
            <span className="text-[15px] font-semibold tracking-tight text-white group-hover:text-white/85 transition-colors">
              RyperDeck
            </span>
            <span className="hidden sm:inline-flex liquid-glass-badge text-white/60">
              for Windows
            </span>
          </a>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8 text-[13px] text-white/50 font-normal">
            <a href="#current-features" className="hover:text-white transition-colors duration-200">
              Features
            </a>
            <a href="#presets" className="hover:text-white transition-colors duration-200">
              Presets
            </a>
            <a href="#windows" className="hover:text-white transition-colors duration-200">
              Windows Integration
            </a>
            <a href="#comparison" className="hover:text-white transition-colors duration-200">
              vs StreamDeck
            </a>
            <a href="#setup" className="hover:text-white transition-colors duration-200">
              Setup
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">

            {/* Download Button */}
            <a
              href="#download"
              className="text-[13px] font-semibold px-4 py-1.5 rounded-full liquid-glass-btn-primary shadow-sm active:scale-95"
            >
              Download
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-white/60 hover:text-white transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto fixed inset-x-3 sm:inset-x-4 top-[76px] sm:top-20 rounded-3xl bg-black/60 backdrop-blur-3xl backdrop-saturate-150 border border-white/[0.16] p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.85)] md:hidden z-[999] flex flex-col gap-3 sm:gap-4 text-sm animate-fadeIn">
            <a
              href="#current-features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/70 py-2 border-b border-white/[0.05]"
            >
              What it offers right now
            </a>
            <a
              href="#presets"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/70 py-2 border-b border-white/[0.05]"
            >
              Default Presets (.json)
            </a>
            <a
              href="#windows"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/70 py-2 border-b border-white/[0.05]"
            >
              Windows PC Integration
            </a>
            <a
              href="#comparison"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/70 py-2 border-b border-white/[0.05]"
            >
              StreamDeck Comparison
            </a>
            <a
              href="#setup"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/70 py-2 border-b border-white/[0.05]"
            >
              Setup Guide
            </a>


            {/* Report a Bug — mobile */}
            {onReportBug && (
              <button
                onClick={() => { setMobileMenuOpen(false); onReportBug(); }}
                className="flex items-center gap-2 text-white/70 py-2 border-b border-white/[0.05] cursor-pointer text-left"
              >
                <Bug className="w-4 h-4 text-red-400/60" />
                Report a Bug
              </button>
            )}

            <a
              href="#download"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-full liquid-glass-btn-primary font-bold text-center text-xs"
            >
              Download for Windows
            </a>
          </div>
        )}
      </header>

      <CoffeeSupportModal
        isOpen={coffeeModalOpen}
        onClose={() => setCoffeeModalOpen(false)}
      />
    </>
  );
};
