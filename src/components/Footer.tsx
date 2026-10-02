import React from 'react';

// SVG icons for social platforms
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

export type LegalTabType = 'terms' | 'privacy' | 'refund' | 'shipping' | 'contact';

interface Props {
  onRequestFeature: () => void;
  onReportBug: () => void;
  onLegal: (tab: LegalTabType) => void;
  onPrivacy?: () => void;
  onOpenKeyboardMouse?: () => void;
}

export const Footer: React.FC<Props> = ({
  onRequestFeature,
  onReportBug,
  onLegal,
  onPrivacy,
  onOpenKeyboardMouse,
}) => {
  const handleLegal = (tab: LegalTabType) => {
    if (tab === 'privacy' && onPrivacy) {
      onPrivacy();
    } else {
      onLegal(tab);
    }
  };

  return (
    <footer className="relative border-t border-white/[0.06] bg-black pt-12 pb-[calc(3rem+env(safe-area-inset-bottom,0px))] sm:py-16 px-4 sm:px-6 text-[12px] text-white/40">
      <div className="max-w-5xl mx-auto">

        {/* Top row — brand + social */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-[18px] font-bold text-white">
                ryper<span className="text-white/70">deck</span>
              </span>
              <span className="liquid-glass-badge text-[10px] text-white/50">for Windows</span>
            </div>
            <p className="text-[12px] text-white/30 max-w-[280px] leading-relaxed mb-3">
              The wireless macro deck for Windows. Built solo by Anurag. Free, forever.
            </p>
            <a
              href="http://anurag-shows-portfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors group"
            >
              <span>Discover more from the developer</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </a>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {[
              { href: 'https://instagram.com/anuraaag12', icon: <InstagramIcon />, label: 'Instagram' },
              { href: 'https://t.me/Anurag_y2', icon: <TelegramIcon />, label: 'Telegram' },
              { href: 'https://x.com/Anurag_y1', icon: <TwitterIcon />, label: 'X / Twitter' },
              { href: 'mailto:ryperdeck.help@gmail.com', icon: <EmailIcon />, label: 'Email' },
              { href: 'https://github.com/anuraaag23', icon: <GitHubIcon />, label: 'GitHub' },
            ].map(({ href, icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.1] hover:border-white/[0.2] transition-all duration-200"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Middle row — nav links */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 mb-8 text-[13px]">
          <a
            href="#keyboard-mouse"
            onClick={(e) => {
              if (onOpenKeyboardMouse) {
                e.preventDefault();
                onOpenKeyboardMouse();
              }
            }}
            className="hover:text-white transition-colors duration-200 text-emerald-400 font-medium"
          >
            Keyboard &amp; Mouse Hub
          </a>
          <a href="#presets" className="hover:text-white transition-colors duration-200">Presets</a>
          <a href="#windows" className="hover:text-white transition-colors duration-200">Windows Native</a>
          <a href="#comparison" className="hover:text-white transition-colors duration-200">vs StreamDeck</a>
          <a href="#setup" className="hover:text-white transition-colors duration-200">Setup Guide</a>
          <a href="#download" className="hover:text-white transition-colors duration-200">Download</a>
          <a href="#faq" className="hover:text-white transition-colors duration-200">FAQ</a>
          <a
            href="http://anurag-shows-portfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200 text-white/60"
          >
            Developer Portfolio ↗
          </a>
        </div>

        {/* Legal & Transparency Policy Links */}
        <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 mb-8 text-[12px] text-white/50 border-t border-b border-white/[0.06] py-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 mr-1 sm:mr-2">
            Compliance & Policies:
          </span>
          <a
            href="#terms"
            onClick={(e) => { e.preventDefault(); handleLegal('terms'); }}
            className="hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Terms & Conditions
          </a>
          <span className="text-white/20">·</span>
          <a
            href="#privacy-policy"
            onClick={(e) => { e.preventDefault(); handleLegal('privacy'); }}
            className="hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Privacy Policy
          </a>
          <span className="text-white/20">·</span>
          <a
            href="#refund-policy"
            onClick={(e) => { e.preventDefault(); handleLegal('refund'); }}
            className="hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Refund & Cancellation Policy
          </a>
          <span className="text-white/20">·</span>
          <a
            href="#shipping-policy"
            onClick={(e) => { e.preventDefault(); handleLegal('shipping'); }}
            className="hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Shipping & Delivery Policy
          </a>
          <span className="text-white/20">·</span>
          <a
            href="#contact-us"
            onClick={(e) => { e.preventDefault(); handleLegal('contact'); }}
            className="hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Contact Us
          </a>
        </div>

        {/* Bottom row — copyright + links */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] text-white/30">
              © {new Date().getFullYear()} RyperDeck · Built with attention, not investors.
            </p>
            <p className="text-[11px] text-white/20 mt-1">
              Made by <a href="http://anurag-shows-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white underline underline-offset-2">Anurag</a> · Local UDP · Zero Cloud · 100% Private
            </p>
          </div>

          {/* Footer action links */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px]">
            <button
              onClick={onRequestFeature}
              className="hover:text-white transition-colors duration-200 cursor-pointer"
            >
              Request Feature
            </button>
            <button
              onClick={onReportBug}
              className="hover:text-white transition-colors duration-200 cursor-pointer"
            >
              Report Bug
            </button>
            <button
              onClick={() => handleLegal('contact')}
              className="hover:text-white transition-colors duration-200 cursor-pointer"
            >
              Support
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
