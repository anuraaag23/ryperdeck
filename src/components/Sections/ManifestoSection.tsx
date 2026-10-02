import React, { useState } from 'react';
import { Reveal } from '../Reveal';
import { submitSubscriberEmail } from '../../lib/supabase';

export const ManifestoSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    const trimmed = email.trim();
    if (!trimmed || !/\S+@\S+\.\S+/.test(trimmed)) return;
    await submitSubscriberEmail(trimmed);
    localStorage.setItem('ryperdeck_build_follow', trimmed);
    setSubmitted(true);
    setOpen(false);
  };

  return (
    <section className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-6 bg-black border-t border-white/[0.05] overflow-hidden">
      {/* Subtle neutral bloom */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-white/[0.015] blur-[200px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Main bold headline */}
        <Reveal direction="up">
          <h2 className="text-[36px] sm:text-[60px] md:text-[80px] lg:text-[96px] font-bold tracking-[-0.045em] leading-[0.95] text-white mb-6 sm:mb-8">
            Built with{' '}
            <span className="text-white/50">attention,</span>
            <br />
            <span className="text-white/30">not investors.</span>
          </h2>
        </Reveal>

        {/* Sub-copy */}
        <Reveal direction="up" delay={100}>
          <p className="text-[15px] sm:text-[18px] md:text-[20px] text-white/50 font-light leading-relaxed mb-3 max-w-lg mx-auto">
            Solo built by Anurag. Independent development. Zero funding. Zero team.
          </p>
          <p className="text-[13px] sm:text-[15px] text-white/25 font-light leading-relaxed mb-10 sm:mb-12">
            Core stays free, forever — no paywalls, no subscriptions, ever.
          </p>
        </Reveal>

        {/* Follow the build CTA */}
        <Reveal direction="up" delay={180}>
          {submitted ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full liquid-glass-panel border border-white/[0.12] text-[13px] text-white/60 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              You're on the list. We'll keep you posted.
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => setOpen(o => !o)}
                className="text-[11px] tracking-[0.35em] uppercase text-white/35 hover:text-white/70 transition-colors duration-300 font-medium cursor-pointer"
              >
                Follow the Build ↓
              </button>

              {/* Inline email drop */}
              <div className={`w-full max-w-sm overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                open ? 'max-h-[140px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    placeholder="your@email.com"
                    maxLength={254}
                    className="liquid-glass-input flex-1 h-[44px] px-4 text-[16px] sm:text-[13px] rounded-full"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!email.trim()}
                    className="liquid-glass-btn liquid-glass-btn-primary h-[44px] px-5 text-[12px] font-bold rounded-full disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
                  >
                    Notify me
                  </button>
                </div>
                <p className="mt-2 text-center text-[10px] text-white/20">No spam. Unsubscribe anytime.</p>
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
};
