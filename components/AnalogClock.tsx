'use client';

import { useEffect, useState } from 'react';

export function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update every frame for smooth second hand if we want, or simply interval
    // For "smooth" feel on second hand, requestAnimationFrame is better,
    // but simple interval is easier. Let's try interval with smaller ms for semi-smooth or just 1000ms.
    // The requirement didn't specify smooth, but I put it in plan.
    // Let's stick to standard 1s update for simplicity and performance first,
    // or maybe 100ms to allow CSS transition to handle smoothness if we want.

    // Actually, CSS transition is best for smooth movement.
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  // Calculate degrees
  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
  const hourDegrees = ((hours + minutes / 60) / 12) * 360;

  return (
    <div className="relative w-10 h-10" aria-label="Analog Clock">
      {/* Clock Face */}
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
        {/* Background */}
        <circle cx="50" cy="50" r="48" fill="white" stroke="#e5e7eb" strokeWidth="2" />

        {/* Markers (Hours) */}
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="6"
            x2="50"
            y2="12"
            transform={`rotate(${i * 30} 50 50)`}
            stroke="#9ca3af"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}

        {/* Hour Hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="25"
          stroke="black"
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${hourDegrees} 50 50)`}
          className="transition-transform duration-500 ease-in-out"
        />

        {/* Minute Hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="15"
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${minuteDegrees} 50 50)`}
          className="transition-transform duration-500 ease-in-out"
        />

        {/* Second Hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="10"
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeLinecap="round"
          transform={`rotate(${secondDegrees} 50 50)`}
          // Remove transition for second hand if it wraps around 360->0 to avoid "rewind" glitch
          // Or handle the wrap in JS. For simple SVG, just letting it tick is fine.
        />

        {/* Center Dot */}
        <circle cx="50" cy="50" r="3" fill="#ef4444" />
      </svg>
    </div>
  );
}
