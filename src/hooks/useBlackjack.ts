import { useCallback, useMemo, useState, useEffect } from 'react';
import { useWallet } from './useWallet';
import { newShuffledDeck } from '../utils/deck';
import { playCashout } from '../utils/soundHooks';
import type { CardData } from '../types/card';

export type BlackjackStatus = 'idle' | 'player-turn' | 'dealer-turn' | 'won' | 'lost' | 'push' | 'blackjack';

export interface BlackjackHistory {
  id: string;
  outcome: 'won' | 'lost' | 'push' | 'blackjack';
  bet: number;
  winAmount: number;
  playerValue: number;
  dealerValue: number;
  time: string;
}

export interface BlackjackCashoutSummary {
  payout: number;
  multiplier: number;
  outcome: 'won' | 'lost' | 'push' | 'blackjack';
  playerValue: number;
  dealerValue: number;
}

const STATS_STORAGE_KEY = 'blackjack-game-stats-v2';
const HISTORY_STORAGE_KEY = 'blackjack-game-history-v2';

const initialStats = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  pushes: 0,
  blackjacks: 0,
  totalBet: 0,
  totalWon: 0,
  highestWin: 0,
};

export function calculateHandValue(hand: CardData[]): number {
  let total = 0;
  let aces = 0;
  for (const card of hand) {
    if (card.rank === 'A') {
      aces += 1;
      total += 11;
    } else if (['J', 'Q', 'K'].includes(card.rank)) {
      total += 10;
    } else {
      total += Number(card.rank);
    }
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

export function useBlackjack() {
  const { balance, canAfford, deduct, adjustBalance } = useWallet();
  const [betAmount, setBetAmount] = useState(10);
  const [activeBet, setActiveBet] = useState(0);
  const [status, setStatus] = useState<BlackjackStatus>('idle');
  const [deck, setDeck] = useState<CardData[]>([]);
  const [playerHand, setPlayerHand] = useState<CardData[]>([]);
  const [dealerHand, setDealerHand] = useState<CardData[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState('Place your wager and deal cards!');
  const [error, setError] = useState('');
  const [cashoutSummary, setCashoutSummary] = useState<BlackjackCashoutSummary | null>(null);

  // Persisted Stats & History
  const [stats, setStats] = useState(() => {
    const stored = window.localStorage.getItem(STATS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialStats;
  });

  const [history, setHistory] = useState<BlackjackHistory[]>(() => {
    const stored = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    window.localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const playerValue = useMemo(() => calculateHandValue(playerHand), [playerHand]);
  const dealerValue = useMemo(() => calculateHandValue(dealerHand), [dealerHand]);

  const canPlay = status === 'idle' && betAmount > 0 && canAfford(betAmount) && !isAnimating;
  const canHit = status === 'player-turn' && playerValue < 21 && !isAnimating;
  const canStand = status === 'player-turn' && !isAnimating;
  const canDouble = status === 'player-turn' && playerHand.length === 2 && canAfford(activeBet) && !isAnimating;

  const dismissCashoutSummary = useCallback(() => {
    setCashoutSummary(null);
  }, []);

  const recordOutcome = useCallback((
    outcome: 'won' | 'lost' | 'push' | 'blackjack',
    currentBet: number,
    winAmount: number,
    pVal: number,
    dVal: number
  ) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newHistoryItem: BlackjackHistory = {
      id: Date.now().toString(),
      outcome,
      bet: currentBet,
      winAmount,
      playerValue: pVal,
      dealerValue: dVal,
      time: timeStr,
    };

    setHistory((prev) => [newHistoryItem, ...prev].slice(0, 30));

    setStats((prev: typeof initialStats) => {
      const isWin = outcome === 'won' || outcome === 'blackjack';
      const isLoss = outcome === 'lost';
      const isPush = outcome === 'push';
      const isBJ = outcome === 'blackjack';

      return {
        gamesPlayed: prev.gamesPlayed + 1,
        wins: prev.wins + (isWin ? 1 : 0),
        losses: prev.losses + (isLoss ? 1 : 0),
        pushes: prev.pushes + (isPush ? 1 : 0),
        blackjacks: prev.blackjacks + (isBJ ? 1 : 0),
        totalBet: Number((prev.totalBet + currentBet).toFixed(2)),
        totalWon: Number((prev.totalWon + winAmount).toFixed(2)),
        highestWin: Math.max(prev.highestWin, winAmount),
      };
    });

    const multiplier = outcome === 'blackjack' ? 2.5 : outcome === 'won' ? 2.0 : outcome === 'push' ? 1.0 : 0.0;
    
    // Play SFX only on cashing out (positive win amounts: win or blackjack)
    if (winAmount > 0) {
      playCashout();
    }

    setCashoutSummary({
      payout: winAmount,
      multiplier,
      outcome,
      playerValue: pVal,
      dealerValue: dVal,
    });
  }, []);

  // Deal starting cards
  const dealCards = useCallback(async () => {
    if (!canPlay) {
      if (betAmount <= 0) {
        setError('Please enter a valid bet.');
      } else if (!canAfford(betAmount)) {
        setError('Insufficient balance.');
      }
      return;
    }

    setError('');
    setIsAnimating(true);
    deduct(betAmount);
    setActiveBet(betAmount);
    setStatus('player-turn');

    const freshDeck = newShuffledDeck();
    const p1 = freshDeck.shift()!;
    const d1 = freshDeck.shift()!;
    const p2 = freshDeck.shift()!;
    const d2 = freshDeck.shift()!;

    setDeck(freshDeck);
    
    // Staggered deal for an elegant, responsive flow
    setPlayerHand([p1]);
    setDealerHand([d1]);

    await new Promise((resolve) => setTimeout(resolve, 200));
    setPlayerHand([p1, p2]);

    await new Promise((resolve) => setTimeout(resolve, 200));
    setDealerHand([d1, d2]);

    const initialPlayerVal = calculateHandValue([p1, p2]);
    const initialDealerVal = calculateHandValue([d1, d2]);

    const hasPlayerBJ = initialPlayerVal === 21;
    const hasDealerBJ = initialDealerVal === 21;

    if (hasPlayerBJ) {
      if (hasDealerBJ) {
        setStatus('push');
        setMessage('Dual Blackjack! Bet returned.');
        adjustBalance(betAmount); // Push refund
        recordOutcome('push', betAmount, betAmount, 21, 21);
      } else {
        setStatus('blackjack');
        setMessage('Blackjack! 3:2 payout!');
        const winVal = Number((betAmount * 2.5).toFixed(2));
        adjustBalance(winVal);
        recordOutcome('blackjack', betAmount, winVal, 21, initialDealerVal);
      }
      setIsAnimating(false);
    } else {
      setMessage('Your turn! Hit, Stand or Double.');
      setIsAnimating(false);
    }
  }, [canPlay, betAmount, canAfford, deduct, adjustBalance, recordOutcome]);

  // Player Hits
  const hit = useCallback(() => {
    if (!canHit) return;

    setError('');
    setIsAnimating(true);

    const nextCard = deck[0];
    const newDeck = deck.slice(1);
    setDeck(newDeck);

    const newHand = [...playerHand, nextCard];
    setPlayerHand(newHand);

    const newVal = calculateHandValue(newHand);
    if (newVal > 21) {
      // Bust
      setStatus('lost');
      setMessage('Bust! Dealer wins.');
      recordOutcome('lost', activeBet, 0, newVal, dealerValue);
      setIsAnimating(false);
    } else if (newVal === 21) {
      // Automatic stand on 21
      setIsAnimating(false);
      standHand(newHand, newDeck);
    } else {
      setMessage(`You drew ${nextCard.rank}. Hit or Stand?`);
      setIsAnimating(false);
    }
  }, [canHit, deck, playerHand, activeBet, dealerValue, recordOutcome]);

  // Stand Action
  const stand = useCallback(() => {
    if (!canStand) return;
    standHand(playerHand, deck);
  }, [canStand, playerHand, deck]);

  // Stand and Dealer plays
  const standHand = async (currentPlayerHand: CardData[], currentDeck: CardData[]) => {
    setStatus('dealer-turn');
    setMessage('Dealer is playing...');
    setIsAnimating(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    let localDealerHand = [...dealerHand];
    let localDeck = [...currentDeck];
    let currentDealerVal = calculateHandValue(localDealerHand);

    // Dealer hits until soft 17 (value >= 17)
    while (currentDealerVal < 17) {
      const nextCard = localDeck[0];
      localDeck = localDeck.slice(1);
      localDealerHand.push(nextCard);
      currentDealerVal = calculateHandValue(localDealerHand);
      setDealerHand([...localDealerHand]);
      setDeck(localDeck);
      setMessage(`Dealer hits and draws ${nextCard.rank}...`);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    const finalPlayerVal = calculateHandValue(currentPlayerHand);

    if (currentDealerVal > 21) {
      // Dealer busts
      setStatus('won');
      setMessage('Dealer bust! You win!');
      const payout = activeBet * 2;
      adjustBalance(payout);
      recordOutcome('won', activeBet, payout, finalPlayerVal, currentDealerVal);
    } else if (finalPlayerVal > currentDealerVal) {
      // Player wins
      setStatus('won');
      setMessage(`You have ${finalPlayerVal}, Dealer has ${currentDealerVal}. You win!`);
      const payout = activeBet * 2;
      adjustBalance(payout);
      recordOutcome('won', activeBet, payout, finalPlayerVal, currentDealerVal);
    } else if (finalPlayerVal < currentDealerVal) {
      // Dealer wins
      setStatus('lost');
      setMessage(`Dealer wins with ${currentDealerVal} vs ${finalPlayerVal}.`);
      recordOutcome('lost', activeBet, 0, finalPlayerVal, currentDealerVal);
    } else {
      // Push
      setStatus('push');
      setMessage(`Both have ${finalPlayerVal}. Push!`);
      adjustBalance(activeBet);
      recordOutcome('push', activeBet, activeBet, finalPlayerVal, currentDealerVal);
    }

    setIsAnimating(false);
  };

  // Double Down Action
  const doubleDown = useCallback(async () => {
    if (!canDouble) return;

    setError('');
    setIsAnimating(true);
    deduct(activeBet);
    const newActiveBet = activeBet * 2;
    setActiveBet(newActiveBet);

    const nextCard = deck[0];
    const newDeck = deck.slice(1);
    setDeck(newDeck);

    const newHand = [...playerHand, nextCard];
    setPlayerHand(newHand);

    const newVal = calculateHandValue(newHand);
    if (newVal > 21) {
      setStatus('lost');
      setMessage('Bust on double! Dealer wins.');
      recordOutcome('lost', newActiveBet, 0, newVal, dealerValue);
      setIsAnimating(false);
    } else {
      await standHand(newHand, newDeck);
    }
  }, [canDouble, activeBet, deck, playerHand, deduct, dealerValue, recordOutcome]);

  const resetGame = useCallback(() => {
    if (isAnimating) return;
    setStatus('idle');
    setPlayerHand([]);
    setDealerHand([]);
    setActiveBet(0);
    setMessage('Place your wager and deal cards!');
    setError('');
  }, [isAnimating]);

  // Auto-reset helper for interactive popups
  useEffect(() => {
    if (!cashoutSummary) return;
    const timer = window.setTimeout(() => {
      setCashoutSummary(null);
      setStatus('idle');
      setPlayerHand([]);
      setDealerHand([]);
      setActiveBet(0);
      setMessage('Place your wager and deal cards!');
      setError('');
    }, 2800);

    return () => window.clearTimeout(timer);
  }, [cashoutSummary]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setStats(initialStats);
    window.localStorage.removeItem(STATS_STORAGE_KEY);
    window.localStorage.removeItem(HISTORY_STORAGE_KEY);
  }, []);

  return {
    balance,
    betAmount,
    setBetAmount,
    activeBet,
    status,
    playerHand,
    dealerHand,
    playerValue,
    dealerValue,
    isAnimating,
    message,
    error,
    stats,
    history,
    cashoutSummary,
    dismissCashoutSummary,
    canPlay,
    canHit,
    canStand,
    canDouble,
    dealCards,
    hit,
    stand,
    doubleDown,
    resetGame,
    clearHistory,
  };
}
