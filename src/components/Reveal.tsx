import React, { useEffect, useRef, useState } from 'react';

type Direction = 'up' | 'left' | 'right' | 'scale';

interface RevealProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number; // ms
  threshold?: number;
  className?: string;
}

/**
 * Wraps children in an animated container that smoothly fades/slides into view upon scrolling.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  threshold = 0.12,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`reveal reveal-${direction}${visible ? ' is-visible' : ''} ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
};
