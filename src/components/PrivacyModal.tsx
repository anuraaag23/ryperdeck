import React, { useEffect } from 'react';
import { X, Shield } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SECTIONS = [
  {
    title: 'What we collect',
    body: 'RyperDeck collects nothing. The app operates entirely on your local Wi-Fi network via direct UDP packets. No data, no telemetry, no usage analytics, no account creation — nothing leaves your network.',
  },
  {
    title: 'This website',
    body: 'The RyperDeck landing page stores only two things in your browser\'s localStorage: your community leaderboard contributions (if you choose to buy a coffee) and your feature/bug reports. These never leave your device unless you explicitly submit them.',
  },
  {
    title: 'Cookies',
    body: 'We do not use cookies. No tracking cookies, no marketing pixels, no third-party analytics scripts are loaded on this page.',
  },
  {
    title: 'Local network & Wi-Fi',
    body: 'The RyperDeck Windows companion app and Android app communicate via direct UDP packets on your LAN. Packets are scoped to your local network and never routed through any external server, cloud service, or CDN.',
  },
  {
    title: 'Feature requests & bug reports',
    body: 'When you submit a feature request or bug report, the data is stored in your browser\'s localStorage. If you include your email, it is only used to follow up on your report — it is never shared with any third party.',
  },
  {
    title: 'Coffee / supporter data',
    body: 'If you choose to support development, your display name and message are stored in your browser\'s localStorage and displayed in the on-page leaderboard. Payment processing is handled by Razorpay under their own Privacy Policy. We do not receive or store your payment details.',
  },
  {
    title: 'Third-party services',
    body: 'Fonts are served by Google Fonts. The font requests may include your IP address as per standard HTTP behaviour, governed by Google\'s Privacy Policy. No other third-party services are used.',
  },
  {
    title: 'Contact',
    body: 'If you have any privacy concerns or questions, email directly at: ryperdeck.help@gmail.com',
  },
];

export const PrivacyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-2xl animate-fadeIn cursor-default"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-2xl rounded-t-[32px] sm:rounded-[32px] bg-[#0b0c14] border border-white/[0.12] shadow-[0_40px_120px_rgba(0,0,0,0.97)] max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between p-6 sm:p-8 pb-0 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white/60" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-white">Built private. Kept private.</h2>
              <p className="text-[11px] text-white/35 font-light">The RyperDeck Privacy Policy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/[0.12] transition-colors text-white/50 hover:text-white cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Trust Guarantee Banner (Replaces raw TL;DR) */}
        <div className="mx-6 sm:mx-8 mt-5 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.1] flex items-start gap-3">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[13px] text-white/70 font-normal leading-relaxed">
            <span className="font-semibold text-white">Our Privacy Guarantee:</span> RyperDeck collects zero data. Direct UDP socket communication over your local home Wi-Fi. No telemetry, no cloud relays, no account required.
          </p>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-5 scrollbar-none">
          <div className="flex flex-col gap-6">
            {SECTIONS.map((s, i) => (
              <div key={i} className="border-b border-white/[0.05] pb-5 last:border-0">
                <h3 className="text-[14px] font-bold text-white mb-2">{s.title}</h3>
                <p className="text-[13px] text-white/45 leading-relaxed font-light">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 rounded-2xl bg-[#090a12] border border-white/[0.14] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-[13px] font-bold text-white mb-0.5">Need to ask a privacy question?</p>
              <p className="text-[11px] text-white/40">Direct email response within 24 hours.</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="mailto:ryperdeck.help@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.2] text-white text-[12px] font-mono font-semibold transition-all group"
              >
                ryperdeck.help@gmail.com
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=ryperdeck.help@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-white/70 hover:text-white text-[12px] font-medium transition-colors"
                title="Open in Gmail"
              >
                Gmail ↗
              </a>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.05]">
            <p className="text-[11px] text-white/25 leading-relaxed">
              This policy may be updated when the product changes significantly. The date at the top will reflect any updates. By using RyperDeck, you agree to this policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
