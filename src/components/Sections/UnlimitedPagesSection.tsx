import React, { useState, useEffect, useRef } from 'react';
import {
  Radio, Mic, MicOff, Volume2, VolumeX, Video, Layers, MessageSquare,
  Music, Scissors, ZoomIn, Undo2, Download, Pipette, Gamepad2, Film,
  Sliders, Terminal, GitBranch, Play, Code2, Calculator, Lock, Camera,
  Monitor, ChevronLeft, ChevronRight, CheckCircle2, Sparkles, Box,
  RefreshCw, Eye, Share2, BellOff, ArrowRightLeft, LucideIcon
} from 'lucide-react';
import { Reveal } from '../Reveal';
import { tactile } from '../../utils/tactileAudio';

interface DeckButton {
  name: string;
  sub: string;
  icon: LucideIcon;
  color: string;
  accent: string;
  activeColor: string;
}

interface DeckPage {
  name: string;
  tagline: string;
  badge: string;
  badgeColor: string;
  keys: string[];
  buttons: DeckButton[];
}

const DECK_PAGES: DeckPage[] = [
  {
    name: 'Streaming',
    tagline: 'OBS Studio · Mic · Live Broadcast',
    badge: '● LIVE STREAM',
    badgeColor: 'border-red-500/40 text-red-400 bg-red-500/10',
    keys: ['OBS', 'Mic', 'Vol', 'Cam'],
    buttons: [
      { name: 'OBS Live', sub: 'Scene 1', icon: Radio, color: 'text-red-400', accent: 'group-hover:border-red-500/40', activeColor: 'bg-red-500/20 border-red-400' },
      { name: 'Mic Mute', sub: 'Push / Toggle', icon: Mic, color: 'text-amber-400', accent: 'group-hover:border-amber-500/40', activeColor: 'bg-amber-500/20 border-amber-400' },
      { name: 'Master Vol +', sub: '+5% Step', icon: Volume2, color: 'text-blue-400', accent: 'group-hover:border-blue-500/40', activeColor: 'bg-blue-500/20 border-blue-400' },
      { name: 'Master Vol –', sub: '-5% Step', icon: VolumeX, color: 'text-blue-400', accent: 'group-hover:border-blue-500/40', activeColor: 'bg-blue-500/20 border-blue-400' },
      { name: 'Cam Angle 2', sub: 'Overhead 4K', icon: Video, color: 'text-purple-400', accent: 'group-hover:border-purple-500/40', activeColor: 'bg-purple-500/20 border-purple-400' },
      { name: 'Clip 30s', sub: 'Instant Replay', icon: Film, color: 'text-emerald-400', accent: 'group-hover:border-emerald-500/40', activeColor: 'bg-emerald-500/20 border-emerald-400' },
      { name: 'Twitch Chat', sub: 'Emote Only', icon: MessageSquare, color: 'text-indigo-400', accent: 'group-hover:border-indigo-500/40', activeColor: 'bg-indigo-500/20 border-indigo-400' },
      { name: 'Airhorn FX', sub: 'Soundboard', icon: Music, color: 'text-pink-400', accent: 'group-hover:border-pink-500/40', activeColor: 'bg-pink-500/20 border-pink-400' },
    ],
  },
  {
    name: 'Design & 3D',
    tagline: 'Figma · Photoshop · Blender Tools',
    badge: 'CREATIVE SUITE',
    badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    keys: ['Figma', 'Crop', 'Undo', 'Export'],
    buttons: [
      { name: 'Figma Hub', sub: 'Open Board', icon: Sparkles, color: 'text-purple-400', accent: 'group-hover:border-purple-500/40', activeColor: 'bg-purple-500/20 border-purple-400' },
      { name: 'Crop Canvas', sub: 'Preserve Ratio', icon: Scissors, color: 'text-pink-400', accent: 'group-hover:border-pink-500/40', activeColor: 'bg-pink-500/20 border-pink-400' },
      { name: 'Zoom 100%', sub: 'Actual Size', icon: ZoomIn, color: 'text-cyan-400', accent: 'group-hover:border-cyan-500/40', activeColor: 'bg-cyan-500/20 border-cyan-400' },
      { name: 'Undo Step', sub: 'Ctrl+Z History', icon: Undo2, color: 'text-amber-400', accent: 'group-hover:border-amber-500/40', activeColor: 'bg-amber-500/20 border-amber-400' },
      { name: 'Eyedropper', sub: 'Copy HEX', icon: Pipette, color: 'text-emerald-400', accent: 'group-hover:border-emerald-500/40', activeColor: 'bg-emerald-500/20 border-emerald-400' },
      { name: 'Export PNG', sub: '2x Retina Web', icon: Download, color: 'text-blue-400', accent: 'group-hover:border-blue-500/40', activeColor: 'bg-blue-500/20 border-blue-400' },
      { name: '3D Orbit', sub: 'Blender View', icon: Box, color: 'text-orange-400', accent: 'group-hover:border-orange-500/40', activeColor: 'bg-orange-500/20 border-orange-400' },
      { name: 'Component', sub: 'Auto Layout', icon: Layers, color: 'text-indigo-400', accent: 'group-hover:border-indigo-500/40', activeColor: 'bg-indigo-500/20 border-indigo-400' },
    ],
  },
  {
    name: 'Gaming',
    tagline: 'Discord · ShadowPlay · Low Latency',
    badge: 'GAME MODE',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    keys: ['PTT', 'Clip', 'Mute', 'Stats'],
    buttons: [
      { name: 'Push To Talk', sub: 'Discord Voice', icon: Mic, color: 'text-emerald-400', accent: 'group-hover:border-emerald-500/40', activeColor: 'bg-emerald-500/20 border-emerald-400' },
      { name: 'Save Clip', sub: 'ShadowPlay 60s', icon: Film, color: 'text-amber-400', accent: 'group-hover:border-amber-500/40', activeColor: 'bg-amber-500/20 border-amber-400' },
      { name: 'Game Audio', sub: 'Toggle Mute', icon: VolumeX, color: 'text-red-400', accent: 'group-hover:border-red-500/40', activeColor: 'bg-red-500/20 border-red-400' },
      { name: 'Spotify Next', sub: 'Skip Track', icon: Music, color: 'text-green-400', accent: 'group-hover:border-green-500/40', activeColor: 'bg-green-500/20 border-green-400' },
      { name: 'FPS Overlay', sub: 'RTSS Stats', icon: Sliders, color: 'text-blue-400', accent: 'group-hover:border-blue-500/40', activeColor: 'bg-blue-500/20 border-blue-400' },
      { name: 'In-Game Mic', sub: 'Squad Voice', icon: Gamepad2, color: 'text-purple-400', accent: 'group-hover:border-purple-500/40', activeColor: 'bg-purple-500/20 border-purple-400' },
      { name: 'Screenshot', sub: 'HDR Clean', icon: Camera, color: 'text-cyan-400', accent: 'group-hover:border-cyan-500/40', activeColor: 'bg-cyan-500/20 border-cyan-400' },
      { name: 'Guild Chat', sub: 'Focus Channel', icon: MessageSquare, color: 'text-pink-400', accent: 'group-hover:border-pink-500/40', activeColor: 'bg-pink-500/20 border-pink-400' },
    ],
  },
  {
    name: 'Dev Tools',
    tagline: 'Terminal · Git · Dev Servers',
    badge: 'DEV WORKFLOW',
    badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    keys: ['Run', 'Build', 'Term', 'Git'],
    buttons: [
      { name: 'npm run dev', sub: 'Start Server', icon: Play, color: 'text-emerald-400', accent: 'group-hover:border-emerald-500/40', activeColor: 'bg-emerald-500/20 border-emerald-400' },
      { name: 'git push', sub: 'origin/main', icon: GitBranch, color: 'text-cyan-400', accent: 'group-hover:border-cyan-500/40', activeColor: 'bg-cyan-500/20 border-cyan-400' },
      { name: 'Terminal', sub: 'PowerShell 7', icon: Terminal, color: 'text-blue-400', accent: 'group-hover:border-blue-500/40', activeColor: 'bg-blue-500/20 border-blue-400' },
      { name: 'VS Code', sub: 'Current Folder', icon: Code2, color: 'text-indigo-400', accent: 'group-hover:border-indigo-500/40', activeColor: 'bg-indigo-500/20 border-indigo-400' },
      { name: 'Docker Up', sub: 'Local DB Stack', icon: Box, color: 'text-purple-400', accent: 'group-hover:border-purple-500/40', activeColor: 'bg-purple-500/20 border-purple-400' },
      { name: 'Chrome F12', sub: 'Inspect Tools', icon: Eye, color: 'text-amber-400', accent: 'group-hover:border-amber-500/40', activeColor: 'bg-amber-500/20 border-amber-400' },
      { name: 'Restart Node', sub: 'Kill & Respawn', icon: RefreshCw, color: 'text-red-400', accent: 'group-hover:border-red-500/40', activeColor: 'bg-red-500/20 border-red-400' },
      { name: 'npm run build', sub: 'Vite Production', icon: Download, color: 'text-pink-400', accent: 'group-hover:border-pink-500/40', activeColor: 'bg-pink-500/20 border-pink-400' },
    ],
  },
  {
    name: 'Work & Daily',
    tagline: 'Meetings · Productivity · Shortcuts',
    badge: 'PRODUCTIVITY',
    badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    keys: ['Meet', 'Slack', 'Mail', 'Lock'],
    buttons: [
      { name: 'Meet Mic', sub: 'Google / Teams', icon: MicOff, color: 'text-red-400', accent: 'group-hover:border-red-500/40', activeColor: 'bg-red-500/20 border-red-400' },
      { name: 'Slack Away', sub: 'Set Status', icon: MessageSquare, color: 'text-amber-400', accent: 'group-hover:border-amber-500/40', activeColor: 'bg-amber-500/20 border-amber-400' },
      { name: 'Inbox Zero', sub: 'Open Mail', icon: Share2, color: 'text-blue-400', accent: 'group-hover:border-blue-500/40', activeColor: 'bg-blue-500/20 border-blue-400' },
      { name: 'Quick Calc', sub: 'Calculator', icon: Calculator, color: 'text-purple-400', accent: 'group-hover:border-purple-500/40', activeColor: 'bg-purple-500/20 border-purple-400' },
      { name: 'Lock Win', sub: 'Win+L Secure', icon: Lock, color: 'text-emerald-400', accent: 'group-hover:border-emerald-500/40', activeColor: 'bg-emerald-500/20 border-emerald-400' },
      { name: 'Snip Tool', sub: 'Win+Shift+S', icon: Scissors, color: 'text-pink-400', accent: 'group-hover:border-pink-500/40', activeColor: 'bg-pink-500/20 border-pink-400' },
      { name: 'Focus DND', sub: 'Silence Windows', icon: BellOff, color: 'text-orange-400', accent: 'group-hover:border-orange-500/40', activeColor: 'bg-orange-500/20 border-orange-400' },
      { name: 'Desktop 2', sub: 'Workspace Switch', icon: ArrowRightLeft, color: 'text-cyan-400', accent: 'group-hover:border-cyan-500/40', activeColor: 'bg-cyan-500/20 border-cyan-400' },
    ],
  },
];

