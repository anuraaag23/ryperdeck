import React, { useRef, useEffect } from 'react';

export const DeveloperPhotoFrame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const setSize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setSize();
    window.addEventListener('resize', setSize);

    // Diagonal streaks (white & grey)
    const streaks = Array.from({ length: 14 }, () => ({
      x: Math.random() * (width || 340),
      y: -80 + Math.random() * (height || 480),
      len: 40 + Math.random() * 80,
      speed: 0.5 + Math.random() * 0.8,
      alpha: 0.05 + Math.random() * 0.12,
      isGrey: Math.random() > 0.5,
    }));

    // Horizontal sweeping glow lines
    const hLines = Array.from({ length: 4 }, (_, i) => ({
      y: 70 + i * 110 + Math.random() * 30,
      x: -160 - Math.random() * 100,
      w: 80 + Math.random() * 100,
      speed: 0.35 + Math.random() * 0.4,
      alpha: 0.04 + Math.random() * 0.06,
    }));

    // Floating particles
    const dots = Array.from({ length: 28 }, () => ({
      x: Math.random() * (width || 340),
      y: Math.random() * (height || 480),
      r: 0.6 + Math.random() * 1.2,
      vy: -0.15 - Math.random() * 0.2,
      alpha: 0.15 + Math.random() * 0.35,
    }));

    let t = 0;

    const render = () => {
      if (!width || !height) {
        animId = requestAnimationFrame(render);
        return;
      }

      // Deep dark background strictly inside frame
      ctx.fillStyle = '#08080a';
      ctx.fillRect(0, 0, width, height);

      // Subtle radial vignette in center
      const vg = ctx.createRadialGradient(width / 2, height * 0.55, 0, width / 2, height * 0.55, width * 0.75);
      vg.addColorStop(0, 'rgba(255, 255, 255, 0.035)');
      vg.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, width, height);

      // Subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      const step = 36;
      for (let x = 0; x <= width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Diagonal streaks (white & grey)
      streaks.forEach((s) => {
        s.y += s.speed;
        s.x += s.speed * 0.5;
        if (s.y - s.len > height) {
          s.y = -s.len;
          s.x = Math.random() * width;
        }

        const x1 = s.x;
        const y1 = s.y;
        const x2 = s.x + s.len * 0.45;
        const y2 = s.y + s.len;
        const g = ctx.createLinearGradient(x1, y1, x2, y2);
        const col = s.isGrey ? 'rgba(160, 160, 160,' : 'rgba(255, 255, 255,';
        g.addColorStop(0, col + '0)');
        g.addColorStop(0.4, col + s.alpha + ')');
        g.addColorStop(1, col + '0)');
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      // Horizontal sweeping glow lines
      hLines.forEach((h) => {
        h.x += h.speed;
        if (h.x - h.w > width) h.x = -h.w;
        const g = ctx.createLinearGradient(h.x - h.w, 0, h.x + h.w, 0);
        g.addColorStop(0, 'rgba(200, 200, 200, 0)');
        g.addColorStop(0.5, `rgba(240, 240, 240, ${h.alpha})`);
        g.addColorStop(1, 'rgba(200, 200, 200, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(h.x - h.w, h.y, h.w * 2, 1);
      });

      // Floating particles
      dots.forEach((d) => {
        d.y += d.vy;
        if (d.y < -4) {
          d.y = height + 4;
          d.x = Math.random() * width;
        }
        const pulse = 0.6 + 0.4 * Math.sin(t * 0.03 + d.x);
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 220, 220, ${d.alpha * pulse})`;
        ctx.fill();
      });

      t++;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', setSize);
    };
  }, []);

  return (
    <div className="relative group select-none">
      {/* Outer ambient blur */}
      <div className="absolute -inset-4 rounded-[40px] bg-white/[0.025] blur-2xl opacity-60 pointer-events-none" />

      {/* Main Frame Box */}
      <div className="relative w-[280px] sm:w-[320px] md:w-[340px] max-w-[calc(100vw-3rem)] h-[390px] sm:h-[450px] md:h-[480px] rounded-[30px] sm:rounded-[34px] p-[2px] bg-gradient-to-b from-white/[0.25] via-white/[0.08] to-white/[0.18] shadow-[0_30px_90px_-15px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.4)]">
        
        {/* Inner container with overflow-hidden: strictly clips canvas, lines and grid inside! */}
        <div className="relative w-full h-full rounded-[28px] sm:rounded-[32px] overflow-hidden bg-[#08080a] flex items-end justify-center">
          
          {/* Animated Canvas (lines + grid + particles) strictly confined inside the frame */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
          />

          {/* Photo */}
          <img
            src="/creator/developer_photo.png"
            alt="Anurag - Creator of RyperDeck"
            className="relative z-10 w-full h-auto max-h-[96%] object-contain object-bottom pointer-events-none select-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
            draggable={false}
          />

          {/* Subtle inner hairline border */}
          <div className="absolute inset-2.5 rounded-[22px] sm:rounded-[26px] border border-white/[0.06] pointer-events-none z-20" />

          {/* Corner brackets */}
          {/* Top-Left */}
          <div className="absolute top-3.5 left-3.5 w-4 h-4 pointer-events-none z-20">
            <span className="absolute top-0 left-0 w-0.5 h-3.5 bg-white/80 rounded-full" />
            <span className="absolute top-0 left-0 w-3.5 h-0.5 bg-white/80 rounded-full" />
          </div>
          {/* Top-Right */}
          <div className="absolute top-3.5 right-3.5 w-4 h-4 pointer-events-none z-20">
            <span className="absolute top-0 right-0 w-0.5 h-3.5 bg-white/80 rounded-full" />
            <span className="absolute top-0 right-0 w-3.5 h-0.5 bg-white/80 rounded-full" />
          </div>
          {/* Bottom-Left */}
          <div className="absolute bottom-3.5 left-3.5 w-4 h-4 pointer-events-none z-20">
            <span className="absolute bottom-0 left-0 w-0.5 h-3.5 bg-white/80 rounded-full" />
            <span className="absolute bottom-0 left-0 w-3.5 h-0.5 bg-white/80 rounded-full" />
          </div>
          {/* Bottom-Right */}
          <div className="absolute bottom-3.5 right-3.5 w-4 h-4 pointer-events-none z-20">
            <span className="absolute bottom-0 right-0 w-0.5 h-3.5 bg-white/80 rounded-full" />
            <span className="absolute bottom-0 right-0 w-3.5 h-0.5 bg-white/80 rounded-full" />
          </div>

          {/* Mid-edge ticks */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white/35 rounded-full pointer-events-none z-20" />
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white/35 rounded-full pointer-events-none z-20" />
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white/35 rounded-full pointer-events-none z-20" />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white/35 rounded-full pointer-events-none z-20" />

          {/* Top border animated light sweep */}
          <div className="absolute top-0 inset-x-5 h-[1.5px] overflow-hidden pointer-events-none z-20">
            <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent animate-top-sweep" />
          </div>
        </div>

        {/* Floating stat chip / badge */}
        <div className="absolute -bottom-4 -right-3 sm:-bottom-5 sm:-right-4 px-4 py-2.5 rounded-2xl bg-[#0a0b12]/90 backdrop-blur-xl border border-white/[0.18] shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] z-30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white timeline-pulse" />
            <span className="text-[12px] font-semibold text-white/90">Solo Dev</span>
          </div>
          <p className="text-[10px] text-white/45 mt-0.5 font-light">0 vc money. 0 team. 100% passion.</p>
        </div>
      </div>
    </div>
  );
};
