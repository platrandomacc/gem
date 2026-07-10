import { useEffect, useMemo, useState } from 'react';
import { createMinesBoard } from '../utils/minesGenerator';
import { getMinesMultiplier, getMinesRiskLabel } from '../utils/multipliers';
import { playCashout, playMine, playReveal, playStart, playTowerComplete } from '../utils/soundHooks';
import type { MineTile, MinesGameStatus, MinesHistoryEntry, MinesResultSummary, MinesStats } from '../types/mines';
import { useWallet } from './useWallet';

const HISTORY_LIMIT = 10;
const MINES_STATE_STORAGE_KEY = 'mines-game-state';
const initialStats: MinesStats = {
  gamesPlayed: 0,
  winRate: 0,
  averageMultiplier: 1,
  highestCashout: 0,
  bestStreak: 0,
  largestWin: 0,
};

function readStoredMinesState() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(MINES_STATE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      betAmount?: number;
      mineCount?: number;
      board?: Array<{ id: number; isMine: boolean; revealed: boolean }>;
      status?: MinesGameStatus;
      safePicks?: number;
      multiplier?: number;
      profit?: number;
      canCashOut?: boolean;
      resultSummary?: MinesResultSummary | null;
      history?: MinesHistoryEntry[];
      stats?: MinesStats;
    };
    return parsed;
  } catch (e) {
    window.localStorage.removeItem(MINES_STATE_STORAGE_KEY);
    return null;
  }
}

