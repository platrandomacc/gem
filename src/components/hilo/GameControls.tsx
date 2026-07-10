import { Button } from '../ui/Button';
import type { Prediction } from '../../types/card';
import { PredictionButtons } from './PredictionButtons';

interface GameControlsProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  stake: number;
  currentMultiplier: number;
  potentialPayout: number;
  profit: number;
  status: 'idle' | 'playing' | 'lost' | 'cashedOut';
  error: string;
  isAnimating: boolean;
  canStart: boolean;
  canPredict: boolean;
  canCashOut: boolean;
  higherChance: number;
  lowerChance: number;
  higherMultiplier: number;
  lowerMultiplier: number;
  onPredict: (prediction: Prediction) => void;
  onStart: () => void;
  onCashOut: () => void;
  onHalf: () => void;
  onDouble: () => void;
}

export function GameControls({
  betAmount,
  setBetAmount,
  stake,
  currentMultiplier,
  potentialPayout,
  profit,
  status,
  error,
  isAnimating,
  canStart,
  canPredict,
  canCashOut,
  higherChance,
  lowerChance,
  higherMultiplier,
  lowerMultiplier,
  onPredict,
  onStart,
  onCashOut,
  onHalf,
  onDouble,
}: GameControlsProps) {
  return (
    <div>

      <PredictionButtons
        onPredict={onPredict}
        canPredict={canPredict}
        isAnimating={isAnimating}
        higherChance={higherChance}
        lowerChance={lowerChance}
        higherMultiplier={higherMultiplier}
        lowerMultiplier={lowerMultiplier}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        canStart={canStart}
        onStart={onStart}
        canCashOut={canCashOut}
        onCashOut={onCashOut}
        stake={stake}
        currentMultiplier={currentMultiplier}
        onHalf={onHalf}
        onDouble={onDouble}
      />
    </div>
  );
}
