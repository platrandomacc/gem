import { CoinSide } from '../../types/coin';
import { BetInput } from '../BetInput';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface CoinControlsProps {
  bet: number;
  setBet: (value: number) => void;
  selectedSide: CoinSide;
  setSelectedSide: (value: CoinSide) => void;
  currentMultiplier: number;
  potentialPayout: number;
  status: 'idle' | 'flipping' | 'won' | 'lost';
  message: string;
  error: string | null;
  isFlipping: boolean;
  canFlip: boolean;
  startFlip: () => void;
}

export function CoinControls({
  bet,
  setBet,
  selectedSide,
  setSelectedSide,
  currentMultiplier,
  potentialPayout,
  status,
  message,
  error,
  isFlipping,
  canFlip,
  startFlip,
}: CoinControlsProps) {
  return (
    <div className="space-y-3.5">
      <Card className="rounded-[22px] border-white/10 bg-[#03080C]/80 p-4 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#00F5FF] font-black">Flip Controls</p>
            </div>
            <div className="rounded-full bg-[#00F5FF]/10 border border-[#00F5FF]/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#00F5FF] shadow-[0_0_12px_rgba(0,245,255,0.1)]">
              ×{currentMultiplier.toFixed(2)} Mult
            </div>
          </div>

          <BetInput value={bet} onChange={setBet} />

          {/* Cinematic Side Selector */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#7DD3FC]/50 font-black">Target Side</span>
            <div className="grid gap-2.5 grid-cols-2">
              {(['heads', 'tails'] as const).map((value) => {
                const isSelected = selectedSide === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSelectedSide(value)}
                    className={`relative rounded-2xl border px-4 py-3 text-xs font-black tracking-widest uppercase transition-all duration-200 ${
                      isSelected
                        ? 'border-[#00F5FF] bg-gradient-to-r from-[#00F5FF]/15 to-[#14B8A6]/10 text-white shadow-[0_0_20px_rgba(0,245,255,0.2)] scale-[1.02]'
                        : 'border-white/5 bg-[#0C202F]/30 text-[#7DD3FC]/70 hover:border-[#00F5FF]/30 hover:bg-[#0C202F]/60'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F5FF] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00F5FF]"></span>
                      </span>
                    )}
                    {value === 'heads' ? 'Heads' : 'Tails'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Premium Cyber Payout Grid */}
          <div className="grid gap-2 sm:grid-cols-2 pt-2 border-t border-white/5">
            <div className="rounded-[16px] border border-white/5 bg-[#0C202F]/40 p-3">
              <p className="text-[9px] uppercase tracking-[0.24em] text-[#7DD3FC]/60 font-bold">Estimated Payout</p>
              <p className="mt-1 text-xl font-black text-white">${potentialPayout.toFixed(2)}</p>
            </div>
            <div className="rounded-[16px] border border-white/5 bg-[#0C202F]/40 p-3">
              <p className="text-[9px] uppercase tracking-[0.24em] text-[#00F5FF] font-bold">Net Profit</p>
              <p className="mt-1 text-xl font-black text-[#00F5FF]">${(potentialPayout - bet).toFixed(2)}</p>
            </div>
          </div>

          {/* System Messages */}
          <div className="space-y-1">
            <p className="text-[10px] text-[#7DD3FC]/80 font-bold flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00F5FF]" />
              {message || "Choose a side and flip"}
            </p>
            {error && <p className="text-[10px] text-red-400 font-bold flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              {error}
            </p>}
          </div>

          <div className="grid gap-2">
            <Button
              onClick={startFlip}
              disabled={!canFlip || isFlipping}
              className={`w-full py-5 rounded-[16px] text-sm font-black tracking-widest transition-all duration-200 ${
                !canFlip || isFlipping
                  ? 'opacity-40 cursor-not-allowed'
                  : 'shadow-[0_8px_25px_rgba(0,245,255,0.25)] hover:shadow-[0_12px_35px_rgba(0,245,255,0.45)]'
              }`}
              variant="primary"
            >
              {isFlipping ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#03080C] border-t-transparent" />
                  FLIPPING…
                </span>
              ) : (
                `Bet $${bet.toFixed(2)}`
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
