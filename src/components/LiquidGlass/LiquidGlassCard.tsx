import React, { useRef, useState } from 'react';

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  interactive?: boolean;
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(0, 240, 255, 0.12)',
  interactive = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 50, y: 50, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y, active: true });
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setCoords(prev => ({ ...prev, active: false }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-[30px] bg-[#0c0d14]/70 backdrop-blur-2xl border border-white/[0.1] transition-all duration-300 overflow-hidden ${className}`}
      style={{
        boxShadow: coords.active
          ? '0 30px 80px -20px rgba(0, 0, 0, 0.95), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.35), inset 0 -1px 2px 0 rgba(0, 0, 0, 0.5)'
          : '0 20px 50px -15px rgba(0, 0, 0, 0.85), inset 0 1px 1px 0 rgba(255, 255, 255, 0.18), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Dynamic Optical Caustic Flare on Cursor Position */}
      {interactive && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(400px circle at ${coords.x}% ${coords.y}%, ${glowColor}, transparent 75%)`,
          }}
        />
      )}

      {/* Top Glass Bevel Reflection Hairline */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

      {/* Subtle Bottom Ambient Lip */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/05 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
