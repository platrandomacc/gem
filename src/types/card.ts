export type CardRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
export type CardSuit = 'spades' | 'hearts' | 'diamonds' | 'clubs';

export interface CardData {
  id: string;
  rank: CardRank;
  suit: CardSuit;
  value: number;
}

export type Prediction = 'higher' | 'lower' | 'skip';

export interface HiloGameSummary {
  id: string;
  startCard: CardData;
  prediction: Prediction;
  resultCard: CardData;
  multiplier: number;
  won: boolean;
  skipped?: boolean;
}
