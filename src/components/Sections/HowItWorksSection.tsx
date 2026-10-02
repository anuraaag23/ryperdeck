import React from 'react';
import { LiquidGlassCard } from '../LiquidGlass/LiquidGlassCard';
import { Download, Wifi, Smartphone, Check, Usb, Bluetooth } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Install on Android',
      description: 'Transfer and tap RyperDeck.apk on your phone, tablet, or foldable. Works on Android 8.0 all the way to Android 17+.',
      icon: Smartphone,
      badge: 'Step 1 • Mobile App',
    },
    {
      num: '02',
      title: 'Run Windows Agent',
      description: 'Double-click RyperDeckAgent.exe on your Windows 10 or 11 PC. Zero installation needed — it lives quietly in your System Tray.',
      icon: Download,
      badge: 'Step 2 • Portable Agent',
    },
    {
      num: '03',
      title: 'Connect & Control',
      description: 'Choose USB Cable (<10ms latency & keeps battery charged), Local Wi-Fi with instant QR code scan, or direct Bluetooth pairing.',
      icon: Wifi,
      badge: 'Step 3 • 3 Connect Modes',
    },
  ];

  return (
    <section id="setup" className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-6 bg-black border-t border-white/[0.05] overflow-hidden">
      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="liquid-glass-badge">
              Getting Started
            </span>
          </div>
          <h2 className="text-[28px] sm:text-[42px] md:text-[54px] font-bold tracking-[-0.035em] leading-tight text-white mb-4">
            Set up in under 30 seconds.
          </h2>
          <p className="text-[15px] sm:text-[17px] text-white/50 max-w-md mx-auto leading-relaxed font-light">
            Zero installation wizards. Zero runtime downloads. Standalone portable architecture ready right out of the box.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <LiquidGlassCard key={idx} className="p-5 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="liquid-glass-badge font-mono text-[11px] mb-6 block w-fit">
                    {s.badge}
                  </span>
                  <h3 className="text-[20px] font-bold text-white mb-2 tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-[13px] text-white/50 leading-relaxed font-light mb-8">
                    {s.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-[12px] text-white/40 font-medium">
                    <span className="w-5 h-5 rounded-md liquid-glass-icon-pod shrink-0">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </span>
                    <span>Sub-millisecond sync</span>
                  </div>
                  <span className="w-8 h-8 rounded-xl liquid-glass-icon-pod">
                    <Icon className="w-4 h-4 text-white/40" />
                  </span>
                </div>
              </LiquidGlassCard>
            );
          })}
        </div>

        {/* Connection Modes Summary Bar */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-white/60">
          <span className="font-semibold text-white/80">
            3 Ways to Connect:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/80">
              <Usb className="w-3.5 h-3.5 text-emerald-400" />
              <strong>USB Mode</strong> (&lt;10ms, charges battery)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/80">
              <Wifi className="w-3.5 h-3.5 text-sky-400" />
              <strong>Wi-Fi Mode</strong> (Local subnet UDP)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/80">
              <Bluetooth className="w-3.5 h-3.5 text-indigo-400" />
              <strong>Bluetooth Mode</strong> (Zero Wi-Fi needed)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
