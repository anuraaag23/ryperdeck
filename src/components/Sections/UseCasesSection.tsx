import React from 'react';

/* ── Small visual mockups for each card ──────────────────────────── */

// Card 1: Streamer — OBS scene switcher mockup
const StreamerVisual = () => (
  <div className="w-full rounded-xl bg-black/50 border border-white/[0.08] p-3 select-none">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      <span className="text-[10px] font-mono text-white/50">OBS Studio  •  LIVE</span>
    </div>
    <div className="flex flex-col gap-1.5">
      {['Gameplay Scene', 'Just Chatting', 'BRB Screen'].map((scene, i) => (
        <div
          key={i}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${
            i === 0
              ? 'bg-white/[0.1] border border-white/[0.12] text-white font-medium'
              : 'text-white/30'
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-red-400' : 'bg-white/20'}`} />
          {scene}
        </div>
      ))}
    </div>
  </div>
);

// Card 2: Gamer — keyboard shortcut mockup
const GamerVisual = () => (
  <div className="w-full flex flex-col gap-3 select-none">
    <div className="flex items-center gap-2">
      {['Ctrl', 'Shift', 'M'].map((k, i) => (
        <React.Fragment key={i}>
          <div className="px-2.5 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.12] text-[11px] font-mono text-white/60 font-medium">
            {k}
          </div>
          {i < 2 && <span className="text-white/25 text-[11px]">+</span>}
        </React.Fragment>
      ))}
      <span className="text-white/25 text-[11px] ml-1">→</span>
      <div className="px-2.5 py-1.5 rounded-lg bg-white/[0.12] border border-white/[0.2] text-[11px] font-semibold text-white ml-1">
        RyperDeck
      </div>
    </div>
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full bg-amber-400" />
      <span className="text-[11px] text-white/40 font-light">Flow uninterrupted</span>
    </div>
  </div>
);

// Card 3: Creator — app switcher mockup
const CreatorVisual = () => (
  <div className="w-full flex gap-2 select-none">
    {[
      { name: 'Notion', active: false },
      { name: 'Premiere', active: true },
      { name: 'Email', active: false },
    ].map((app, i) => (
      <div
        key={i}
        className={`flex-1 text-center px-2 py-2 rounded-xl border text-[10px] font-medium transition-all ${
          app.active
            ? 'bg-white/[0.1] border-white/[0.2] text-white'
            : 'bg-white/[0.02] border-white/[0.06] text-white/30'
        }`}
      >
        <div className={`w-6 h-6 rounded-lg mx-auto mb-1.5 ${app.active ? 'bg-white/20' : 'bg-white/[0.05]'}`} />
        {app.name}
      </div>
    ))}
  </div>
);

// Card 4: Power user — terminal snippet mockup
const PowerUserVisual = () => (
  <div className="w-full rounded-xl bg-black/60 border border-white/[0.07] p-3 font-mono text-[10px] select-none">
    <div className="flex gap-1.5 mb-2">
      <div className="w-2 h-2 rounded-full bg-white/20" />
      <div className="w-2 h-2 rounded-full bg-white/20" />
      <div className="w-2 h-2 rounded-full bg-white/20" />
    </div>
    {[
      { prompt: '>', cmd: 'npm run build', color: 'text-white/60' },
      { prompt: '>', cmd: 'git push origin main', color: 'text-white/40' },
      { prompt: '>', cmd: '█', color: 'text-white/70' },
    ].map((line, i) => (
      <div key={i} className={`${line.color} mb-0.5`}>
        <span className="text-white/25 mr-1.5">{line.prompt}</span>
        {line.cmd}
      </div>
    ))}
  </div>
);

/* ── Main section ─────────────────────────────────────────────────── */

const personas = [
  {
    tag: 'FOR THE STREAMER',
    tagColor: 'text-red-400/70',
    headline: 'Never leave your\nflow state.',
    body: 'Tap to trigger OBS scenes, mute Discord, switch layouts. Keep your hands on the keyboard. Keep going.',
    visual: <StreamerVisual />,
  },
  {
    tag: 'FOR THE GAMER',
    tagColor: 'text-amber-400/70',
    headline: 'Macros at\nyour fingertips.',
    body: 'One tap: push-to-talk, clip that, volume up. No memorizing 14-key combos.',
    visual: <GamerVisual />,
  },
  {
    tag: 'FOR THE CREATOR',
    tagColor: 'text-blue-400/70',
    headline: 'Boss walks by.\nYou\'re already on it.',
    body: 'One tap and you\'re on Premiere. Or Notion. Or your email draft. RyperDeck switches in 0.3ms.',
    visual: <CreatorVisual />,
  },
  {
    tag: 'FOR THE POWER USER',
    tagColor: 'text-emerald-400/70',
    headline: 'Any action.\nOne tap.',
    body: 'Run scripts, open terminal, paste clipboard snippets — anything you can bind, RyperDeck can fire instantly.',
    visual: <PowerUserVisual />,
  },
];

export const UseCasesSection: React.FC = () => {
  return (
    <section className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-6 bg-black border-t border-white/[0.05] overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-white/[0.012] blur-[220px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14 sm:mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] backdrop-blur-xl text-[10px] font-semibold tracking-[0.3em] uppercase text-white/40 mb-8">
            Why It Matters
          </span>
          <h2 className="text-[36px] sm:text-[56px] md:text-[72px] font-bold tracking-[-0.04em] leading-[0.97] text-white">
            Built for people<br />
            <span className="text-white/25">who actually </span>
            <span className="text-white/60">focus.</span>
          </h2>
        </div>

        {/* 2×2 persona grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {personas.map((p, i) => (
            <div
              key={i}
              className="rounded-[24px] bg-white/[0.03] border border-white/[0.08] p-6 sm:p-7 flex flex-col gap-4 hover:bg-white/[0.05] hover:border-white/[0.14] transition-all duration-300 cursor-default group"
            >
              {/* Visual mockup at top */}
              <div className="mb-1">{p.visual}</div>

              {/* Tag */}
              <span className={`text-[10px] font-bold tracking-[0.25em] uppercase ${p.tagColor}`}>
                {p.tag}
              </span>

              {/* Headline */}
              <h3 className="text-[20px] sm:text-[24px] font-bold tracking-tight text-white leading-tight whitespace-pre-line">
                {p.headline}
              </h3>

              {/* Body */}
              <p className="text-[13px] text-white/40 leading-relaxed font-light">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
