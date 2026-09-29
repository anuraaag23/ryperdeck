import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, ChevronLeft, ChevronRight, CheckCircle2, FolderArchive } from 'lucide-react';
import { Reveal } from '../Reveal';

const slides = [
  { name: 'Media Controls', src: '/screenshots/phone_slide_1.jpg' },
  { name: 'Visual Layout', src: '/screenshots/phone_slide_2.jpg' },
  { name: 'Run Mode Deck', src: '/screenshots/phone_slide_3.jpg' },
];

export const PhoneShowcaseSection: React.FC = () => {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-swipe every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => setActive((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setActive((prev) => (prev - 1 + slides.length) % slides.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <section className="relative py-24 sm:py-32 md:py-40 px-4 sm:px-6 bg-black border-t border-white/[0.05] overflow-hidden">
      {/* Subtle background caustics */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-blue-600/[0.02] blur-[180px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        
        {/* Left Column — Phone Mockup with Auto-swiping Carousel */}
        <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
          <Reveal direction="scale">
            <div
              className="relative group select-none"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Ambient phone back-glow */}
              <div className="absolute -inset-4 rounded-[50px] bg-white/[0.02] blur-3xl opacity-75 pointer-events-none" />

              {/* Phone Chassis */}
              <div className="relative w-[270px] sm:w-[300px] md:w-[320px] rounded-[48px] p-[10px] sm:p-[12px] bg-[#121318] border border-white/[0.14] shadow-[0_50px_120px_-20px_rgba(0,0,0,0.98),inset_0_1px_1px_rgba(255,255,255,0.25)]">
                
                {/* Top bezel: Green connection dot & speaker slit */}
                <div className="absolute top-[8px] left-6 flex items-center gap-1.5 z-20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-white/10 z-20" />

                {/* Left/Right physical hardware button notches */}
                <div className="absolute -left-[3px] top-[140px] w-[3px] h-[34px] rounded-r-sm bg-[#1e2029] border border-white/[0.08]" />
                <div className="absolute -left-[3px] top-[185px] w-[3px] h-[48px] rounded-r-sm bg-[#1e2029] border border-white/[0.08]" />
                <div className="absolute -right-[3px] top-[160px] w-[3px] h-[44px] rounded-l-sm bg-[#1e2029] border border-white/[0.08]" />

                {/* Phone Screen Screen Area with 1260/2800 aspect ratio */}
                <div
                  className="relative rounded-[38px] overflow-hidden bg-black border border-white/[0.08] shadow-inner"
                  style={{ aspectRatio: '1260 / 2800' }}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Sliding Pages Container */}
                  <div
                    className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    style={{ transform: `translateX(-${active * 100}%)` }}
                  >
                    {slides.map((slide, idx) => (
                      <div key={idx} className="w-full h-full shrink-0 relative bg-black">
                        <img
                          src={slide.src}
                          alt={slide.name}
                          className="w-full h-full object-contain pointer-events-none select-none"
                          draggable={false}
                        />
                        {/* Glass shine specular overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] via-transparent to-transparent pointer-events-none" />
                      </div>
                    ))}
                  </div>

                  {/* Manual Navigation Arrows (hover on desktop) */}
                  <button
                    onClick={prevSlide}
                    aria-label="Previous Page"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/70 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    aria-label="Next Page"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/70 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Bottom Page Indicator Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActive(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          active === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right Column — Editorial Copy matching PhoneDeck format */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <Reveal direction="up">
            <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#4e82ee] mb-4 block">
              ANDROID
            </span>
          </Reveal>

          <Reveal direction="up" delay={80}>
            <h2 className="text-[46px] sm:text-[64px] md:text-[76px] font-bold tracking-[-0.04em] leading-[0.98] mb-8">
              <span className="text-white block">Pick up.</span>
              <span className="text-white block">Tap.</span>
              <span className="text-[#4e82ee] block">Done.</span>
            </h2>
          </Reveal>

          <Reveal direction="up" delay={140}>
            <div className="space-y-6 text-[15px] sm:text-[17px] text-white/50 leading-relaxed font-light mb-10 max-w-xl">
              <p>
                Leave your phone charging beside your PC. RyperDeck finds it automatically, reconnects every time you wake your PC, and stays completely invisible until you need it.
              </p>
              <p>
                Swipe between pages — Media, Gaming, Work, System. Tap any tile to instantly trigger that macro or shortcut on your Windows PC. Lay it flat and the tiles stay completely responsive.
              </p>
              <p>
                Control your Windows PC volume, per-app audio mixer, OBS scenes, mute toggles, and shortcut macros — directly from your phone. Zero setup delay.
              </p>
              <p className="text-[13px] text-white/35 font-light pt-1">
                Requires Android 8+. 100% Free, lightweight, zero telemetry.
              </p>
            </div>
          </Reveal>

          {/* Download Action Buttons */}
          <Reveal direction="up" delay={200}>
            <div className="flex flex-wrap items-center gap-3.5">
              <a
                href="https://github.com/anuraaag23/ryperdeck/releases/download/v1.0.0/RyperDeck.apk"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[#0c0d12] hover:bg-[#14151e] border border-white/20 hover:border-white/40 shadow-[0_12px_36px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.25)] text-white text-[13px] font-semibold transition-all group active:scale-95 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-white/40 uppercase tracking-wider font-mono">Download Android APK</div>
                  <div className="text-[15px] font-bold text-white tracking-tight leading-none mt-0.5">RyperDeck Mobile</div>
                </div>
              </a>

              <a
                href="https://github.com/anuraaag23/ryperdeck/releases/download/v1.0.0/RyperDeck_Complete_Package.zip"
                className="inline-flex items-center gap-2.5 px-5 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.14] hover:border-white/[0.28] text-white text-[13px] font-semibold transition-all group active:scale-95 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              >
                <FolderArchive className="w-4 h-4 text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span>Download Both as zip file</span>
              </a>

              <div className="flex items-center gap-2 text-xs text-white/40 ml-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Latency · UDP Wi-Fi</span>
              </div>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
};
