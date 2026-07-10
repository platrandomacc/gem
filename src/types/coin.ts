export type CoinSide = 'heads' | 'tails';

export type CoinflipStatus = 'idle' | 'flipping' | 'won' | 'lost';

export interface CoinHistoryItem {
  id: string;
  side: CoinSide;
  result: CoinSide;
  bet: number;
  profit: number;
  won: boolean;

  timestamp: number;
}
