export type TowerDifficulty = 'easy' | 'medium' | 'hard' | 'extreme';

export interface DifficultyMode {
  value: TowerDifficulty;
  label: string;
  description: string;
  floors: number;
  // configuration per row
  tilesPerRow: number;
  trapsPerRow: number;
  minBet: number;
  maxBet: number;
  growth: number;
  // multiplier applied when player completes the entire board
  completionBonus?: number;
  accent: string;
}

export const difficultyModes: DifficultyMode[] = [
  {
    value: 'easy',
    label: 'Easy',
    description: 'Lower-risk climbs for steady payouts.',
    floors: 9,
    tilesPerRow: 4,
    trapsPerRow: 1,
    minBet: 0,
    maxBet: Number.POSITIVE_INFINITY,
    growth: 0.4,
    completionBonus: 2,
    accent: 'from-[#22C55E]/35 to-[#16A34A]/20',
  },
  {
    value: 'medium',
    label: 'Medium',
    description: 'Balanced risk with stronger multipliers.',
    floors: 9,
    tilesPerRow: 3,
    trapsPerRow: 1,
    minBet: 0,
    maxBet: Number.POSITIVE_INFINITY,
    growth: 0.6,
    completionBonus: 4,
    accent: 'from-[#3B82F6]/30 to-[#22C55E]/10',
  },
  {
    value: 'hard',
    label: 'Hard',
    description: 'Faster climbs and higher stakes.',
    floors: 9,
    tilesPerRow: 2,
    trapsPerRow: 1,
    minBet: 0,
    maxBet: Number.POSITIVE_INFINITY,
    growth: 1.15,
    completionBonus: 12,
    accent: 'from-[#F97316]/30 to-[#EF4444]/15',
  },
  {
    value: 'extreme',
    label: 'Extreme',
    description: 'Maximum volatility with explosive rewards.',
    floors: 9,
    tilesPerRow: 4,
    trapsPerRow: 3,
    minBet: 0,
    maxBet: Number.POSITIVE_INFINITY,
    growth: 1.45,
    completionBonus: 28,
    accent: 'from-[#A855F7]/30 to-[#3B82F6]/15',
  },
];

export function getMultiplierForFloor(index: number, floors: number, difficulty: TowerDifficulty) {
  const mode = difficultyModes.find((item) => item.value === difficulty)!;
  const scale = difficulty === 'extreme' ? 1.8 : 1.45;
  const base = difficulty === 'extreme'
    ? 4.15 + Math.pow(index + 1, 1.8) * (mode.growth * 0.7)
    : 1 + Math.pow(index + 1, scale) * mode.growth;
  return Number(base.toFixed(2));
}

export function getPotentialPayout(bet: number, multiplier: number) {
  return Number((bet * multiplier).toFixed(2));
}

export function getMinesMultiplier(mineCount: number, safePicks: number) {
  const base = 1 + safePicks * 0.1875 + (mineCount - 1) * 0.03;
  return Number((base * (1 + mineCount * 0.0375)).toFixed(2));
}

export function getMinesRiskLabel(mineCount: number) {
  if (mineCount <= 3) return 'Low';
  if (mineCount <= 8) return 'Medium';
  if (mineCount <= 15) return 'High';
  return 'Extreme';
}
