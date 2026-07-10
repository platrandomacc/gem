import { useEffect, useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { DollarSign } from 'lucide-react';

interface BetInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  onHalf?: () => void;
  onDouble?: () => void;
  disabled?: boolean;
}

export function BetInput({ value, onChange, error, onHalf, onDouble, disabled = false }: BetInputProps) {
  const [displayValue, setDisplayValue] = useState(value === 0 ? '' : String(value));
  const [focused, setFocused] = useState(false);
  const { balance } = useWallet();

  useEffect(() => {
    if (!focused) {
      setDisplayValue(value === 0 ? '' : String(value));
    }
  }, [value, focused]);

  const handleQuickAdd = (amount: number) => {
    if (disabled) return;
    const nextValue = Number((value + amount).toFixed(2));
    onChange(Math.min(balance, nextValue));
  };

  const handleMax = () => {
    if (disabled) return;
    onChange(Number(balance.toFixed(2)));
  };

  return (
    <div className="space-y-3.5">
      {/* Cinematic Bet Cockpit Input Panel */}
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-px rounded-[20px] bg-gradient-to-r from-[#00F5FF]/10 to-[#14B8A6]/5 opacity-70 blur-md transition duration-300 group-hover:opacity-100" />
        
        <div
          className={`relative flex flex-col gap-1.5 rounded-[20px] border bg-[#03080C]/90 p-4 transition-all duration-300 ${
            focused
              ? 'border-[#00F5FF] shadow-[0_0_25px_rgba(0,245,255,0.25)]'
              : 'border-white/10 hover:border-[#00F5FF]/40'
          } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#7DD3FC]/50 font-black">Active Wager</span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/20 shadow-[0_0_12px_rgba(0,245,255,0.15)]">
              <DollarSign size={16} className="animate-pulse" />
            </div>
            
            <input
              type="text"
              inputMode="decimal"
              value={displayValue}
              disabled={disabled}
              onChange={(event) => {
                const rawValue = event.target.value;
                if (/^\d*\.?\d*$/.test(rawValue)) {
                  setDisplayValue(rawValue);
                  const nextValue = rawValue === '' ? 0 : Number(rawValue);
                  if (!Number.isNaN(nextValue)) {
                    onChange(nextValue);
                  }
                }
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full bg-transparent text-2xl font-black text-white outline-none placeholder:text-[#1F3345] tracking-wide"
              placeholder="0.00"
            />

            <span className="text-xs font-black tracking-widest text-[#03080C] bg-gradient-to-r from-[#00F5FF] to-[#14B8A6] px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(0,245,255,0.25)]">
              USD
            </span>
          </div>
        </div>
      </div>

      {/* Cinematic Bet Modifier Matrix */}
      <div className="grid gap-2">
        <div className="flex flex-wrap gap-1.5">
          {onHalf && (
            <button
              type="button"
              onClick={onHalf}
              disabled={disabled}
              className="flex-1 min-h-[36px] rounded-[14px] border border-white/5 bg-[#071520] text-xs font-black text-[#7DD3FC]/80 transition duration-150 hover:border-[#00F5FF]/40 hover:bg-[#0C202F] hover:text-[#00F5FF] active:scale-[0.96] disabled:opacity-30"
            >
              ½
            </button>
          )}
          {onDouble && (
            <button
              type="button"
              onClick={onDouble}
              disabled={disabled}
              className="flex-1 min-h-[36px] rounded-[14px] border border-white/5 bg-[#071520] text-xs font-black text-[#7DD3FC]/80 transition duration-150 hover:border-[#00F5FF]/40 hover:bg-[#0C202F] hover:text-[#00F5FF] active:scale-[0.96] disabled:opacity-30"
            >
              2×
            </button>
          )}
          <button
            type="button"
            onClick={() => handleQuickAdd(5)}
            disabled={disabled}
            className="flex-1 min-h-[36px] rounded-[14px] border border-white/5 bg-[#071520] text-xs font-black text-[#7DD3FC]/80 transition duration-150 hover:border-[#00F5FF]/40 hover:bg-[#0C202F] hover:text-[#00F5FF] active:scale-[0.96] disabled:opacity-30"
          >
            +$5
          </button>
          <button
            type="button"
            onClick={() => handleQuickAdd(20)}
            disabled={disabled}
            className="flex-1 min-h-[36px] rounded-[14px] border border-white/5 bg-[#071520] text-xs font-black text-[#7DD3FC]/80 transition duration-150 hover:border-[#00F5FF]/40 hover:bg-[#0C202F] hover:text-[#00F5FF] active:scale-[0.96] disabled:opacity-30"
          >
            +$20
          </button>
          <button
            type="button"
            onClick={handleMax}
            disabled={disabled}
            className="flex-[1.2] min-h-[36px] rounded-[14px] border border-[#00F5FF]/20 bg-[#00F5FF]/5 text-xs font-black uppercase tracking-widest text-[#00F5FF] transition duration-150 hover:bg-[#00F5FF]/15 hover:border-[#00F5FF]/50 active:scale-[0.96] disabled:opacity-30"
          >
            MAX
          </button>
        </div>
      </div>

      {error ? (
        <p className="text-xs font-bold text-red-400 animate-pulse pl-1 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

