import React, { useState } from 'react';
import { LiquidGlassCard } from '../LiquidGlass/LiquidGlassCard';
import { Download, ChevronDown, Check, Shield, Smartphone, ExternalLink, FolderArchive } from 'lucide-react';

export const DownloadAndFAQ: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is RyperDeck truly 100% free with no limits?',
      a: 'Yes — completely free, forever. There are no subscriptions, no in-app purchases, no ads, and no page or button limits. Every feature including AI automation, remote keyboard & trackpad, unlimited pages, preset import/export, and all system controls are free. The only optional thing is buying the developer a coffee.',
    },
    {
      q: 'What are the system requirements?',
      a: 'Windows PC: Windows 10 (Version 1809 / Build 17763+) or Windows 11 (64-bit, including 24H2+). Zero installation required — RyperDeckAgent.exe is a single self-contained portable executable that lives in your system tray using under 15 MB of RAM. Android device: Android 8.0 (Oreo) up to Android 14, 15, 16, and 17+ on phones, tablets, and foldables.',
    },
    {
      q: 'How does it connect — does it require the internet?',
      a: 'Zero internet required. RyperDeck offers 3 connection modes: (1) USB Cable for ultra-low latency (<10ms) that keeps your battery charged, (2) Local Wi-Fi / LAN with instant QR code discovery, and (3) Direct Bluetooth when travelling or when no Wi-Fi router is available. All communication stays 100% offline.',
    },
    {
      q: 'How does the Remote Keyboard & Multi-Touch Trackpad hub work?',
      a: 'Tap Keyboard & Mouse on the home screen to launch the dedicated 2-button hub. Keyboard Mode gives you a live typing console synced to your active PC window with Gboard/Samsung/IME support and 56dp quick PC hotkeys. Trackpad Mode turns your screen into a Windows Precision touchpad with adjustable DPI, natural 2-finger scrolling, 84dp thumb scroll strip, and 1/2/3/4-finger gestures.',
    },
    {
      q: 'Will my PC apps show crisp, authentic brand logos?',
      a: 'Yes. RyperDeck features a native Windows Shell icon extraction pipeline that pulls maximum-resolution 256×256 icons directly from your installed programs. For websites (YouTube, GitHub, ChatGPT, Claude, Twitch), it automatically fetches and caches authentic high-res brand logos.',
    },
    {
      q: 'Can I leave an old Android tablet plugged in as a permanent macro pad?',
      a: 'Yes — and this is how many power users run RyperDeck. Prop an old phone or tablet on a stand beside your keyboard connected via USB or Wi-Fi. It automatically reconnects whenever your PC boots. Full-screen immersion prevents Android system gesture interference.',
    },
  ];


  return (
    <section id="download" className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-6 bg-black border-t border-white/[0.05] overflow-hidden">
      <div className="relative max-w-4xl mx-auto">
        {/* Download Showcase */}
        <div className="text-center mb-16">
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="liquid-glass-badge">
              Get Started
            </span>
          </div>
          <h2 className="text-[28px] sm:text-[42px] md:text-[54px] font-bold tracking-[-0.035em] leading-tight text-white mb-4">
            Download RyperDeck.
          </h2>
          <p className="text-[15px] sm:text-[17px] text-white/50 max-w-md mx-auto leading-relaxed font-light">
            Windows 11 & 10 companion installer. Lightweight, fast, zero telemetry.
          </p>
        </div>

        {/* Windows & Android Download Card */}
        <LiquidGlassCard className="p-8 sm:p-10 mb-10 max-w-2xl mx-auto text-center">
          <div className="flex flex-col items-center">
            <span className="liquid-glass-badge font-mono text-[11px] mb-5">
              Windows 11 & 10 • Android APK • 100% Free
            </span>

            <h3 className="text-[26px] sm:text-[30px] font-bold text-white mb-2 tracking-tight">
              RyperDeck for Windows & Android
            </h3>

            <p className="text-[14px] text-white/50 leading-relaxed font-light max-w-md mb-8">
              Native Windows system tray companion and ultra-responsive Android macro controller. Zero cloud relay, zero telemetry, sub-millisecond local UDP sync.
            </p>

            {/* Download Buttons Group: Windows, Android APK & Complete Zip */}
            <div className="flex flex-col gap-3 w-full max-w-lg mb-2">
              {/* Row 1: Windows & Android APK */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                <a
                  href="https://github.com/anuraaag23/ryperdeck/releases/download/v1.0.0/RyperDeckAgent.exe"
                  className="w-full sm:w-1/2 liquid-glass-btn liquid-glass-btn-primary h-[50px] px-5 text-[13.5px] font-bold gap-2.5 shadow-[0_0_35px_rgba(255,255,255,0.25)] justify-center active:scale-95"
                >
                  <svg className="w-4 h-4 shrink-0 fill-black" viewBox="0 0 22 22">
                    <rect x="1" y="1" width="9" height="9" rx="1" />
                    <rect x="12" y="1" width="9" height="9" rx="1" />
                    <rect x="1" y="12" width="9" height="9" rx="1" />
                    <rect x="12" y="12" width="9" height="9" rx="1" />
                  </svg>
                  <span>Download for Windows (.exe)</span>
                </a>

                <a
                  href="https://github.com/anuraaag23/ryperdeck/releases/download/v1.0.0/RyperDeck.apk"
                  className="w-full sm:w-1/2 liquid-glass-btn h-[50px] px-5 text-[13.5px] font-bold gap-2.5 border border-white/[0.18] bg-white/[0.08] hover:bg-white/[0.14] hover:border-white/[0.28] text-white justify-center transition-all shadow-[0_0_20px_rgba(255,255,255,0.06)] active:scale-95"
                >
                  <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Download Android APK</span>
                </a>
              </div>

              {/* Row 2: Download Both as zip file */}
              <a
                href="https://github.com/anuraaag23/ryperdeck/releases/download/v1.0.0/RyperDeck_Complete_Package.zip"
                className="w-full liquid-glass-btn h-[50px] px-6 text-[13.5px] font-bold gap-2.5 border border-white/[0.2] bg-white/[0.05] hover:bg-white/[0.12] hover:border-white/[0.32] text-white justify-center transition-all shadow-[0_4px_24px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] active:scale-95 group"
              >
                <FolderArchive className="w-4 h-4 text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span>Download Both as zip file</span>
                <span className="text-[11px] font-mono font-normal text-white/50 px-2.5 py-0.5 rounded-full bg-white/[0.08] border border-white/[0.08] ml-1">
                  Windows + Android (.zip)
                </span>
              </a>
            </div>

            {/* Trust specs row */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 text-[12px] text-white/40">
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full liquid-glass-icon-pod shrink-0">
                  <Check className="w-2.5 h-2.5 text-emerald-400" />
                </span>
                <span>Zero Telemetry</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full liquid-glass-icon-pod shrink-0">
                  <Shield className="w-2.5 h-2.5 text-white/80" />
                </span>
                <span>Local Network Only</span>
              </span>
              <span>•</span>
              <span>100% Free Forever</span>
            </div>

            {/* Mac Alternative Skeleton / Ghost Button */}
            <div className="mt-8 pt-6 border-t border-white/[0.08] w-full flex flex-col items-center">
              <a
                href="https://phonedeck.io"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-dashed border-white/20 hover:border-white/45 bg-white/[0.02] hover:bg-white/[0.06] text-[12px] text-white/60 hover:text-white transition-all duration-200 active:scale-95 shadow-sm text-center"
              >
                <svg className="w-3.5 h-3.5 shrink-0 text-white/60 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.76 1.05-1.82.93-2.88-.9.04-2 .6-2.64 1.36-.56.65-.98 1.73-.85 2.76 1 .08 1.94-.48 2.56-1.24z"/>
                </svg>
                <span>
                  If you are searching for MAC then use <strong className="text-white font-semibold underline underline-offset-2 decoration-white/40 group-hover:decoration-white">PhoneDeck</strong> — Click here
                </span>
                <ExternalLink className="w-3 h-3 text-white/40 group-hover:text-white transition-colors shrink-0" />
              </a>
            </div>
          </div>
        </LiquidGlassCard>

        {/* Windows FAQ */}
        <div className="max-w-2xl mx-auto mt-20">
          <h3 className="text-[22px] font-bold text-white text-center mb-8 tracking-tight">
            Frequently Asked Questions
          </h3>

          <div className="flex flex-col gap-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="rounded-[22px] liquid-glass-panel-subtle p-5 cursor-pointer transition-all hover:border-white/[0.14]"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-[14px] sm:text-[15px] font-medium text-white/90">
                      {faq.q}
                    </h4>
                    <ChevronDown
                      className={`w-4 h-4 text-white/40 transition-transform duration-200 shrink-0 ml-4 ${
                        isOpen ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </div>

                  {isOpen && (
                    <p className="mt-3.5 text-[13px] text-white/50 leading-relaxed pt-3.5 border-t border-white/[0.06] font-light">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
