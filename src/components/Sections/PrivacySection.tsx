import React, { useEffect, useRef, useState } from 'react';
import { Shield, Lock, Wifi, Monitor, Smartphone, Check } from 'lucide-react';
import { Reveal } from '../Reveal';

interface Props {
  onOpenPrivacyModal?: () => void;
}

export const PrivacySection: React.FC<Props> = ({ onOpenPrivacyModal }) => {
  const [activeStep, setActiveStep] = useState(1);

  // Animated cycle through steps to simulate packet flow
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 3);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      id: 0,
      label: 'Your Windows PC',
      sub: 'Broadcasts button actions over LAN',
      icon: <Monitor className="w-4 h-4 text-white/70" />,
      detail: 'Direct socket stream · Zero telemetry',
    },
    {
      id: 1,
      label: 'Local Wi-Fi only',
      sub: 'UDP · encrypted · zero internet',
      icon: <Wifi className="w-4 h-4 text-white/90" />,
      detail: 'Packets stay strictly within your subnet',
      highlight: true,
    },
    {
      id: 2,
      label: 'Your Android Device',
      sub: 'Receives layout · sends instantaneous taps',
      icon: <Smartphone className="w-4 h-4 text-white/70" />,
      detail: '0.3ms latency · No cloud relay',
    },
  ];

  return (
    <section id="privacy-overview" className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-6 bg-black border-t border-white/[0.05] overflow-hidden">
      {/* Ambient background glow with soft breathing animation */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.018] blur-[220px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />

      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Left Column — Text & Philosophy */}
        <div>
          <Reveal direction="up">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/[0.1] bg-white/[0.03] text-[10px] font-semibold tracking-[0.3em] uppercase text-white/60 mb-6">
              <Shield className="w-3.5 h-3.5 text-white/80" />
              100% PRIVATE
            </span>
          </Reveal>

          <Reveal direction="up" delay={80}>
            <h2 className="text-[40px] sm:text-[56px] md:text-[68px] font-bold tracking-[-0.04em] leading-[0.97] text-white mb-8">
              Nothing<br />
              <span className="text-white/35">leaves your home.</span>
            </h2>
          </Reveal>

          <Reveal direction="up" delay={140}>
            <div className="space-y-5 text-[15px] sm:text-[16px] text-white/50 font-light leading-relaxed mb-8">
              <p>
                No servers. No accounts. No telemetry. RyperDeck runs entirely on your{' '}
                <span className="text-white/80 font-medium">local Wi-Fi</span> using direct UDP
                packets — the exact same private local protocol your wireless mouse uses.
              </p>
              <p className="text-[13px] text-white/35">
                Your hotkeys, your layouts, your usage patterns — none of it ever touches the internet. Ever.
              </p>
            </div>
          </Reveal>

          <Reveal direction="up" delay={180}>
            <div className="flex flex-wrap items-center gap-4">
              {onOpenPrivacyModal && (
                <button
                  onClick={onOpenPrivacyModal}
                  className="inline-flex items-center gap-2 text-[13px] font-medium text-white/70 hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Read full Privacy Policy →
                </button>
              )}
            </div>
          </Reveal>
        </div>

        {/* Right Column — Animated Fluid Flow Diagram */}
        <Reveal direction="left" delay={120}>
          <div className="relative rounded-[32px] p-6 sm:p-8 bg-[#090a10]/80 border border-white/[0.1] backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.8)]">
            
            {/* Live Status Header */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[12px] font-mono text-white/60">Local Subnet Socket</span>
              </div>
              <span className="text-[11px] font-mono text-white/30 uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
                Internet: 0 KB/S
              </span>
            </div>

            {/* Stepper with animated packet stream */}
            <div className="relative flex flex-col gap-3">
              {steps.map((step, i) => {
                const isStepActive = activeStep === step.id;
                return (
                  <div key={step.id} className="relative flex flex-col items-start group">
                    {/* Step Card */}
                    <div
                      className={`w-full rounded-[22px] px-5 sm:px-6 py-4 sm:py-5 border transition-all duration-500 ${
                        isStepActive || step.highlight
                          ? 'liquid-glass-panel border-white/[0.22] shadow-[0_0_40px_rgba(255,255,255,0.06)] bg-white/[0.06]'
                          : 'bg-white/[0.025] border-white/[0.06] hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          {/* Circle Icon Indicator */}
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 ${
                              isStepActive
                                ? 'bg-white/20 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105'
                                : 'bg-white/[0.04] border-white/[0.1]'
                            }`}
                          >
                            {step.icon}
                          </div>

                          <div>
                            <p className="text-[15px] font-semibold text-white leading-tight">
                              {step.label}
                            </p>
                            <p className="text-[12px] text-white/40 font-light mt-0.5">
                              {step.sub}
                            </p>
                          </div>
                        </div>

                        {/* Detail Tag */}
                        <span className="hidden sm:inline-block text-[10px] font-mono text-white/35 px-2.5 py-1 rounded-lg bg-black/40 border border-white/[0.05]">
                          {step.detail}
                        </span>
                      </div>
                    </div>

                    {/* Connector line between steps with moving pulse */}
                    {i < steps.length - 1 && (
                      <div className="relative ml-[30px] my-1 w-0.5 h-6 bg-white/[0.1] overflow-hidden">
                        <div
                          className="absolute inset-x-0 h-4 bg-white/80 rounded-full blur-[1px] animate-pulse"
                          style={{
                            animation: 'timelinePulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom footnote */}
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-white/35">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Packets never reach the internet. Ever.
              </span>
              <span className="font-mono text-white/25">Air-gapped safe</span>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
};
