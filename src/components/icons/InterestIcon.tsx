import React from 'react';

type Props = {
  name?: string;
  size?: number;
  color?: string;
};

export default function InterestIcon({ name = '', size = 16, color = '#c0c0c0' }: Props) {
  const n = String(name || '').toLowerCase();

  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
  } as any;

  const strokeProps = {
    stroke: color,
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none',
  } as any;

  // Simple, highly-readable monochrome glyphs for common interests.
  if (n.includes('ฟุต') || n.includes('football') || n.includes('soccer')) {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" {...strokeProps} />
        <path d="M7 12h10M12 7v10" {...strokeProps} />
      </svg>
    );
  }

  // Generic "sports" keyword (กีฬา)
  if (n.includes('กีฬา')) {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" {...strokeProps} />
        <path d="M8 9l8 6" {...strokeProps} />
      </svg>
    );
  }

  if (n.includes('แบด') || n.includes('badm')) {
    return (
      <svg {...common}>
        <path d="M6 6l12 12" {...strokeProps} />
        <path d="M8 5l11 6-3 3" {...strokeProps} />
      </svg>
    );
  }

  if (n.includes('บาส') || n.includes('basket')) {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" {...strokeProps} />
        <path d="M4.5 12h15M12 4.5v15" {...strokeProps} />
      </svg>
    );
  }

  if (n.includes('เทนนิส') || n.includes('tennis')) {
    return (
      <svg {...common}>
        <circle cx="10" cy="10" r="4" {...strokeProps} />
        <path d="M14 14l5 5" {...strokeProps} />
      </svg>
    );
  }

  if (n.includes('วิ่ง') || n.includes('run') || n.includes('jog')) {
    return (
      <svg {...common}>
        <circle cx="7" cy="7" r="1.2" {...strokeProps} />
        <path d="M9 8l3 1 2-1 1 2" {...strokeProps} />
      </svg>
    );
  }

  if (n.includes('จักรยาน') || n.includes('ปั่น') || n.includes('cycle')) {
    return (
      <svg {...common}>
        <circle cx="7" cy="16" r="3" {...strokeProps} />
        <circle cx="17" cy="16" r="3" {...strokeProps} />
        <path d="M7 16h10" {...strokeProps} />
        <path d="M11 13v-6" {...strokeProps} />
      </svg>
    );
  }

  if (n.includes('ว่าย') || n.includes('swim')) {
    return (
      <svg {...common}>
        <path d="M3 16c4-2 6 2 9 0s6 2 9 0" {...strokeProps} />
      </svg>
    );
  }

  if (n.includes('ถ่าย') || n.includes('photo') || n.includes('กล้อง')) {
    return (
      <svg {...common}>
        <rect x="3.5" y="6" width="17" height="12" rx="2" {...strokeProps} />
        <circle cx="12" cy="12" r="3" {...strokeProps} />
        <path d="M7 6l1.5-2h7L17 6" {...strokeProps} />
      </svg>
    );
  }

  if (n.includes('กีตาร์') || n.includes('guitar') || n.includes('music') || n.includes('กีต') || n.includes('ดนตรี')) {
    return (
      <svg {...common}>
        <path d="M16 3l4 4-9 9-4 1-1-4 9-9z" {...strokeProps} />
        <circle cx="7" cy="17" r="1.2" {...strokeProps} />
      </svg>
    );
  }

  if (n.includes('วาด') || n.includes('paint') || n.includes('art')) {
    return (
      <svg {...common}>
        <path d="M4 14c2-4 8-4 10 0-2 4-8 4-10 0z" {...strokeProps} />
        <path d="M14 6l6 2" {...strokeProps} />
      </svg>
    );
  }

  if (n.includes('อ่าน') || n.includes('read') || n.includes('หนังสือ')) {
    return (
      <svg {...common}>
        <path d="M4 7h7v12H4zM13 7h7v12h-7z" {...strokeProps} />
      </svg>
    );
  }

  if (n.includes('เกม') || n.includes('game') || n.includes('เกมส์')) {
    return (
      <svg {...common}>
        <rect x="3.5" y="6" width="17" height="12" rx="2" {...strokeProps} />
        <circle cx="9.5" cy="12" r="1" {...strokeProps} />
        <circle cx="14.5" cy="12" r="1" {...strokeProps} />
      </svg>
    );
  }

  if (n.includes('โยคะ')) {
    return (
      <svg {...common}>
        <path d="M12 3c2 2 3 4 3 6s-1 4-3 6-3 4-3 6" {...strokeProps} />
      </svg>
    );
  }

  if (n.includes('ทำอาหาร') || n.includes('cooking')) {
    return (
      <svg {...common}>
        <path d="M4 13h16v2a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-2z" {...strokeProps} />
        <path d="M8 6v4" {...strokeProps} />
      </svg>
    );
  }

  if (n.includes('เดินป่า') || n.includes('hike') || n.includes('แคมป์') || n.includes('trek')) {
    return (
      <svg {...common}>
        <path d="M3 17l4-6 4 6 4-8 4 8" {...strokeProps} />
      </svg>
    );
  }

  if (n.includes('ท่องเที่ยว') || n.includes('travel') || n.includes('เที่ยว')) {
    return (
      <svg {...common}>
        <path d="M2 12h20M12 2v20" {...strokeProps} />
      </svg>
    );
  }

  if (n.includes('ทำสวน') || n.includes('garden')) {
    return (
      <svg {...common}>
        <path d="M12 3c0 4-3 6-3 9a3 3 0 0 0 6 0c0-3-3-5-3-9z" {...strokeProps} />
      </svg>
    );
  }

  if (n.includes('ตกปลา') || n.includes('fishing')) {
    return (
      <svg {...common}>
        <path d="M4 12c4-4 8 0 12 0" {...strokeProps} />
        <path d="M18 6l2 2" {...strokeProps} />
      </svg>
    );
  }

  // fallback simple sparkle
  return (
    <svg {...common}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3" {...strokeProps} />
    </svg>
  );
}
