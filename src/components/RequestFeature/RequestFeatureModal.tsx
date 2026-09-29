import React, { useState, useEffect } from 'react';
import { submitFeatureRequest } from '../../lib/supabase';
import {
  X,
  Sparkles,
  Send,
  ArrowLeft,
  Smartphone,
  Zap,
  Layers,
  Move,
  Grid,
  Eye,
  SlidersHorizontal,
  RotateCcw,
  Sliders,
} from 'lucide-react';

const CURRENT_FEATURES = [
  {
    title: 'Wireless Android controller',
    desc: 'Use your Android phone or tablet as a wireless controller for your Windows PC over your local network.',
    icon: <Smartphone className="w-5 h-5 text-white/70" />,
  },
  {
    title: 'One-tap app launching',
    desc: 'Tap a tile on your Android device and the matching Windows app opens instantly.',
    icon: <Zap className="w-5 h-5 text-white/70" />,
  },
  {
    title: 'Custom pages',
    desc: 'Build separate pages for design, development, music, streaming, or any workflow you use often.',
    icon: <Layers className="w-5 h-5 text-white/70" />,
  },
  {
    title: 'Drag and drop setup',
    desc: 'Arrange apps and controls from the Windows app by dragging them into tiles.',
    icon: <Move className="w-5 h-5 text-white/70" />,
  },
  {
    title: 'Full app library',
    desc: 'Browse apps and actions from your Windows PC and place the ones you need onto your layout.',
    icon: <Grid className="w-5 h-5 text-white/70" />,
  },
  {
    title: 'Live preview',
    desc: 'See the phone or tablet layout mirrored inside the Windows app while you build your pages.',
    icon: <Eye className="w-5 h-5 text-white/70" />,
  },
  {
    title: 'Swipe between pages',
    desc: 'Move between multiple pages for different contexts without touching your Windows PC.',
    icon: <SlidersHorizontal className="w-5 h-5 text-white/70" />,
  },
  {
    title: 'Landscape support',
    desc: 'Lay your phone or tablet flat and use a landscape tile layout beside your keyboard.',
    icon: <RotateCcw className="w-5 h-5 text-white/70" />,
  },
  {
    title: 'System controls',
    desc: 'Control volume, brightness, media playback, dictation, screenshot, and system audio.',
    icon: <Sliders className="w-5 h-5 text-white/70" />,
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestFeatureModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [request, setRequest] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setSubmitting(false);
      setName('');
      setEmail('');
      setRequest('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.trim() || submitting) return;

    setSubmitting(true);
    await submitFeatureRequest({
      title: request.trim().slice(0, 100),
      description: request.trim(),
      name: name.trim() || undefined,
      email: email.trim() || undefined,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999999] overflow-y-auto bg-black/90 backdrop-blur-2xl animate-fadeIn p-4 sm:p-6 md:p-10 cursor-default"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="max-w-4xl mx-auto my-6 sm:my-10 bg-[#090a10] border border-white/[0.12] rounded-[32px] sm:rounded-[40px] shadow-[0_40px_140px_rgba(0,0,0,0.98)] overflow-hidden">
        
        {/* Top Bar with 'Back to RyperDeck' and Close */}
        <div className="p-6 sm:p-8 pb-4 flex items-center justify-between border-b border-white/[0.06]">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[13px] text-white/70 hover:text-white transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to RyperDeck
          </button>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 md:p-12 space-y-16">
          
          {/* Section 1: Form — Shape what gets built next */}
          <div>
            <span className="text-[11px] font-mono tracking-[0.35em] uppercase text-white/50 block mb-3 font-semibold">
              REQUEST A FEATURE
            </span>

            <h1 className="text-[36px] sm:text-[52px] md:text-[64px] font-bold tracking-[-0.04em] leading-[0.98] text-white mb-6">
              Shape what gets built <br />
              <span className="text-white/60">next.</span>
            </h1>

            <div className="space-y-2 text-[15px] sm:text-[16px] text-white/50 leading-relaxed font-light max-w-2xl mb-10">
              <p>
                If something would make RyperDeck better for your workflow, send it over. Below is what the product already supports today.
              </p>
              <p className="text-[13px] text-white/35">
                If your idea ships, we may feature your name on the site as one of the people who helped shape RyperDeck.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-[28px] bg-white/[0.03] border border-emerald-500/30 text-center space-y-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-emerald-500/[0.1] border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-[20px] font-bold text-white">Idea Submitted! 🎉</h3>
                <p className="text-[14px] text-white/50 max-w-md mx-auto">
                  Thank you! Your suggestion has been added to our roadmap review board with 1 starting vote.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => { setSubmitted(false); setRequest(''); }}
                    className="text-[13px] text-white/60 hover:text-white underline cursor-pointer"
                  >
                    Submit another feature request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-[28px] bg-white/[0.025] border border-white/[0.08] space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-white/40 block mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your name"
                      maxLength={80}
                      className="liquid-glass-input w-full px-4 py-3 text-[14px] rounded-2xl"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-white/40 block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      maxLength={254}
                      className="liquid-glass-input w-full px-4 py-3 text-[14px] rounded-2xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold tracking-wider uppercase text-white/40 block mb-2">
                    Feature request <span className="text-white/20 font-normal lowercase">(required)</span>
                  </label>
                  <textarea
                    required
                    value={request}
                    onChange={e => setRequest(e.target.value)}
                    placeholder="What should RyperDeck do? Tell us the feature and how you would use it."
                    rows={4}
                    maxLength={1000}
                    className="liquid-glass-input w-full px-4 py-3 text-[14px] rounded-2xl resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={!request.trim()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full liquid-glass-btn-primary font-bold text-[14px] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.12)]"
                  >
                    <Send className="w-4 h-4" />
                    Submit feature request
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.08]" />

          {/* Section 2: What RyperDeck offers right now (CURRENT FEATURES from Image 2) */}
          <div>
            <span className="text-[11px] font-mono tracking-[0.35em] uppercase text-white/40 block mb-3 font-semibold">
              CURRENT FEATURES
            </span>

            <div className="mb-8">
              <h2 className="text-[28px] sm:text-[40px] md:text-[48px] font-bold tracking-[-0.035em] leading-[1.02] text-white">
                What RyperDeck offers <br />
                <span className="text-white/40">right now.</span>
              </h2>
            </div>

            {/* 3x3 Card Grid matching Image 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CURRENT_FEATURES.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[22px] p-6 bg-white/[0.025] border border-white/[0.07] hover:border-white/[0.14] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-[16px] font-bold text-white mb-2 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-[12px] text-white/45 leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
