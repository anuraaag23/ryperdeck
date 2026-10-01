import React, { useState } from 'react';
import {
  ArrowLeft,
  Keyboard,
  Mouse,
  Smartphone,
  Laptop,
  Usb,
  Wifi,
  Bluetooth,
  Sliders,
  Sparkles,
  Check,
  ChevronRight,
  Maximize2,
  Delete,
  CornerDownLeft,
  Space,
  ExternalLink,
  Shield,
  Layers,
  Cpu,
  Monitor,
  HelpCircle,
} from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const KeyboardMousePage: React.FC<Props> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'keyboard' | 'mouse'>('keyboard');
  const [dpi, setDpi] = useState<string>('1.0x');
  const [typedSample, setTypedSample] = useState<string>(
    'RyperDeck instant live PC typing console with zero latency...'
  );
  const [hudMessage, setHudMessage] = useState<string>('Ready for input');

  const dpiOptions = ['0.5x', '0.8x', '1.0x', '1.5x', '2.0x', '2.5x', '3.0x'];

  const triggerHud = (msg: string) => {
    setHudMessage(msg);
    setTimeout(() => {
      setHudMessage('Ready for input');
    }, 2000);
  };

  const quickKeys = [
    { label: 'Esc', desc: 'Escape' },
    { label: 'Tab', desc: 'Tab Indent' },
    { label: 'Enter', desc: 'Return ↵' },
    { label: 'Bksp', desc: 'Delete Left ⌫' },
    { label: 'Space', desc: 'Spacebar ␣' },
    { label: 'Del', desc: 'Delete Forward' },
    { label: 'Ctrl+A', desc: 'Select All' },
    { label: 'Ctrl+C', desc: 'Copy' },
    { label: 'Ctrl+V', desc: 'Paste' },
    { label: 'Ctrl+X', desc: 'Cut' },
    { label: 'Ctrl+Z', desc: 'Undo' },
    { label: 'Ctrl+Y', desc: 'Redo' },
    { label: 'Ctrl+S', desc: 'Save' },
    { label: 'Win', desc: 'Start Menu' },
    { label: 'Alt+Tab', desc: 'Switch Apps' },
    { label: '↑', desc: 'Arrow Up' },
    { label: '↓', desc: 'Arrow Down' },
    { label: '←', desc: 'Arrow Left' },
    { label: '→', desc: 'Arrow Right' },
    { label: 'F5', desc: 'Refresh' },
  ];

  const gestureList = [
    {
      fingers: '1 Finger',
      badge: 'Basic',
      actions: [
        { gesture: 'Move Finger', result: 'Smooth Cursor Navigation with Velocity Curve' },
        { gesture: 'Single Tap', result: 'Left Click (Select / Activate)' },
        { gesture: 'Double Tap', result: 'Double Click (Open App / File)' },
      ],
    },
    {
      fingers: '2 Fingers',
      badge: 'Scroll & Context',
      actions: [
        { gesture: 'Swipe Up / Down', result: 'Natural Ergonomic Vertical Scrolling' },
        { gesture: 'Swipe Left / Right', result: 'Horizontal Pan / Timeline Scrub' },
        { gesture: 'Two-Finger Tap', result: 'Right Click (Context Menu)' },
      ],
    },
    {
      fingers: '3 Fingers',
      badge: 'Windows Precision',
      actions: [
        { gesture: 'Swipe UP', result: 'Task View (Win + Tab)' },
        { gesture: 'Swipe DOWN', result: 'Show Desktop (Win + D)' },
        { gesture: 'Swipe LEFT / RIGHT', result: 'Switch Active Applications (Alt + Tab)' },
        { gesture: 'Three-Finger Tap', result: 'Windows Search (Win + S)' },
      ],
    },
    {
      fingers: '4 Fingers',
      badge: 'Virtual Desktops',
      actions: [
        { gesture: 'Swipe LEFT / RIGHT', result: 'Switch Virtual Desktops (Ctrl + Win + ←/→)' },
        { gesture: 'Swipe UP', result: 'Action Center / Quick Settings (Win + A)' },
        { gesture: 'Swipe DOWN', result: 'Minimize All Windows (Win + D)' },
        { gesture: 'Four-Finger Tap', result: 'Windows Notification Center (Win + N)' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] pt-6 pb-28 px-4 sm:px-6 md:px-8 relative z-50 overflow-x-hidden selection:bg-white/20 selection:text-white">
      {/* Background Optical Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full bg-blue-500/[0.03] blur-[220px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[400px] rounded-full bg-indigo-500/[0.02] blur-[200px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between py-6 mb-10 border-b border-white/[0.07]">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass-btn border border-white/[0.1] hover:border-white/[0.2] bg-white/[0.04] text-[13px] text-white/80 hover:text-white transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to RyperDeck
          </button>

          <div className="flex items-center gap-2.5">
            <span className="text-[14px] font-semibold text-white">
              ryper<span className="text-white/70">deck</span>
            </span>
            <span className="liquid-glass-badge text-[10px] text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
              Feature Hub
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] backdrop-blur-xl text-[11px] font-mono tracking-widest uppercase text-white/60 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-white/80" />
            REMOTE DESKTOP INPUT HUB
          </div>

          <h1 className="text-[34px] sm:text-[50px] md:text-[60px] font-bold tracking-[-0.04em] leading-[1.0] text-white mb-6">
            Turn your phone or tablet into a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/50">
              Keyboard & Precision Trackpad.
            </span>
          </h1>

          <p className="text-[16px] sm:text-[18px] text-white/55 font-light leading-relaxed max-w-2xl mx-auto mb-8">
            No dongles, no extra hardware. Launch the dedicated 2-button hub inside RyperDeck to control your Windows PC with zero-latency live typing and full multi-finger Windows precision gestures.
          </p>

          {/* Connection Modes Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-[12px] text-white/70">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
              <Usb className="w-3.5 h-3.5 text-emerald-400" />
              <span>USB Cable (&lt;10ms latency)</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
              <Wifi className="w-3.5 h-3.5 text-sky-400" />
              <span>Local Wi-Fi LAN</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
              <Bluetooth className="w-3.5 h-3.5 text-indigo-400" />
              <span>Direct Bluetooth</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE HUB SELECTOR (Keyboard vs Mouse) */}
        {/* ========================================================================= */}
        <div className="mb-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto p-2 rounded-[28px] bg-white/[0.03] border border-white/[0.1] backdrop-blur-2xl">
            {/* Keyboard Option Button */}
            <button
              onClick={() => setActiveTab('keyboard')}
              className={`flex items-center gap-4 p-5 rounded-2xl text-left transition-all cursor-pointer ${
                activeTab === 'keyboard'
                  ? 'bg-white text-black shadow-xl shadow-white/10 scale-[1.01]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  activeTab === 'keyboard' ? 'bg-black text-white' : 'bg-white/10 text-white'
                }`}
              >
                <Keyboard className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[16px] font-bold block">Remote Keyboard</span>
                <span
                  className={`text-[12px] block ${
                    activeTab === 'keyboard' ? 'text-black/60' : 'text-white/40'
                  }`}
                >
                  Live PC typing console & 56dp hotkey comfort row
                </span>
              </div>
            </button>

            {/* Mouse Option Button */}
            <button
              onClick={() => setActiveTab('mouse')}
              className={`flex items-center gap-4 p-5 rounded-2xl text-left transition-all cursor-pointer ${
                activeTab === 'mouse'
                  ? 'bg-white text-black shadow-xl shadow-white/10 scale-[1.01]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  activeTab === 'mouse' ? 'bg-black text-white' : 'bg-white/10 text-white'
                }`}
              >
                <Mouse className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[16px] font-bold block">Precision Trackpad</span>
                <span
                  className={`text-[12px] block ${
                    activeTab === 'mouse' ? 'text-black/60' : 'text-white/40'
                  }`}
                >
                  DPI toggle, 84dp thumb scroll & multi-finger gestures
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: KEYBOARD MODE SHOWCASE */}
        {/* ========================================================================= */}
        {activeTab === 'keyboard' && (
          <div className="space-y-12 animate-fadeIn">
            {/* Interactive Keyboard Visual Simulator */}
            <div className="rounded-[32px] bg-[#0c0d15] border border-white/[0.12] p-6 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.85)] relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6 mb-8 border-b border-white/[0.08]">
                <div>
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                    Live Input Simulator
                  </span>
                  <h3 className="text-[22px] sm:text-[26px] font-bold text-white tracking-tight">
                    Live PC Input Console
                  </h3>
                  <p className="text-[14px] text-white/50 font-light mt-1">
                    Type on your device using Gboard, Samsung, Xiaomi, or voice typing. Characters stream instantly to your active PC window.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[12px] text-white/60 bg-white/[0.04] px-3.5 py-1.5 rounded-full border border-white/[0.08] self-start">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Full IME & Multilingual Support</span>
                </div>
              </div>

              {/* High-Contrast Live Console Box */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-[12px] text-white/40 mb-2 font-mono px-1">
                  <span>MOBILE TYPING DISPLAY (REAL-TIME PC SYNC)</span>
                  <button
                    onClick={() => {
                      setTypedSample('');
                      triggerHud('Display Cleared');
                    }}
                    className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <Delete className="w-3.5 h-3.5" /> Clear Box (✕)
                  </button>
                </div>

                <div className="relative rounded-2xl bg-black/70 border border-white/[0.15] p-5 font-mono text-[15px] sm:text-[17px] text-emerald-300 min-h-[90px] shadow-inner flex items-center">
                  <span className="select-all break-words w-full">
                    {typedSample || (
                      <span className="text-white/20 italic font-sans font-light">
                        Tap any key below or test typing here...
                      </span>
                    )}
                    <span className="inline-block w-2 h-5 bg-emerald-400 ml-1.5 animate-pulse align-middle" />
                  </span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <button
                  onClick={() => {
                    setTypedSample((prev) => prev + '\n');
                    triggerHud('Enter ↵ sent to PC');
                  }}
                  className="p-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <CornerDownLeft className="w-4 h-4 text-emerald-400" />
                  <span>Enter (↵)</span>
                </button>

                <button
                  onClick={() => {
                    setTypedSample((prev) => prev + ' ');
                    triggerHud('Space ␣ sent to PC');
                  }}
                  className="p-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <Space className="w-4 h-4 text-sky-400" />
                  <span>Space (␣)</span>
                </button>

                <button
                  onClick={() => {
                    setTypedSample((prev) => prev.slice(0, -1));
                    triggerHud('Backspace ⌫ sent to PC');
                  }}
                  className="p-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <Delete className="w-4 h-4 text-rose-400" />
                  <span>Bksp (⌫)</span>
                </button>

                <button
                  onClick={() => {
                    setTypedSample('');
                    triggerHud('Display Cleared');
                  }}
                  className="p-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <span className="text-white/40">✕</span>
                  <span>Clear Box</span>
                </button>
              </div>

              {/* 56dp Comfort Row — Enlarged Quick PC Keys */}
              <div>
                <div className="flex items-center justify-between text-[12px] text-white/50 mb-3 px-1">
                  <span className="font-semibold text-white/80">
                    Enlarged Quick PC Keys (56dp Comfort Row)
                  </span>
                  <span className="text-[11px] font-mono text-white/30 hidden sm:inline">
                    Horizontal Scrollable Hotkeys
                  </span>
                </div>

                <div className="flex items-center gap-2.5 overflow-x-auto pb-4 pt-1 scrollbar-none">
                  {quickKeys.map((k) => (
                    <button
                      key={k.label}
                      onClick={() => {
                        triggerHud(`${k.label} triggered`);
                        setTypedSample((prev) => `${prev} [${k.label}]`);
                      }}
                      title={k.desc}
                      className="h-[52px] min-w-[58px] px-3 rounded-2xl bg-white/[0.07] hover:bg-white/[0.16] border border-white/[0.14] text-white font-mono text-[13px] font-bold flex flex-col items-center justify-center transition-all active:scale-90 cursor-pointer shadow-md shrink-0"
                    >
                      <span>{k.label}</span>
                      <span className="text-[9px] text-white/35 font-sans font-normal truncate max-w-[50px]">
                        {k.desc.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* HUD Badge simulator */}
              <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-white/40 font-mono">
                <span>SIMULATOR STATUS</span>
                <span className="text-emerald-400 font-semibold">{hudMessage}</span>
              </div>
            </div>

            {/* Keyboard Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-7 rounded-[26px] bg-white/[0.025] border border-white/[0.08]">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center mb-5">
                  <Keyboard className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="text-[17px] font-bold text-white mb-2">Zero Drop Lag</h4>
                <p className="text-[13px] text-white/50 leading-relaxed font-light">
                  Direct raw socket communication ensures keypresses land on your active PC window in sub-10ms without dropping characters or stuttering.
                </p>
              </div>

              <div className="p-7 rounded-[26px] bg-white/[0.025] border border-white/[0.08]">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center mb-5">
                  <Smartphone className="w-5 h-5 text-sky-400" />
                </div>
                <h4 className="text-[17px] font-bold text-white mb-2">Any Android Keyboard</h4>
                <p className="text-[13px] text-white/50 leading-relaxed font-light">
                  Seamlessly compatible with Gboard, Samsung Keyboard, Xiaomi keyboards, swipe typing, voice input, and multilingual regional scripts.
                </p>
              </div>

              <div className="p-7 rounded-[26px] bg-white/[0.025] border border-white/[0.08]">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center mb-5">
                  <Maximize2 className="w-5 h-5 text-indigo-400" />
                </div>
                <h4 className="text-[17px] font-bold text-white mb-2">Immersive Shield</h4>
                <p className="text-[13px] text-white/50 leading-relaxed font-light">
                  Applies system gesture exclusions so you can type freely near the screen borders without triggering Android back or home gestures.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: MOUSE & TRACKPAD MODE SHOWCASE */}
        {/* ========================================================================= */}
        {activeTab === 'mouse' && (
          <div className="space-y-12 animate-fadeIn">
            {/* Interactive Trackpad Visual Simulator */}
            <div className="rounded-[32px] bg-[#0c0d15] border border-white/[0.12] p-6 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.85)] relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6 mb-8 border-b border-white/[0.08]">
                <div>
                  <span className="text-[11px] font-mono text-sky-400 uppercase tracking-widest block mb-1">
                    Precision Touchpad Engine
                  </span>
                  <h3 className="text-[22px] sm:text-[26px] font-bold text-white tracking-tight">
                    Multi-Touch Trackpad with Dynamic DPI
                  </h3>
                  <p className="text-[14px] text-white/50 font-light mt-1">
                    Full Windows Precision gestures, adjustable DPI velocity curves, natural two-finger scrolling, and dedicated 84dp thumb scroll strip.
                  </p>
                </div>

                {/* DPI Sensitivity Selector */}
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[11px] font-mono text-white/40">DPI SENSITIVITY</span>
                  <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/[0.08]">
                    {dpiOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setDpi(opt);
                          triggerHud(`DPI set to ${opt}`);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                          dpi === opt
                            ? 'bg-white text-black font-bold shadow'
                            : 'text-white/50 hover:text-white'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trackpad Surface Simulator Box */}
              <div className="relative rounded-2xl bg-black/60 border border-white/[0.12] h-[280px] sm:h-[340px] flex items-stretch mb-6 overflow-hidden select-none">
                {/* Main Gliding Area */}
                <div
                  onMouseMove={() => triggerHud(`Cursor Moving (${dpi} DPI)`)}
                  onClick={() => triggerHud('Left Click (1-Finger Tap)')}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    triggerHud('Right Click (2-Finger Tap)');
                  }}
                  className="flex-1 flex flex-col items-center justify-center p-6 text-center cursor-crosshair group relative"
                >
                  {/* Subtle Grid Caustic */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                  {/* HUD Message Badge */}
                  <div className="absolute top-4 px-4 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] text-[12px] font-mono text-sky-300 shadow-md">
                    HUD: {hudMessage}
                  </div>

                  <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/[0.1] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Mouse className="w-7 h-7 text-white/40" />
                  </div>
                  <p className="text-[15px] font-semibold text-white/80">
                    Precision Touch Surface
                  </p>
                  <p className="text-[12px] text-white/40 max-w-xs mt-1">
                    Glide 1 finger to move, tap to click, double-tap & drag, or use 2/3/4-finger gestures
                  </p>
                </div>

                {/* Dedicated 84dp Vertical Scroll Strip */}
                <div
                  onWheel={() => triggerHud('84dp Vertical Scroll Strip Engaged')}
                  onClick={() => triggerHud('Scroll Strip Thumb Drag')}
                  className="w-[72px] sm:w-[84px] bg-white/[0.03] border-l border-white/[0.08] flex flex-col items-center justify-between py-6 px-1 hover:bg-white/[0.06] transition-colors cursor-ns-resize group"
                  title="84dp Vertical Thumb Scroll Strip"
                >
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest rotate-90 my-auto">
                    Scroll Strip
                  </span>
                  <div className="flex flex-col items-center gap-1.5 text-white/30 group-hover:text-white/70 transition-colors">
                    <div className="w-1 h-8 rounded-full bg-white/20 group-hover:bg-white/50" />
                  </div>
                </div>
              </div>

              {/* Bottom Tactile Click Pads */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => triggerHud('LEFT CLICK (Click Pad)')}
                  className="h-[60px] rounded-2xl bg-white/[0.06] hover:bg-white/[0.14] active:bg-white text-white active:text-black border border-white/[0.12] font-mono font-bold text-[14px] flex items-center justify-center transition-all active:scale-[0.98] cursor-pointer shadow-lg"
                >
                  LEFT CLICK
                </button>
                <button
                  onClick={() => triggerHud('RIGHT CLICK (Click Pad)')}
                  className="h-[60px] rounded-2xl bg-white/[0.06] hover:bg-white/[0.14] active:bg-white text-white active:text-black border border-white/[0.12] font-mono font-bold text-[14px] flex items-center justify-center transition-all active:scale-[0.98] cursor-pointer shadow-lg"
                >
                  RIGHT CLICK
                </button>
              </div>
            </div>

            {/* Windows Precision Multi-Touch Gestures Reference */}
            <div>
              <div className="text-center max-w-xl mx-auto mb-8">
                <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest block mb-2">
                  NATIVE DESKTOP CAPABILITIES
                </span>
                <h3 className="text-[26px] sm:text-[32px] font-bold text-white tracking-tight">
                  Windows Precision Touchpad Gestures
                </h3>
                <p className="text-[14px] text-white/50 font-light mt-1">
                  Enjoy identical multi-finger gestures to high-end Windows Precision laptops on your tablet or smartphone screen.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {gestureList.map((g) => (
                  <div
                    key={g.fingers}
                    className="p-6 sm:p-7 rounded-[26px] bg-white/[0.025] border border-white/[0.08] hover:border-white/[0.15] transition-all"
                  >
                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.06]">
                      <span className="text-[17px] font-bold text-white">{g.fingers}</span>
                      <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60">
                        {g.badge}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {g.actions.map((act) => (
                        <div key={act.gesture} className="flex items-start justify-between gap-3 text-[13px]">
                          <span className="font-mono text-white/80 shrink-0">{act.gesture}</span>
                          <span className="text-white/45 text-right font-light">{act.result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tablet & Xiaomi Setup Guide Banner */}
            <div className="p-7 sm:p-8 rounded-[28px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.1] backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-[18px] font-bold text-white mb-2">
                    Xiaomi Pad 6 / HyperOS / MIUI & Samsung Tablet Setup Note
                  </h4>
                  <p className="text-[14px] text-white/60 leading-relaxed font-light mb-4">
                    Certain Android tablets intercept 3-finger swipes for OS screenshots before apps can receive them. To enable full Windows 3-finger precision touchpad gestures:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1.5 text-[13px] text-white/70 font-light mb-4">
                    <li>Open <strong>Settings</strong> on your Android tablet.</li>
                    <li>Navigate to <strong>Additional Settings</strong> → <strong>Gesture Shortcuts</strong>.</li>
                    <li>Under <strong>Take a screenshot</strong>, change <em>"Slide 3 fingers down"</em> to <em>"Volume down + Power"</em> or <em>"None"</em>.</li>
                    <li>Return to RyperDeck for seamless Windows precision trackpad gestures!</li>
                  </ol>
                  <span className="text-[12px] text-emerald-400 font-mono flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Full-screen gesture immunity is applied automatically
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DOWNLOAD / TRY CTA */}
        {/* ========================================================================= */}
        <div className="mt-16 pt-12 border-t border-white/[0.08] text-center">
          <h3 className="text-[24px] sm:text-[30px] font-bold text-white mb-3 tracking-tight">
            Ready to control your PC from your fingertips?
          </h3>
          <p className="text-[15px] text-white/50 font-light max-w-md mx-auto mb-8">
            Download RyperDeck today. Zero installation on PC, 100% free, forever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#download"
              onClick={onBack}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full liquid-glass-btn liquid-glass-btn-primary font-bold text-[14px] shadow-lg active:scale-95"
            >
              Download RyperDeck Free
            </a>

            <button
              onClick={onBack}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-white/[0.14] hover:border-white/[0.25] bg-white/[0.04] text-[14px] text-white/80 hover:text-white transition-all cursor-pointer active:scale-95"
            >
              Explore Full Features
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
