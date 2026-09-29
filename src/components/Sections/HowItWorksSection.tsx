import React from 'react';
import { LiquidGlassCard } from '../LiquidGlass/LiquidGlassCard';
import { Download, Wifi, Smartphone, Check } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Run on Windows PC',
      description: 'Download the lightweight Windows companion. It lives in your system tray and starts instantly with Windows.',
      icon: Download,
    },
    {
      num: '02',
      title: 'Connect over Wi-Fi',
      description: 'Open the mobile app on the same local network. Zero pairing codes, zero IP configuration, zero accounts.',
      icon: Wifi,
    },
    {
      num: '03',
      title: 'Tap to Command',
      description: 'Launch games, trigger hotkeys, adjust volume mixers, or download custom .json presets with a single tap.',
      icon: Smartphone,
    },
  ];

  return (
    <section id="setup" className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-6 bg-black border-t border-white/[0.05] overflow-hidden">
      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="liquid-glass-badge">
              Getting Started
            </span>
          </div>
          <h2 className="text-[28px] sm:text-[42px] md:text-[54px] font-bold tracking-[-0.035em] leading-tight text-white mb-4">
            Set up in under 30 seconds.
          </h2>
          <p className="text-[15px] sm:text-[17px] text-white/50 max-w-md mx-auto leading-relaxed font-light">
            No hardware to assemble. No cables to route. Ready before you finish your coffee.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <LiquidGlassCard key={idx} className="p-8 flex flex-col justify-between">
                <div>
                  <span className="liquid-glass-badge font-mono text-[11px] mb-6 block w-fit">
                    Step {s.num}
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
                    <span>Instant automatic sync</span>
                  </div>
                  <span className="w-8 h-8 rounded-xl liquid-glass-icon-pod">
                    <Icon className="w-4 h-4 text-white/40" />
                  </span>
                </div>
              </LiquidGlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
