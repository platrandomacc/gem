import { MessageCircleMore } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <Card className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.32em] text-[#3B82F6]">Support</p>
          <h1 className="text-3xl font-semibold text-white">Professional help, available around the clock.</h1>
          <p className="max-w-2xl text-sm leading-7 text-[#B7BDCB]">Need assistance with account access, limits, or payout questions? Our support team is ready with fast, premium help for every wallet and play experience.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button className="w-full sm:w-auto">Contact support</Button>
          <div className="rounded-[20px] border border-white/10 bg-[#0D1116]/90 px-4 py-3 text-sm text-[#A0A8BC]">
            <p className="font-semibold text-white">Priority response</p>
            <p className="mt-1">Live chat and email support for verified members.</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3 text-[#3B82F6]">
            <MessageCircleMore size={18} />
            <p className="font-medium text-white">Live chat</p>
          </div>
          <p className="mt-3 text-sm text-[#8D95A8]">Average response time under three minutes for priority issues.</p>
          <div className="mt-5 space-y-2 rounded-[20px] bg-[#0D1116]/90 p-4 text-sm text-[#A0A8BC]">
            <p className="font-semibold text-white">Instant help for:</p>
            <p>- Account verification</p>
            <p>- Deposit and withdrawal guidance</p>
            <p>- Security and password support</p>
          </div>
        </Card>
        <Card>
          <p className="font-medium text-white">Email support</p>
          <p className="mt-3 text-sm text-[#8D95A8]">Send a detailed request to the care desk for account and verification enquiries.</p>
          <div className="mt-5 rounded-[20px] bg-[#0D1116]/90 p-4 text-sm text-[#A0A8BC]">
            <p className="font-semibold text-white">Suggested subject</p>
            <p className="mt-2">"Account safety review / withdrawal limits"</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
