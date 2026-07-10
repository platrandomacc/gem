export type MinesGameStatus = 'idle' | 'loading' | 'playing' | 'cashedOut' | 'lost';

export interface MineTile {
  id: number;
  isMine: boolean;
  revealed: boolean;
}

export interface MinesHistoryEntry {
  id: number;
  bet: number;
  mineCount: number;
  safePicks: number;
  multiplier: number;
  profit: number;
  outcome: 'win' | 'loss';
  timestamp: string;
}

export interface MinesStats {
  gamesPlayed: number;
  winRate: number;
  averageMultiplier: number;
  highestCashout: number;
  bestStreak: number;
  largestWin: number;
}

export interface MinesResultSummary {
  type: 'cashout' | 'loss';
  payout: number;
  multiplier: number;
  safePicks: number;
}
