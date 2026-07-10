import { shuffleArray } from './shuffle';
import { CardData, CardRank, CardSuit } from '../types/card';

const ranks: CardRank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suits: CardSuit[] = ['spades', 'hearts', 'diamonds', 'clubs'];

const rankValue: Record<CardRank, number> = {
  A: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  J: 11,
  Q: 12,
  K: 13,
};

export function createDeck(): CardData[] {
  return suits.flatMap((suit) =>
    ranks.map((rank) => ({
      id: `${rank}-${suit}`,
      rank,
      suit,
      value: rankValue[rank],
    })),
  );
}

export function newShuffledDeck(): CardData[] {
  return shuffleArray(createDeck());
}
