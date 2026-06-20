"use client";

import { useEffect, useState } from "react";

interface Bubble {
  id: number;
  left: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
}

export default function AnimatedBackground() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const generated: Bubble[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 2 + Math.random() * 10,
      speed: 10 + Math.random() * 25,
      opacity: 0.02 + Math.random() * 0.08,
      delay: Math.random() * 20,
    }));
    setBubbles(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Gradient orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/3 rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-2/3 rounded-full blur-[120px]" />

      {/* Floating bubbles */}
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full animate-bubble"
          style={{
            left: `${b.left}%`,
            bottom: "-5%",
            width: `${b.size}px`,
            height: `${b.size}px`,
            opacity: b.opacity,
            background: "radial-gradient(circle at 30% 30%, rgba(14, 165, 233, 0.5), transparent)",
            animationDuration: `${b.speed}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
