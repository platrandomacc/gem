import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface SidebarProps {
  betAmount: number;
  mineCount: number;
  multiplier: number;
  payout: number;
  profit: number;
  safePicks: number;
  remainingTiles: number;
  canCashOut: boolean;
  isActive: boolean;
  onCashOut: () => void;
  onNewGame: () => void;
}

export function Sidebar({
  betAmount,
  mineCount,
  multiplier,
  payout,
  profit,
  safePicks,
  remainingTiles,
  canCashOut,
  isActive,
  onCashOut,
  onNewGame,
}: SidebarProps) {
  return (
    <Card hover={false} className="p-3 sm:p-4">
      <div className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ['Bet amount', `$${betAmount.toFixed(2)}`],
            ['Mines', String(mineCount)],
            ['Multiplier', `${multiplier.toFixed(2)}×`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[14px] border border-white/10 bg-[#0D1116] p-3">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#8D95A8]">{label}</p>
              <p className="mt-1 text-sm font-semibold text-white">{value}</p>
            </div>
          ))}



        <motion.div whileHover={{ scale: 1.01 }} className="grid gap-2 sm:grid-cols-2">
          <Button
            onClick={onCashOut}
            disabled={!canCashOut}
            fullWidth
            className={`h-11 min-h-11 px-5 py-0 text-sm font-bold tracking-wide rounded-[16px] ${canCashOut ? 'shadow-[0_0_0_1px_rgba(34,197,94,0.14),0_0_26px_rgba(34,197,94,0.20)]' : ''}`}
          >
            Cash Out
          </Button>
        </motion.div>
        </div>
      </div>
    </Card>
  );
}
