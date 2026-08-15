import React, { useRef } from "react";

// Clean deep-space background: nebula glow + twinkling stars only.
// (Removed the shooting-star streaks - they were re-triggering constantly
// and showing up as distracting static-looking lines on some screens.)
export default function SpaceBackground() {
  const farStars = useRef(
    Array.from({ length: 110 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 4,
      duration: Math.random() * 2 + 2,
    }))
  ).current;

  const nearStars = useRef(
    Array.from({ length: 35 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1.5,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#05061a]">
      <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-indigo-700/25 blur-[100px] animate-drift" />
      <div
        className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-blue-500/15 blur-[100px] animate-drift"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-purple-700/20 blur-[100px] animate-drift"
        style={{ animationDelay: "3s" }}
      />

      {farStars.map((s, i) => (
        <div
          key={`f-${i}`}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}

      {nearStars.map((s, i) => (
        <div
          key={`n-${i}`}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            boxShadow: "0 0 4px 1px rgba(255,255,255,0.6)",
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
