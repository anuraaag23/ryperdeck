import React from 'react';
import { Play } from 'lucide-react';
import { TopSupportersBar } from '../Coffee/TopSupportersBar';

export const InActionSection: React.FC = () => {
  return (
    <section
      id="in-action"
      className="relative flex flex-col items-center justify-center px-4 sm:px-6 py-20 sm:py-28 md:py-36 overflow-hidden bg-black"
    >
      {/* Top divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      {/* Ambient — neutral monochrome */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-white/[0.02] blur-[180px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] backdrop-blur-xl text-[11px] font-medium tracking-widest uppercase text-white/40 mb-8">
          <Play className="w-3 h-3" />
          RyperDeck in Action
        </span>

        {/* Placeholder frame */}
        <div className="w-full max-w-xl rounded-[32px] liquid-glass-panel-subtle border border-white/[0.07] aspect-video flex flex-col items-center justify-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full liquid-glass-panel border border-white/[0.12] flex items-center justify-center">
            <Play className="w-6 h-6 text-white/30 ml-0.5" />
          </div>
          <p className="text-[13px] text-white/25 font-light tracking-wide">
            Preview coming soon
          </p>
        </div>

        <h2 className="text-[26px] sm:text-[36px] md:text-[44px] font-bold tracking-[-0.04em] leading-tight text-white mb-4">
          See it live.{' '}
          <span className="text-white/40">
            Feel the difference.
          </span>
        </h2>
        <p className="text-[16px] text-white/35 font-light max-w-sm">
          A real-world recording of RyperDeck in action — coming very soon.
        </p>
      </div>

      {/* Top Supporters Bar — below the video area */}
      <div className="relative z-10 w-full max-w-4xl mx-auto mt-16">
        <TopSupportersBar />
      </div>
    </section>
  );
};
