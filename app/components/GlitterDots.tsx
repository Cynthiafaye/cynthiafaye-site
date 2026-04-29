'use client';

import { useState, useEffect } from 'react';

export default function GlitterDots({ count = 20 }: { count?: number }) {
  const [dots, setDots] = useState<Array<{ id: number; left: string; top: string; delay: string; size: number }>>([]);

  useEffect(() => {
    const d = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      size: 2 + Math.random() * 3,
    }));
    setDots(d);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((d) => (
        <div
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            background: '#ffd700',
            boxShadow: '0 0 6px #ffd700, 0 0 12px rgba(255,215,0,0.5)',
            animation: `glitter-pulse 2s ease-in-out infinite`,
            animationDelay: d.delay,
          }}
        />
      ))}
    </div>
  );
}
