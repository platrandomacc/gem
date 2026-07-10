import { memo } from 'react';
import { Card } from '../ui/Card';

interface CoinStatsProps {
  stats: {
    totalGames: number;
    winRate: number;
    biggestWin: number;
    currentStreak: number;
  };
}

export const CoinStats = memo(function CoinStats({ stats }: CoinStatsProps) {
  return (
    <Card className="rounded-[18px] border-white/10 bg-[#0E1017] p-3">
      <div className="space-y-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#EC4899]">Statistics</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-[16px] border border-white/10 bg-[#12141C] p-3">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#EC4899]">Total games</p>
            <p className="mt-1 text-xl font-semibold text-white">{stats.totalGames}</p>
          </div>
          <div className="rounded-[16px] border border-white/10 bg-[#12141C] p-3">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#EC4899]">Win rate</p>
            <p className="mt-1 text-xl font-semibold text-white">{stats.winRate}%</p>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-[16px] border border-white/10 bg-[#12141C] p-3">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#EC4899]">Biggest win</p>
            <p className="mt-1 text-xl font-semibold text-white">${stats.biggestWin.toFixed(2)}</p>
          </div>
          <div className="rounded-[16px] border border-white/10 bg-[#12141C] p-3">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#EC4899]">Current streak</p>
            <p className="mt-1 text-xl font-semibold text-white">{stats.currentStreak}</p>
          </div>
        </div>
      </div>
    </Card>
  );
});
