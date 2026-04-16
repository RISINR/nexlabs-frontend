import React from 'react';

type Point = { label: string; score: number };

export default function LineChart({ data }: { data: Point[] }) {
  const max = 100;
  const minX = 5;
  const maxX = 95;
  const step = (maxX - minX) / Math.max(1, data.length - 1);
  const points = data.map((t, i) => `${minX + step * i},${30 - (t.score / max) * 26}`).join(' ');

  return (
    <div style={{ height: 160 }}>
      <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <polyline fill="none" stroke="#06b6d4" strokeWidth={1.2} points={points} />
        {data.map((t, i) => {
          const x = minX + step * i;
          const y = 30 - (t.score / max) * 26;
          return <circle key={i} cx={x} cy={y} r={0.8} fill="#06b6d4" />;
        })}
      </svg>
    </div>
  );
}
