'use client';

import { useEffect, useState } from 'react';

interface AnalogClockProps {
  timezoneOffset?: number; // UTC offset in hours (e.g., 7 for WIB, 9 for JST)
  className?: string;
}

export function AnalogClock({ timezoneOffset = 7, className = "w-full h-full" }: AnalogClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      // Create date object for current time
      const now = new Date();

      // Convert to target timezone
      // Get UTC time in ms
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);

      // Create new Date object for target timezone
      const targetTime = new Date(utc + (3600000 * timezoneOffset));

      setTime(targetTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [timezoneOffset]);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  // Calculate degrees
  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
  const hourDegrees = ((hours + minutes / 60) / 12) * 360;

  // Format Date
  const dateStr = time.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short'
  });

  return (
    <div className={`relative ${className}`} aria-label="Analog Clock">
      {/* Clock Face */}
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
        {/* Background */}
        <circle cx="50" cy="50" r="48" fill="white" stroke="#e5e7eb" strokeWidth="2" />

        {/* Date Display */}
        <text
            x="50"
            y="70"
            textAnchor="middle"
            className="text-[10px] font-bold fill-gray-500 tracking-widest uppercase"
            fontSize="8"
        >
            {dateStr}
        </text>

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
