import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { calculateTargetFromChance, calculateWinChance } from '../../utils/limboRandom';

interface TargetSelectorProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const quickTargets = [1.2, 1.5, 2, 5, 10, 20];

export function TargetSelector({ value, onChange, disabled = false }: TargetSelectorProps) {
  const [chanceInput, setChanceInput] = useState<number>(calculateWinChance(value));

  useEffect(() => {
    setChanceInput(calculateWinChance(value));
  }, [value]);

  const formattedChance = useMemo(() => `${calculateWinChance(value).toFixed(2)}%`, [value]);

  const handleChanceChange = (nextChance: number) => {
    setChanceInput(nextChance);
    if (!Number.isFinite(nextChance)) return;
    onChange(calculateTargetFromChance(nextChance));
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3.5 lg:grid-cols-[1.5fr_1fr]">
        <div className="relative group">
          <div className="flex items-center justify-between">
            <label htmlFor="target-multiplier" className="text-xs font-black uppercase tracking-[0.2em] text-[#7DD3FC]/70">
              Target Multiplier
            </label>
            <span className="rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/10 px-2.5 py-0.5 text-xs font-black text-[#00F5FF] shadow-[0_0_12px_rgba(0,245,255,0.15)]">
              {value.toFixed(2)}×
            </span>
          </div>
          <motion.input
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            id="target-multiplier"
            type="text"
            inputMode="decimal"
            value={value === 0 ? '' : value}
            onChange={(event) => {
              const rawValue = event.target.value;
              if (/^\d*\.?\d*$/.test(rawValue)) {
                onChange(rawValue === '' ? 0 : Number(rawValue));
              }
            }}
            disabled={disabled}
            className="mt-2.5 h-11 w-full rounded-[14px] border border-white/10 bg-[#03080C] px-4 text-lg font-black text-white outline-none ring-0 transition focus:border-[#00F5FF] disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="0"
          />
        </div>

        <div className="rounded-[18px] border border-white/10 bg-[#0C202F]/30 p-3.5">
          <div className="flex items-center justify-between text-xs text-[#7DD3FC]/60">
            <span className="font-bold uppercase tracking-wider">Win Chance</span>
            <span className="text-xs font-black text-white">{formattedChance}</span>
          </div>
          <div className="mt-2.5">
            <input
              type="text"
              inputMode="decimal"
              value={chanceInput === 0 ? '' : chanceInput}
              onChange={(event) => {
                const rawValue = event.target.value;
                if (/^\d*\.?\d*$/.test(rawValue)) {
                  handleChanceChange(rawValue === '' ? 0 : Number(rawValue));
                }
              }}
              disabled={disabled}
              className="h-11 w-full rounded-[14px] border border-white/10 bg-[#03080C] px-4 text-lg font-black text-white outline-none ring-0 transition focus:border-[#00F5FF] disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <div className="relative pt-1">
        <input
          type="range"
          min="1.01"
          max="9999"
          step="0.01"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          disabled={disabled}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#03080C] border border-white/5 accent-[#00F5FF] disabled:cursor-not-allowed disabled:opacity-50"
        />
        {/* Glow track under range */}
        <div className="absolute -z-10 top-[11px] left-0 right-0 h-1 rounded-full bg-gradient-to-r from-[#00F5FF]/20 to-[#14B8A6]/5 pointer-events-none" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {quickTargets.map((target) => (
          <button
            key={target}
            type="button"
            onClick={() => onChange(target)}
            disabled={disabled}
            className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition duration-150 ${value === target ? 'border-[#00F5FF]/50 bg-[#00F5FF]/10 text-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.15)]' : 'border-white/5 bg-[#0C202F]/30 text-[#7DD3FC]/70 hover:border-[#00F5FF]/30 hover:text-white'} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {target.toFixed(1)}×
          </button>
        ))}
      </div>
    </div>
  );
}
