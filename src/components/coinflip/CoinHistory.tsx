import { memo } from 'react';
import { Card } from '../ui/Card';
import { CoinHistoryItem } from '../../types/coin';

interface CoinHistoryProps {
  history: CoinHistoryItem[];
  countLabel: string;
}

const formatSide = (side: 'heads' | 'tails') => (side === 'heads' ? 'Heads' : 'Tails');

export const CoinHistory = memo(function CoinHistory({ history, countLabel }: CoinHistoryProps) {
  return (
    <Card className="rounded-[20px] border-white/10 bg-[#08101D] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#6B8CFF]">Flip history</p>
          <p className="mt-1 text-sm text-[#D1D9F5]">Most recent outcomes first.</p>
        </div>
        <span className="rounded-full bg-[#0B1220] px-3 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#22C55E]">{countLabel}</span>
      </div>
      <div className="mt-4 space-y-3">
        {history.length === 0 ? (
          <div className="rounded-[18px] border border-white/10 bg-[#09121B] p-4 text-sm text-[#9AA9C8]">No flips yet. Place a wager to begin.</div>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <div key={item.id} className="grid gap-3 rounded-[18px] border border-white/10 bg-[#09121B] p-3 sm:grid-cols-[1fr_1fr_1fr]">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#6B8CFF]">Prediction</p>
                  <p className="mt-1 text-sm font-semibold text-white">{formatSide(item.side)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#6B8CFF]">Result</p>
                  <p className="mt-1 text-sm font-semibold text-white">{formatSide(item.result)}</p>
                </div>
                <div className="text-right sm:text-left">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#6B8CFF]">Profit</p>
                  <p className={`mt-1 text-sm font-semibold ${item.won ? 'text-[#22C55E]' : 'text-[#F87171]'}`}>{item.won ? `+$${item.profit.toFixed(2)}` : `-$${Math.abs(item.profit).toFixed(2)}`}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
});
