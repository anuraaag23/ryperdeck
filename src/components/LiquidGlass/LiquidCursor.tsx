import React, { useEffect, useRef } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  time: number;
  vx: number;
  vy: number;
}

interface Droplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
  alpha: number;
}

interface ClickRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export const LiquidCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lensRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  const state = useRef({
    // Direct mouse position
    targetX: -200,
    targetY: -200,
    // Smooth lerped lens position
    lensX: -200,
    lensY: -200,
    // Velocity & tracking
    prevX: -200,
    prevY: -200,
    velocity: 0,
    isHovering: false,
    isClicking: false,
    isVisible: false,
    lastMoveTime: 0,
  });

  const trail = useRef<TrailPoint[]>([]);
  const droplets = useRef<Droplet[]>([]);
  const ripples = useRef<ClickRipple[]>([]);

  useEffect(() => {
    // Only run on desktop devices with fine pointer (mouse / trackpad)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const onMouseMove = (e: MouseEvent) => {
      const s = state.current;
      const now = performance.now();

      if (!s.isVisible) {
        s.isVisible = true;
        s.lensX = e.clientX;
        s.lensY = e.clientY;
        s.prevX = e.clientX;
        s.prevY = e.clientY;
        if (lensRef.current) lensRef.current.style.opacity = '1';
        if (dotRef.current) dotRef.current.style.opacity = '1';
      }

      const dx = e.clientX - s.targetX;
      const dy = e.clientY - s.targetY;
      s.velocity = Math.sqrt(dx * dx + dy * dy);

      s.prevX = s.targetX;
      s.prevY = s.targetY;
      s.targetX = e.clientX;
      s.targetY = e.clientY;
      s.lastMoveTime = now;

      // Immediately place the focal dot at exact cursor pointer
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      // Check if hovering an interactive target
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = !!target.closest(
          'button, a, input, textarea, select, [role="button"], .liquid-glass-btn, .liquid-glass-pill-amber, .liquid-glass-icon-pod, .liquid-glass-badge, .liquid-glass-panel, [data-interactive="true"]'
        );
        if (isInteractive !== s.isHovering) {
          s.isHovering = isInteractive;
          updateLensStyle(isInteractive, s.isClicking);
        }
      }

      // Add trail point with sub-segment interpolation for buttery smooth ribbons
      const points = trail.current;
      const lastPoint = points[points.length - 1];
      if (!lastPoint) {
        points.push({ x: e.clientX, y: e.clientY, time: now, vx: dx, vy: dy });
      } else {
        const dist = Math.hypot(e.clientX - lastPoint.x, e.clientY - lastPoint.y);
        // If mouse moved more than 6px in one event, interpolate a midpoint
        if (dist > 6) {
          points.push({
            x: (lastPoint.x + e.clientX) * 0.5,
            y: (lastPoint.y + e.clientY) * 0.5,
            time: now - 8,
            vx: dx * 0.5,
            vy: dy * 0.5,
          });
        }
        points.push({ x: e.clientX, y: e.clientY, time: now, vx: dx, vy: dy });
      }

      // Cap trail length
      if (points.length > 28) {
        points.splice(0, points.length - 28);
      }

      // Spawn fluid micro-droplets on high velocity flick
      if (s.velocity > 12 && droplets.current.length < 24) {
        const angle = Math.atan2(dy, dx) + Math.PI + (Math.random() - 0.5) * 0.8;
        const speed = Math.min(6, s.velocity * 0.12 + Math.random() * 2);
        droplets.current.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 2.5 + 1.5,
          life: 1,
          maxLife: 1,
          alpha: Math.min(0.55, 0.2 + s.velocity * 0.008),
        });
      }
    };

    const updateLensStyle = (hovering: boolean, clicking: boolean) => {
      if (!lensRef.current) return;
      if (clicking) {
        lensRef.current.style.width = '26px';
        lensRef.current.style.height = '26px';
        lensRef.current.style.borderColor = 'rgba(255, 255, 255, 0.9)';
        lensRef.current.style.boxShadow =
          'inset 0 1px 2px rgba(255, 255, 255, 0.95), 0 0 20px rgba(255, 255, 255, 0.4)';
      } else if (hovering) {
        lensRef.current.style.width = '52px';
        lensRef.current.style.height = '52px';
        lensRef.current.style.borderColor = 'rgba(255, 255, 255, 0.75)';
        lensRef.current.style.boxShadow =
          'inset 0 2px 4px rgba(255, 255, 255, 0.85), inset 0 -2px 6px rgba(0, 0, 0, 0.4), 0 12px 36px rgba(0, 0, 0, 0.65)';
      } else {
        lensRef.current.style.width = '36px';
        lensRef.current.style.height = '36px';
        lensRef.current.style.borderColor = 'rgba(255, 255, 255, 0.4)';
        lensRef.current.style.boxShadow =
          'inset 0 1.5px 2px rgba(255, 255, 255, 0.65), inset 0 -2px 4px rgba(0, 0, 0, 0.35), 0 8px 24px rgba(0, 0, 0, 0.5)';
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      state.current.isClicking = true;
      updateLensStyle(state.current.isHovering, true);

      // Create concentric liquid shockwave ripple
      ripples.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 4,
        maxRadius: state.current.isHovering ? 48 : 36,
        alpha: 0.85,
      });
    };

    const onMouseUp = () => {
      state.current.isClicking = false;
      updateLensStyle(state.current.isHovering, false);
    };

    const onMouseLeave = () => {
      state.current.isVisible = false;
      if (lensRef.current) lensRef.current.style.opacity = '0';
      if (dotRef.current) dotRef.current.style.opacity = '0';
    };

    const onMouseEnter = () => {
      state.current.isVisible = true;
      if (lensRef.current) lensRef.current.style.opacity = '1';
      if (dotRef.current) dotRef.current.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // High performance RAF loop
    let animationFrameId: number;

    const render = () => {
      const s = state.current;
      const now = performance.now();

      // Smooth critically damped lerp for trailing liquid glass lens
      if (s.isVisible) {
        const lerpFactor = s.isHovering ? 0.28 : 0.2;
        s.lensX += (s.targetX - s.lensX) * lerpFactor;
        s.lensY += (s.targetY - s.lensY) * lerpFactor;

        if (lensRef.current) {
          lensRef.current.style.transform = `translate3d(${s.lensX}px, ${s.lensY}px, 0) translate(-50%, -50%)`;
        }
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // ── 1. RENDER CONTINUOUS SILKY LIQUID TRAIL RIBBON ──
      const points = trail.current;

      // Filter out points older than 280ms
      const trailMaxAge = 280;
      for (let i = points.length - 1; i >= 0; i--) {
        if (now - points[i].time > trailMaxAge) {
          points.splice(i, 1);
        }
      }

      if (points.length > 2) {
        // Draw Outer Soft Liquid Aura
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          const ageRatio = 1 - (now - p2.time) / trailMaxAge;
          if (ageRatio <= 0) continue;

          const progress = i / (points.length - 1);
          const width = progress * 10 * ageRatio + 1;
          const alpha = progress * 0.18 * ageRatio;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = width;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        }

        // Draw Inner Glowing Core Stream
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          const ageRatio = 1 - (now - p2.time) / trailMaxAge;
          if (ageRatio <= 0) continue;

          const progress = i / (points.length - 1);
          const coreWidth = progress * 3.5 * ageRatio + 0.6;
          const coreAlpha = progress * 0.45 * ageRatio;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${coreAlpha})`;
          ctx.lineWidth = coreWidth;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        }

        // Connect latest point to current cursor position smoothly
        if (s.isVisible) {
          const last = points[points.length - 1];
          ctx.beginPath();
          ctx.moveTo(last.x, last.y);
          ctx.lineTo(s.targetX, s.targetY);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 3.5;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      }

      // ── 2. RENDER FLUID MICRO-DROPLETS ──
      for (let i = droplets.current.length - 1; i >= 0; i--) {
        const d = droplets.current[i];
        d.x += d.vx;
        d.y += d.vy;
        d.vx *= 0.94;
        d.vy *= 0.94;
        d.life -= 0.035;

        if (d.life <= 0) {
          droplets.current.splice(i, 1);
          continue;
        }

        const currentAlpha = d.alpha * (d.life / d.maxLife);
        const currentRadius = d.radius * (0.4 + 0.6 * (d.life / d.maxLife));

        ctx.beginPath();
        ctx.arc(d.x, d.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── 3. RENDER CLICK SHOCKWAVE RIPPLES ──
      for (let i = ripples.current.length - 1; i >= 0; i--) {
        const r = ripples.current[i];
        r.radius += (r.maxRadius - r.radius) * 0.16 + 0.5;
        r.alpha -= 0.045;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${r.alpha * 0.8})`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden hidden md:block"
      style={{ zIndex: 99999999 }}
      aria-hidden="true"
    >
      {/* 1. Fluid Caustic Particle & Ribbon Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none block"
      />

      {/* 2. Fluid Trailing Liquid Glass Lens - Smooth Organic Lerp Lag */}
      <div
        ref={lensRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none opacity-0 transition-[width,height,border-color,box-shadow,opacity] duration-150 ease-out will-change-transform"
        style={{
          width: '36px',
          height: '36px',
          transform: 'translate3d(-200px, -200px, 0) translate(-50%, -50%)',
          backdropFilter: 'blur(3px) contrast(1.15) brightness(1.1)',
          WebkitBackdropFilter: 'blur(3px) contrast(1.15) brightness(1.1)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow:
            'inset 0 1.5px 2px rgba(255, 255, 255, 0.65), inset 0 -2px 4px rgba(0, 0, 0, 0.35), 0 8px 24px rgba(0, 0, 0, 0.5)',
          background:
            'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.03) 60%, rgba(255, 255, 255, 0.08) 100%)',
        }}
      >
        {/* Specular Bevel Arc Reflection */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/35 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 3. Micro Precision Focal Dot - Locked 1:1 on actual pointer */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none opacity-0 will-change-transform"
        style={{
          width: '5px',
          height: '5px',
          transform: 'translate3d(-200px, -200px, 0) translate(-50%, -50%)',
          background: '#ffffff',
          boxShadow: '0 0 6px #ffffff, 0 0 10px rgba(255, 255, 255, 0.85)',
        }}
      />
    </div>
  );
};
