import { useEffect, useMemo, useRef, useState } from 'react';
import { useWallet } from './useWallet';
import { createLimboSeed, generateLimboRoll, formatMultiplier } from '../utils/limboRandom';
import { playLose, playSpin, playWin } from '../utils/soundHooks';
import { playCashout } from '../utils/soundHooks';
import type { LimboHistoryEntry, LimboRoundResult, LimboStats, LimboStatus } from '../types/limbo';

const HISTORY_LIMIT = 10;
const STORAGE_KEY = 'limbo-state';

const initialStats: LimboStats = {
  totalGames: 0,
  winRate: 0,
  biggestWin: 0,
  highestMultiplier: 1,
  averageMultiplier: 1,
};

interface StoredLimboState {
  betAmount?: number;
  targetMultiplier?: number;
  status?: LimboStatus;
  roundResult?: LimboRoundResult | null;
  history?: LimboHistoryEntry[];
  stats?: LimboStats;
  seed?: string;
  nonce?: number;
  error?: string;
}

function readStoredLimboState() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredLimboState;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}
export function useLimbo() {
  const { balance, canAfford, deduct, adjustBalance } = useWallet(1000);
  const storedState = readStoredLimboState();

  const [betAmount, setBetAmount] = useState<number>(() => storedState?.betAmount ?? 10);
  const [status, setStatus] = useState<LimboStatus>(() => (storedState?.status === 'rolling' ? 'idle' : storedState?.status ?? 'idle'));
  const [targetMultiplier, setTargetMultiplier] = useState<number>(() => storedState?.targetMultiplier ?? 2);
  // No target multiplier - Limbo now generates a single final multiplier per round
  const [roundResult, setRoundResult] = useState<LimboRoundResult | null>(() => storedState?.roundResult ?? null);
  const [inFlightMultiplier, setInFlightMultiplier] = useState<number | null>(null);
  const [cashoutSummary, setCashoutSummary] = useState<{ payout: number; multiplier: number } | null>(null);
  const [history, setHistory] = useState<LimboHistoryEntry[]>(() => storedState?.history ?? []);
  const [stats, setStats] = useState<LimboStats>(() => storedState?.stats ?? initialStats);
  const [error, setError] = useState<string>(() => storedState?.error ?? '');
  const [seed, setSeed] = useState<string>(() => storedState?.seed ?? createLimboSeed());
  const [nonce, setNonce] = useState<number>(() => storedState?.nonce ?? 1);
  const statusRef = useRef(status);
  const activeRoundRef = useRef<{ timerId: number | null; fallbackTimerId: number | null; settled: boolean; spinAudio: HTMLAudioElement | null }>({ timerId: null, fallbackTimerId: null, settled: false, spinAudio: null });

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const payload = {
      betAmount,
      targetMultiplier,
      status,
      roundResult,
      history,
      stats,
      seed,
      nonce,
      error,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [betAmount, targetMultiplier, status, roundResult, history, stats, seed, nonce, error]);

  useEffect(() => {
    if (history.length === 0) {
      setStats(initialStats);
      return;
    }

    const totalGames = history.length;
    const wins = history.filter((entry) => entry.outcome === 'win').length;
    const winRate = Number(((wins / totalGames) * 100).toFixed(1));
    const biggestWin = Number(history.reduce((max, entry) => Math.max(max, entry.profit), 0).toFixed(2));
    const highestMultiplier = Number(history.reduce((max, entry) => Math.max(max, entry.rolledMultiplier), 1).toFixed(2));
    const averageMultiplier = Number((history.reduce((sum, entry) => sum + entry.rolledMultiplier, 0) / totalGames).toFixed(2));

    setStats({
      totalGames,
      winRate,
      biggestWin,
      highestMultiplier,
      averageMultiplier,
    });
  }, [history]);

  const canPlay = useMemo(() => status !== 'rolling' && betAmount > 0 && canAfford(betAmount), [betAmount, canAfford, status]);
  const payoutPreview = useMemo(() => Number((betAmount * targetMultiplier).toFixed(2)), [betAmount, targetMultiplier]);
  const profitPreview = useMemo(() => Number((payoutPreview - betAmount).toFixed(2)), [betAmount, payoutPreview]);

  const appendHistory = (entry: LimboHistoryEntry) => {
    setHistory((current) => [entry, ...current].slice(0, HISTORY_LIMIT));
  };

  const finalizeRound = (nextNonce: number, roll: ReturnType<typeof generateLimboRoll>, cleanedBet: number, target: number, seedValue: string) => {
    if (activeRoundRef.current.settled) return;
    activeRoundRef.current.settled = true;
    if (activeRoundRef.current.timerId) {
      window.clearTimeout(activeRoundRef.current.timerId);
      activeRoundRef.current.timerId = null;
    }
    if (activeRoundRef.current.fallbackTimerId) {
      window.clearTimeout(activeRoundRef.current.fallbackTimerId);
      activeRoundRef.current.fallbackTimerId = null;
    }
    if (activeRoundRef.current.spinAudio) {
      activeRoundRef.current.spinAudio.pause();
      activeRoundRef.current.spinAudio.currentTime = 0;
      activeRoundRef.current.spinAudio = null;
    }

    const won = roll.rolledMultiplier >= target;
    const payout = won ? Number((cleanedBet * target).toFixed(2)) : 0;
    const profit = won ? Number((payout - cleanedBet).toFixed(2)) : Number((-cleanedBet).toFixed(2));

    if (won) {
      adjustBalance(payout);
      playCashout();
      setCashoutSummary({ payout, multiplier: target });
    }

    const entry: LimboHistoryEntry = {
      id: `${Date.now()}-${nextNonce}`,
      bet: cleanedBet,
      targetMultiplier: target,
      rolledMultiplier: roll.rolledMultiplier,
      payout,
      profit,
      outcome: won ? 'win' : 'loss',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      nonce: nextNonce,
    };

    appendHistory(entry);
    setRoundResult({
      seed: seedValue,
      nonce: nextNonce,
      targetMultiplier: target,
      rolledMultiplier: roll.rolledMultiplier,
      payout,
      profit,
      won,
      hash: roll.hash,
    });
    setStatus('result');
    setInFlightMultiplier(null);
    setNonce(nextNonce);
    if (won) {
      playWin();
    } else {
      playLose();
    }
  };

  const dismissCashoutSummary = () => setCashoutSummary(null);

  const playRound = () => {
    const cleanedBet = Number(betAmount);

    if (Number.isNaN(cleanedBet) || cleanedBet <= 0) {
      setError('Enter a valid stake amount.');
      return;
    }

    if (!canAfford(cleanedBet)) {
      setError('Insufficient balance for this round.');
      setStatus('idle');
      setRoundResult(null);
      return;
    }

    setError('');
    setStatus('rolling');
    setRoundResult(null);
    activeRoundRef.current.settled = false;
    deduct(cleanedBet);
    const spinAudio = playSpin();
    if (spinAudio) {
      activeRoundRef.current.spinAudio = spinAudio;
    }

    const nextNonce = nonce + 1;
    const roll = generateLimboRoll(seed, nextNonce);
    setInFlightMultiplier(roll.rolledMultiplier);

    if (activeRoundRef.current.timerId) {
      window.clearTimeout(activeRoundRef.current.timerId);
    }
    if (activeRoundRef.current.fallbackTimerId) {
      window.clearTimeout(activeRoundRef.current.fallbackTimerId);
    }

    activeRoundRef.current.timerId = window.setTimeout(() => {
      finalizeRound(nextNonce, roll, cleanedBet, targetMultiplier, seed);
    }, 1600);

    activeRoundRef.current.fallbackTimerId = window.setTimeout(() => {
      if (statusRef.current === 'rolling' && !activeRoundRef.current.settled) {
        finalizeRound(nextNonce, roll, cleanedBet, targetMultiplier, seed);
      }
    }, 2400);
  };

  const setSafeBetAmount = (value: number) => {
    if (status === 'rolling') return;
    const parsedValue = Number.isFinite(value) ? value : 0;
    setBetAmount(Math.max(0.01, Number(parsedValue.toFixed(2))));
  };

  const setSafeTargetMultiplier = (value: number) => {
    if (status === 'rolling') return;
    const parsedValue = Number.isFinite(value) ? value : 1;
    setTargetMultiplier(Math.max(1.01, Number(parsedValue.toFixed(2))));
  };

  const cashoutNow = () => {
    if (status !== 'rolling') return;
    // Stop timer and finalize as if rolledMultiplier == target (player cashed out successfully)
    if (activeRoundRef.current.timerId) {
      window.clearTimeout(activeRoundRef.current.timerId);
      activeRoundRef.current.timerId = null;
    }
    // Create a synthetic roll where rolledMultiplier equals target
    const syntheticRoll = { rolledMultiplier: targetMultiplier, hash: 'CASHOUT' } as ReturnType<typeof generateLimboRoll>;
    finalizeRound(nonce + 1, syntheticRoll, betAmount, targetMultiplier, seed);
  };

  const resetRound = () => {
    if (activeRoundRef.current.timerId) {
      window.clearTimeout(activeRoundRef.current.timerId);
      activeRoundRef.current.timerId = null;
    }
    if (activeRoundRef.current.fallbackTimerId) {
      window.clearTimeout(activeRoundRef.current.fallbackTimerId);
      activeRoundRef.current.fallbackTimerId = null;
    }
    if (activeRoundRef.current.spinAudio) {
      activeRoundRef.current.spinAudio.pause();
      activeRoundRef.current.spinAudio.currentTime = 0;
      activeRoundRef.current.spinAudio = null;
    }
    activeRoundRef.current.settled = true;
    setStatus('idle');
    setRoundResult(null);
    setError('');
    setSeed(createLimboSeed());
    setNonce(1);
  };

  useEffect(() => () => {
    if (activeRoundRef.current.timerId) {
      window.clearTimeout(activeRoundRef.current.timerId);
    }
    if (activeRoundRef.current.spinAudio) {
      activeRoundRef.current.spinAudio.pause();
      activeRoundRef.current.spinAudio.currentTime = 0;
    }
  }, []);

  return {
    balance,
    betAmount,
    setBetAmount: setSafeBetAmount,
    targetMultiplier,
    setTargetMultiplier: setSafeTargetMultiplier,
    status,
    roundResult,
    cashoutSummary,
    dismissCashoutSummary,
    history,
    stats,
    error,
    isRolling: status === 'rolling',
    payoutPreview,
    profitPreview,
    canPlay,
    playRound,
    cashoutNow,
    resetRound,
    seed,
    nonce,
    rollingMultiplier: inFlightMultiplier,
    formattedRollingTarget: roundResult ? formatMultiplier(roundResult.rolledMultiplier) : (inFlightMultiplier != null ? formatMultiplier(inFlightMultiplier) : formatMultiplier(1)),
  };
}
