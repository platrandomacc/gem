import { motion } from 'framer-motion';
import { memo, useEffect, useMemo, useState } from 'react';

interface MultiplierDisplayProps {
  isRolling: boolean;
  value: number;
  resultValue?: number;
  status: 'idle' | 'rolling' | 'result';
  won?: boolean;
}

function MultiplierDisplay({ isRolling, value, resultValue, status, won }: MultiplierDisplayProps) {
  const [displayValue, setDisplayValue] = useState(resultValue ?? value);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (status === 'rolling') return;
    setDisplayValue(resultValue ?? value);
    setProgress(0);
  }, [status, resultValue, value]);

  useEffect(() => {
    if (status !== 'rolling') return;

    const endValue = resultValue ?? value;
    const startTime = window.performance.now();
    setDisplayValue(1);

    const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width:640px)').matches;
    const duration = isMobile ? 1400 : 1900;

    let active = true;
    let frame = 0;

    const tick = (time: number) => {
      if (!active) return;
      const elapsed = time - startTime;
      const normalized = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - normalized, 5);
      const nextValue = 1 + (endValue - 1) * eased;
      setDisplayValue(Number(nextValue.toFixed(2)));
      setProgress(eased);

      if (normalized < 1) {
        frame = window.requestAnimationFrame(tick);
      } else {
        setDisplayValue(Number(endValue.toFixed(2)));
        setProgress(1);
      }
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
      setProgress(0);
    };
  }, [isRolling, resultValue, value, status]);

  const accentClass = status === 'result' ? (won ? 'text-[#22C55E]' : 'text-[#F87171]') : 'text-white';
  const barWidth = useMemo(() => Math.min(Math.max((displayValue / 24) * 100, 8), 100), [displayValue]);
  const displaySizeClass = useMemo(() => 'mt-5 text-4xl sm:text-7xl', []);

  return (
    <div className="rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_62%)] p-4 text-center shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-6">
      <p className="text-[10px] uppercase tracking-[0.32em] text-[#3B82F6]">Live multiplier</p>
      <motion.div
        key={`${resultValue}-${resultValue}`}
        initial={{ opacity: 0.7, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1, y: [0, -2, 0] }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`${displaySizeClass} font-semibold tracking-[0.2em] ${accentClass}`}
      >
        {displayValue.toFixed(2)}×
      </motion.div>
      <div className="mt-5">
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#0D1116]">
          <motion.div
            initial={{ width: '8%' }}
            animate={{ width: `${isRolling ? Math.max(progress * 100, 8) : barWidth}%` }}
            transition={{ duration: 0.12, ease: 'linear' }}
            className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] via-[#22C55E] to-[#3B82F6]"
          />
        </div>
        {status === 'result' ? (
          <div className="mt-3 text-sm font-semibold text-[#22C55E]">{(resultValue ?? value).toFixed(2)}×</div>
        ) : null}
        <div className="mt-2 text-xs uppercase tracking-[0.28em] text-[#8D95A8]">
          {isRolling ? 'Progress' : status === 'result' ? 'Revealed' : 'Ready'}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-center gap-3 text-sm text-[#8D95A8]">
        <span className="rounded-full border border-white/10 bg-[#0D1116] px-3 py-2">{isRolling ? 'Rolling…' : status === 'result' ? 'Revealed' : 'Awaiting spin'}</span>
      </div>
      {/* cashout button removed - Limbo auto-cashes out when target reached */}
    </div>
  );
}

export default memo(MultiplierDisplay);
