import { ShieldCheck, UserRound } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#22C55E]/20 bg-[#22C55E]/10 text-[#3B82F6]">
              <UserRound size={28} />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#3B82F6]">Player profile</p>
              <h1 className="mt-1 text-2xl font-semibold text-white">Mina V.</h1>
              <p className="text-sm text-[#8D95A8]">Diamond tier • Verified identity</p>
            </div>
          </div>
          <Button>Manage account</Button>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3 text-[#3B82F6]">
            <ShieldCheck size={18} />
            <p className="font-medium text-white">Security</p>
          </div>
          <div className="mt-4 space-y-3 text-sm text-[#8D95A8]">
            <div className="rounded-[14px] border border-transparent hover:border-sky-500/25 hover:border-emerald-500/40 bg-[#171A22] px-4 py-3">Two-factor authentication enabled</div>
            <div className="rounded-[14px] border border-transparent hover:border-sky-500/25 hover:border-emerald-500/40 bg-[#171A22] px-4 py-3">Withdrawal alerts active</div>
          </div>
        </Card>

        <Card>
          <p className="font-medium text-white">Preferences</p>
          <div className="mt-4 space-y-3 text-sm text-[#8D95A8]">
            <div className="rounded-[14px] border border-transparent hover:border-sky-500/25 hover:border-emerald-500/40 bg-[#171A22] px-4 py-3">Preferred games: live roulette and blackjack</div>
            <div className="rounded-[14px] border border-transparent hover:border-sky-500/25 hover:border-emerald-500/40 bg-[#171A22] px-4 py-3">Notifications: promotions and VIP events</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
