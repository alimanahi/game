import { LevelRank } from '../types';

export const LEVEL_RANKS: LevelRank[] = [
  {
    level: 1,
    title: 'کارآگاه تازه‌کار',
    minXP: 0,
    badge: '🔍',
    color: 'from-blue-600 to-slate-700',
  },
  {
    level: 2,
    title: 'دستیار کارآگاه',
    minXP: 400,
    badge: '🔎',
    color: 'from-cyan-600 to-blue-700',
  },
  {
    level: 3,
    title: 'بازپرس پرونده‌ها',
    minXP: 1000,
    badge: '📜',
    color: 'from-emerald-600 to-teal-700',
  },
  {
    level: 4,
    title: 'کارآگاه حرفه‌ای',
    minXP: 2000,
    badge: '🕵️',
    color: 'from-amber-600 to-orange-700',
  },
  {
    level: 5,
    title: 'کارآگاه ارشد',
    minXP: 3800,
    badge: '⭐',
    color: 'from-purple-600 to-indigo-700',
  },
  {
    level: 6,
    title: 'استاد حقیقت',
    minXP: 6500,
    badge: '👑',
    color: 'from-amber-400 to-yellow-600',
  },
  {
    level: 7,
    title: 'بازرس ویژه شایعات',
    minXP: 10500,
    badge: '🛡️',
    color: 'from-rose-600 to-red-800',
  },
  {
    level: 8,
    title: 'افسانه حقیقت‌یابی',
    minXP: 16000,
    badge: '🌟',
    color: 'from-amber-300 via-rose-500 to-indigo-600',
  },
];

export function getRankForXP(xp: number): LevelRank {
  for (let i = LEVEL_RANKS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_RANKS[i].minXP) {
      return LEVEL_RANKS[i];
    }
  }
  return LEVEL_RANKS[0];
}

export function getNextRank(currentLevel: number): LevelRank | null {
  const next = LEVEL_RANKS.find((r) => r.level === currentLevel + 1);
  return next || null;
}
