import React from 'react';
import { Reveal } from '../Reveal';

const pages = [
  { name: 'Streaming', keys: ['OBS', 'Mic', 'Vol'] },
  { name: 'Design', keys: ['Undo', 'Crop', 'Zoom'] },
  { name: 'Gaming', keys: ['PTT', 'Clip', 'Mute'] },
  { name: 'Dev Tools', keys: ['Run', 'Build', 'Term'] },
  { name: 'Work', keys: ['Meet', 'Slack', 'Mail'] },
];

const tiles = [
  'OBS Scene', 'Mic', 'Vol +', 'Vol –',
  'Undo', 'Redo', 'Screenshot', 'Clip',
];

export const UnlimitedPagesSection: React.FC = () => {
  return (
    <section className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-6 bg-black border-t border-white/[0.05] overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-[700px] h-[400px] rounded-full bg-white/[0.012] blur-[200px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Headline */}
        <div className="mb-12 sm:mb-16 max-w-3xl">
          <Reveal direction="up">
            <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-white/35 mb-4 block">
              Windows
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
              Pages, drag & drop, live preview. Every workflow you have — one app, beside your screen.
            </p>
          </Reveal>
        </div>

        {/* Windows App Mockup */}
        <Reveal direction="scale" delay={180}>
          <div className="w-full max-w-3xl mx-auto rounded-[18px] sm:rounded-[22px] border border-white/[0.1] bg-[#0d0e14] overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.9)] select-none">
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
                <span className="text-[11px] text-white/40 font-medium">RyperDeck</span>
                <div className="flex items-center gap-1.5 ml-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] text-white/30 font-mono">CONNECTED</span>
                </div>
              </div>
              {/* Right: Windows title bar controls */}
              <div className="flex items-center">
                {/* Minimize */}
                <div className="flex items-center justify-center w-8 h-7 hover:bg-white/[0.06] transition-colors cursor-default group">
                  <div className="w-3 h-[1.5px] bg-white/40 group-hover:bg-white/70 transition-colors" />
                </div>
                {/* Maximize */}
                <div className="flex items-center justify-center w-8 h-7 hover:bg-white/[0.06] transition-colors cursor-default group">
                  <div className="w-2.5 h-2.5 border border-white/40 group-hover:border-white/70 rounded-[1px] transition-colors" />
                </div>
                {/* Close */}
                <div className="flex items-center justify-center w-9 h-7 hover:bg-[#c42b1c]/80 transition-colors cursor-default group rounded-tr-[18px]">
                  <span className="text-[14px] leading-none text-white/40 group-hover:text-white transition-colors" style={{ fontFamily: 'system-ui' }}>✕</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row min-h-[240px] sm:min-h-[300px]">
              {/* Sidebar / Top bar on mobile */}
              <div className="w-full sm:w-[180px] shrink-0 border-b sm:border-b-0 sm:border-r border-white/[0.07] bg-[#090a0f] p-2.5 sm:p-3 flex sm:flex-col flex-row overflow-x-auto sm:overflow-x-visible gap-1.5 sm:gap-1 items-center sm:items-stretch scrollbar-none">
                <div className="px-2 py-1 mb-1 sm:mb-2 hidden sm:block">
                  <div className="flex items-center gap-2 text-white/40">
                    <div className="w-4 h-5 rounded-sm border border-white/20 flex items-center justify-center">
                      <div className="w-2 h-2.5 rounded-[1px] border border-white/30" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/70 font-medium">Your Device</p>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[9px] text-white/30">Connected</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-[9px] text-white/25 font-semibold tracking-[0.2em] uppercase px-2 mb-1 hidden sm:block">Pages</p>
                {pages.map((page, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 px-2.5 py-1 sm:py-1.5 rounded-lg cursor-default shrink-0 whitespace-nowrap ${
                      i === 0 ? 'bg-white/[0.08] border border-white/[0.12]' : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex gap-0.5">
                      {page.keys.map((k, j) => (
                        <div key={j} className="w-2.5 h-2.5 rounded-[2px] bg-white/[0.15]" />
                      ))}
                    </div>
                    <span className={`text-[10px] font-medium ${i === 0 ? 'text-white' : 'text-white/40'}`}>
                      {page.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Main area */}
              <div className="flex-1 p-3.5 sm:p-5">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div>
                    <h3 className="text-[15px] sm:text-[18px] font-bold text-white">Streaming</h3>
                    <p className="text-[10px] sm:text-[11px] text-white/30 mt-0.5">Tap an empty slot to add · Drag to rearrange</p>
                  </div>
                  <span className="text-[9px] sm:text-[10px] px-2.5 py-1 rounded-full border border-emerald-500/40 text-emerald-400/70 font-mono">
                    ● LIVE
                  </span>
                </div>

                {/* Tile grid */}
                <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                  {tiles.map((tile, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-[10px] sm:rounded-[12px] bg-white/[0.04] border border-white/[0.07] flex flex-col items-center justify-center p-1 cursor-default hover:bg-white/[0.08] transition-colors"
                    >
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-white/[0.1] mb-1" />
                      <span className="text-[7px] sm:text-[8px] text-white/30 text-center leading-tight">{tile}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Bottom footnote */}
        <Reveal direction="up" delay={220}>
          <p className="text-center mt-6 text-[12px] text-white/20 font-light">
            Pages are unlimited. Buttons per page: unlimited. Layouts: fully custom.
          </p>
        </Reveal>
      </div>
    </section>
  );
};
