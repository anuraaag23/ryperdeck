import React from 'react';
import { LiquidGlassCard } from '../LiquidGlass/LiquidGlassCard';
import { Check } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const comparisonItems = [
    {
      feature: 'Hardware Investment',
      streamdeck: '$150 – $250 USD',
      ryperdeck: '$0 (Uses your existing device)',
      highlight: true,
    },
    {
      feature: 'Display Technology',
      streamdeck: 'Low-res LCD under plastic buttons',
      ryperdeck: '120Hz OLED / Retina Liquid Glass',
      highlight: true,
    },
    {
      feature: 'Input Versatility',
      streamdeck: 'Fixed push buttons only',
      ryperdeck: 'Multi-touch sliders, hold triggers, and dials',
      highlight: true,
    },
    {
      feature: 'Page & Button Limits',
      streamdeck: 'Strictly limited to 15 or 32 physical keys',
      ryperdeck: 'Infinite pages, flexible grid matrices',
      highlight: false,
    },
    {
      feature: 'Preset Sharing (.json)',
      streamdeck: 'Proprietary store account requirement',
      ryperdeck: 'Direct .json drag-and-drop file export & import',
      highlight: true,
    },
    {
      feature: 'Desk Clutter',
      streamdeck: 'Additional plastic dock & USB cabling',
      ryperdeck: '100% wireless Wi-Fi. Clean desk.',
      highlight: false,
    },
  ];

  return (
    <section id="comparison" className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-6 bg-black border-t border-white/[0.05] overflow-hidden">
      <div className="relative max-w-4xl mx-auto text-center">
        <div className="mb-3 inline-flex items-center gap-2">
          <span className="liquid-glass-badge">
            Hardware Comparison
          </span>
        </div>

        <h2 className="text-[28px] sm:text-[44px] md:text-[56px] font-bold tracking-[-0.035em] leading-[1.05] text-white mb-4">
          The StreamDeck<br />
          <span className="text-white/40">you already own.</span>
        </h2>

        {/* Pricing Comparison */}
        <div className="my-10 sm:my-14 flex items-center justify-center gap-8 sm:gap-20">
          <div className="flex flex-col items-center">
            <span className="text-[40px] sm:text-[60px] md:text-[76px] font-bold tracking-tight text-white/25 line-through decoration-white/35 decoration-2">
              $250
            </span>
            <span className="text-[11px] uppercase tracking-widest text-white/25 mt-1 font-mono">
              StreamDeck
            </span>
          </div>

          <span className="text-[16px] text-white/25 font-light">vs</span>

          <div className="flex flex-col items-center">
            <span className="text-[40px] sm:text-[60px] md:text-[76px] font-bold tracking-tight text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.35)]">
              $0
            </span>
            <span className="liquid-glass-badge text-[11px] uppercase tracking-widest mt-1 font-semibold text-white">
              RyperDeck
            </span>
          </div>
        </div>

        <p className="text-[15px] sm:text-[17px] text-white/50 max-w-md mx-auto leading-relaxed font-light mb-16">
          The high-resolution touch hardware is already charging on your desk. You paid for it years ago.
        </p>

        {/* Comparison Matrix in Liquid Glass Card */}
        <LiquidGlassCard className="p-6 sm:p-8 text-left">
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-white/[0.08] text-[11px] text-white/45 uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Capability</th>
                  <th className="py-3.5 px-4 font-medium text-white/35">StreamDeck</th>
                  <th className="py-3.5 px-4 font-semibold text-white">RyperDeck for Windows</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {comparisonItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white/85">
                      {item.feature}
                    </td>
                    <td className="py-3.5 px-4 text-white/40">
                      {item.streamdeck}
                    </td>
                    <td className={`py-3.5 px-4 font-medium ${item.highlight ? 'text-white' : 'text-white/70'}`}>
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-md liquid-glass-icon-pod shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </span>
                        <span>{item.ryperdeck}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </LiquidGlassCard>
      </div>
    </section>
  );
};
