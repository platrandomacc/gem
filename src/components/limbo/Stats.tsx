import type { LimboStats as LimboStatsModel } from '../../types/limbo';

interface StatsProps {
  stats: LimboStatsModel;
}

const statCards = [
  { label: 'Games', value: (stats: LimboStatsModel) => stats.totalGames },
  { label: 'Win rate', value: (stats: LimboStatsModel) => `${stats.winRate.toFixed(1)}%` },
  { label: 'Biggest win', value: (stats: LimboStatsModel) => `$${stats.biggestWin.toFixed(2)}` },
  { label: 'Highest hit', value: (stats: LimboStatsModel) => `${stats.highestMultiplier.toFixed(2)}×` },
  { label: 'Avg. multiplier', value: (stats: LimboStatsModel) => `${stats.averageMultiplier.toFixed(2)}×` },
];

export function Stats({ stats }: StatsProps) {
  return (
    <div className="space-y-3 rounded-[20px] border border-white/10 bg-[#0D1116] p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Performance</p>
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#3B82F6]">Live stats</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-[16px] border border-white/10 bg-[#12141B] p-3">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#8D95A8]">{card.label}</p>
            <p className="mt-2 text-lg font-semibold text-white">{card.value(stats)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
