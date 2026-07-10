import { useEffect, useState } from 'react';
import { difficultyModes, getPotentialPayout, TowerDifficulty } from '../utils/multipliers';
import { generateTower, TowerFloor } from '../utils/towerGenerator';
import { useWallet } from './useWallet';

export type TowerGameStatus = 'idle' | 'playing' | 'lost' | 'won' | 'cashed';

export interface TowerResultSummary {
  type: 'won' | 'cashed';
  payout: number;
  multiplier: number;
  tilesRevealed: number;
}

export interface TowerGameState {
  balance: number;
  bet: number;
  betError: string;
  difficulty: TowerDifficulty;
  tower: TowerFloor[];
  currentFloor: number;
  status: TowerGameStatus;
  message: string;
  payout: number;
  nextFloorMultiplier: number | null;
  canStart: boolean;
  canClimb: boolean;
  canCashOut: boolean;
}

const BALANCE_STORAGE_KEY = 'tower-balance';
const TOWER_STATE_KEY = 'tower-state';

export function useTowerGame() {
  const { balance, canAfford, deduct, adjustBalance } = useWallet(1000);
  const [bet, setBet] = useState<number>(10);
  const [betError, setBetError] = useState('');
  const [difficulty, setDifficulty] = useState<TowerDifficulty>('easy');
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [tower, setTower] = useState<TowerFloor[]>(() => generateTower('easy'));
  const [currentFloor, setCurrentFloor] = useState(-1);
  const [status, setStatus] = useState<TowerGameStatus>('idle');
  const [message, setMessage] = useState('Set your stake, choose a difficulty, and start the climb.');
  const [soundSrc, setSoundSrc] = useState<string | null>(null);
  const [resultSummary, setResultSummary] = useState<TowerResultSummary | null>(null);

  const queueSound = (src: string) => {
    setSoundSrc((current) => (current === src ? `${src}?t=${Date.now()}` : src));
  };

  // Persist important game state so refresh won't lose progress
  useEffect(() => {
    const raw = window.localStorage.getItem(TOWER_STATE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.tower) setTower(parsed.tower);
      if (typeof parsed.currentFloor === 'number') setCurrentFloor(parsed.currentFloor);
      if (parsed?.status) setStatus(parsed.status);
      if (parsed?.message) setMessage(parsed.message);
      if (typeof parsed.bet === 'number') setBet(parsed.bet);
      if (parsed?.resultSummary) setResultSummary(parsed.resultSummary);
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  // Save state whenever key parts change
  useEffect(() => {
    try {
      const toSave = JSON.stringify({
        bet,
        difficulty,
        tower,
        currentFloor,
        status,
        message,
        resultSummary,
      });
      window.localStorage.setItem(TOWER_STATE_KEY, toSave);
    } catch (e) {
      // ignore
    }
  }, [bet, difficulty, tower, currentFloor, status, message, resultSummary]);

  const difficultyMode = difficultyModes.find((item) => item.value === difficulty)!;

  const handleDifficultyChange = (nextDifficulty: TowerDifficulty) => {
    setDifficulty(nextDifficulty);
    if (status === 'idle' || status === 'lost' || status === 'won' || status === 'cashed') {
      setTower(generateTower(nextDifficulty));
    }
  };

  const startGame = () => {
    const cleanedBet = Number(bet);

    if (Number.isNaN(cleanedBet) || cleanedBet <= 0) {
      setBetError('Enter a valid stake amount.');
      return;
    }

    if (cleanedBet < 0) {
      setBetError('Stake cannot be negative.');
      return;
    }

    if (cleanedBet > balance) {
      setBetError('Your balance is too low for this bet.');
      return;
    }

    setBetError('');
    deduct(cleanedBet);
    setCurrentFloor(-1);
    setTower(generateTower(difficulty));
    setStatus('playing');
    setMessage('Your tower is ready. Climb to reveal each floor and secure your payout before the trap appears.');
    setSoundSrc(null);
    setResultSummary(null);
  };

  const climb = () => {
    // keep for compatibility: perform a random pick on climb
    randomPick();
  };

  const revealTile = (tileIndex: number) => {
    if (status !== 'playing') return;
    const nextIndex = currentFloor + 1;
    const nextFloor = tower[nextIndex];
    if (!nextFloor) return;

    if (nextFloor.revealedIndex !== null) return; // already revealed

    const isTrap = nextFloor.tiles[tileIndex]?.isTrap;

    const tilesRevealed = tower.filter((floor) => floor.revealedIndex !== null).length + 1;

    // reveal the chosen tile
    setTower((prev) => {
      const copy = prev.map((f) => ({ ...f }));
      copy[nextIndex] = { ...copy[nextIndex], revealedIndex: tileIndex };
      return copy;
    });

    if (isTrap) {
      setCurrentFloor(nextIndex);
      setStatus('lost');
      setMessage(`You picked a trap on ${nextFloor.label} and lost your stake.`);
      queueSound('/audios/losskey.mp3');
      return;
    }

    setCurrentFloor(nextIndex);
    const reachedSummit = nextIndex === tower.length - 1;

    if (reachedSummit) {
      const completion = difficultyMode.completionBonus ?? 1;
      const multiplier = nextFloor.multiplier * completion;
      const payout = getPotentialPayout(bet, multiplier);
      adjustBalance(payout);
      setResultSummary({ type: 'cashed', payout, multiplier, tilesRevealed });
      setStatus('cashed');
      setMessage(`Full tower completed! You automatically cashed out $${payout.toFixed(2)}. Place a new bet to start again.`);
      queueSound('/audios/towercomplete.mp3');
      return;
    }

    queueSound('/audios/safekey.mp3');
    setMessage(`Safe. You cleared ${nextFloor.label}. Choose to climb again or cash out.`);
  };

  const randomPick = () => {
    if (status !== 'playing') return;
    const nextIndex = currentFloor + 1;
    const nextFloor = tower[nextIndex];
    if (!nextFloor) return;

    // do nothing if already revealed
    if (nextFloor.revealedIndex !== null) return;

    const tileIndex = Math.floor(Math.random() * nextFloor.tiles.length);
    revealTile(tileIndex);
  };

  const halfBet = () => setBet((b) => Math.max(1, Math.floor(b / 2)));
  const doubleBet = () => setBet((b) => Math.min(balance, Math.floor(b * 2)));

  const cashOut = () => {
    if (status !== 'playing' && status !== 'won') return;
    if (currentFloor < 0) return;
    const completed = currentFloor === tower.length - 1;
    const completion = completed ? (difficultyMode.completionBonus ?? 1) : 1;
    const multiplier = tower[currentFloor].multiplier * completion;
    const payout = getPotentialPayout(bet, multiplier);
    const tilesRevealed = tower.filter((floor) => floor.revealedIndex !== null).length;
    adjustBalance(payout);
    setResultSummary({ type: 'cashed', payout, multiplier, tilesRevealed });
    setStatus('cashed');
    setMessage(`You cashed out at ${multiplier}× for $${payout.toFixed(2)}.`);
    queueSound('/audios/cashout.mp3');
  };

  const resetRound = () => {
    setTower(generateTower(difficulty));
    setCurrentFloor(-1);
    setStatus('idle');
    setMessage('Set your stake, choose a difficulty, and start the climb.');
    setBetError('');
    setSoundSrc(null);
    setResultSummary(null);
  };

  const currentMultiplier = (() => {
    if (currentFloor >= 0 && tower[currentFloor]) {
      const baseMultiplier = tower[currentFloor].multiplier;
      const completed = currentFloor === tower.length - 1 && status === 'won';
      return completed ? baseMultiplier * (difficultyMode.completionBonus ?? 1) : baseMultiplier;
    }
    return 1;
  })();
  const nextFloorMultiplier = tower[currentFloor + 1]?.multiplier ?? null;
  const payout = getPotentialPayout(bet, currentMultiplier);

  const canStart = status === 'idle' || status === 'lost' || status === 'won' || status === 'cashed';
  const canClimb = status === 'playing';
  const canCashOut = (status === 'playing' || status === 'won') && currentFloor >= 0;

  return {
    balance,
    bet,
    setBet,
    betError,
    difficulty,
    setDifficulty: handleDifficultyChange,
    difficultyMode,
    mode,
    setMode,
    tower,
    currentFloor,
    status,
    message,
    currentMultiplier,
    nextFloorMultiplier,
    payout,
    soundSrc,
    resultSummary,
    startGame,
    climb,
    revealTile,
    randomPick,
    cashOut,
    resetRound,
    dismissResult: () => setResultSummary(null),
    canStart,
    canClimb,
    canCashOut,
    halfBet,
    doubleBet,
  };
}
