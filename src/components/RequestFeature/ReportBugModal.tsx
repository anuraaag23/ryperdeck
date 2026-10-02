import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowLeft, Bug, Upload, CheckCircle2 } from 'lucide-react';
import { uploadToGoogleDrive } from '../../lib/gdrive';
import { submitBugReport } from '../../lib/supabase';

const QUICK_FIXES = [
  {
    title: 'Android not connecting',
    desc: 'Make sure both devices are on the same Wi-Fi network. Try quitting and relaunching the Windows desktop app.',
  },
  {
    title: 'Tiles not responding',
    desc: 'Force-quit the Android app, reopen it, and wait for reconnection. If persistent, restart the Windows companion app.',
  },
  {
    title: 'App not launching on Windows',
    desc: 'Check Windows Security / Defender settings and allow RyperDeck through your local firewall. Windows 10 or 11 required.',
  },
  {
    title: 'Layout not saving',
    desc: 'Ensure you tap Save after editing your page. Changes made mid-session are not automatically saved.',
  },
  {
    title: 'System controls not working',
    desc: 'Grant Administrator or Accessibility permissions in Windows Settings and RyperDeck Android app settings.',
  },
  {
    title: 'Slow or laggy response',
    desc: 'A congested 2.4 GHz Wi-Fi band can add latency. Try connecting both your PC and phone/tablet to a 5 GHz network.',
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportBugModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [what, setWhat] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setWhat('');
      setEmail('');
      setFile(null);
      setSubmitted(false);
      setIsDragging(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      if (dropped.size <= 10 * 1024 * 1024) {
        setFile(dropped);
      }
    }
  };

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!what.trim()) return;

    setUploading(true);
    let driveUrl: string | undefined = undefined;

    if (file) {
      setUploadProgress('Uploading attachment to Google Drive...');
      const uploadRes = await uploadToGoogleDrive(file);
      if (uploadRes.success && uploadRes.url) {
        driveUrl = uploadRes.url;
      }
    }

    setUploadProgress('Saving bug report...');
    await submitBugReport({
      what: what.trim(),
      email: email.trim() || undefined,
      fileName: file?.name || undefined,
      driveUrl,
    });

    setUploading(false);
    setUploadProgress('');
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 overflow-y-auto bg-black/90 backdrop-blur-2xl animate-fadeIn p-2 sm:p-6 md:p-10 cursor-default"
      style={{ zIndex: 9999999 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="max-w-4xl mx-auto my-2 sm:my-10 bg-[#090a10] border border-white/[0.12] rounded-[24px] sm:rounded-[40px] shadow-[0_40px_140px_rgba(0,0,0,0.98)] overflow-hidden">
        
        {/* Top Bar with 'Back to RyperDeck' and Close */}
        <div className="p-4 sm:p-8 pb-3 sm:pb-4 flex items-center justify-between border-b border-white/[0.06]">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[12px] sm:text-[13px] text-white/70 hover:text-white transition-all cursor-pointer active:scale-95"
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
        <div className="p-4 sm:p-10 md:p-12 space-y-10 sm:space-y-16">
          
          {/* Section 1: Report a Bug Form */}
          <div>
            <span className="text-[11px] font-mono tracking-[0.35em] uppercase text-white/50 block mb-3 font-semibold">
              REPORT A BUG
            </span>

            <h1 className="text-[28px] sm:text-[44px] md:text-[64px] font-bold tracking-[-0.04em] leading-[0.98] text-white mb-6">
              Found something <br />
              <span className="text-white/60">broken?</span>
            </h1>

            <div className="space-y-2 text-[15px] sm:text-[16px] text-white/50 leading-relaxed font-light max-w-2xl mb-10">
              <p>
                Tell us what went wrong and we'll fix it. Every report goes straight to the developer.
              </p>
              <p className="text-[13px] text-white/35">
                Before submitting, check the list below — your issue may already have a quick fix.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-[28px] bg-white/[0.03] border border-emerald-500/30 text-center space-y-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-emerald-500/[0.1] border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-[20px] font-bold text-white">Report Sent!</h3>
                <p className="text-[14px] text-white/50 max-w-md mx-auto">
                  Thank you for reporting this issue. Anurag has been notified and will investigate the issue promptly.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => { setSubmitted(false); setWhat(''); }}
                    className="text-[13px] text-white/60 hover:text-white underline cursor-pointer"
                  >
                    Submit another bug report
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-4 sm:p-8 rounded-[22px] sm:rounded-[28px] bg-white/[0.025] border border-white/[0.08] space-y-4 sm:space-y-5">
                <div>
                  <label className="text-[11px] font-semibold tracking-wider uppercase text-white/40 block mb-2">
                    What happened? <span className="text-white/40 font-normal lowercase">(required)</span>
                  </label>
                  <textarea
                    required
                    value={what}
                    onChange={e => setWhat(e.target.value)}
                    placeholder="Describe the bug. What were you doing, what went wrong?"
                    rows={4}
                    maxLength={2000}
                    className="liquid-glass-input w-full px-4 py-3 text-[16px] sm:text-[14px] rounded-2xl resize-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold tracking-wider uppercase text-white/40 block mb-2">
                    Email <span className="text-white/20 font-normal lowercase">(optional — for follow-up)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    maxLength={254}
                    className="liquid-glass-input w-full px-4 py-3 text-[16px] sm:text-[14px] rounded-2xl"
                  />
                </div>

                {/* Screenshot upload dropzone matching Image 4 */}
                <div>
                  <label className="text-[11px] font-semibold tracking-wider uppercase text-white/40 block mb-2">
                    Screenshot or recording <span className="text-white/20 font-normal lowercase">(optional — PNG, JPG, MOV · max 10 MB)</span>
                  </label>

                  <div
                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                      isDragging
                        ? 'border-white/40 bg-white/[0.06]'
                        : 'border-white/[0.1] bg-white/[0.02] hover:border-white/[0.2] hover:bg-white/[0.04]'
                    }`}
                  >
                    <Upload className="w-5 h-5 text-white/40" />
                    {file ? (
                      <p className="text-[13px] text-white/70 font-medium">{file.name}</p>
                    ) : (
                      <>
                        <p className="text-[13px] text-white/50">
                          Drop file here or <span className="text-white/80 underline underline-offset-2">browse</span>
                        </p>
                        <p className="text-[11px] text-white/25">PNG · JPG · MOV · max 10 MB</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,video/quicktime,video/mp4"
                    className="hidden"
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f && f.size <= 10 * 1024 * 1024) setFile(f);
                    }}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!what.trim() || uploading}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full liquid-glass-btn-primary font-bold text-[14px] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.12)]"
                  >
                    {uploading ? uploadProgress || 'Submitting...' : 'Submit report'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.08]" />

          {/* Section 2: Quick fixes first matching Image 5 */}
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-[28px] sm:text-[38px] md:text-[44px] font-bold tracking-[-0.035em] leading-[1.02] text-white">
                  Quick fixes first.
                </h2>
              </div>
              <p className="text-[13px] text-white/40 max-w-sm font-light">
                Most issues have a fast solution. Check here before filling out the form above.
              </p>
            </div>

            {/* 6-Card Grid matching Image 5 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {QUICK_FIXES.map((q) => (
                <div
                  key={q.title}
                  className="rounded-[22px] p-6 bg-white/[0.025] border border-white/[0.07] hover:border-white/[0.14] transition-all flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-[15px] font-bold text-white mb-2 tracking-tight">
                      {q.title}
                    </h3>
                    <p className="text-[12px] text-white/45 leading-relaxed font-light">
                      {q.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>,
    document.body
  );
};
