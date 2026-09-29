import React, { useEffect, useState } from 'react';

export const LiquidShaderBackground: React.FC = () => {
  const [cursor, setCursor] = useState({ x: 50, y: 30 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setCursor({ x, y });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-black">
      {/* Dynamic Cursor Light Source (Monochrome white liquid glass caustics) */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-[170px] opacity-[0.08] transition-transform duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.08) 40%, transparent 70%)',
          left: `${cursor.x}%`,
          top: `${cursor.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Atmospheric Caustics (Deep neutral dark glass lighting, no color gradients) */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] rounded-full bg-white/[0.025] blur-[170px]" />
      <div className="absolute top-1/3 -right-60 w-[600px] h-[600px] rounded-full bg-white/[0.015] blur-[160px]" />
      <div className="absolute bottom-1/4 -left-60 w-[700px] h-[700px] rounded-full bg-white/[0.015] blur-[180px]" />

      {/* Micro Studio Grid (Understated optical grid) */}
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
    </div>
  );
};
