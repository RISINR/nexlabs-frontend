import React from 'react';

export default function RadarChart() {
  return (
    <div style={{ width: '100%' }}>
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: 140 }}>
        {[1,2,3,4,5].map(i => (
          <polygon key={i} points="50,10 78,30 68,68 32,68 22,30" fill="none" stroke="#eef2ff" />
        ))}
        <polygon points="50,28 72,38 64,62 36,62 28,38" fill="rgba(99,102,241,0.15)" stroke="#6366f1" />
        <polygon points="50,22 76,36 70,64 30,64 24,36" fill="rgba(16,185,129,0.12)" stroke="#10b981" />
      </svg>
    </div>
  );
}
