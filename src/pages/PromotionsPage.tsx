import { Gift, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionHeading } from '../components/ui/SectionHeading';

const offers = [
  { title: 'Luminous Deposit Match', detail: 'Claim a 50% boost on your next deposit and unlock a premium welcome package.', badge: 'New' },
  { title: 'Weekend Live Drop', detail: 'Free chips and boosted table limits on Friday and Saturday evenings.', badge: 'Live' },
  { title: 'VIP Concierge', detail: 'Dedicated host support, faster cashouts, and personalized reward schedules.', badge: 'VIP' },
];

export default function PromotionsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-[#3B82F6]">Promotions</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Rewarding moments, with restraint and precision.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#B7BDCB]">Every offer is designed to feel meaningful—clear terms, polished delivery, and a premium cadence of value.</p>
          </div>
          <Button className="px-4">View full calendar</Button>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {offers.map((offer) => (
          <Card key={offer.title}>
            <div className="flex items-center justify-between">
              <div className="rounded-full border border-[#22C55E]/20 bg-[#22C55E]/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-[#3B82F6]">{offer.badge}</div>
              <Sparkles size={18} className="text-[#16A34A]" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-white">{offer.title}</h2>
            <p className="mt-2 text-sm leading-7 text-[#8D95A8]">{offer.detail}</p>
            <div className="mt-6 flex items-center gap-2 text-sm text-[#B7BDCB]">
              <Gift size={16} />
              Limited availability
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
