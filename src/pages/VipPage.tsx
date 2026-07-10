import { Crown, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function VipPage() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden bg-[#071520] border-white/10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-[#00F5FF] font-black">VIP CLUB</p>
            <h1 className="mt-3 text-3xl font-black text-white">Personalized service for players who expect more.</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#7DD3FC]/80">Access private offers, elevated limits, concierge support, and a more considered pace of play.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button>Request invitation</Button>
              <Button variant="secondary">View benefits</Button>
            </div>
          </div>
          <div className="rounded-[18px] border border-[#00F5FF]/20 bg-[linear-gradient(135deg,rgba(0,245,255,0.15),rgba(20,184,166,0.12))] p-6 shadow-[0_0_25px_rgba(0,245,255,0.1)]">
            <div className="flex items-center gap-3 text-[#00F5FF]">
              <Crown size={18} />
              <span className="text-sm font-bold text-white">Diamond tier</span>
            </div>
            <div className="mt-6 space-y-3 text-sm text-[#7DD3FC]/80">
              <div className="rounded-[14px] border border-white/5 hover:border-[#00F5FF]/30 bg-[#0C202F]/80 px-4 py-3">Priority withdrawals within 30 minutes</div>
              <div className="rounded-[14px] border border-white/5 hover:border-[#00F5FF]/30 bg-[#0C202F]/80 px-4 py-3">Dedicated host and seasonal perks</div>
              <div className="rounded-[14px] border border-white/5 hover:border-[#00F5FF]/30 bg-[#0C202F]/80 px-4 py-3">Custom limits and tailored rewards</div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {['Private lounge', 'Higher limits', 'Dedicated support'].map((item) => (
          <Card key={item} className="bg-[#071520] border-white/10">
            <div className="flex items-center gap-3 text-[#00F5FF]">
              <Sparkles size={16} />
              <p className="font-bold text-white">{item}</p>
            </div>
            <p className="mt-3 text-sm text-[#7DD3FC]/70">Elevated access with thoughtful service and a more refined pace.</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
