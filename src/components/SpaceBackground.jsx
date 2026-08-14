import React, { useRef } from "react";

export default function SpaceBackground() {
  // Layer 1: tiny distant stars
  const farStars = useRef(
    Array.from({ length: 120 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 4,
      duration: Math.random() * 2 + 2,
    }))
  ).current;

  // Layer 2: closer, brighter stars
  const nearStars = useRef(
    Array.from({ length: 40 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1.5,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
    }))
  ).current;

  // Layer 3: shooting stars
  const shootingStars = useRef(
    Array.from({ length: 4 }, () => ({
      top: Math.random() * 50,
      left: Math.random() * 60 + 30,
      delay: Math.random() * 8,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#05061a]">
      {/* Nebula glow blobs */}
      <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-indigo-700/25 blur-[100px] animate-drift" />
      <div
        className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-amber-500/15 blur-[100px] animate-drift"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-purple-700/20 blur-[100px] animate-drift"
        style={{ animationDelay: "3s" }}
      />

      {/* Far stars */}
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

      {/* Near stars with glow */}
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

      {/* Shooting stars */}
      {shootingStars.map((s, i) => (
        <div
          key={`sh-${i}`}
          className="absolute h-px w-16 bg-gradient-to-r from-white to-transparent animate-shoot"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            animationDelay: `${s.delay}s`,
            animationIterationCount: "infinite",
          }}
        />
      ))}
    </div>
  );
}
