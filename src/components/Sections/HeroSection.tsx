import React, { useEffect, useState } from 'react';
import { Lightbulb, Bug, Sparkles } from 'lucide-react';
import { getLifetimeVisitors, subscribeVisitorUpdates } from '../../utils/visitors';
import { Reveal } from '../Reveal';

interface Props {
  onRequestFeature: () => void;
  onReportBug: () => void;
}

export const HeroSection: React.FC<Props> = ({ onRequestFeature, onReportBug }) => {
  const [visitors, setVisitors] = useState<number>(getLifetimeVisitors());

  useEffect(() => {
    setVisitors(getLifetimeVisitors());
    const unsubscribe = subscribeVisitorUpdates((newCount) => {
      setVisitors(newCount);
    });
    return () => unsubscribe();
  }, []);

  const scrollToNext = () => {
    const el = document.getElementById('current-features') || document.getElementById('developer-story') || document.querySelector('section:nth-of-type(2)');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-28 sm:pt-36 pb-16 sm:pb-20 overflow-hidden bg-black">
      {/* Neutral optical caustics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[900px] h-[480px] rounded-full bg-white/[0.025] blur-[180px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl mx-auto">

        {/* Status pill */}
        <Reveal direction="up">
          <div className="mb-8 sm:mb-10 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.03] backdrop-blur-xl text-[11px] text-white/70 font-medium tracking-widest uppercase shadow-[0_4px_24px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>Windows 11 &amp; 10 · Multipeer Wi-Fi · Free Forever</span>
          </div>
        </Reveal>

        {/* Hero headline */}
        <Reveal direction="up" delay={80}>
          <h1 className="text-[34px] sm:text-[60px] md:text-[88px] lg:text-[102px] font-bold tracking-[-0.045em] leading-[0.97] max-w-4xl text-white mb-6 sm:mb-7">
            The Windows<br />
            <span className="text-white/80">controller</span>
            <br />
            <span className="text-white/45">you already own.</span>
          </h1>
        </Reveal>

        {/* Subhead */}
        <Reveal direction="up" delay={140}>
          <p className="text-[14px] sm:text-[17px] md:text-[19px] text-white/45 max-w-[540px] leading-relaxed font-light mb-6 px-2">
            Your phone or tablet is already an OLED multi-touch display. RyperDeck turns it into an ultra-fluid liquid glass macro deck for Windows. Free, forever.
          </p>
        </Reveal>

        {/* Real-time lifetime visitor counter badge */}
        <Reveal direction="up" delay={180}>
          <div className="mb-8 sm:mb-9 inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[11px] sm:text-[12px] text-white/60 font-medium shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>
              <strong className="text-white font-semibold font-mono tracking-tight">{visitors.toLocaleString()}</strong> lifetime visitors
            </span>
            <span className="text-white/20">•</span>
            <span className="text-white/40 text-[10px] sm:text-[11px]">Real-time count</span>
          </div>
        </Reveal>

        {/* Action Buttons: Request a Feature & Report a Bug (Replaces Buy a Coffee) */}
        <Reveal direction="up" delay={220}>
          <div className="mb-10 sm:mb-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 max-w-md sm:max-w-none w-full px-2">
            <button
              onClick={onRequestFeature}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full liquid-glass-btn-primary text-white text-[13px] sm:text-[14px] font-semibold cursor-pointer active:scale-95 transition-all shadow-[0_12px_36px_rgba(255,255,255,0.12)] w-full sm:w-auto"
            >
              <Lightbulb className="w-4 h-4" />
              Request a Feature
            </button>

            <button
              onClick={onReportBug}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full liquid-glass-btn border border-white/[0.12] hover:border-white/[0.22] bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white text-[13px] sm:text-[14px] font-semibold cursor-pointer active:scale-95 transition-all w-full sm:w-auto"
            >
              <Bug className="w-4 h-4 text-red-400/80" />
              Report a Bug
            </button>

            <a
              href="#current-features"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-white/[0.08] hover:border-white/[0.16] bg-white/[0.02] hover:bg-white/[0.05] text-white/50 hover:text-white/80 text-[13px] font-medium transition-all w-full sm:w-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              What it offers right now
            </a>
          </div>
        </Reveal>

        {/* Scroll Indicator */}
        <Reveal direction="up" delay={260}>
          <div className="mt-2 flex flex-col items-center gap-3">
            <p className="text-[10px] font-medium tracking-[0.35em] uppercase text-white/35">
              Scroll to Explore
            </p>
            <button
              onClick={scrollToNext}
              aria-label="Scroll to explore"
              className="group flex flex-col items-center gap-1.5 cursor-pointer"
            >
              <div className="relative w-[26px] h-[40px] rounded-[14px] border-2 border-white/25 group-hover:border-white/60 transition-colors duration-500 flex items-start justify-center pt-[6px]">
                <div className="w-[4px] h-[8px] rounded-full bg-white opacity-95 animate-scroll-dot" />
              </div>
              <svg className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors duration-500 mt-0.5" fill="none" viewBox="0 0 16 16">
                <path d="M4 5.5L8 9.5L12 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 8.5L8 12.5L12 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
              </svg>
            </button>
          </div>
        </Reveal>

      </div>
    </section>
  );
};
