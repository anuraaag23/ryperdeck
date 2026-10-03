import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal } from '../Reveal';

const slides = [
  { name: 'Home Tab',             src: '/screenshots/home_tab.jpg' },
  { name: 'Pages Tab',            src: '/screenshots/pages_tab.jpg' },
  { name: 'Keyboard & Mouse Tab', src: '/screenshots/keyboard_mouse_tab.jpg' },
  { name: 'Media Page',           src: '/screenshots/media_page.jpg' },
  { name: 'Widgets Tab',          src: '/screenshots/widgets_tab.png' },
  { name: 'Recent Window',        src: '/screenshots/recent_window.jpg' },
  { name: 'Websites Page',        src: '/screenshots/websites_page.jpg' },
  { name: 'Browser Basic Page',   src: '/screenshots/browser_basic_page.jpg' },
];

export const AppShowcaseSection: React.FC = () => {
  const [current, setCurrent]       = useState(0);
  const [dir, setDir]               = useState<'right' | 'left'>('right');
  const [animKey, setAnimKey]       = useState(0);
  const [nameKey, setNameKey]       = useState(0);
  const touchStartX                 = useRef<number | null>(null);

  const go = useCallback((nextIdx: number, direction: 'right' | 'left') => {
    setDir(direction);
    setAnimKey(k => k + 1);
    setNameKey(k => k + 1);
    setCurrent(nextIdx);
  }, []);

  const prev = useCallback(() => {
    go((current - 1 + slides.length) % slides.length, 'left');
  }, [current, go]);

  const next = useCallback(() => {
    go((current + 1) % slides.length, 'right');
  }, [current, go]);

  // Auto-swipe screenshot every 5 seconds (5000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      go((current + 1) % slides.length, 'right');
    }, 5000);
    return () => clearInterval(timer);
  }, [current, go]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <section
      id="app-showcase"
      className="relative flex flex-col items-center justify-center px-4 sm:px-6 py-20 sm:py-28 md:py-36 overflow-hidden bg-black"
    >
      {/* Top divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-white/[0.07]" />

      {/* Ambient optical bloom (subtle neutral, no color gradient) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-white/[0.02] blur-[180px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center">

        {/* Header */}
        <Reveal direction="up" className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] backdrop-blur-xl text-[11px] font-medium tracking-widest uppercase text-white/70 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            App Showcase
          </span>
          <h2 className="text-[28px] sm:text-[42px] md:text-[54px] font-bold tracking-[-0.04em] leading-[1.03] text-white mb-4">
            Crazy pages you will{' '}
            <span className="text-white/60">
              customize yourself.
            </span>
          </h2>
        </Reveal>

        {/* Tablet + controls */}
        <Reveal direction="scale" delay={120} className="relative flex flex-col items-center gap-8">

          {/* ── Xiaomi Pad 6 frame (CSS-only, landscape) ── */}
          <div
            className="relative select-none"
            style={{ width: 720, maxWidth: 'min(96vw, 720px)' }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Outer chassis — dark aluminum glass bezel */}
            <div className="relative rounded-[20px] sm:rounded-[32px] p-1.5 sm:p-[10px] bg-[#16161c] shadow-[0_60px_140px_-30px_rgba(0,0,0,0.98),inset_0_1.5px_1px_rgba(255,255,255,0.22),inset_0_-1px_1px_rgba(0,0,0,0.6)] border border-white/[0.1]">
              {/* Camera + sensors strip (left side) */}
              <div className="absolute left-[3px] sm:left-[5px] top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 sm:gap-1.5">
                <div className="w-[5px] h-[5px] sm:w-[6px] sm:h-[6px] rounded-full bg-[#1c1c22] border border-white/[0.12] shadow-inner" />
                <div className="w-[3px] h-[3px] sm:w-[4px] sm:h-[4px] rounded-full bg-[#1c1c22] border border-white/[0.08]" />
              </div>
              {/* Volume + power buttons (right side) */}
              <div className="absolute right-[-3px] top-1/3 w-[3px] h-[22px] sm:h-[28px] rounded-l-sm bg-[#222228] border border-white/[0.08]" />
              <div className="absolute right-[-3px] top-1/2 w-[3px] h-[16px] sm:h-[20px] rounded-l-sm bg-[#222228] border border-white/[0.08]" />

              {/* Inner screen bezel */}
              <div className="relative rounded-[14px] sm:rounded-[22px] overflow-hidden bg-black border border-white/[0.06]" style={{ aspectRatio: '16/10' }}>
                {/* Continuous Sliding Pages Track */}
                <div
                  className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ transform: `translateX(-${current * 100}%)` }}
                >
                  {slides.map((s, idx) => (
                    <div key={idx} className="w-full h-full shrink-0 relative bg-black">
                      <img
                        src={s.src}
                        alt={s.name}
                        className="w-full h-full object-cover pointer-events-none select-none"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
                {/* Glass screen reflection */}
                <div className="absolute inset-0 bg-white/[0.015] pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-px bg-white/20 pointer-events-none" />
              </div>
            </div>

            {/* Ambient shadow under tablet */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full bg-black blur-2xl opacity-80" />
          </div>

          {/* Quick Tab Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 max-w-2xl px-1 sm:px-2">
            {slides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => go(idx, idx > current ? 'right' : 'left')}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-[12px] transition-all duration-200 cursor-pointer ${
                  current === idx
                    ? 'bg-white text-black font-semibold shadow-md shadow-white/20 scale-[1.02]'
                    : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* Slide name — animates on change */}
          <div className="h-8 flex items-center justify-center">
            <p
              key={nameKey}
              className="slide-name-in text-[15px] font-medium text-white/80 tracking-wide"
            >
              {slides[current].name}
            </p>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i, i > current ? 'right' : 'left')}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-6 h-2 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]'
                    : 'w-2 h-2 bg-white/25 hover:bg-white/50'
                }`}
                aria-label={slides[i].name}
              />
            ))}
          </div>

          {/* Arrow controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={prev}
              className="liquid-glass-btn liquid-glass-btn-secondary h-[44px] w-[44px] rounded-full !px-0 justify-center cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 text-white/80" />
            </button>
            <span className="text-[12px] text-white/35 font-mono tracking-wider">
              {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
            <button
              onClick={next}
              className="liquid-glass-btn liquid-glass-btn-primary h-[44px] w-[44px] rounded-full !px-0 justify-center cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.25)]"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 text-black" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
