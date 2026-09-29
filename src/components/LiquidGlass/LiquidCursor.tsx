import React, { useEffect, useRef } from 'react';

interface Droplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
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
    mouse: { x: -200, y: -200 },
    isHovering: false,
    isClicking: false,
    isVisible: false,
    lastSpawn: 0,
    velocity: 0,
    prevMouse: { x: -200, y: -200 },
  });

  const droplets = useRef<Droplet[]>([]);
  const ripples = useRef<ClickRipple[]>([]);

  useEffect(() => {
    // Only run on desktop devices with fine pointer (mouse)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const onMouseMove = (e: MouseEvent) => {
      const s = state.current;
      const prevX = s.mouse.x;
      const prevY = s.mouse.y;

      s.mouse.x = e.clientX;
      s.mouse.y = e.clientY;

      if (!s.isVisible) {
        s.isVisible = true;
        if (lensRef.current) lensRef.current.style.opacity = '1';
        if (dotRef.current) dotRef.current.style.opacity = '1';
      }

      // Compute velocity
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      s.velocity = Math.sqrt(dx * dx + dy * dy);

      // DIRECT CENTERING: The liquid glass effect center MUST be exactly at the cursor pointer
      if (lensRef.current) {
        lensRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

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

      // Spawn fluid caustic droplets when moving
      const now = performance.now();
      if (now - s.lastSpawn > 24 && s.velocity > 2) {
        s.lastSpawn = now;
        const radius = Math.min(8, Math.max(3, s.velocity * 0.2 + Math.random() * 2));
        droplets.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: -dx * 0.08 + (Math.random() - 0.5) * 0.6,
          vy: -dy * 0.08 + (Math.random() - 0.5) * 0.6,
          radius,
          maxRadius: radius * 1.2,
          life: 1,
          maxLife: 1,
          alpha: Math.min(0.6, 0.25 + s.velocity * 0.012),
        });
      }
    };

    const updateLensStyle = (hovering: boolean, clicking: boolean) => {
      if (!lensRef.current) return;
      if (clicking) {
        lensRef.current.style.width = '28px';
        lensRef.current.style.height = '28px';
        lensRef.current.style.borderColor = 'rgba(255, 255, 255, 0.9)';
        lensRef.current.style.boxShadow =
          'inset 0 1px 2px rgba(255, 255, 255, 0.95), 0 0 20px rgba(255, 255, 255, 0.35)';
      } else if (hovering) {
        lensRef.current.style.width = '54px';
        lensRef.current.style.height = '54px';
        lensRef.current.style.borderColor = 'rgba(255, 255, 255, 0.7)';
        lensRef.current.style.boxShadow =
          'inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -2px 6px rgba(0, 0, 0, 0.4), 0 12px 32px rgba(0, 0, 0, 0.6)';
      } else {
        lensRef.current.style.width = '36px';
        lensRef.current.style.height = '36px';
        lensRef.current.style.borderColor = 'rgba(255, 255, 255, 0.45)';
        lensRef.current.style.boxShadow =
          'inset 0 1.5px 2px rgba(255, 255, 255, 0.7), inset 0 -2px 4px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.5)';
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
        maxRadius: state.current.isHovering ? 46 : 34,
        alpha: 0.8,
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

    // RAF loop for canvas particles & ripples
    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render Fluid Droplet Trails
      for (let i = droplets.current.length - 1; i >= 0; i--) {
        const d = droplets.current[i];
        d.x += d.vx;
        d.y += d.vy;
        d.vx *= 0.93;
        d.vy *= 0.93;
        d.life -= 0.038;

        if (d.life <= 0) {
          droplets.current.splice(i, 1);
          continue;
        }

        const currentAlpha = d.alpha * (d.life / d.maxLife);
        const currentRadius = d.radius * (0.3 + 0.7 * (d.life / d.maxLife));

        const grad = ctx.createRadialGradient(
          d.x - currentRadius * 0.3,
          d.y - currentRadius * 0.3,
          currentRadius * 0.1,
          d.x,
          d.y,
          currentRadius
        );

        grad.addColorStop(0, `rgba(255, 255, 255, ${currentAlpha * 0.95})`);
        grad.addColorStop(0.5, `rgba(255, 255, 255, ${currentAlpha * 0.4})`);
        grad.addColorStop(0.85, `rgba(255, 255, 255, ${currentAlpha * 0.1})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(d.x, d.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Render Click Ripples
      for (let i = ripples.current.length - 1; i >= 0; i--) {
        const r = ripples.current[i];
        r.radius += (r.maxRadius - r.radius) * 0.18 + 0.5;
        r.alpha -= 0.05;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${r.alpha * 0.75})`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 6;
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
      {/* 1. Fluid Caustic Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none block"
      />

      {/* 2. Refractive Liquid Glass Lens - EXACTLY CENTERED on cursor pointer */}
      <div
        ref={lensRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none opacity-0 transition-[width,height,border-color,box-shadow,opacity] duration-150 ease-out will-change-transform"
        style={{
          width: '36px',
          height: '36px',
          transform: 'translate3d(-200px, -200px, 0) translate(-50%, -50%)',
          backdropFilter: 'blur(2px) contrast(1.15) brightness(1.1)',
          WebkitBackdropFilter: 'blur(2px) contrast(1.15) brightness(1.1)',
          border: '1px solid rgba(255, 255, 255, 0.45)',
          boxShadow:
            'inset 0 1.5px 2px rgba(255, 255, 255, 0.7), inset 0 -2px 4px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.5)',
          background:
            'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.03) 60%, rgba(255, 255, 255, 0.08) 100%)',
        }}
      >
        {/* Specular Bevel Arc Reflection */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/35 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 3. Micro Precision Focal Dot - EXACTLY at cursor pointer */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none opacity-0 will-change-transform"
        style={{
          width: '5px',
          height: '5px',
          transform: 'translate3d(-200px, -200px, 0) translate(-50%, -50%)',
          background: '#ffffff',
          boxShadow: '0 0 6px #ffffff, 0 0 10px rgba(255, 255, 255, 0.8)',
        }}
      />
    </div>
  );
};
