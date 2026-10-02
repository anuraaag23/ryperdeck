import React, { useState, useEffect, useCallback } from 'react';
import { Download, Mail, Check, Smartphone, Monitor, FolderArchive } from 'lucide-react';

const pcSlides = [
  '/screenshots/pc_app_preview_1.png',
  '/screenshots/pc_app_preview_2.png',
  '/screenshots/pc_app_preview_3.png',
];

import { submitSubscriberEmail } from '../../lib/supabase';

const EMAIL_KEY       = 'ryperdeck_notify_email';
const EMAIL_ARRAY_KEY = 'ryperdeck_notify_emails';

export const PCAppShowcaseSection: React.FC = () => {
  const [pcSlide, setPcSlide]         = useState(0);
  const [notifyOpen, setNotifyOpen]   = useState(false);
  const [email, setEmail]             = useState('');
  const [notified, setNotified]       = useState(false);

  // Auto-cycle PC screenshots every 3 s
  useEffect(() => {
    const t = setInterval(() => {
      setPcSlide(s => (s + 1) % pcSlides.length);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const handleNotify = useCallback(async () => {
    const trimmed = email.trim();
    if (!trimmed || !/\S+@\S+\.\S+/.test(trimmed)) return;
    
    // Submit to Supabase database
    await submitSubscriberEmail(trimmed);

    // Store single (for backward compat)
    localStorage.setItem(EMAIL_KEY, trimmed);
    setNotified(true);
    setNotifyOpen(false);
  }, [email]);

  return (
    <section
      id="pc-showcase"
      className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-6 overflow-hidden bg-black"
    >
      {/* Divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-white/[0.07]" />

      {/* Neutral optical caustics */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-white/[0.02] blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] backdrop-blur-xl text-[11px] font-medium tracking-widest uppercase text-white/80 mb-6">
            <Monitor className="w-3 h-3 text-white/70" />
            Windows App
          </span>
          <h2 className="text-[28px] sm:text-[42px] md:text-[54px] font-bold tracking-[-0.04em] leading-[1.03] text-white mb-4">
            The perfect pair.{' '}
            <span className="text-white/60">
              PC meets phone.
            </span>
          </h2>
          <p className="text-[16px] text-white/40 font-light max-w-md mx-auto">
            One lightweight Windows service. One beautiful companion app. Zero subscriptions.
          </p>
        </div>

        {/* Devices row */}
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-center gap-8 lg:gap-16 mb-10 sm:mb-14">

          {/* ── PC Monitor (CSS-only) ── */}
          <div className="flex flex-col items-center gap-4">
            {/* Monitor body */}
            <div className="relative" style={{ width: 560, maxWidth: 'min(90vw, 560px)' }}>
              {/* Outer bezel */}
              <div className="relative rounded-[14px] pt-[10px] px-[10px] pb-[34px] bg-[#14141a] border border-white/[0.12] shadow-[0_60px_130px_-30px_rgba(0,0,0,0.98),inset_0_1.5px_1px_rgba(255,255,255,0.2)]">
                {/* Top camera dot */}
                <div className="absolute top-[4px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-[#1c1c24] border border-white/[0.08]" />
                {/* Screen */}
                <div className="relative rounded-[8px] overflow-hidden bg-black border border-white/[0.07]" style={{ aspectRatio: '16/9' }}>
                  {pcSlides.map((src, i) => (
                    <img
                      key={src}
                      src={src}
                      alt={`RyperDeck PC view ${i + 1}`}
                      className="absolute inset-0 w-full h-full object-cover showcase-image pointer-events-none select-none transition-opacity duration-700"
                      style={{ opacity: i === pcSlide ? 1 : 0 }}
                      draggable={false}
                    />
                  ))}
                  {/* Glare */}
                  <div className="absolute inset-0 bg-white/[0.015] pointer-events-none" />
                  <div className="absolute inset-x-0 top-0 h-px bg-white/15 pointer-events-none" />
                  {/* Slide dots overlay */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {pcSlides.map((_, i) => (
                      <div
                        key={i}
                        className={`h-[3px] rounded-full transition-all duration-500 ${
                          i === pcSlide ? 'w-5 bg-white/90' : 'w-[6px] bg-white/25'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {/* Monitor chin brand */}
                <div className="absolute bottom-[12px] left-1/2 -translate-x-1/2 text-[8px] font-medium tracking-widest text-white/20 uppercase">
                  RyperDeck for Windows
                </div>
              </div>
              {/* Stand neck */}
              <div className="mx-auto w-[40px] h-[22px] bg-[#141419] rounded-b-sm" />
              {/* Stand base */}
              <div className="mx-auto w-[120px] h-[6px] rounded-full bg-[#18181f] border border-white/[0.06]" />
            </div>

            {/* Windows download button */}
            <a
              href="https://github.com/anuraaag23/ryperdeck/releases/download/v1.0.0/RyperDeckAgent.exe"
              className="liquid-glass-btn liquid-glass-btn-primary h-[48px] px-8 text-[13px] font-bold gap-2.5 mt-1 cursor-pointer active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.22)]"
            >
              <Download className="w-4 h-4 text-black" />
              Download for Windows (.exe)
            </a>
          </div>

          {/* ── Android Phone Mockup (portrait) ── */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative" style={{ width: 196, maxWidth: 'min(45vw, 200px)' }}>
              {/* Chassis */}
              <div className="relative rounded-[32px] p-[8px] bg-[#141419] border border-white/[0.12] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.97),inset_0_1px_1px_rgba(255,255,255,0.2)]">
                {/* Punch hole front camera top center */}
                <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[7px] h-[7px] rounded-full bg-[#0a0a0f] border border-white/[0.18] z-20 flex items-center justify-center">
                  <div className="w-[2.5px] h-[2.5px] rounded-full bg-[#182030]" />
                </div>
                {/* Volume / Power buttons on right edge */}
                <div className="absolute right-[-3px] top-[26%] w-[3px] h-[30px] rounded-l-sm bg-[#1c1c22] border border-white/[0.08]" />
                <div className="absolute right-[-3px] top-[38%] w-[3px] h-[20px] rounded-l-sm bg-[#1c1c22] border border-white/[0.08]" />
                {/* Screen with exact 1260/2800 aspect ratio */}
                <div className="rounded-[24px] overflow-hidden bg-black border border-white/[0.08] relative shadow-inner" style={{ aspectRatio: '1260 / 2800' }}>
                  <img
                    src="/screenshots/phone_showcase.jpg"
                    alt="RyperDeck on Android smartphone"
                    className="w-full h-full object-contain showcase-image pointer-events-none select-none"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-white/[0.012] pointer-events-none" />
                  <div className="absolute inset-x-0 top-0 h-px bg-white/20 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Android download button */}
            <a
              href="https://github.com/anuraaag23/ryperdeck/releases/download/v1.0.0/RyperDeck.apk"
              className="liquid-glass-btn liquid-glass-btn-secondary h-[44px] px-7 text-[12px] font-bold gap-2 cursor-pointer active:scale-95"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              Download Android APK
            </a>
          </div>
        </div>

        {/* Download Both as zip file */}
        <div className="flex justify-center mb-10">
          <a
            href="https://github.com/anuraaag23/ryperdeck/releases/download/v1.0.0/RyperDeck.Both.PC.+.Mobile.zip"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-white/[0.18] bg-white/[0.05] hover:bg-white/[0.12] hover:border-white/[0.32] text-white text-[13px] font-semibold transition-all shadow-[0_4px_24px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] active:scale-95 group cursor-pointer"
          >
            <FolderArchive className="w-4 h-4 text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
            <span>Download Both as zip file</span>
            <span className="text-[10px] font-mono text-white/50 px-2.5 py-0.5 rounded-full bg-white/[0.08] border border-white/[0.08] ml-1">
              Windows + Android (.zip)
            </span>
          </a>
        </div>

        {/* Notify me row + inline dialog */}
        <div className="flex flex-col items-center">
          {!notified ? (
            <button
              onClick={() => setNotifyOpen(o => !o)}
              className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-white/[0.1] bg-white/[0.025] backdrop-blur-xl text-[13px] font-medium text-white/60 hover:text-white/90 hover:border-white/[0.2] transition-all duration-300 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-white/70 group-hover:scale-110 transition-transform" />
              Email me when new feature ships
            </button>
          ) : (
            <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-emerald-500/30 bg-emerald-500/[0.08] backdrop-blur-xl text-[13px] font-medium text-emerald-400">
              <Check className="w-4 h-4" />
              You're on the list! We'll email you when a feature ships.
            </div>
          )}

          {/* Inline animated dialog */}
          <div
            className={`w-full max-w-md overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              notifyOpen && !notified ? 'max-h-[220px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
            }`}
          >
            <div className="rounded-[24px] liquid-glass-panel border border-white/[0.1] p-5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.9)]">
              <p className="text-[12px] text-white/40 mb-3 font-light">
                Drop your email — we'll only write when something worth your time ships.
              </p>
              <div className="flex gap-2.5">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleNotify()}
                  placeholder="you@email.com"
                  className="liquid-glass-input flex-1 h-[44px] px-4 text-[13px] rounded-full"
                />
                <button
                  onClick={handleNotify}
                  disabled={!email.trim()}
                  className="liquid-glass-btn liquid-glass-btn-primary h-[44px] px-5 text-[13px] font-bold gap-2 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer rounded-full"
                >
                  Notify Me
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-white/20">No spam. One-click unsubscribe.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
