import { DollarSign } from 'lucide-react';

interface BetAmountPanelProps {
  value: number;
  onChange: (value: number) => void;
  onHalf: () => void;
  onDouble: () => void;
}

export function BetAmountPanel({ value, onChange, onHalf, onDouble }: BetAmountPanelProps) {
  return (
    <div className="rounded-[16px] border border-white/8 bg-[#08101D] p-3 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#6B8CFF]">Bet amount</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F172A] text-[#8DA1D7]">
          <DollarSign size={16} />
        </div>
      </div>

      <div className="mt-3 rounded-[14px] border border-[#1F2B48] bg-[#0B1526] p-3">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.24em] text-[#7A8ABE]">USD</span>
          <input
            type="text"
            inputMode="decimal"
            value={value === 0 ? '' : value}
            onChange={(event) => {
              const rawValue = event.target.value;
              if (/^\d*\.?\d*$/.test(rawValue)) {
                onChange(rawValue === '' ? 0 : Number(rawValue));
              }
            }}
            className="w-full bg-transparent text-right text-2xl font-semibold text-white outline-none placeholder:text-[#5A6D9E]"
            placeholder="0"
          />
        </div>
        <div className="mt-3 flex gap-3">
          <button type="button" onClick={onHalf} className="inline-flex h-9 flex-1 items-center justify-center rounded-[12px] bg-[#162249] text-sm font-semibold text-[#B7C3EA] transition hover:bg-[#1B2D5B]">
            ½
          </button>
          <button type="button" onClick={onDouble} className="inline-flex h-9 flex-1 items-center justify-center rounded-[12px] bg-[#162249] text-sm font-semibold text-[#B7C3EA] transition hover:bg-[#1B2D5B]">
            2×
          </button>
        </div>
      </div>
    </div>
  );
}
