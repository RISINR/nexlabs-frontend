import React from 'react';

type Props = { name: string; size?: number; color?: string };

export default function ActionIcon({ name, size = 16, color = 'currentColor' }: Props) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' } as any;
  const stroke = { stroke: color, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' } as any;

  switch ((name || '').toLowerCase()) {
    case 'edit':
      return (
        <svg {...common}>
          <path d="M3 21l3-1 11-11 1-3-3 1L4 18l-1 3z" {...stroke} />
        </svg>
      );
    case 'mic':
    case 'microphone':
      return (
        <svg {...common}>
          <path d="M12 1v11" {...stroke} />
          <path d="M19 11a7 7 0 0 1-14 0" {...stroke} />
          <path d="M5 21h14" {...stroke} />
        </svg>
      );
    case 'crown':
      return (
        <svg {...common}>
          <path d="M2 9l4 11h12l4-11-6 4-4-7-4 7-6-4z" {...stroke} />
        </svg>
      );
    case 'palette':
      return (
        <svg {...common}>
          <path d="M12 2a9 9 0 1 0 9 9c0-4.97-4.03-9-9-9z" {...stroke} />
          <circle cx="9.5" cy="9.5" r="1" fill={color} />
          <circle cx="14" cy="8" r="1" fill={color} />
          <circle cx="11" cy="14" r="1" fill={color} />
        </svg>
      );
    case 'note':
    case 'document':
      return (
        <svg {...common}>
          <path d="M7 3h8l4 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" {...stroke} />
          <path d="M7 14h10" {...stroke} />
          <path d="M7 10h6" {...stroke} />
        </svg>
      );
    case 'star':
      return (
        <svg {...common}>
          <path d="M12 2l2.9 6.26L21 9.27l-5 4.87L17.8 21 12 17.77 6.2 21 7 14.14 2 9.27l6.1-.99L12 2z" {...stroke} />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" {...stroke} />
        </svg>
      );
  }
}
