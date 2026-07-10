export type LimboStatus = 'idle' | 'rolling' | 'result';

export interface LimboRoundResult {
  seed: string;
  nonce: number;
  targetMultiplier: number;
  rolledMultiplier: number;
  payout: number;
  profit: number;
  won: boolean;
  hash: string;
}

export interface LimboHistoryEntry {
  id: string;
  bet: number;
  targetMultiplier: number;
  rolledMultiplier: number;
  payout: number;
  profit: number;
  outcome: 'win' | 'loss';
  timestamp: string;
  nonce: number;
}

export interface LimboStats {
  totalGames: number;
  winRate: number;
  biggestWin: number;
  highestMultiplier: number;
  averageMultiplier: number;
}
