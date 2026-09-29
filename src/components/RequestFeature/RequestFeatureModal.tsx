import React, { useState, useEffect, useCallback } from 'react';
import {
  submitFeatureRequest,
  upvoteFeatureRequest,
  fetchFeatureRequests,
} from '../../lib/supabase';
import {
  X,
  ChevronUp,
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

interface Feature {
  id: string;
  name?: string;
  email?: string;
  title: string;
  description: string;
  votes: number;
  status: 'requested' | 'planned' | 'building' | 'done';
  ts: number;
}

const STATUS_LABELS: Record<Feature['status'], { label: string; color: string }> = {
  requested: { label: 'Requested', color: 'text-white/40 border-white/10 bg-white/[0.04]' },
  planned:   { label: 'Planned',   color: 'text-amber-400/70 border-amber-400/20 bg-amber-400/[0.06]' },
  building:  { label: 'Building',  color: 'text-blue-400/70 border-blue-400/20 bg-blue-400/[0.06]' },
  done:      { label: 'Done ✓',    color: 'text-emerald-400/70 border-emerald-400/20 bg-emerald-400/[0.06]' },
};

const SEED_FEATURES: Feature[] = [
  {
    id: 'f1',
    title: 'Macro chaining — run multiple actions in sequence',
    description: 'Tap once and fire 3 hotkeys in order with configurable delays.',
    votes: 52,
    status: 'planned',
    ts: Date.now() - 86400000 * 5,
  },
  {
    id: 'f2',
    title: 'Haptic feedback on action fire',
    description: 'Short vibration on the phone when a button is pressed successfully.',
    votes: 41,
    status: 'building',
    ts: Date.now() - 86400000 * 3,
  },
  {
    id: 'f3',
    title: 'Per-page background image / icon pack',
    description: 'Let users set a custom icon or background per page.',
    votes: 34,
    status: 'requested',
    ts: Date.now() - 86400000 * 7,
  },
  {
    id: 'f4',
    title: 'Auto-connect on device wake',
    description: 'RyperDeck should automatically reconnect when the phone screen turns on.',
    votes: 28,
    status: 'done',
    ts: Date.now() - 86400000 * 10,
  },
];

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

const STORAGE_KEY = 'ryperdeck_features';
const VOTED_KEY   = 'ryperdeck_voted_ids';

function loadFeatures(): Feature[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Feature[];
  } catch {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_FEATURES));
  return SEED_FEATURES;
}
function saveFeatures(f: Feature[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(f));
}
function loadVoted(): Set<string> {
  try {
    const raw = localStorage.getItem(VOTED_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch {}
  return new Set();
}
function saveVoted(v: Set<string>) {
  localStorage.setItem(VOTED_KEY, JSON.stringify([...v]));
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestFeatureModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [voted,    setVoted]    = useState<Set<string>>(new Set());
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [request,  setRequest]  = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [viewCommunity, setViewCommunity] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setName('');
      setEmail('');
      setRequest('');
      setViewCommunity(false);
      setVoted(loadVoted());

      // Initial load from local cache
      setFeatures(loadFeatures().sort((a, b) => b.votes - a.votes));

      // Fetch latest from Supabase
      fetchFeatureRequests().then((dbList) => {
        if (dbList && dbList.length > 0) {
          const mapped: Feature[] = dbList.map((item: any) => ({
            id: item.id || `f_${Date.now()}`,
            name: item.name || undefined,
            email: item.email || undefined,
            title: item.title,
            description: item.description,
            votes: item.votes || 1,
            status: item.status || 'requested',
            ts: item.created_at ? new Date(item.created_at).getTime() : Date.now(),
          }));
          // Merge unique
          const ids = new Set(mapped.map(m => m.id));
          const remaining = loadFeatures().filter(f => !ids.has(f.id));
          const combined = [...mapped, ...remaining].sort((a, b) => b.votes - a.votes);
          setFeatures(combined);
          saveFeatures(combined);
        }
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const upvote = useCallback(async (id: string) => {
    if (voted.has(id)) return;
    const newFeatures = features.map(f => f.id === id ? { ...f, votes: f.votes + 1 } : f);
    const newVoted = new Set([...voted, id]);
    setFeatures(newFeatures.sort((a, b) => b.votes - a.votes));
    setVoted(newVoted);
    saveFeatures(newFeatures);
    saveVoted(newVoted);
    await upvoteFeatureRequest(id);
  }, [features, voted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.trim()) return;

    const res = await submitFeatureRequest({
      title: request.trim(),
      description: request.trim(),
      name: name.trim() || undefined,
      email: email.trim() || undefined,
    });

    const newF: Feature = {
      id: res.data?.id || `f_${Date.now()}`,
      name: name.trim() || undefined,
      email: email.trim() || undefined,
      title: request.trim().slice(0, 100),
      description: request.trim(),
      votes: 1,
      status: 'requested',
      ts: Date.now(),
    };

    const newFeatures = [newF, ...features.filter(f => f.id !== newF.id)].sort((a, b) => b.votes - a.votes);
    const newVoted = new Set([...voted, newF.id]);
    setFeatures(newFeatures);
    setVoted(newVoted);
    saveFeatures(newFeatures);
    saveVoted(newVoted);
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

                  <button
                    type="button"
                    onClick={() => setViewCommunity(!viewCommunity)}
                    className="text-[12px] text-white/40 hover:text-white underline cursor-pointer transition-colors"
                  >
                    {viewCommunity ? 'Hide community votes' : `View community votes (${features.length})`}
                  </button>
                </div>
              </form>
            )}

            {/* Community Upvotes Section */}
            {viewCommunity && (
              <div className="mt-8 space-y-3 animate-fadeIn">
                <p className="text-[12px] font-semibold text-white/40 uppercase tracking-widest mb-4">
                  Community Upvote Board
                </p>
                <div className="grid grid-cols-1 gap-3 max-h-[360px] overflow-y-auto pr-1">
                  {features.map(f => {
                    const hasVoted = voted.has(f.id);
                    const s = STATUS_LABELS[f.status];
                    return (
                      <div
                        key={f.id}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.12] transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() => upvote(f.id)}
                          disabled={hasVoted}
                          className={`flex flex-col items-center justify-center min-w-[44px] py-2 px-2 rounded-xl border transition-all ${
                            hasVoted
                              ? 'bg-white/[0.08] border-white/[0.15] text-white cursor-default'
                              : 'bg-white/[0.03] border-white/[0.08] text-white/50 hover:bg-white/[0.08] hover:text-white cursor-pointer active:scale-95'
                          }`}
                        >
                          <ChevronUp className="w-4 h-4" />
                          <span className="text-[12px] font-bold">{f.votes}</span>
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-[14px] font-semibold text-white">{f.title}</span>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full border font-semibold ${s.color}`}>
                              {s.label}
                            </span>
                          </div>
                          {f.description && (
                            <p className="text-[12px] text-white/40 leading-relaxed">{f.description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
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
