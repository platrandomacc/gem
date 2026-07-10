import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWallet } from './useWallet';
import { newShuffledDeck } from '../utils/deck';
import { playCashout, playHiloFlip } from '../utils/soundHooks';
import type { CardData, HiloGameSummary, Prediction } from '../types/card';

type HiloStatus = 'idle' | 'playing' | 'lost' | 'cashedOut';

const initialStats = {
  gamesPlayed: 26,
  wins: 15,
  currentStreak: 2,
  bestStreak: 5,
  highestMultiplier: 2.15,
};

export function useHilo() {
  const { balance, canAfford, deduct, adjustBalance } = useWallet();
  const [betAmount, setBetAmount] = useState(0);
  const [stake, setStake] = useState(0);
  const [status, setStatus] = useState<HiloStatus>('idle');
  const [deck, setDeck] = useState<CardData[]>([]);
  const [currentCard, setCurrentCard] = useState<CardData | null>(null);
  const [revealedCard, setRevealedCard] = useState<CardData | null>(null);
  const [startCard, setStartCard] = useState<CardData | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [rounds, setRounds] = useState(0);
  const [cumulativeMultiplier, setCumulativeMultiplier] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState('Enter a wager and start the game.');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HiloGameSummary[]>([]); // history now stores per-draw plays for the current run
  const [cashoutSummary, setCashoutSummary] = useState<{ payout: number; multiplier: number; cardsDrawn: number } | null>(null);
  const [stats, setStats] = useState(initialStats);

  const RTP = 0.96;
  const calcOddsAndMultiplier = (card: CardData | null, remainingDeck: CardData[]) => {
    if (!card || remainingDeck.length === 0) {
      return {
        higherChance: 0,
        lowerChance: 0,
        higherMultiplier: 0,
        lowerMultiplier: 0,
      };
    }

    const currentRank = card.value; // 1..13
    const higherCards = remainingDeck.filter((deckCard) => deckCard.value > currentRank).length;
    const lowerCards = remainingDeck.filter((deckCard) => deckCard.value < currentRank).length;
    const tieCards = remainingDeck.filter((deckCard) => deckCard.value === currentRank).length;
    const remainingCards = remainingDeck.length;

    const higherChanceRaw = remainingCards > 0 ? (higherCards / remainingCards) * 100 : 0;
    const lowerChanceRaw = remainingCards > 0 ? (lowerCards / remainingCards) * 100 : 0;

    const higherChance = Number(higherChanceRaw.toFixed(2));
    const lowerChance = Number(lowerChanceRaw.toFixed(2));

    const safeMultiplier = (rawChance: number) => {
      if (rawChance <= 0) return 0;
      const winProbability = rawChance / 100;
      const base = RTP / winProbability;
      const bonusFactor = rawChance > 80 ? 1 + (rawChance - 80) / 200 : 1;
      return Number((base * bonusFactor).toFixed(2));
    };

    const higherMultiplier = safeMultiplier(higherChanceRaw);
    const lowerMultiplier = safeMultiplier(lowerChanceRaw);

    return { higherChance, lowerChance, higherMultiplier, lowerMultiplier };
  };

  const currentMultiplier = useMemo(() => Number(cumulativeMultiplier.toFixed(4)), [cumulativeMultiplier]);
  const { higherChance, lowerChance, higherMultiplier, lowerMultiplier } = useMemo(
    () => calcOddsAndMultiplier(currentCard, deck),
    [currentCard, deck],
  );
  const potentialPayout = useMemo(() => Number((stake * currentMultiplier).toFixed(2)), [stake, currentMultiplier]);
  const profit = useMemo(() => Number((potentialPayout - stake).toFixed(2)), [potentialPayout, stake]);
  const cardsRemaining = deck.length;
  const isPlaying = status === 'playing';
  const canStart = betAmount > 0 && canAfford(betAmount) && status !== 'playing' && !isAnimating;
  const canPredict = isPlaying && !isAnimating && cardsRemaining > 0;
  const canCashOut = isPlaying && !isAnimating && stake > 0;
  const canSkip = isPlaying && !isAnimating && cardsRemaining > 0;

  const resetGame = useCallback(() => {
    setStake(0);
    setStatus('idle');
    setDeck([]);
    setCurrentCard(null);
    setRevealedCard(null);
    setStartCard(null);
    setPrediction(null);
    setRounds(0);
    setCumulativeMultiplier(1);
    setIsAnimating(false);
    setMessage('Enter a wager and start the game.');
    setError('');
  }, []);

  useEffect(() => {
    if (status !== 'lost') return;
    const timeout = window.setTimeout(() => {
      resetGame();
    }, 1400);
    return () => window.clearTimeout(timeout);
  }, [status, resetGame]);

  const halfBet = useCallback(() => setBetAmount((value) => Math.max(1, Math.floor(value / 2))), []);
  const doubleBet = useCallback(() => setBetAmount((value) => value * 2), []);

  const startGame = useCallback(() => {
    if (betAmount <= 0) {
      setError('Enter a valid bet before starting.');
      return;
    }
    if (!canAfford(betAmount)) {
      setError('Insufficient balance for this bet.');
      return;
    }

    const deck = newShuffledDeck();
    const [firstCard, ...rest] = deck;
    deduct(betAmount);
    setStake(betAmount);
    setStatus('playing');
    setDeck(rest);
    setCurrentCard(firstCard);
    setStartCard(firstCard);
    setHistory([]); // start fresh run history
    setRevealedCard(null);
    setPrediction(null);
    setRounds(0);
    setCumulativeMultiplier(1);
    setIsAnimating(false);
    setMessage('Predict whether the next card will be higher or lower.');
    setError('');
    // do not play any sound on starting a bet (user requested no sound on Bet)
  }, [betAmount, canAfford, deduct]);

  const finishGame = useCallback(
    (won: boolean, finalCard: CardData, predictionChoice: Prediction, finalMultiplier: number) => {
      setStatus(won ? 'cashedOut' : 'lost');
      setIsAnimating(false);
      // When a run finishes we keep the current run history visible (it's built during plays).

      setStats((previous) => {
        const gamesPlayed = previous.gamesPlayed + 1;
        const wins = previous.wins + (won ? 1 : 0);
        const currentStreak = won ? previous.currentStreak + 1 : 0;
        return {
          gamesPlayed,
          wins,
          currentStreak,
          bestStreak: won ? Math.max(previous.bestStreak, currentStreak) : previous.bestStreak,
          highestMultiplier: Math.max(previous.highestMultiplier, finalMultiplier),
        };
      });
    },
    [startCard],
  );

  const choosePrediction = useCallback(
    (predictionChoice: Prediction) => {
      if (!canPredict || !currentCard) return;
      setPrediction(predictionChoice);
      setIsAnimating(true);
      setMessage('Dealing the next card...');
      playHiloFlip();

      const nextDeck = [...deck];
      const nextCard = nextDeck.shift();
      if (!nextCard) {
        setMessage('No cards remaining. Start a new game.');
        setIsAnimating(false);
        return;
      }

      setDeck(nextDeck);
      setRevealedCard(nextCard);

      window.setTimeout(() => {
        const sameRank = nextCard.value === currentCard.value;
        if (sameRank) {
          setCurrentCard(nextCard);
          setHistory((cur) => [
            ...cur,
            {
              id: `${Date.now()}-${nextCard.id}`,
              startCard: currentCard,
              resultCard: nextCard,
              prediction: predictionChoice,
              multiplier: 0,
              won: false,
            },
          ]);
          finishGame(false, nextCard, predictionChoice, currentMultiplier);
          return;
        }

            const won = predictionChoice === 'higher' ? nextCard.value > currentCard.value : nextCard.value < currentCard.value;
        if (won) {
          const nextRounds = rounds + 1;
          const perRoundMultiplier = predictionChoice === 'higher' ? higherMultiplier : lowerMultiplier;
          const nextMultiplier = Number((currentMultiplier * perRoundMultiplier).toFixed(4));
          setRounds(nextRounds);
          setCumulativeMultiplier(nextMultiplier);
          setCurrentCard(nextCard);
          // record this successful draw in the run history as the total multiplier so far
          setHistory((cur) => [
            ...cur,
            {
              id: `${Date.now()}-${nextCard.id}`,
              startCard: currentCard,
              resultCard: nextCard,
              prediction: predictionChoice,
              multiplier: nextMultiplier,
              won: true,
            },
          ]);
          setIsAnimating(false);
          // no win sound per user request — only flip sound is played on prediction
          return;
        }

        // record loss as the final play in this run
        setHistory((cur) => [
          ...cur,
          {
            id: `${Date.now()}-${nextCard.id}`,
            startCard: currentCard,
            resultCard: nextCard,
            prediction: predictionChoice,
            multiplier: 0,
            won: false,
          },
        ]);
        // no lose sound per user request
        finishGame(false, nextCard, predictionChoice, currentMultiplier);
      }, 800);
    },
    [canPredict, currentCard, deck, finishGame, currentMultiplier, rounds, higherMultiplier, lowerMultiplier],
  );

  const skipCard = useCallback(() => {
    if (!canSkip || !currentCard) return;

    const nextDeck = [...deck];
    const nextCard = nextDeck.shift();
    if (!nextCard) {
      setMessage('No cards remaining to skip to.');
      return;
    }

    setHistory((cur) => [
      ...cur,
      {
        id: `${Date.now()}-${currentCard.id}`,
        startCard: currentCard,
        resultCard: currentCard,
        prediction: 'skip',
        multiplier: currentMultiplier,
        won: false,
        skipped: true,
      },
    ]);

    setDeck(nextDeck);
    setCurrentCard(nextCard);
    setRevealedCard(null);
    setPrediction(null);
    setIsAnimating(false);
    setMessage('Card skipped. Predict whether the next card will be higher or lower.');
  }, [canSkip, currentCard, currentMultiplier, deck]);

  const cashOut = useCallback(() => {
    if (!canCashOut) return;
    const payout = Number((stake * currentMultiplier).toFixed(2));
    const cardsDrawn = history.length;
    adjustBalance(payout);
    playCashout();
    setCashoutSummary({ payout, multiplier: currentMultiplier, cardsDrawn });
    finishGame(stake > 0 && currentMultiplier > 1, currentCard ?? (startCard as CardData), prediction ?? 'higher', currentMultiplier);
    setMessage(`Cashed out for $${payout.toFixed(2)}.`);
  }, [adjustBalance, canCashOut, currentCard, currentMultiplier, finishGame, history.length, prediction, stake, startCard]);

  const dismissCashoutSummary = useCallback(() => setCashoutSummary(null), []);

  return {
    balance,
    betAmount,
    setBetAmount,
    stake,
    status,
    currentCard,
    revealedCard,
    prediction,
    currentMultiplier,
    potentialPayout,
    profit,
    message,
    error,
    history,
    cashoutSummary,
    stats: {
      gamesPlayed: stats.gamesPlayed,
      currentStreak: stats.currentStreak,
      bestStreak: stats.bestStreak,
      highestMultiplier: stats.highestMultiplier,
      winRate: stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0,
    },
    cardsRemaining,
    isAnimating,
    canStart,
    canPredict,
    canCashOut,
    canSkip,
    startGame,
    choosePrediction,
    skipCard,
    cashOut,
    dismissCashoutSummary,
    resetGame,
    halfBet,
    doubleBet,
    higherChance,
    lowerChance,
    higherMultiplier,
    lowerMultiplier,
  };
}