export function useMines() {
  const { balance, canAfford, deduct, adjustBalance } = useWallet(1000);
  const storedState = readStoredMinesState();
  const [betAmount, setBetAmount] = useState<number>(() => storedState?.betAmount ?? 10);
  const [mineCount, setMineCount] = useState<number>(() => storedState?.mineCount ?? 3);
  const [board, setBoard] = useState<MineTile[]>(() => storedState?.board ?? createMinesBoard(25, 3));
  const [status, setStatus] = useState<MinesGameStatus>(() => storedState?.status ?? 'idle');
  const [safePicks, setSafePicks] = useState<number>(() => storedState?.safePicks ?? 0);
  const [multiplier, setMultiplier] = useState<number>(() => storedState?.multiplier ?? 1);
  const [profit, setProfit] = useState<number>(() => storedState?.profit ?? 0);
  const [canCashOut, setCanCashOut] = useState<boolean>(() => storedState?.canCashOut ?? false);
  const [betError, setBetError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultSummary, setResultSummary] = useState<MinesResultSummary | null>(() => storedState?.resultSummary ?? null);
  const [explodedIndex, setExplodedIndex] = useState<number | null>(() => (storedState as any)?.explodedIndex ?? null);
  const [history, setHistory] = useState<MinesHistoryEntry[]>(() => storedState?.history ?? []);
  const [stats, setStats] = useState<MinesStats>(() => storedState?.stats ?? initialStats);
  const totalSafeTiles = 25 - mineCount;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const payload = {
      betAmount,
      mineCount,
      board,
      status,
      safePicks,
      multiplier,
      profit,
      canCashOut,
      resultSummary,
      explodedIndex,
      history,
      stats,
    };
    window.localStorage.setItem(MINES_STATE_STORAGE_KEY, JSON.stringify(payload));
  }, [betAmount, mineCount, board, status, safePicks, multiplier, profit, canCashOut, resultSummary, history, stats]);

  useEffect(() => {
    if (history.length === 0) {
      setStats(initialStats);
      return;
    }

    const gamesPlayed = history.length;
    const wins = history.filter((entry) => entry.outcome === 'win').length;
    const winRate = Number(((wins / gamesPlayed) * 100).toFixed(1));
    const averageMultiplier = Number((history.reduce((sum, entry) => sum + entry.multiplier, 0) / gamesPlayed).toFixed(2));
    const highestCashout = Number(history.reduce((max, entry) => {
      if (entry.outcome === 'win') return Math.max(max, entry.bet * entry.multiplier);
      return max;
    }, 0).toFixed(2));
    const bestStreak = history.reduce((streak, entry) => {
      if (entry.outcome === 'win') return streak + 1;
      return 0;
    }, 0);
    const largestWin = Number(history.reduce((max, entry) => (entry.outcome === 'win' ? Math.max(max, entry.profit) : max), 0).toFixed(2));

    setStats({
      gamesPlayed,
      winRate,
      averageMultiplier,
      highestCashout,
      bestStreak,
      largestWin,
    });
  }, [history]);

  const payout = useMemo(() => Number((betAmount * multiplier).toFixed(2)), [betAmount, multiplier]);
  const remainingTiles = board.filter((tile) => !tile.revealed).length;
  const previewMultiplier = useMemo(() => getMinesMultiplier(mineCount, 0), [mineCount]);
  const previewPayout = useMemo(() => Number((betAmount * previewMultiplier).toFixed(2)), [betAmount, previewMultiplier]);
  const riskLabel = useMemo(() => getMinesRiskLabel(mineCount), [mineCount]);

  const appendHistory = (entry: MinesHistoryEntry) => {
    setHistory((current) => [entry, ...current].slice(0, HISTORY_LIMIT));
  };

  const resetRound = () => {
    setBoard(createMinesBoard(25, mineCount));
    setStatus('idle');
    setSafePicks(0);
    setMultiplier(1);
    setProfit(0);
    setCanCashOut(false);
    setBetError('');
    setIsLoading(false);
    setResultSummary(null);
    setExplodedIndex(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(MINES_STATE_STORAGE_KEY);
    }
  };

  const startGame = () => {
    const cleanedBet = Number(betAmount);

    if (Number.isNaN(cleanedBet) || cleanedBet <= 0) {
      setBetError('Enter a valid stake amount.');
      return;
    }

    if (!canAfford(cleanedBet)) {
      setBetError('Your balance is too low.');
      return;
    }

    setBetError('');
    setStatus('loading');
    setIsLoading(true);
    setBoard(createMinesBoard(25, mineCount));
    setSafePicks(0);
    setMultiplier(1);
    setProfit(0);
    setCanCashOut(false);
    setResultSummary(null);
    setExplodedIndex(null);
    deduct(cleanedBet);
    playStart();

    window.setTimeout(() => {
      const nextBoard = createMinesBoard(25, mineCount);
      setBoard(nextBoard);
      setStatus('playing');
      setIsLoading(false);
    }, 500);
  };

  const revealTile = (tileIndex: number) => {
    if (status !== 'playing') return;
    if (!board[tileIndex]) return;
    if (board[tileIndex].revealed) return;

    const tile = board[tileIndex];
    if (tile.isMine) {
      setExplodedIndex(tileIndex);
      const revealedBoard = board.map((entry) => ({
        ...entry,
        revealed: true,
      }));
      setBoard(revealedBoard);
      setStatus('lost');
      setCanCashOut(false);
      setProfit(-betAmount);
      setResultSummary(null);
      appendHistory({
        id: Date.now(),
        bet: betAmount,
        mineCount,
        safePicks,
        multiplier,
        profit: -betAmount,
        outcome: 'loss',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      playMine();
      return;
    }

    const nextSafePicks = safePicks + 1;
    const totalSafeTiles = 25 - mineCount;
    const isGameWon = nextSafePicks === totalSafeTiles;
    const nextMultiplier = getMinesMultiplier(mineCount, nextSafePicks);
    const completionMultiplier = isGameWon ? nextMultiplier + 10 : nextMultiplier;
    const nextProfit = Number((betAmount * completionMultiplier - betAmount).toFixed(2));

    setBoard((current) => current.map((entry, index) => (index === tileIndex ? { ...entry, revealed: true } : entry)));
    setSafePicks(nextSafePicks);
    setMultiplier(completionMultiplier);
    setProfit(nextProfit);
    setCanCashOut(true);
    playReveal();

    if (isGameWon) {
      window.setTimeout(() => {
        playTowerComplete();
      }, 200);
    }
  };

  const cashOut = () => {
    if (status !== 'playing' || !canCashOut || safePicks === 0) return;
    const cashoutValue = Number((betAmount * multiplier).toFixed(2));
    const revealedBoard = board.map((entry) => ({
      ...entry,
      revealed: true,
    }));
    setBoard(revealedBoard);
    adjustBalance(cashoutValue);
    setStatus('cashedOut');
    setExplodedIndex(null);
    setCanCashOut(false);
    setResultSummary({ type: 'cashout', payout: cashoutValue, multiplier, safePicks });
    appendHistory({
      id: Date.now() + 1,
      bet: betAmount,
      mineCount,
      safePicks,
      multiplier,
      profit: Number((cashoutValue - betAmount).toFixed(2)),
      outcome: 'win',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    playCashout();
  };

  const halfBet = () => {
    setBetAmount((current) => Math.max(0.01, Number((current / 2).toFixed(2))));
  };

  const doubleBet = () => {
    setBetAmount((current) => Math.min(balance, Number((current * 2).toFixed(2))));
  };

  const updateMineCount = (value: number) => {
    if (status === 'playing' || status === 'loading') return;
    setMineCount(value);
    if (status === 'idle') {
      setBoard(createMinesBoard(25, value));
    }
  };

  return {
    balance,
    betAmount,
    setBetAmount,
    mineCount,
    setMineCount: updateMineCount,
    board,
    status,
    safePicks,
    multiplier,
    profit,
    canCashOut,
    betError,
    isLoading,
    resultSummary,
    history,
    stats,
    payout,
    remainingTiles,
    previewMultiplier,
    previewPayout,
    riskLabel,
    totalSafeTiles,
    startGame,
    revealTile,
    explodedIndex,
    cashOut,
    resetRound,
    halfBet,
    doubleBet,
    dismissResult: () => setResultSummary(null),
  };
}
