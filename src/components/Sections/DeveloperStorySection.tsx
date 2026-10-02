import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Reveal } from '../Reveal';
import { DeveloperPhotoFrame } from './DeveloperPhotoFrame';

export const DeveloperStorySection: React.FC = () => {

  const milestones = [
    { label: 'Solo Creator Age', value: '20' },
    { label: 'Free Forever', value: '100%' },
    { label: 'Cloud Servers / Telemetry', value: '0' },
    { label: 'Local UDP Response', value: '< 1ms' },
  ];

  return (
    <section
      id="developer-story"
      className="relative flex flex-col items-center justify-center px-6 py-20 sm:py-28 md:py-36 overflow-hidden bg-black"
    >
      {/* Neutral optical caustics */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[160px] pointer-events-none" />

      {/* Horizontal divider at top */}
      <div className="absolute top-0 inset-x-0 h-px bg-white/[0.08]" />

      <div className="relative z-10 max-w-5xl mx-auto w-full">

        {/* Badge */}
        <Reveal direction="up" className="flex justify-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] backdrop-blur-xl text-[11px] font-medium tracking-widest uppercase text-white/80">
            <svg className="w-3 h-3 text-white/70" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0l1.8 5.5H16l-4.9 3.6L12.9 15 8 11.4 3.1 15l1.8-5.9L0 5.5h6.2z" />
            </svg>
            Built by one person • Age 20
          </span>
        </Reveal>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-center">

          {/* Left — story text */}
          <div>
            <Reveal direction="up">
              <h2 className="text-[32px] sm:text-[44px] md:text-[54px] font-bold tracking-[-0.04em] leading-[1.02] text-white mb-6">
                One dream.{' '}
                <span className="text-white/60">
                  One developer.
                </span>
              </h2>
            </Reveal>

            <Reveal direction="up" delay={100}>
              <div className="space-y-5 text-[16px] sm:text-[17px] text-white/50 leading-relaxed font-light mb-10">
                <p>
                  I'm Anurag — I am 20, a solo developer who got tired of spending{' '}
                  <span className="text-white/80 font-medium">$250 on a Stream Deck</span> just to control my
                  Windows PC while streaming and working. So I built my own.
                </p>
                <p>
                  RyperDeck started as a weekend project and turned into{' '}
                  <span className="text-white/80 font-medium">2 months of obsessive building</span> — 
                  designing every pixel, every protocol, every gesture. Late nights, way too much coffee, 
                  and a dream to give Windows power users the tool they deserve for free.
                </p>
                <p>
                  My goal is simple: build something so good that you'd never need to pay for it —
                  and make it <span className="text-white font-medium">100% free, forever</span>.
                </p>
              </div>
            </Reveal>

            {/* Timeline / milestones with live real cups of coffee & realtime visitors */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {milestones.map((m, idx) => (
                <Reveal key={m.label} direction="up" delay={150 + idx * 60}>
                  <div
                    className="rounded-[20px] liquid-glass-panel-subtle p-4 border border-white/[0.06] hover:border-white/[0.15] transition-all"
                  >
                    <p className="text-[28px] font-bold tracking-tight leading-none mb-1 text-white">
                      {m.value}
                    </p>
                    <p className="text-[12px] text-white/40 leading-snug">{m.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Discover More From The Developer */}
            <Reveal direction="up" delay={390}>
              <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[14px] font-semibold text-white">Curious what else I'm building?</p>
                  <p className="text-[12px] text-white/40 font-light">Explore experiments, tools & interactive apps.</p>
                </div>
                <a
                  href="http://anurag-shows-portfolio.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full liquid-glass-btn border border-white/[0.15] bg-white/[0.05] hover:bg-white/[0.12] text-xs font-semibold text-white transition-all shadow-[0_4px_20px_rgba(255,255,255,0.06)] group cursor-pointer whitespace-nowrap"
                >
                  <span>Discover more from the developer</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/60 group-hover:text-white transition-colors" />
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right — photo + beautiful custom frame with animated lines & grid inside */}
          <Reveal direction="scale" className="flex justify-center">
            <DeveloperPhotoFrame />
          </Reveal>
        </div>

        {/* Bottom quote */}
        <Reveal direction="up" delay={200} className="mt-20 text-center">
          <div className="inline-block max-w-2xl mx-auto">
            <p className="text-[17px] sm:text-[20px] md:text-[24px] font-light text-white/40 leading-relaxed tracking-tight italic">
              "I wanted every Windows power user in the world to have a{' '}
              <span className="text-white/80 not-italic font-medium">macro deck</span>{' '}
              in their pocket. No paywalls. No compromises."
            </p>
            <p className="mt-4 text-[12px] text-white/25 tracking-widest uppercase">— Anurag, Creator of RyperDeck</p>
            <div className="mt-6 flex justify-center">
              <a
                href="http://anurag-shows-portfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.1] hover:border-white/[0.2] text-[12px] text-white/70 hover:text-white transition-all cursor-pointer group"
              >
                <span>Discover more from the developer</span>
                <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
