import { useCallback, useMemo, useState } from 'react';
import { useWallet } from './useWallet';
import { generateFlipOutcome } from '../utils/coinLogic';
import { CoinHistoryItem, CoinSide, CoinflipStatus } from '../types/coin';

const MAX_HISTORY = 10;
const MULTIPLIER = 2;

export function useCoinflip() {
  const { balance, canAfford, deduct, adjustBalance } = useWallet();
  const [selectedSide, setSelectedSide] = useState<CoinSide>('heads');
  const [bet, setBet] = useState(25);
  const [status, setStatus] = useState<CoinflipStatus>('idle');
  const [result, setResult] = useState<CoinSide | null>(null);
  const [message, setMessage] = useState('Choose your side and place a stake.');
  const [history, setHistory] = useState<CoinHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [round, setRound] = useState(0);

  const currentMultiplier = MULTIPLIER;
  const potentialPayout = useMemo(() => Number((bet * currentMultiplier).toFixed(2)), [bet, currentMultiplier]);
  const potentialProfit = useMemo(() => Number((potentialPayout - bet).toFixed(2)), [potentialPayout, bet]);
  const canFlip = bet > 0 && canAfford(bet) && status !== 'flipping';

  const playFlipSound = useCallback(() => {
    return undefined;
  }, []);

  const playWinSound = useCallback(() => {
    return undefined;
  }, []);

  const playLoseSound = useCallback(() => {
    return undefined;
  }, []);

  const stats = useMemo(() => {
    const totalGames = history.length;
    const wins = history.filter((item) => item.won).length;
    const winRate = totalGames ? Math.round((wins / totalGames) * 100) : 0;
    const biggestWin = history.reduce((max, item) => (item.profit > max ? item.profit : max), 0);
    let streak = 0;
    for (const item of history) {
      if (item.won) {
        streak += 1;
        continue;
      }
      break;
    }
    return {
      totalGames,
      winRate,
      biggestWin,
      currentStreak: streak,
    };
  }, [history]);

  const startFlip = useCallback(() => {
    if (bet <= 0) {
      setError('Enter a valid stake amount.');
      return;
    }

    if (!canAfford(bet)) {
      setError('Insufficient balance for this wager.');
      return;
    }

    setError(null);
    deduct(bet);
    setStatus('flipping');
    setIsFlipping(true);
    setMessage('Coin is in the air...');
    playFlipSound();

    const finalResult = generateFlipOutcome();

    window.setTimeout(() => {
      const won = finalResult === selectedSide;
      const profit = won ? potentialProfit : -bet;
      const historyItem: CoinHistoryItem = {
        id: crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
        side: selectedSide,
        result: finalResult,
        bet,
        profit,
        won,
        timestamp: Date.now(),
      };

      if (won) {
        adjustBalance(potentialPayout);
        setStatus('won');
        setMessage(`Win! You earned $${potentialProfit.toFixed(2)}.`);
        playWinSound();
      } else {
        setStatus('lost');
        setMessage(`Loss. The coin landed on ${finalResult}.`);
        playLoseSound();
      }

      setResult(finalResult);
      setHistory((current) => [historyItem, ...current].slice(0, MAX_HISTORY));
      setIsFlipping(false);
      setRound((current) => current + 1);
    }, 1700);
  }, [adjustBalance, bet, canAfford, currentMultiplier, deduct, potentialPayout, potentialProfit, playFlipSound, playLoseSound, playWinSound, round, selectedSide]);

  const resetGame = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setMessage('Choose your side and place a stake.');
    setError(null);
    setIsFlipping(false);
  }, [round]);

  return {
    balance,
    bet,
    setBet,
    selectedSide,
    setSelectedSide,
    status,
    result,
    message,
    error,
    history,
    stats,
    isFlipping,
    currentMultiplier,
    potentialPayout,
    canFlip,
    startFlip,
    resetGame,
    playFlipSound,
    playWinSound,
    playLoseSound,
  };
}
