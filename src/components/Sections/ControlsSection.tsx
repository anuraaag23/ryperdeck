import React from 'react';
import {
  Camera, Volume, Volume1, Volume2, VolumeX,
  Mic, MicOff, SkipBack, SkipForward, PlayCircle,
  Sun, Monitor, Wifi, Keyboard, Clipboard,
  ScreenShare, Zap, Settings, Power
} from 'lucide-react';
import { Reveal } from '../Reveal';

const controls = [
  { icon: Camera,       label: 'Screenshot' },
  { icon: VolumeX,      label: 'Mute' },
  { icon: Volume1,      label: 'Vol –' },
  { icon: Volume2,      label: 'Vol +' },
  { icon: Mic,          label: 'Microphone' },
  { icon: SkipBack,     label: 'Prev Track' },
  { icon: PlayCircle,   label: 'Play / Pause' },
  { icon: SkipForward,  label: 'Next Track' },
  { icon: Sun,          label: 'Brightness' },
  { icon: Keyboard,     label: 'Hotkeys' },
  { icon: Clipboard,    label: 'Paste Clip' },
  { icon: ScreenShare,  label: 'OBS Scene' },
  { icon: Zap,          label: 'Run Script' },
  { icon: Monitor,      label: 'Switch App' },
  { icon: Settings,     label: 'System Tray' },
  { icon: Power,        label: 'Shutdown' },
];

export const ControlsSection: React.FC = () => {
  return (
    <section className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-6 bg-black border-t border-white/[0.05] overflow-hidden">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.015] blur-[200px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

        {/* Left — Text */}
        <div>
          <Reveal direction="up">
            <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-white/35 mb-5 block">
              Controls
            </span>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <h2 className="text-[44px] sm:text-[60px] md:text-[72px] font-bold tracking-[-0.04em] leading-[0.96] text-white mb-8">
              Every hotkey.<br />
              <span className="text-white/30">On your Android.</span>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={140}>
            <div className="space-y-4 text-[15px] sm:text-[16px] text-white/45 font-light leading-relaxed">
              <p>
                Volume, mute, media playback, screenshot, brightness, OBS scenes, clipboard paste
                — drag any action onto any page as a button tile.
              </p>
              <p>
                Your Windows PC's entire function row, in your hand.
              </p>
              <p className="text-[13px] text-white/25">
                One-time Wi-Fi pairing. Zero USB. Zero Bluetooth.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Right — Control tiles grid */}
        <Reveal direction="scale" delay={100} className="relative">
          {/* Subtle vignette fade on right edge */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

          <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
            {controls.map(({ icon: Icon, label }, i) => (
              <div
                key={i}
                className="aspect-square rounded-[18px] sm:rounded-[22px] flex flex-col items-center justify-center gap-1.5 p-3 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.09] hover:border-white/[0.18] transition-all duration-200 cursor-default group select-none hover:scale-105"
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white/70 group-hover:text-white transition-colors" />
                <span className="text-[8px] sm:text-[9px] text-white/30 font-medium text-center leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};
