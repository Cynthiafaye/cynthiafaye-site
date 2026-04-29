'use client';

import { useState, useEffect } from 'react';

export default function SparkleField({ count = 30 }: { count?: number }) {
  const [particles, setParticles] = useState<Array<{ id: number; left: string; delay: string; duration: string; size: number }>>([]);

  useEffect(() => {
    const p = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${4 + Math.random() * 6}s`,
      size: 2 + Math.random() * 5,
    }));
    setParticles(p);
  }, [count]);

  return (
    <div className="sparkle-field">
      {particles.map((p) => (
        <div
          key={p.id}
          className="sparkle-particle"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}
