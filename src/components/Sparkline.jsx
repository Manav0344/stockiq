import React from 'react';

export default function Sparkline({ data = [], positive = true, width = 80, height = 32 }) {
  if (!data || data.length < 2) return <div style={{ width, height }} />;
  const vals = data.map(d => d.price ?? d.close ?? d);
  const min   = Math.min(...vals);
  const max   = Math.max(...vals);
  const range = max - min || 1;
  const pts   = vals.map((v, i) =>
    `${(i / (vals.length - 1)) * width},${height - ((v - min) / range) * (height - 4) - 2}`
  ).join(" ");
  const color = positive ? "#00e5a0" : "#ff4d4d";
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ flexShrink: 0 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
