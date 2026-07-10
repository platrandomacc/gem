import { Card } from '../ui/Card';
import type { MinesHistoryEntry } from '../../types/mines';

interface HistoryProps {
  entries: MinesHistoryEntry[];
}

export function History({ entries }: HistoryProps) {
  return (
    <Card hover={false} className="p-3 sm:p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#3B82F6]">History</p>
            <p className="mt-1 text-sm font-semibold text-white">Last 10 rounds</p>
          </div>
        </div>
        <div className="space-y-2">
          {entries.length === 0 ? (
            <div className="rounded-[14px] border border-white/10 bg-[#0D1116] p-3 text-sm text-[#8D95A8]">
              No rounds yet. Start a new game to build your history.
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="rounded-[14px] border border-white/10 bg-[#0D1116] p-3 text-sm text-[#B7BDCB]">
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-semibold ${entry.outcome === 'win' ? 'text-[#22C55E]' : 'text-[#F43F5E]'}`}>{entry.outcome === 'win' ? 'Win' : 'Loss'}</span>
                  <span className="text-[#8D95A8]">{entry.timestamp}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-xs uppercase tracking-[0.25em] text-[#8D95A8]">
                  <span>Bet ${entry.bet.toFixed(2)}</span>
                  <span>Mines {entry.mineCount}</span>
                  <span>Safe {entry.safePicks}</span>
                  <span>{entry.multiplier.toFixed(2)}×</span>
                  <span>Profit ${entry.profit.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
