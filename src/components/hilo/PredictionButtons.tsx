import { Button } from '../ui/Button';
import { BetInput } from '../BetInput';
import type { Prediction } from '../../types/card';

interface PredictionButtonsProps {
  onPredict: (prediction: Prediction) => void;
  canPredict: boolean;
  isAnimating: boolean;
  higherChance: number;
  lowerChance: number;
  higherMultiplier: number;
  lowerMultiplier: number;
  betAmount?: number;
  setBetAmount?: (n: number) => void;
  canStart?: boolean;
  onStart?: () => void;
  canCashOut?: boolean;
  onCashOut?: () => void;
  stake?: number;
  currentMultiplier?: number;
  onHalf?: () => void;
  onDouble?: () => void;
}

export function PredictionButtons({ onPredict, canPredict, isAnimating, higherChance, lowerChance, higherMultiplier, lowerMultiplier, betAmount, setBetAmount, canStart, onStart, canCashOut, onCashOut, stake, currentMultiplier, onHalf, onDouble }: PredictionButtonsProps) {
  const formatChance = (c: number) => `${c.toFixed(2)}%`;
  const formatMult = (m: number) => (m > 0 ? `${m.toFixed(2)}x` : '—');
  const higherRecommended = higherChance >= 65 && higherChance >= lowerChance;
  const lowerRecommended = lowerChance >= 65 && lowerChance > higherChance;

  return (
    <div className="space-y-3.5 rounded-[20px] border border-white/10 bg-[#03080C]/80 p-4 backdrop-blur-md">
      {typeof setBetAmount === 'function' ? (
        <div className="mb-2 space-y-2">
          <BetInput value={betAmount ?? 0} onChange={setBetAmount} onHalf={onHalf} onDouble={onDouble} />
        </div>
      ) : null}
      <div className="grid grid-cols-2 gap-3">
        <div className={`space-y-2 rounded-[16px] border p-3 transition-all duration-300 ${higherRecommended ? 'border-[#10B981]/50 bg-[#10B981]/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-white/5 bg-[#0C202F]/40 hover:border-white/15'}`}>
          <Button
            variant="secondary"
            onClick={() => onPredict('higher')}
            disabled={!canPredict || isAnimating || higherChance === 0}
            className="w-full py-2.5 text-sm font-black tracking-wide border-[#00F5FF]/10 text-white hover:text-[#00F5FF]"
          >
            Higher ↑
          </Button>
          <div className="text-center text-xs font-black text-white">{formatChance(higherChance)}</div>
          <div className="rounded-full bg-[#03080C] border border-[#10B981]/20 px-2 py-1 text-center text-xs font-black text-[#10B981]">{formatMult(higherMultiplier)}</div>
          {higherRecommended ? <div className="text-center text-[10px] uppercase tracking-[0.24em] text-[#10B981] font-bold animate-pulse">Recommended</div> : null}
        </div>

        <div className={`space-y-2 rounded-[16px] border p-3 transition-all duration-300 ${lowerRecommended ? 'border-[#10B981]/50 bg-[#10B981]/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-white/5 bg-[#0C202F]/40 hover:border-white/15'}`}>
          <Button
            variant="secondary"
            onClick={() => onPredict('lower')}
            disabled={!canPredict || isAnimating || lowerChance === 0}
            className="w-full py-2.5 text-sm font-black tracking-wide border-[#00F5FF]/10 text-white hover:text-[#00F5FF]"
          >
            Lower ↓
          </Button>
          <div className="text-center text-xs font-black text-white">{formatChance(lowerChance)}</div>
          <div className="rounded-full bg-[#03080C] border border-[#10B981]/20 px-2 py-1 text-center text-xs font-black text-[#10B981]">{formatMult(lowerMultiplier)}</div>
          {lowerRecommended ? <div className="text-center text-[10px] uppercase tracking-[0.24em] text-[#10B981] font-bold animate-pulse">Recommended</div> : null}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <Button
          fullWidth
          className={`py-5 transition-all duration-300 rounded-[16px] font-black ${
            !canStart || isAnimating || !(betAmount && betAmount > 0)
              ? 'opacity-40 cursor-not-allowed'
              : 'shadow-[0_8px_25px_rgba(0,245,255,0.25)] hover:shadow-[0_12px_35px_rgba(0,245,255,0.45)]'
          }`}
          onClick={onStart}
          disabled={!canStart || isAnimating || !(betAmount && betAmount > 0)}
        >
          {`Bet $${((betAmount ?? 0)).toFixed(2)}`}
        </Button>
        <Button
          fullWidth
          className={`h-11 min-h-11 px-5 py-0 text-sm font-bold tracking-wide transition-all duration-300 rounded-[16px] ${
            canCashOut
              ? 'bg-gradient-to-r from-[#00F5FF] via-[#14B8A6] to-[#00F5FF] text-[#03080C] font-black shadow-[0_0_30px_rgba(0,245,255,0.55)] hover:shadow-[0_0_45px_rgba(0,245,255,0.7)] hover:scale-[1.04] border-none animate-pulse'
              : 'opacity-40 cursor-not-allowed border border-[#00F5FF]/20 text-[#00F5FF] bg-[#00F5FF]/5'
          }`}
          variant={canCashOut ? 'primary' : 'outline'}
          onClick={onCashOut}
          disabled={!canCashOut || isAnimating}
        >
          {canCashOut ? (
            <span className="flex flex-col items-center justify-center leading-[1.1] whitespace-normal text-center">
              <span className="text-[9px] uppercase tracking-widest font-bold text-[#03080C]/80">Instant Cashout</span>
              <span className="text-xs font-black">${((stake ?? 0) * (currentMultiplier ?? 1)).toFixed(2)} ({(currentMultiplier ?? 1).toFixed(2)}×)</span>
            </span>
          ) : (
            'Cashout'
          )}
        </Button>
      </div>
    </div>
  );
}
