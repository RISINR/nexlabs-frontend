export function getInterestEmoji(name?: string) {
  if (!name) return '';
  const n = String(name).toLowerCase();
  if (n.includes('ฟุต') || n.includes('football') || n.includes('soccer')) return '⚽';
  if (n.includes('แบด') || n.includes('badm')) return '🏸';
  if (n.includes('บาส') || n.includes('basket')) return '🏀';
  if (n.includes('เทนนิส') || n.includes('tennis')) return '🎾';
  if (n.includes('วิ่ง') || n.includes('run') || n.includes('jog')) return '🏃';
  if (n.includes('จักรยาน') || n.includes('ปั่น') || n.includes('cycle')) return '🚴';
  if (n.includes('ว่าย') || n.includes('swim')) return '🏊';
  if (n.includes('ถ่าย') || n.includes('photo') || n.includes('กล้อง')) return '📷';
  if (n.includes('กีตาร์') || n.includes('guitar') || n.includes('music')) return '🎸';
  if (n.includes('วาด') || n.includes('paint') || n.includes('art')) return '🎨';
  if (n.includes('อ่าน') || n.includes('read') || n.includes('หนังสือ')) return '📚';
  if (n.includes('เกม') || n.includes('game') || n.includes('เกมส์')) return '🎮';
  if (n.includes('โยคะ')) return '🧘';
  if (n.includes('ทำอาหาร') || n.includes('cooking')) return '🍳';
  if (n.includes('เดินป่า') || n.includes('hike') || n.includes('แคมป์')) return '🥾';
  if (n.includes('เต้น') || n.includes('dance')) return '💃';
  if (n.includes('ทำสวน') || n.includes('garden')) return '🌱';
  if (n.includes('ตกปลา') || n.includes('fishing')) return '🎣';
  // fallback
  return '✨';
}

export default getInterestEmoji;
