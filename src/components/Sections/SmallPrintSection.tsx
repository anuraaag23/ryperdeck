import React from 'react';
import { Reveal } from '../Reveal';

const specs = [
  {
    title: 'Windows 10 & 11',
    sub: '64-bit (1809+) • Zero installation portable .exe',
    icon: (
      <svg className="w-6 h-6 text-white/60" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 5.25L11.25 4.05V11.75H3V5.25ZM12.75 3.82L21 2.5V11.75H12.75V3.82ZM3 12.25H11.25V19.95L3 18.75V12.25ZM12.75 12.25H21V21.5L12.75 20.18V12.25Z" />
      </svg>
    ),
  },
  {
    title: 'Android 8.0 to 17+',
    sub: 'Phones, tablets & foldables in landscape & portrait',
    icon: (
      <svg className="w-6 h-6 text-white/60" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.523 15.341A6 6 0 0 0 6.477 8.659L4.5 6.682A9 9 0 0 1 19.5 6.682l-1.977 1.977zM15.5 10l-3.5 3.5-1.5-1.5-1.06 1.06 2.56 2.56L16.56 11.06 15.5 10zM7 17h10v1.5A2.5 2.5 0 0 1 14.5 21h-5A2.5 2.5 0 0 1 7 18.5V17zm2.5 1.5v.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-.5H9.5z" />
      </svg>
    ),
  },
  {
    title: 'Free Forever',
    sub: 'No subscriptions, no ads, no telemetry',
    icon: (
      <svg className="w-6 h-6 text-white/60" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-13h2v6h-2zm0 8h2v2h-2z" />
      </svg>
    ),
  },
];

export const SmallPrintSection: React.FC = () => {
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 bg-black border-t border-white/[0.05] overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Headline */}
        <Reveal direction="up">
          <h2 className="text-[28px] sm:text-[40px] md:text-[48px] font-bold tracking-[-0.03em] text-white text-center mb-12 sm:mb-16">
            Small print. No surprises.
          </h2>
        </Reveal>

        {/* Specs row */}
        <Reveal direction="scale" delay={100}>
          <div className="relative rounded-[28px] liquid-glass-panel border border-white/[0.1] overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.07]">
              {specs.map((spec, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center gap-3 px-8 py-10 sm:py-12 text-center group hover:bg-white/[0.03] transition-colors"
                >
                  {/* Icon pod */}
                  <div className="w-12 h-12 rounded-2xl liquid-glass-icon-pod flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                    {spec.icon}
                  </div>
                  <p className="text-[20px] sm:text-[24px] font-bold tracking-tight text-white leading-tight">
                    {spec.title}
                  </p>
                  <p className="text-[12.5px] text-white/40 font-light max-w-[200px]">
                    {spec.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Bottom footnote */}
        <Reveal direction="up" delay={160}>
          <p className="text-center mt-6 text-[12px] text-white/30 font-light">
            USB Cable (&lt;10ms) · Local Wi-Fi LAN · Direct Bluetooth · 100% Offline · Zero Cloud Relays · Zero Accounts
          </p>
        </Reveal>
      </div>
    </section>
  );
};
