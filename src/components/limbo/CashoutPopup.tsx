import { motion } from 'framer-motion';
import { playCashout } from '../../utils/soundHooks';

interface CashoutPopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  target: number;
  payout: number;
}

export function CashoutPopup({ open, onClose, onConfirm, target, payout }: CashoutPopupProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 w-full max-w-sm rounded-xl bg-[#0D1116] p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-[#8D95A8]">Cashout</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Cash out at {target.toFixed(2)}×?</h2>
        <p className="mt-2 text-sm text-[#8D95A8]">Payout: ${payout.toFixed(2)}</p>

        <div className="mt-4 flex gap-3">
          <button
            className="flex-1 rounded-xl border border-white/10 bg-[#122025] px-4 py-2 text-sm text-white"
            onClick={() => {
              playCashout();
              onConfirm();
            }}
          >
            Confirm
          </button>
          <button className="flex-1 rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm text-[#8D95A8]" onClick={onClose}>
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
