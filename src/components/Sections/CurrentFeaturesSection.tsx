import React from 'react';
import {
  Smartphone,
  Zap,
  Layers,
  Move,
  Grid,
  Eye,
  SlidersHorizontal,
  RotateCcw,
  Sliders,
  Sparkles,
  Keyboard,
  Mouse,
  Usb,
  Globe,
  Radio,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Reveal } from '../Reveal';

export interface CurrentFeatureItem {
  title: string;
  desc: string;
  icon: React.ReactNode;
  badge?: string;
  link?: string;
}

export const CURRENT_FEATURES_LIST: CurrentFeatureItem[] = [
  {
    title: 'Remote Keyboard & Multi-Touch Trackpad',
    desc: 'Turn any phone or tablet into a live PC typing console with IME support, 56dp quick PC keys, and Windows Precision multi-finger gestures.',
    icon: <Keyboard className="w-5 h-5 text-emerald-400" />,
    badge: 'NEW HUB',
    link: '#keyboard-mouse',
  },
  {
    title: '3 Flexible Connection Modes',
    desc: 'Connect via high-speed USB Cable (<10ms ultra-low latency & phone charging), Local Wi-Fi LAN with QR code discovery, or direct Bluetooth.',
    icon: <Usb className="w-5 h-5 text-sky-400" />,
    badge: 'FLEXIBLE',
  },
  {
    title: 'Smart Website Cards & Logo Sync',
    desc: 'Add any URL (YouTube, GitHub, ChatGPT, Claude, Grok, Reddit) and RyperDeck automatically downloads, caches, and syncs the official brand logo.',
    icon: <Globe className="w-5 h-5 text-indigo-400" />,
    badge: 'AUTO SYNC',
  },
  {
    title: 'Live PC Key Recording',
    desc: 'Record complex shortcuts and macro chords directly by pressing the keys on your physical PC keyboard. The agent captures the exact sequence.',
    icon: <Radio className="w-5 h-5 text-amber-400" />,
    badge: 'LIVE CAPTURE',
  },
  {
    title: 'Live PC Hardware Monitoring',
    desc: 'Real-time telemetry tiles display active Windows CPU load, RAM utilization percentage, and connection latency directly on your deck screen.',
    icon: <Cpu className="w-5 h-5 text-purple-400" />,
    badge: 'REAL TIME',
  },
  {
    title: '256×256 High-Res Icon Pipeline',
    desc: 'Native Windows Shell extraction pulls the maximum-resolution 256×256 app icons directly from your installed programs without blurry downscaling.',
    icon: <Grid className="w-5 h-5 text-white/80" />,
  },
  {
    title: 'Zero-Installation Portable Agent',
    desc: 'Provided as a single standalone executable (RyperDeckAgent.exe). Runs quietly in your Windows System Tray using under 15 MB of RAM.',
    icon: <ShieldCheck className="w-5 h-5 text-white/80" />,
  },
  {
    title: 'AI Automation Generator',
    desc: 'Powered by Gemini AI. Create complex multi-step Windows macros instantly just by explaining what you want in plain words.',
    icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
  },
  {
    title: 'One-Tap App & Game Launching',
    desc: 'Tap a tile on your Android device and the matching Windows program opens instantly with sub-millisecond local response.',
    icon: <Zap className="w-5 h-5 text-white/80" />,
  },
  {
    title: 'Unlimited Custom Pages',
    desc: 'Organize separate pages for Gaming, Streaming, Video Editing, Software Development, Audio Mixing, or Daily Productivity.',
    icon: <Layers className="w-5 h-5 text-white/80" />,
  },
  {
    title: 'Landscape & Portrait Layouts',
    desc: 'Fully responsive on smartphones, tablets (like Xiaomi Pad 6 & Samsung Galaxy Tab), and foldables in both orientations.',
    icon: <RotateCcw className="w-5 h-5 text-white/80" />,
  },
  {
    title: 'System & Media Controls',
    desc: 'Smooth volume sliders, one-touch mute, media playback, Snipping Tool, Task Manager, Disk Cleanup, and workstation lock.',
    icon: <Sliders className="w-5 h-5 text-white/80" />,
  },
];

