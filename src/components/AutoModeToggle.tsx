interface AutoModeToggleProps {
  mode: 'manual' | 'auto';
  onChange: (mode: 'manual' | 'auto') => void;
}

export function AutoModeToggle({ mode, onChange }: AutoModeToggleProps) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-[#08101D] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <p className="text-xs uppercase tracking-[0.28em] text-[#6B8CFF]">Mode</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {(['manual', 'auto'] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${mode === value ? 'bg-[#5B7AF6] text-white' : 'bg-[#101B2D] text-[#9BB0E4] hover:bg-[#152242]'}`}
          >
            {value === 'manual' ? 'Manual' : 'Auto'}
          </button>
        ))}
      </div>
    </div>
  );
}
