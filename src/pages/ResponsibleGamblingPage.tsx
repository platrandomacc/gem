import { ShieldAlert } from 'lucide-react';
import { Card } from '../components/ui/Card';

export default function ResponsibleGamblingPage() {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-3 text-[#3B82F6]">
          <ShieldAlert size={18} />
          <p className="text-sm uppercase tracking-[0.32em]">Responsible gambling</p>
        </div>
        <h1 className="mt-3 text-3xl font-semibold text-white">Tools that support healthy, controlled play.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#B7BDCB]">Set boundaries, manage your time, and access support whenever you need it.</p>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {['Deposit limits', 'Cooling-off periods', 'Self-exclusion'].map((item) => (
          <Card key={item}>
            <p className="font-medium text-white">{item}</p>
            <p className="mt-3 text-sm text-[#8D95A8]">Adjust your controls directly in your profile with clear, actionable options.</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