export const UnlimitedPagesSection: React.FC = () => {
  const [activePage, setActivePage] = useState(0);
  const [clickedButton, setClickedButton] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-scroll pages smoothly every 4.2 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActivePage((prev) => (prev + 1) % DECK_PAGES.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [isPaused]);

  const selectPage = (idx: number) => {
    tactile.playTap('toggle');
    setActivePage(idx);
  };

  const nextPage = () => {
    tactile.playTap('toggle');
    setActivePage((prev) => (prev + 1) % DECK_PAGES.length);
  };

  const prevPage = () => {
    tactile.playTap('toggle');
    setActivePage((prev) => (prev - 1 + DECK_PAGES.length) % DECK_PAGES.length);
  };

  const handleButtonClick = (buttonName: string) => {
    tactile.playTap('deck');
    setClickedButton(buttonName);
    setTimeout(() => setClickedButton(null), 350);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextPage();
      else prevPage();
    }
    touchStartX.current = null;
  };

  const current = DECK_PAGES[activePage];

  return (
    <section className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-6 bg-black border-t border-white/[0.05] overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-[700px] h-[400px] rounded-full bg-white/[0.015] blur-[200px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Headline */}
        <div className="mb-12 sm:mb-16 max-w-3xl">
          <Reveal direction="up">
            <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-white/35 mb-4 block">
              Limitless Architecture
            </span>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <h2 className="text-[28px] sm:text-[50px] md:text-[70px] font-bold tracking-[-0.04em] leading-[0.97]">
              <span className="text-white/25">Most controllers give you<br />8 buttons.</span>
              <br />
              <span className="text-white">RyperDeck gives you<br />unlimited pages.</span>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={140}>
            <p className="mt-5 sm:mt-6 text-[14px] sm:text-[16px] text-white/40 font-light max-w-lg leading-relaxed">
              Pages, drag & drop, live preview. Tap any page tab below or swipe to watch the deck fluidly scroll between completely custom workflows.
            </p>
          </Reveal>
        </div>

        {/* Windows App Mockup with Animated Page Scrolling */}
        <Reveal direction="scale" delay={180}>
          <div
            className="w-full max-w-3xl mx-auto rounded-[18px] sm:rounded-[22px] border border-white/[0.12] bg-[#0d0e14] overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.95)] select-none group/window"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Title bar — Windows style */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.07] bg-[#0a0b10] select-none">
              {/* Left: Windows logo + app name */}
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="9" height="9" rx="1" fill="white" fillOpacity="0.6"/>
                  <rect x="12" y="1" width="9" height="9" rx="1" fill="white" fillOpacity="0.6"/>
                  <rect x="1" y="12" width="9" height="9" rx="1" fill="white" fillOpacity="0.6"/>
                  <rect x="12" y="12" width="9" height="9" rx="1" fill="white" fillOpacity="0.6"/>
                </svg>
                <span className="text-[11px] text-white/50 font-medium">RyperDeck Windows Companion</span>
                <div className="flex items-center gap-1.5 ml-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] text-emerald-400/80 font-mono">0.3ms UDP</span>
                </div>
              </div>

              {/* Right: Windows title bar controls */}
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-7 hover:bg-white/[0.06] transition-colors cursor-default">
                  <div className="w-3 h-[1.5px] bg-white/40" />
                </div>
                <div className="flex items-center justify-center w-8 h-7 hover:bg-white/[0.06] transition-colors cursor-default">
                  <div className="w-2.5 h-2.5 border border-white/40 rounded-[1px]" />
                </div>
                <div className="flex items-center justify-center w-9 h-7 hover:bg-[#c42b1c]/80 transition-colors cursor-default rounded-tr-[18px]">
                  <span className="text-[14px] leading-none text-white/40 hover:text-white" style={{ fontFamily: 'system-ui' }}>✕</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row min-h-[300px] sm:min-h-[340px]">
              {/* Sidebar / Mobile Top bar for switching pages */}
              <div className="w-full sm:w-[200px] shrink-0 border-b sm:border-b-0 sm:border-r border-white/[0.07] bg-[#08090d] p-2.5 sm:p-3 flex sm:flex-col flex-row overflow-x-auto sm:overflow-x-visible gap-1.5 sm:gap-1.5 items-center sm:items-stretch scrollbar-none">
                <div className="px-2 py-1 mb-1 sm:mb-2 hidden sm:block">
                  <div className="flex items-center gap-2 text-white/40">
                    <div className="w-4 h-5 rounded-sm border border-white/20 flex items-center justify-center bg-white/[0.02]">
                      <div className="w-2 h-2.5 rounded-[1px] border border-white/40" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/80 font-medium">Active Deck</p>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[9px] text-white/40">Wireless Pad</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2 mb-1 hidden sm:flex">
                  <p className="text-[9px] text-white/30 font-semibold tracking-[0.2em] uppercase">Pages ({DECK_PAGES.length})</p>
                  <span className="text-[9px] text-white/20 font-mono">Click to scroll</span>
                </div>

                {DECK_PAGES.map((page, i) => {
                  const isCurrent = i === activePage;
                  return (
                    <button
                      key={i}
                      onClick={() => selectPage(i)}
                      className={`flex items-center justify-between w-full px-2.5 py-1.5 sm:py-2 rounded-xl transition-all duration-300 text-left shrink-0 whitespace-nowrap cursor-pointer ${
                        isCurrent
                          ? 'bg-white/[0.12] border border-white/[0.2] shadow-sm shadow-white/5 text-white font-medium scale-[1.01]'
                          : 'bg-transparent text-white/40 hover:text-white/80 hover:bg-white/[0.04] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {page.keys.slice(0, 3).map((_, j) => (
                            <div
                              key={j}
                              className={`w-2 h-2 rounded-[2px] transition-colors ${
                                isCurrent ? 'bg-white/70' : 'bg-white/20'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px]">{page.name}</span>
                      </div>

                      {isCurrent && (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] hidden sm:block" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Main area with Horizontal Sliding Track */}
              <div
                className="flex-1 p-3.5 sm:p-5 flex flex-col justify-between overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                {/* Active page header */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[16px] sm:text-[19px] font-bold text-white tracking-tight">
                        {current.name}
                      </h3>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full border font-mono font-medium ${current.badgeColor}`}>
                        {current.badge}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-white/40 mt-0.5 font-light">
                      {current.tagline} · Tap any button to fire
                    </p>
                  </div>

                  {/* Page scroll arrows */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={prevPage}
                      className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                      title="Previous Page"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-mono text-white/35 px-1">
                      {activePage + 1}/{DECK_PAGES.length}
                    </span>
                    <button
                      onClick={nextPage}
                      className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                      title="Next Page"
                      aria-label="Next Page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Animated Horizontal Pages Container */}
                <div className="relative overflow-hidden rounded-[14px] bg-black/40 border border-white/[0.05] p-2">
                  <div
                    className="flex transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ transform: `translateX(-${activePage * 100}%)` }}
                  >
                    {DECK_PAGES.map((page, pIdx) => (
                      <div key={pIdx} className="w-full shrink-0 grid grid-cols-4 gap-2 sm:gap-2.5">
                        {page.buttons.map((btn, bIdx) => {
                          const Icon = btn.icon;
                          const isTriggered = clickedButton === btn.name;
                          return (
                            <button
                              key={bIdx}
                              onClick={() => handleButtonClick(btn.name)}
                              className={`aspect-square rounded-[12px] sm:rounded-[14px] p-2 sm:p-2.5 flex flex-col items-center justify-between text-center transition-all duration-150 cursor-pointer select-none group relative overflow-hidden border ${
                                isTriggered
                                  ? `${btn.activeColor} scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]`
                                  : 'bg-white/[0.035] hover:bg-white/[0.08] border-white/[0.08] hover:border-white/[0.18]'
                              } ${btn.accent}`}
                            >
                              {/* Glass refraction glow */}
                              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

                              <div className="flex items-center justify-between w-full">
                                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isTriggered ? 'bg-white' : 'bg-white/10 group-hover:bg-white/30'}`} />
                                <span className="text-[7px] sm:text-[8px] font-mono text-white/30 truncate max-w-[50px]">
                                  {isTriggered ? 'FIRED' : btn.sub}
                                </span>
                              </div>

                              {/* Button Icon */}
                              <div className="flex items-center justify-center my-0.5">
                                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover:scale-110 ${btn.color}`} />
                              </div>

                              {/* Button Name */}
                              <span className="text-[8px] sm:text-[10px] font-medium text-white/80 group-hover:text-white leading-tight truncate w-full">
                                {btn.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Footer Info + Page Dots */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/[0.05] text-[10px] text-white/30">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Swipe or click tabs to scroll between unlimited pages</span>
                  </div>

                  {/* Dot navigation */}
                  <div className="flex items-center gap-1.5">
                    {DECK_PAGES.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectPage(idx)}
                        className={`rounded-full transition-all duration-300 ${
                          idx === activePage
                            ? 'w-5 h-1.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]'
                            : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                        }`}
                        aria-label={`Go to page ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Bottom footnote */}
        <Reveal direction="up" delay={220}>
          <p className="text-center mt-6 text-[12px] text-white/30 font-light">
            Pages are unlimited. Buttons per page: unlimited. Layouts: 100% custom and free forever.
          </p>
        </Reveal>
      </div>
    </section>
  );
};
