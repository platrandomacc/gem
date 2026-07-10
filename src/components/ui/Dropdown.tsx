import { useEffect, useRef, useState } from 'react';

export interface DropdownOption {
  label: string;
  value: string;
  description?: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  compact?: boolean;
  disabled?: boolean;
}

export function Dropdown({ label, options, value, onChange, className = '', compact = false, disabled = false }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        className={`flex w-full items-center justify-between rounded-full border border-transparent hover:border-sky-500/25 hover:border-emerald-500/40 bg-[#171A22] ${compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} text-left text-[#F7F7F8] transition hover:border-[#22C55E]/30 disabled:cursor-not-allowed disabled:opacity-60`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>
          <span className="block text-[9px] uppercase tracking-[0.28em] text-[#8D95A8]">{label}</span>
          <span className={`mt-1 block font-medium text-white ${compact ? 'text-sm' : ''}`}>{selectedOption.label}</span>
        </span>
        <span className="text-[#8D95A8]">▾</span>
      </button>

      {open ? (
        <div className="absolute left-0 z-20 mt-2 w-full overflow-hidden rounded-[20px] border border-transparent hover:border-sky-500/25 hover:border-emerald-500/40 bg-[#12141B] text-sm shadow-soft">
          <ul role="listbox" className="divide-y divide-white/5">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className="flex w-full flex-col gap-1 px-4 py-3 text-left text-sm text-white transition hover:bg-white/[0.04]"
                >
                  <span className="font-medium">{option.label}</span>
                  {option.description ? <span className="text-xs text-[#8D95A8]">{option.description}</span> : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
