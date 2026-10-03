import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { TopSupportersBar } from '../Coffee/TopSupportersBar';
import { Reveal } from '../Reveal';

export const InActionSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [userInteracted, setUserInteracted] = useState<boolean>(false);

  const controlsTimeoutRef = useRef<number | null>(null);

  // Format seconds into M:SS
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs <= 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Autoplay / Autopause with IntersectionObserver
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Autoplay silently if user hasn't explicitly paused
            if (!userInteracted || video.paused) {
              video.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          } else {
            // Pause when off-screen to preserve CPU & battery
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [userInteracted]);

  // Video time update
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    setCurrentTime(current);
    setDuration(dur);
    setProgress(dur > 0 ? (current / dur) * 100 : 0);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setUserInteracted(true);
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
    }
  }, []);

  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUserInteracted(true);
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  // Scrubbing progress
  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!progressTrackRef.current || !videoRef.current || !duration) return;
    const rect = progressTrackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = Math.max(0, Math.min(1, clickX / rect.width));
    videoRef.current.currentTime = newProgress * duration;
    setProgress(newProgress * 100);
  };

  // Fullscreen support
  const toggleFullscreen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if ((videoRef.current as any)?.webkitEnterFullscreen) {
          (videoRef.current as any).webkitEnterFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch {
      // Fullscreen not supported or blocked
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Controls auto-hide on inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  return (
    <section
      id="in-action"
      className="relative flex flex-col items-center justify-center px-4 sm:px-6 py-20 sm:py-28 md:py-36 overflow-hidden bg-black"
    >
      {/* Top divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-blue-500/[0.03] blur-[180px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto w-full">
        {/* Section Badge & Heading */}
        <Reveal direction="up" className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] backdrop-blur-xl text-[11px] font-medium tracking-widest uppercase text-white/50 mb-6">
            <Sparkles className="w-3 h-3 text-white/70" />
            RyperDeck in Action
          </span>

          <h2 className="text-[28px] sm:text-[42px] md:text-[52px] font-bold tracking-[-0.04em] leading-tight text-white mb-4">
            See it live.{' '}
            <span className="text-white/40">
              Feel the difference.
            </span>
          </h2>
          <p className="text-[15px] sm:text-[17px] text-white/45 font-light max-w-xl mb-10 px-2 leading-relaxed">
            Zero latency hardware response. Watch RyperDeck launch instant developer workflows and desktop controls directly from tablet to Windows PC.
          </p>
        </Reveal>

        {/* Video Player Container — Strict Aspect Ratio matching source 3246:2160 */}
        <Reveal direction="scale" delay={120} className="w-full flex justify-center">
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => togglePlay()}
            style={{ aspectRatio: '3246 / 2160' }}
            className="relative w-full max-w-3xl rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer bg-[#0a0a0f] border border-white/[0.14] shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_30px_rgba(255,255,255,0.03)] transition-all duration-300"
          >
          {/* Native HTML5 Video Element */}
          <video
            ref={videoRef}
            src="/videos/ryperdeck_demo.mp4"
            poster="/videos/ryperdeck_demo_poster.jpg"
            playsInline
            muted
            loop
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            className="w-full h-full object-cover block select-none"
          />

          {/* Liquid Glass Edge Reflection */}
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/[0.12]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Center Play/Pause Pill Button */}
          <div
            className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 ${
              !isPlaying || showControls ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              className="pointer-events-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/[0.12] hover:bg-white/[0.2] active:scale-95 text-white backdrop-blur-2xl border border-white/[0.25] shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex items-center justify-center transition-all duration-200"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 text-white fill-white/80" />
              ) : (
                <Play className="w-7 h-7 text-white fill-white/90 ml-1" />
              )}
            </button>
          </div>

          {/* Bottom Floating Liquid Glass Control Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[#0e0f18]/85 backdrop-blur-2xl border border-white/[0.12] shadow-2xl flex flex-col gap-2 transition-all duration-300 ${
              showControls || !isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            {/* Scrubber Progress Bar */}
            <div
              ref={progressTrackRef}
              onClick={handleScrub}
              className="group/track w-full h-1.5 hover:h-2.5 bg-white/15 rounded-full cursor-pointer relative transition-all duration-150 flex items-center"
            >
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-white rounded-full relative transition-all duration-75"
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover/track:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between text-xs text-white/70 select-none">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-1 rounded-md hover:text-white hover:bg-white/10 transition-colors"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <button
                  type="button"
                  onClick={handleRestart}
                  className="p-1 rounded-md hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Restart video"
                  title="Restart"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <span className="font-mono text-[11px] sm:text-[12px] text-white/50 tracking-tight">
                  {formatTime(currentTime)} <span className="text-white/20">/</span> {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider bg-white/[0.06] border border-white/[0.08] text-white/40">
                  Full 1080p
                </span>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-1 rounded-md hover:text-white hover:bg-white/10 transition-colors"
                  aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>

    {/* Top Supporters Bar — below the video area */}
    <Reveal direction="up" delay={150} className="relative z-10 w-full max-w-4xl mx-auto mt-16 sm:mt-20">
      <TopSupportersBar />
    </Reveal>
  </section>
  );
};
