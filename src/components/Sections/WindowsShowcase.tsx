import React from 'react';
import { LiquidGlassCard } from '../LiquidGlass/LiquidGlassCard';
import { Monitor, Volume2, Cpu, Zap, Sliders, Layers } from 'lucide-react';

export const WindowsShowcase: React.FC = () => {
  return (
    <section id="windows" className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-6 bg-black border-t border-white/[0.05] overflow-hidden">
      <div className="relative max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="mb-20 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="liquid-glass-badge">
              Windows Native
            </span>
          </div>
          <h2 className="text-[28px] sm:text-[42px] md:text-[54px] font-bold tracking-[-0.035em] leading-[1.04] text-white mb-5">
            Engineered exclusively<br />
            <span className="text-white/40">for Windows power users.</span>
          </h2>
          <p className="text-[16px] text-white/50 leading-relaxed font-light">
            RyperDeck runs directly inside your Windows 11 &amp; 10 system tray. No bloated Electron memory hogs, no cloud telemetry. Just pure low-level Windows APIs and lightning-fast local UDP packets.
          </p>
        </div>

        {/* Feature Grid with Real App Screenshots (Strictly non-clickable) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-16">
          {/* Card 1: Custom Button Layouts & Run Mode */}
          <LiquidGlassCard className="p-5 sm:p-8 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-8 h-8 rounded-xl liquid-glass-icon-pod">
                  <Sliders className="w-4 h-4 text-white/80" />
                </span>
                <span className="liquid-glass-badge text-white/60">
                  Custom Macro Grids
                </span>
              </div>
              <h3 className="text-[20px] sm:text-[22px] font-bold text-white mb-2 tracking-tight">
                Any button. Any size. Any action.
              </h3>
              <p className="text-[13px] text-white/50 leading-relaxed mb-6 font-light">
                Configure buttons that span multiple rows and columns, volume dials, toggle states, and custom images directly on your mobile device.
              </p>
            </div>

            {/* Real Screenshot in Hardware Frame (Non-clickable) */}
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] bg-[#070709] mt-2 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
              <img
                src="/screenshots/any_button_action.jpg"
                alt="RyperDeck custom layout in run mode"
                className="w-full h-auto block showcase-image pointer-events-none select-none"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-white/[0.015] pointer-events-none" />
            </div>
          </LiquidGlassCard>

          {/* Card 2: Interactive Grid Editor & Wi-Fi */}
          <LiquidGlassCard className="p-5 sm:p-8 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-8 h-8 rounded-xl liquid-glass-icon-pod">
                  <Layers className="w-4 h-4 text-white/80" />
                </span>
                <span className="liquid-glass-badge text-white/60">
                  Visual Layout Editor
                </span>
              </div>
              <h3 className="text-[22px] font-bold text-white mb-2 tracking-tight">
                Drag, arrange, and deploy in seconds.
              </h3>
              <p className="text-[13px] text-white/50 leading-relaxed mb-6 font-light">
                Fine-tune column spans, row spans, corner radiuses, and glass opacities with visual feedback that synchronizes with your PC instantly.
              </p>
            </div>

            {/* Real Screenshot in Hardware Frame (Non-clickable) */}
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] bg-[#070709] mt-2 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
              <img
                src="/screenshots/drag_arrange_deploy.png"
                alt="RyperDeck tablet layout visual editor"
                className="w-full h-auto block showcase-image pointer-events-none select-none"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-white/[0.015] pointer-events-none" />
            </div>
          </LiquidGlassCard>
        </div>

        {/* 3 Value Pillars with Liquid Glass Pods */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          <div className="p-7 rounded-[28px] liquid-glass-panel-subtle">
            <div className="w-10 h-10 rounded-2xl liquid-glass-icon-pod mb-4">
              <Zap className="w-5 h-5 text-white/80" />
            </div>
            <h4 className="text-[16px] font-semibold text-white mb-1.5">
              0.3ms Input Latency
            </h4>
            <p className="text-[13px] text-white/45 leading-relaxed font-light">
              Direct UDP packet broadcast over your local Wi-Fi router. Taps register on your PC faster than human perception.
            </p>
          </div>

          <div className="p-7 rounded-[28px] liquid-glass-panel-subtle">
            <div className="w-10 h-10 rounded-2xl liquid-glass-icon-pod mb-4">
              <Monitor className="w-5 h-5 text-white/80" />
            </div>
            <h4 className="text-[16px] font-semibold text-white mb-1.5">
              Windows System Control
            </h4>
            <p className="text-[13px] text-white/45 leading-relaxed font-light">
              Full control over Windows master volume, per-application audio mixers, virtual desktops, and global hotkeys.
            </p>
          </div>

          <div className="p-7 rounded-[28px] liquid-glass-panel-subtle">
            <div className="w-10 h-10 rounded-2xl liquid-glass-icon-pod mb-4">
              <Cpu className="w-5 h-5 text-white/80" />
            </div>
            <h4 className="text-[16px] font-semibold text-white mb-1.5">
              Zero Background Overhead
            </h4>
            <p className="text-[13px] text-white/45 leading-relaxed font-light">
              The Windows companion stays under 15MB of RAM in your system tray, leaving 100% of your GPU and CPU for your games and apps.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
