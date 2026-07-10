import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { TargetSelector } from './TargetSelector';
import { BetInput } from '../BetInput';

interface BetControlsProps {
  betAmount: number;
  onBetChange: (value: number) => void;
  targetMultiplier: number;
  onTargetChange: (value: number) => void;
  onPlay: () => void;
  onCashout?: () => void;
  inputDisabled?: boolean;
  buttonDisabled?: boolean;
  error?: string;
}

export function BetControls({
  betAmount,
  onBetChange,
  targetMultiplier,
  onTargetChange,
  onPlay,
  onCashout,
  inputDisabled = false,
  buttonDisabled = false,
  error,
}: BetControlsProps) {
 
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 rounded-[22px] border border-white/10 bg-[#03080C]/80 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-5">
      <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#00F5FF] font-black">Limbo Console</p>
          <p className="mt-0.5 text-xs text-[#7DD3FC]/60">Configure wager and payout parameters.</p>
        </div>
        <div className="rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#00F5FF] uppercase tracking-widest flex items-center gap-1">
          <span className="h-1 w-1 bg-[#00F5FF] rounded-full animate-pulse" />
          Live
        </div>
      </div>

      <div className="space-y-4">
        <BetInput value={betAmount} onChange={onBetChange} disabled={inputDisabled} />

        <TargetSelector value={targetMultiplier} onChange={onTargetChange} disabled={inputDisabled} />
      </div>

      {inputDisabled && typeof onCashout === 'function' ? (
        <Button
          fullWidth
          onClick={onCashout}
          className="h-11 min-h-11 px-5 py-0 text-sm font-bold tracking-wide bg-gradient-to-r from-[#00F5FF] via-[#14B8A6] to-[#00F5FF] text-[#03080C] shadow-[0_0_30px_rgba(0,245,255,0.45)] hover:shadow-[0_0_45px_rgba(0,245,255,0.65)] hover:scale-[1.03] border-none animate-pulse rounded-[16px]"
        >
          <span className="flex flex-col items-center justify-center leading-[1.1] whitespace-normal text-center">
            <span className="text-[9px] uppercase tracking-widest opacity-80 font-bold text-[#03080C]">Instant Cashout</span>
            <span className="text-xs font-black">${(betAmount * targetMultiplier).toFixed(2)}</span>
          </span>
        </Button>
      ) : (
        <Button
          fullWidth
          onClick={onPlay}
          disabled={buttonDisabled}
          className={`h-12 text-sm sm:text-base rounded-[16px] font-black tracking-widest ${
            buttonDisabled
              ? 'opacity-40 cursor-not-allowed'
              : 'shadow-[0_8px_25px_rgba(0,245,255,0.25)] hover:shadow-[0_12px_35px_rgba(0,245,255,0.45)]'
          }`}
        >
          {`Bet $${betAmount.toFixed(2)}`}
        </Button>
      )}

      {error ? (
        <p className="text-xs font-bold text-red-400 flex items-center gap-1.5 pl-1">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
          {error}
        </p>
      ) : null}
    </motion.div>
  );
}
