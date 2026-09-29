import React, { useState } from 'react';
import { RyperPage, RyperButton } from '../../types/ryperDeck';
import { DynamicIcon } from '../../utils/iconMap';
import { tactile } from '../../utils/tactileAudio';
import { Smartphone, Tablet, Wifi, Zap, Volume2 } from 'lucide-react';

interface VirtualDeckProps {
  pages: RyperPage[];
  initialPageIndex?: number;
  interactive?: boolean;
  className?: string;
  defaultDevice?: 'phone' | 'tablet';
}

export const VirtualDeck: React.FC<VirtualDeckProps> = ({
  pages,
  initialPageIndex = 0,
  interactive = true,
  className = '',
  defaultDevice = 'tablet',
}) => {
  const [activePageIndex, setActivePageIndex] = useState(initialPageIndex);
  const [deviceMode, setDeviceMode] = useState<'phone' | 'tablet'>(defaultDevice);
  const [activeButtons, setActiveButtons] = useState<Record<string, boolean>>({});
  const [buttonStates, setButtonStates] = useState<Record<string, { toggled?: boolean; sliderVal?: number }>>({});
  const [lastAction, setLastAction] = useState<string>('Ready • Multipeer Active');

  const currentPage = pages[activePageIndex] || pages[0];

  const handleButtonPress = (btn: RyperButton) => {
    if (!interactive) return;

    if (btn.type === 'TOGGLE') {
      tactile.playTap('toggle');
      setButtonStates(prev => {
        const current = prev[btn.id]?.toggled ?? (btn.isToggledOn === 1 || btn.isToggledOn === true);
        const next = !current;
        setLastAction(`Toggled ${btn.label}: ${next ? 'ACTIVE' : 'OFF'}`);
        return {
          ...prev,
          [btn.id]: { ...prev[btn.id], toggled: next },
        };
      });
    } else {
      tactile.playTap('deck');
      setActiveButtons(prev => ({ ...prev, [btn.id]: true }));
      setLastAction(`Triggered: ${btn.label}`);
      setTimeout(() => {
        setActiveButtons(prev => ({ ...prev, [btn.id]: false }));
      }, 180);
    }
  };

  const handleSliderChange = (btnId: string, label: string, val: number) => {
    tactile.playTap('slider');
    setButtonStates(prev => ({
      ...prev,
      [btnId]: { ...prev[btnId], sliderVal: val },
    }));
    setLastAction(`${label}: ${Math.round(val * 100)}%`);
  };

  const argbToCss = (argb?: number | string | null, fallbackAlpha = 0.25): string => {
    if (!argb) return 'rgba(255, 255, 255, 0.05)';
    if (typeof argb === 'string') return argb;
    const a = ((argb >> 24) & 0xff) / 255 || fallbackAlpha;
    const r = (argb >> 16) & 0xff;
    const g = (argb >> 8) & 0xff;
    const b = argb & 0xff;
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
  };

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Device Mode Switcher Pill */}
      <div className="mb-4 inline-flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl">
        <button
          onClick={() => {
            setDeviceMode('tablet');
            tactile.playTap('subtle');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            deviceMode === 'tablet'
              ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
              : 'text-white/40 hover:text-white/80'
          }`}
        >
          <Tablet className="w-3.5 h-3.5" />
          <span>Tablet Pad</span>
        </button>
        <button
          onClick={() => {
            setDeviceMode('phone');
            tactile.playTap('subtle');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            deviceMode === 'phone'
              ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
              : 'text-white/40 hover:text-white/80'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Phone (Landscape)</span>
        </button>
      </div>

      {/* Physical Hardware Frame */}
      <div
        className={`relative transition-all duration-500 ease-out p-3 sm:p-4 rounded-[40px] sm:rounded-[48px] bg-gradient-to-b from-[#242638] via-[#0d0e17] to-[#05060b] shadow-[0_40px_100px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.1),inset_0_1px_1px_rgba(255,255,255,0.25)] ${
          deviceMode === 'tablet' ? 'w-full max-w-[820px]' : 'w-full max-w-[660px]'
        }`}
      >
        <div className="absolute inset-0 rounded-[40px] sm:rounded-[48px] pointer-events-none border border-white/[0.15]" />

        {/* Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full border border-white/[0.05] z-30 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a18] border border-blue-900/40" />
        </div>

        {/* Device Screen Glass Container */}
        <div className="relative rounded-[32px] sm:rounded-[38px] bg-[#070810] border border-white/[0.08] overflow-hidden p-3 sm:p-5 flex flex-col min-h-[360px] sm:min-h-[440px]">
          {/* Top Status Bar */}
          <div className="flex items-center justify-between text-[11px] text-white/40 pb-3 border-b border-white/[0.04]">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span className="font-semibold text-white/80 tracking-wide">Ryper<span className="text-cyan-400">Deck</span></span>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">0.3ms</span>
            </div>

            {/* Page Navigation Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-[45%] scrollbar-none">
              {pages.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePageIndex(idx);
                    tactile.playTap('subtle');
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors shrink-0 ${
                    idx === activePageIndex
                      ? 'bg-white/15 text-white shadow-sm'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-emerald-400">
                <Wifi className="w-3 h-3" />
                <span className="text-[10px] hidden sm:inline">Mac Connected</span>
              </div>
            </div>
          </div>

          {/* Interactive Button Grid */}
          <div
            className="flex-1 grid gap-2.5 sm:gap-3 py-3 select-none"
            style={{
              gridTemplateColumns: `repeat(${currentPage.gridColumns || 4}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${currentPage.gridRows || 3}, minmax(0, 1fr))`,
            }}
          >
            {currentPage.buttons.map(btn => {
              const isPressed = activeButtons[btn.id];
              const isToggled =
                buttonStates[btn.id]?.toggled ?? (btn.isToggledOn === 1 || btn.isToggledOn === true);
              const sliderValue = buttonStates[btn.id]?.sliderVal ?? (btn.sliderValue ?? 0.5);

              const colSpan = btn.spanCols || 1;
              const rowSpan = btn.spanRows || 1;

              if (btn.type === 'SLIDER') {
                return (
                  <div
                    key={btn.id}
                    style={{
                      gridColumn: `span ${colSpan}`,
                      gridRow: `span ${rowSpan}`,
                      background: argbToCss(btn.backgroundColorArgb, 0.15),
                      borderColor: argbToCss(btn.borderColorArgb, 0.4),
                    }}
                    className="relative flex flex-col justify-between p-3 rounded-2xl border backdrop-blur-xl group overflow-hidden shadow-lg"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-white/90 flex items-center gap-1.5 text-[11px] sm:text-xs">
                        <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                        {btn.label}
                      </span>
                      <span className="font-mono text-[10px] text-cyan-300">
                        {Math.round(sliderValue * 100)}%
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.02"
                      value={sliderValue}
                      onChange={e => handleSliderChange(btn.id, btn.label, parseFloat(e.target.value))}
                      className="w-full h-2 rounded-lg bg-black/40 accent-cyan-400 cursor-pointer"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-white/[0.04] to-transparent pointer-events-none" />
                  </div>
                );
              }

              return (
                <button
                  key={btn.id}
                  onClick={() => handleButtonPress(btn)}
                  style={{
                    gridColumn: `span ${colSpan}`,
                    gridRow: `span ${rowSpan}`,
                    background: isToggled
                      ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.3), rgba(138, 43, 226, 0.3))'
                      : argbToCss(btn.backgroundColorArgb, 0.12),
                    borderColor: isToggled ? '#00F0FF' : argbToCss(btn.borderColorArgb, 0.35),
                  }}
                  className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all duration-150 backdrop-blur-2xl group ${
                    isPressed ? 'scale-95 brightness-125' : 'hover:scale-[1.02] active:scale-95'
                  } ${isToggled ? 'shadow-[0_0_24px_rgba(0,240,255,0.4)]' : 'shadow-md'}`}
                >
                  <div className="absolute inset-x-2 top-0.5 h-px bg-white/40 pointer-events-none" />

                  {btn.hotkeyDisplay && (
                    <span className="absolute top-1.5 right-1.5 text-[8px] font-mono px-1 py-0.5 rounded bg-black/40 text-white/50 border border-white/[0.08]">
                      {btn.hotkeyDisplay}
                    </span>
                  )}

                  {btn.type === 'TOGGLE' && (
                    <span
                      className={`absolute top-2 left-2 w-2 h-2 rounded-full transition-colors ${
                        isToggled ? 'bg-cyan-400 shadow-[0_0_8px_#00F0FF]' : 'bg-white/20'
                      }`}
                    />
                  )}

                  <div className="flex flex-col items-center gap-1 my-auto">
                    <DynamicIcon
                      name={btn.iconKey}
                      className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110 ${
                        isToggled ? 'text-cyan-300' : 'text-white/90'
                      }`}
                    />
                    <span className="text-[11px] sm:text-xs font-semibold text-white/95 text-center leading-tight line-clamp-1">
                      {btn.label}
                    </span>
                    {btn.sublabel && (
                      <span className="text-[9px] text-white/40 font-normal text-center leading-none hidden sm:block">
                        {btn.sublabel}
                      </span>
                    )}
                  </div>

                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gradient-to-tr from-cyan-500/10 via-transparent to-pink-500/10" />
                </button>
              );
            })}
          </div>

          {/* Bottom Live Feedback Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[10px] text-white/35">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>{lastAction}</span>
            </span>
            <span>Tap any button to test tactile feedback</span>
          </div>
        </div>
      </div>
    </div>
  );
};
