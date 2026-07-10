import { BetInput } from '../BetInput';
import { Button } from '../ui/Button';
import { Dropdown } from '../ui/Dropdown';

interface GameControlsProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  mineCount: number;
  setMineCount: (value: number) => void;
  betError: string;
  previewMultiplier: number;
  previewPayout: number;
  riskLabel: string;
  canStart: boolean;
  canCashOut: boolean;
  cashoutAmount: number;
  cashoutMultiplier: number;
  isLoading: boolean;
  onStart: () => void;
  onCashOut: () => void;
  onHalfBet: () => void;
  onDoubleBet: () => void;
}

const mineOptions = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10', value: '10' },
  { label: '12', value: '12' },
  { label: '16', value: '16' },
  { label: '20', value: '20' },
  { label: '24', value: '24' },
];

export function GameControls({
  betAmount,
  setBetAmount,
  mineCount,
  setMineCount,
  betError,
  previewMultiplier,
  previewPayout,
  riskLabel,
  canStart,
  canCashOut,
  cashoutAmount,
  cashoutMultiplier,
  isLoading,
  onStart,
  onCashOut,
  onHalfBet,
  onDoubleBet,
}: GameControlsProps) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-[#03080C]/80 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#00F5FF] font-black">Wager Parameters</p>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#7DD3FC]/50 font-black">Minefield</span>
        </div>

        <div className="space-y-3">
          <BetInput value={betAmount} onChange={setBetAmount} error={betError} onHalf={onHalfBet} onDouble={onDoubleBet} disabled={isLoading} />
          
          <div className="relative group">
            <Dropdown label="Mines count" options={mineOptions} value={String(mineCount)} onChange={(value) => setMineCount(Number(value))} disabled={isLoading} />
          </div>
        </div>

        {/* Cinematic Active/In-Game Risk Telemetry */}
        <div className="grid gap-2 sm:grid-cols-2 pt-2 border-t border-white/5">
          <div className="rounded-[16px] border border-white/5 bg-[#0C202F]/40 p-3">
            <p className="text-[9px] uppercase tracking-[0.24em] text-[#7DD3FC]/60 font-bold">Risk profile</p>
            <p className="mt-1 text-sm font-black text-white">{riskLabel}</p>
          </div>
          <div className="rounded-[16px] border border-white/5 bg-[#0C202F]/40 p-3">
            <p className="text-[9px] uppercase tracking-[0.24em] text-[#00F5FF]/90 font-bold">Next tile payout</p>
            <p className="mt-1 text-sm font-black text-[#00F5FF]">{previewMultiplier.toFixed(2)}× (${previewPayout.toFixed(2)})</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2">
          <Button
            onClick={onStart}
            disabled={!canStart || isLoading}
            fullWidth
            className={`text-sm py-5 transition-all duration-300 rounded-[16px] font-black tracking-widest uppercase ${
              !canStart && !isLoading
                ? 'opacity-40 cursor-not-allowed'
                : 'shadow-[0_8px_25px_rgba(0,245,255,0.25)] hover:shadow-[0_12px_35px_rgba(0,245,255,0.45)]'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#03080C] border-t-transparent" />
                PLACING...
              </span>
            ) : (
              `Bet $${betAmount.toFixed(2)}`
            )}
          </Button>
          <Button
            variant={canCashOut ? 'primary' : 'secondary'}
            onClick={onCashOut}
            disabled={!canCashOut || isLoading}
            fullWidth
            className={`h-11 min-h-11 px-5 py-0 text-sm font-bold tracking-wide transition-all duration-300 rounded-[16px] ${
              canCashOut
                ? 'bg-gradient-to-r from-[#00F5FF] via-[#14B8A6] to-[#00F5FF] text-[#03080C] font-black shadow-[0_0_30px_rgba(0,245,255,0.55)] hover:shadow-[0_0_45px_rgba(0,245,255,0.7)] hover:scale-[1.04] border-none animate-pulse'
                : 'opacity-40 cursor-not-allowed'
            }`}
          >
            {canCashOut ? (
              <span className="flex flex-col items-center justify-center leading-[1.1] whitespace-normal text-center">
                <span className="text-[9px] uppercase tracking-widest opacity-80 font-bold text-[#03080C]">Instant Cashout</span>
                <span className="text-xs font-black">${cashoutAmount.toFixed(2)} ({cashoutMultiplier.toFixed(2)}×)</span>
              </span>
            ) : (
              'Cashout'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
