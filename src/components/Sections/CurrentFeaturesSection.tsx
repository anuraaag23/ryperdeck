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
} from 'lucide-react';
import { Reveal } from '../Reveal';

export interface CurrentFeatureItem {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

export const CURRENT_FEATURES_LIST: CurrentFeatureItem[] = [
  {
    title: 'AI Automation Generator',
    desc: 'Powered by Gemini AI. Create new complex macros and PC automations instantly just by explaining what you want in plain words.',
    icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
  },
  {
    title: 'Wireless Android controller',
    desc: 'Use your Android phone or tablet as a wireless controller for your Windows PC over your local network.',
    icon: <Smartphone className="w-5 h-5 text-white/70" />,
  },
  {
    title: 'One-tap app launching',
    desc: 'Tap a tile on your Android device and the matching Windows app opens instantly with zero latency.',
    icon: <Zap className="w-5 h-5 text-white/70" />,
  },
  {
    title: 'Custom pages',
    desc: 'Build separate pages for design, development, gaming, streaming, or any workflow you use often.',
    icon: <Layers className="w-5 h-5 text-white/70" />,
  },
  {
    title: 'Drag and drop setup',
    desc: 'Arrange apps and controls from the Windows companion app by dragging them into tiles effortlessly.',
    icon: <Move className="w-5 h-5 text-white/70" />,
  },
  {
    title: 'Full app library',
    desc: 'Browse apps, shortcuts, and commands from your Windows PC and place the ones you need onto your layout.',
    icon: <Grid className="w-5 h-5 text-white/70" />,
  },
  {
    title: 'Live preview',
    desc: 'See the phone or tablet layout mirrored in real-time inside the Windows app while you customize your deck.',
    icon: <Eye className="w-5 h-5 text-white/70" />,
  },
  {
    title: 'Swipe between pages',
    desc: 'Move between multiple deck pages for different contexts with fluid gestures without touching your PC.',
    icon: <SlidersHorizontal className="w-5 h-5 text-white/70" />,
  },
  {
    title: 'Landscape & Portrait support',
    desc: 'Lay your phone or tablet flat and use landscape or portrait tile layout right beside your keyboard.',
    icon: <RotateCcw className="w-5 h-5 text-white/70" />,
  },
  {
    title: 'System controls',
    desc: 'Control volume, brightness, media playback, screenshot, mute, mic toggle, and OBS scenes instantly.',
    icon: <Sliders className="w-5 h-5 text-white/70" />,
  },
];

interface Props {
  onRequestFeature?: () => void;
}

export const CurrentFeaturesSection: React.FC<Props> = ({ onRequestFeature }) => {
  return (
    <section className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-6 bg-black border-t border-white/[0.05] overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-white/[0.015] blur-[220px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <Reveal direction="up">
            <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-white/40 mb-3 block">
              Current Features
            </span>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <h2 className="text-[36px] sm:text-[48px] md:text-[56px] font-bold tracking-[-0.035em] leading-[1.02] text-white">
              What RyperDeck offers <br />
              <span className="text-white/40">right now.</span>
            </h2>
          </Reveal>
        </div>

        {/* 3x3 Grid of features matching phonedeck.io */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {CURRENT_FEATURES_LIST.map((item, index) => (
            <Reveal key={item.title} direction="up" delay={index * 50}>
              <div className="h-full rounded-[24px] p-6 sm:p-7 bg-white/[0.025] hover:bg-white/[0.045] border border-white/[0.07] hover:border-white/[0.14] transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-white/[0.08] transition-all">
                    {item.icon}
                  </div>
                  <h3 className="text-[17px] sm:text-[18px] font-bold text-white mb-2.5 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-white/45 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
