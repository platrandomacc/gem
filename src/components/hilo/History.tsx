import { HiloCard } from './Card';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { HiloGameSummary } from '../../types/card';

interface HistoryProps {
  history: HiloGameSummary[];
}

export function History({ history }: HistoryProps) {
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // auto-scroll to latest when new item appended
    if (!listRef.current) return;
    const el = listRef.current;
    // scroll horizontally to the end to show newest items
    el.scrollLeft = el.scrollWidth;
  }, [history.length]);

  const visibleHistory = history.slice(-2);

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs uppercase tracking-[0.32em] text-[#3B82F6]">Rounds</p>
      </div>
      {visibleHistory.length === 0 ? (
        <div className="rounded-[18px] border border-white/10 bg-[#0D1116] p-3 text-sm text-[#8D95A8]">
          No game history yet. Start a run to record results.
        </div>
      ) : (
        <div ref={listRef} className="flex gap-3 overflow-x-auto pb-2 pr-2 scroll-pl-4 snap-x snap-mandatory touch-pan-x scroll-smooth">
          {visibleHistory.map((item) => {
            const isSkipped = item.skipped === true;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.28 }}
                className={`flex-shrink-0 w-24 snap-center flex flex-col items-center gap-2 rounded-[10px] border p-2 ${isSkipped ? 'border-white/10 bg-[#0B1116] opacity-60' : 'border-white/6 bg-[#0B1116]'}`}
              >
                <div className="rounded-[10px] border border-white/8 bg-[#090D14] p-1 flex items-center justify-center">
                  <HiloCard card={item.resultCard} size="small" />
                </div>
                <div className={`rounded-full px-2 py-1 text-xs font-semibold ${isSkipped ? 'bg-slate-500/15 text-slate-300' : item.won ? 'bg-emerald-500/15 text-emerald-300' : 'bg-[#F87171]/15 text-[#F87171]'}`}>
                  {`${item.multiplier.toFixed(2)}x`}
                </div>
                {isSkipped ? <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Skipped</div> : null}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
