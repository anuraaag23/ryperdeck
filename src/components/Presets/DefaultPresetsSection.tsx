import React, { useState } from 'react';
import { Download, Check, Smartphone, FileJson, Sparkles } from 'lucide-react';
import { LiquidGlassCard } from '../LiquidGlass/LiquidGlassCard';

export const DefaultPresetsSection: React.FC = () => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = '/presets/ryper-deck-workspace.json';
    a.download = 'ryper-deck-workspace.json';
    document.body.appendChild(a);
    a.click();
    a.remove();

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <section id="presets" className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-6 bg-black border-t border-white/[0.05] overflow-hidden">
      {/* Neutral optical caustics */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[450px] rounded-full bg-white/[0.025] blur-[160px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2">
            <span className="liquid-glass-badge">
              <FileJson className="w-3 h-3 text-white/70" />
              Default Presets
            </span>
          </div>
          <h2 className="text-[28px] sm:text-[42px] md:text-[54px] font-bold tracking-[-0.035em] leading-[1.05] text-white mb-4">
            Ready-made Presets for Your Deck.
          </h2>
          <p className="text-[15px] sm:text-[17px] text-white/50 max-w-xl mx-auto leading-relaxed font-light">
            Just download the <code className="text-white/90 font-mono text-[13px] bg-white/[0.08] px-2 py-0.5 rounded-lg border border-white/[0.1]">.json</code> file and import it into your app to enjoy, customize, or build your own pages.
          </p>
        </div>

        {/* Master Preset Showcase Card with attached Import Showcase Screenshot */}
        <LiquidGlassCard
          className="p-8 sm:p-10 mb-16 border border-white/[0.15] bg-[#0c0d12]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2">
                  <span className="liquid-glass-badge uppercase font-mono tracking-wider text-white/80">
                    ★ Official Default Layout
                  </span>
                </div>

                <h3 className="text-[26px] sm:text-[32px] font-bold text-white tracking-tight leading-tight mb-3">
                  RyperDeck Default Workspace
                </h3>

                <p className="text-[14px] text-white/55 leading-relaxed font-light mb-6">
                  Pre-configured with official media controls, developer hotkeys, system monitoring dials, and layout templates created by the developer. Ready for instant 1-click import.
                </p>

                {/* Metadata Chips */}
                <div className="flex items-center gap-2.5 text-xs text-white/50 mb-8 font-mono flex-wrap">
                  <span className="liquid-glass-badge">
                    10 Pages • 96 Buttons
                  </span>
                  <span>•</span>
                  <span>32 System Widgets</span>
                  <span>•</span>
                  <span>Schema v2 .JSON</span>
                </div>
              </div>

              {/* Download CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-5 border-t border-white/[0.08]">
                <button
                  onClick={handleDownload}
                  className="liquid-glass-btn liquid-glass-btn-primary h-12 px-8 text-[13px] font-bold gap-2 cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .json File</span>
                </button>

                {downloaded && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    <span>Downloaded! Import via Settings in your app</span>
                  </span>
                )}
              </div>
            </div>

            {/* Right Screenshot Showcase: Actual Import Workspace Screenshot */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.14] bg-[#070709] shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
                <img
                  src="/screenshots/preset_import_showcase.jpg"
                  alt="RyperDeck Settings Gemini AI and Import Workspace"
                  className="w-full h-auto block showcase-image pointer-events-none select-none"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 right-3 text-[10px] font-mono text-white/80 px-2.5 py-1 rounded-full bg-black/85 border border-white/20 backdrop-blur-md">
                  App Settings → Gemini AI &amp; Import Workspace
                </span>
              </div>
            </div>
          </div>
        </LiquidGlassCard>

        {/* Dedicated Gemini AI Automation Feature Card */}
        <div className="mb-14 p-6 sm:p-8 rounded-[28px] liquid-glass-panel border border-indigo-500/20 bg-gradient-to-br from-indigo-950/20 via-[#0c0d14] to-[#0a0a10]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/10 border border-indigo-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  AI-Powered Automations
                </span>
              </div>
              <h3 className="text-[22px] sm:text-[26px] font-bold text-white tracking-tight mb-2.5">
                Make new automations just by explaining what you want.
              </h3>
              <p className="text-[14px] text-white/60 leading-relaxed font-light">
                No complex scripting or manual key-binding needed. Simply describe your workflow in plain language — for example, <span className="text-white/85 italic">"When I tap this, launch OBS, switch to Gaming scene, mute Discord, and bring Spotify volume to 20%"</span> — and RyperDeck’s integrated Gemini AI automatically generates, configures, and binds the actions directly to your deck.
              </p>
            </div>
            <div className="shrink-0 flex items-center">
              <div className="px-5 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-white/70">
                <span className="text-indigo-400 font-semibold block mb-1">Natural Language → Macro</span>
                <span>Type prompt · Instant button created</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Step Import Guide */}
        <div className="mb-20 p-6 sm:p-8 rounded-[28px] liquid-glass-panel-subtle">
          <h4 className="text-[15px] font-bold text-white mb-4 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl liquid-glass-icon-pod">
              <Smartphone className="w-3.5 h-3.5 text-white" />
            </span>
            <span>How to import into the RyperDeck app:</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-white/55 leading-relaxed font-light">
            <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.06]">
              <span className="text-white font-mono font-bold block mb-1">Step 01</span>
              Download the <strong className="text-white">.json</strong> file above to your phone/tablet or transfer it via Wi-Fi.
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.06]">
              <span className="text-white font-mono font-bold block mb-1">Step 02</span>
              Open RyperDeck, tap <strong className="text-white">Settings</strong> at the bottom right.
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.06]">
              <span className="text-white font-mono font-bold block mb-1">Step 03</span>
              Tap <strong className="text-white">Import Workspace</strong> under Data, pick the .json file, and your full layout is instantly active!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