interface Props {
  onRequestFeature?: () => void;
  onOpenKeyboardMouse?: () => void;
}

export const CurrentFeaturesSection: React.FC<Props> = ({ onRequestFeature, onOpenKeyboardMouse }) => {
  return (
    <section className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-6 bg-black border-t border-white/[0.05] overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-white/[0.015] blur-[220px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 sm:mb-14">
          <Reveal direction="up">
            <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-white/40 mb-3 block">
              Current Features
            </span>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <h2 className="text-[28px] sm:text-[42px] md:text-[54px] font-bold tracking-[-0.035em] leading-[1.02] text-white">
              What RyperDeck offers <br />
              <span className="text-white/40">right out of the box.</span>
            </h2>
          </Reveal>
        </div>

        {/* SPOTLIGHT HERO: Keyboard & Mouse Option Banner */}
        <Reveal direction="up" delay={120}>
          <div className="mb-10 p-5 sm:p-9 rounded-[24px] sm:rounded-[32px] bg-gradient-to-r from-emerald-500/[0.07] via-white/[0.03] to-sky-500/[0.05] border border-white/[0.14] shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl relative overflow-hidden group">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                    Featured Capability
                  </span>
                  <span className="text-white/40 text-[12px]">• Dedicated Full Experience</span>
                </div>

                <h3 className="text-[22px] sm:text-[28px] font-bold text-white tracking-tight mb-2">
                  Remote Keyboard & Precision Trackpad Hub
                </h3>
                <p className="text-[14px] sm:text-[15px] text-white/60 font-light leading-relaxed mb-4">
                  Turn your phone or tablet into a zero-latency wireless keyboard and multi-touch trackpad. Includes live PC typing console with IME support, 56dp comfort hotkeys, dynamic DPI adjustment, 84dp thumb scroll strip, and native Windows Precision gestures.
                </p>

                <div className="flex flex-wrap items-center gap-4 text-[12px] text-white/70">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Live PC Typing Sync
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Windows Precision Gestures
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> USB &lt;10ms, Wi-Fi &amp; Bluetooth
                  </span>
                </div>
              </div>

              <div className="shrink-0 w-full lg:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenKeyboardMouse) onOpenKeyboardMouse();
                    else window.location.hash = '#keyboard-mouse';
                  }}
                  className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-black hover:bg-white/90 font-bold text-[13.5px] transition-all cursor-pointer shadow-lg active:scale-95 group-hover:shadow-white/20"
                >
                  <span>Explore Keyboard &amp; Mouse Page</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* 12-Card Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {CURRENT_FEATURES_LIST.map((item, index) => (
            <Reveal key={item.title} direction="up" delay={index * 35}>
              <div
                onClick={() => {
                  if (item.link === '#keyboard-mouse') {
                    if (onOpenKeyboardMouse) onOpenKeyboardMouse();
                    else window.location.hash = '#keyboard-mouse';
                  }
                }}
                className={`h-full rounded-[20px] sm:rounded-[24px] p-4 sm:p-7 bg-white/[0.025] hover:bg-white/[0.045] border border-white/[0.07] hover:border-white/[0.14] transition-all duration-300 flex flex-col justify-between group ${
                  item.link ? 'cursor-pointer hover:border-emerald-500/30' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center group-hover:scale-105 group-hover:bg-white/[0.08] transition-all">
                      {item.icon}
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-[17px] sm:text-[18px] font-bold text-white mb-2.5 tracking-tight flex items-center gap-1.5">
                    <span>{item.title}</span>
                    {item.link && (
                      <ArrowRight className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </h3>
                  <p className="text-[13px] text-white/45 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>

                {item.link && (
                  <div className="mt-4 pt-3 border-t border-white/[0.05] text-[12px] font-medium text-emerald-400 flex items-center gap-1">
                    <span>View full interactive guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
