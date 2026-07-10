import { motion } from 'framer-motion';
import type { LimboHistoryEntry } from '../../types/limbo';

interface HistoryProps {
  history: LimboHistoryEntry[];
}

export function History({ history }: HistoryProps) {
  return (
    <div className="space-y-3 rounded-[20px] border border-white/10 bg-[#0D1116] p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Recent rounds</p>
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#3B82F6]">Last 10</p>
      </div>

      <div className="space-y-2">
        {history.length === 0 ? (
          <div className="rounded-[16px] border border-dashed border-white/10 bg-[#12141B] p-4 text-center text-sm text-[#8D95A8]">
            No rounds yet.
          </div>
        ) : (
          history.map((entry) => (
            <motion.div key={entry.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-[16px] border border-white/10 bg-[#12141B] p-3">
              <div className="flex items-center justify-between text-sm">
                <span className={entry.outcome === 'win' ? 'text-[#22C55E]' : 'text-[#F87171]'}>{entry.outcome === 'win' ? 'Win' : 'Loss'}</span>
                <span className="text-[#8D95A8]">{entry.timestamp}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-[#B7BDCB]">
                <span>Rolled {entry.rolledMultiplier.toFixed(2)}×</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-[#B7BDCB]">
                <span>Profit ${entry.profit.toFixed(2)}</span>
                <span>Nonce {entry.nonce}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
