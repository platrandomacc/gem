import { Card } from '../ui/Card';

interface StatsProps {
  stats: {
    gamesPlayed: number;
    currentStreak: number;
    bestStreak: number;
    highestMultiplier: number;
    winRate: number;
  };
  cardsRemaining: number;
}

const statItems = [
  { label: 'Games played', key: 'gamesPlayed' },
  { label: 'Current streak', key: 'currentStreak' },
  { label: 'Best streak', key: 'bestStreak' },
  { label: 'Highest multiplier', key: 'highestMultiplier' },
  { label: 'Win rate', key: 'winRate' },
];

export function Stats({ stats, cardsRemaining }: StatsProps) {
  return (
    <Card className="border-white/5 p-4">
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-[#3B82F6]">Statistics</p>
          <h2 className="text-xl font-semibold text-white">Performance</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {statItems.map((item) => (
            <div key={item.label} className="rounded-[18px] border border-white/10 bg-[#0D1116] p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-[#8D95A8]">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {item.key === 'highestMultiplier' ? `${stats.highestMultiplier.toFixed(2)}x` : item.key === 'winRate' ? `${stats.winRate}%` : stats[item.key as keyof typeof stats]}
              </p>
            </div>
          ))}
          <div className="rounded-[18px] border border-white/10 bg-[#0D1116] p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-[#8D95A8]">Remaining deck</p>
            <p className="mt-2 text-2xl font-semibold text-white">{cardsRemaining}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
