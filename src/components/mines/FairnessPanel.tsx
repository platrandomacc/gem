import { Card } from '../ui/Card';

export function FairnessPanel() {
  return (
    <Card hover={false} className="p-3 sm:p-4">
      <div className="space-y-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#3B82F6]">Fairness</p>
          <p className="mt-1 text-sm font-semibold text-white">Provably fair round seed</p>
        </div>
        <div className="grid gap-2 text-sm text-[#B7BDCB]">
          <div className="rounded-[14px] border border-white/10 bg-[#0D1116] p-3">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#8D95A8]">Server seed</p>
            <p className="mt-1 break-all font-mono text-xs text-white">seed-9d4f2c1a8b7e</p>
          </div>
          <div className="rounded-[14px] border border-white/10 bg-[#0D1116] p-3">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#8D95A8]">Client seed</p>
            <p className="mt-1 break-all font-mono text-xs text-white">mine-player-4821</p>
          </div>
          <div className="rounded-[14px] border border-white/10 bg-[#0D1116] p-3">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#8D95A8]">Nonce</p>
            <p className="mt-1 font-mono text-xs text-white">42</p>
          </div>
          <div className="rounded-[14px] border border-white/10 bg-[#0D1116] p-3">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#8D95A8]">Hashed result</p>
            <p className="mt-1 break-all font-mono text-xs text-white">sha256:8274f4fa4b6a7a3c7b07</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
