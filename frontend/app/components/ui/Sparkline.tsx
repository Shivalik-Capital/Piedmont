import React from 'react';

export default function Sparkline({ positive, color = 'currentColor' }: { positive: boolean; color?: string }) {
  const path = positive
    ? 'M0 35 L 10 30 L 25 32 L 40 20 L 60 25 L 80 10 L 100 5'
    : 'M0 10 L 20 15 L 40 5 L 60 25 L 80 20 L 100 35';
  return (
    <svg className="w-24 h-12 sparkline-glow" viewBox="0 0 100 40" style={{ color }}>
      <path d={path} fill="none" stroke={color} strokeLinecap="round" strokeWidth="2.5" />
    </svg>
  );
}
