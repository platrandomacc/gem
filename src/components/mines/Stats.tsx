import { Card } from '../ui/Card';
import type { MinesStats } from '../../types/mines';

interface StatsProps {
  stats: MinesStats;
}

export function Stats({ stats }: StatsProps) {
  return (
    <Card hover={false} className="p-3 sm:p-4">
      <div className="space-y-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#3B82F6]">Statistics</p>
          <p className="mt-1 text-sm font-semibold text-white">Performance snapshot</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ['Games played', stats.gamesPlayed],
            ['Win rate', `${stats.winRate.toFixed(1)}%`],
            ['Average multiplier', `${stats.averageMultiplier.toFixed(2)}×`],
            ['Highest cashout', `$${stats.highestCashout.toFixed(2)}`],
            ['Best streak', stats.bestStreak],
            ['Largest win', `$${stats.largestWin.toFixed(2)}`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[14px] border border-white/10 bg-[#0D1116] p-3">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#8D95A8]">{label}</p>
              <p className="mt-1 text-sm font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
