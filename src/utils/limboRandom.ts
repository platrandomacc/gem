export interface LimboRoll {
  rolledMultiplier: number;
  hash: string;
}

export const HOUSE_EDGE = 0.97;

export function calculateWinChance(target: number) {
  if (target <= 1) return 100;
  if (target >= 100) return Number((HOUSE_EDGE / 100 * 100).toFixed(2));
  return Number((HOUSE_EDGE / target * 100).toFixed(2));
}

export function calculateTargetFromChance(chancePercent: number) {
  const chance = Math.max(0.01, Math.min(chancePercent, 100));
  const target = HOUSE_EDGE / (chance / 100);
  return Number(Math.min(Math.max(target, 1.01), 100).toFixed(2));
}

export function createLimboSeed() {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID().slice(0, 12).toUpperCase();
  }

  return `SEED-${Math.floor(Math.random() * 1_000_000).toString(16).toUpperCase()}`;
}

/**
 * Casino-style Limbo multiplier generator.
 * Uses an exponential curve derived from a uniform random value to
 * produce a heavy-tailed distribution (many small multipliers, rare huge spikes).
 *
 * Implementation required by the user:
 *   multiplier = houseEdge / (1 - r)
 */
function generateLimboMultiplier(): number {
  let r = Math.random();

  // Increase the probability of 1.5×+ multipliers by nudging
  // moderate random values upward, while preserving the heavy tail.
  if (r >= 0.30 && r <= 0.80) {
    r = 1 - Math.pow(1 - r, 1.12);
  }

  const houseEdge = 0.97;
  const multiplier = houseEdge / (1 - r);

  return Math.max(1, Math.min(Number(multiplier.toFixed(2)), 100));
}

export function generateLimboRoll(seed: string, nonce: number): LimboRoll {
  // Keep signature compatible with existing callers (seed/nonce accepted but generator is independent)
  const rolledMultiplier = generateLimboMultiplier();

  // Create a short non-cryptographic hash for display based on seed/nonce and multiplier
  const source = `${seed}:${nonce}:${rolledMultiplier.toFixed(2)}:${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash << 5) - hash + source.charCodeAt(i);
    hash |= 0;
  }

  const shortHash = Math.abs(hash).toString(16).toUpperCase().slice(0, 16);

  return {
    rolledMultiplier,
    hash: shortHash,
  };
}

export function formatMultiplier(value: number) {
  return `${value.toFixed(2)}×`;
}
