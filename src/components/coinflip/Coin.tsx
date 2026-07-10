import { motion } from 'framer-motion';
import { CoinSide } from '../../types/coin';

interface CoinProps {
  status: 'idle' | 'flipping' | 'won' | 'lost';
  result: CoinSide | null;
  selectedSide: CoinSide;
  isFlipping: boolean;
}

const faceStyles = {
  heads: {
    inner: 'from-[#FDE68A] via-[#F59E0B] to-[#D97706]',
    icon: (
      <svg viewBox="0 0 84 84" className="h-16 w-16">
        <circle cx="42" cy="42" r="18" fill="rgba(255,255,255,0.95)" />
        <path d="M28 42c0-1 0-4 1-5 2-7 8-12 14-12 4 0 8 2 11 5 2 2 3 4 4 6 0 1 0 2-1 3-2 4-7 7-11 7-5 0-10-3-13-6z" fill="rgba(0,0,0,0.8)" />
        <circle cx="44" cy="36" r="2" fill="rgba(255,255,255,0.9)" />
        <path d="M32 44c4 1 8 2 12 0" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M46 30c3 2 5 5 5 8" stroke="rgba(0,0,0,0.75)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M54 22c-6 0-17 1-20 8" stroke="rgba(0,0,0,0.6)" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  tails: {
    inner: 'from-[#FCD34D] via-[#D97706] to-[#92400E]',
    icon: (
      <svg viewBox="0 0 84 84" className="h-16 w-16">
        <circle cx="42" cy="42" r="18" fill="rgba(255,255,255,0.95)" />
        <circle cx="42" cy="42" r="8" fill="rgba(0,0,0,0.75)" />
        <path d="M42 30l4 6 7 1-5 5 2 7-6-4-6 4 2-7-5-5 7-1 4-6z" fill="rgba(255,255,255,0.92)" />
        <path d="M30 52c4-4 20-4 24 0" stroke="rgba(0,0,0,0.55)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M42 50v8" stroke="rgba(0,0,0,0.55)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
};

const oppositeSide = (side: CoinSide): CoinSide => (side === 'heads' ? 'tails' : 'heads');

export function Coin({ status, result, selectedSide, isFlipping }: CoinProps) {
  const settled = status === 'won' || status === 'lost';
  const frontFace = faceStyles[selectedSide];
  const backFace = faceStyles[oppositeSide(selectedSide)];
  const rotation = isFlipping ? 1260 : settled && result !== selectedSide ? 180 : 0;

  return (
    <div className="relative mx-auto flex h-full min-h-[160px] items-center justify-center overflow-hidden rounded-[18px] border border-white/10 bg-[#08101D] p-2">
      <motion.div
        initial={false}
        animate={{ rotateY: rotation, y: isFlipping ? [0, -4, 0] : [0, 0], boxShadow: isFlipping ? '0 24px 60px rgba(245,158,11,0.16)' : '0 16px 36px rgba(0,0,0,0.18)' }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-[#2F1E04] via-[#240F02] to-[#0F0904] shadow-xl"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 rounded-full border border-white/10 bg-gradient-to-b from-[#3C2C08] via-[#211100] to-[#090502] opacity-80" />
        <div
          className={`absolute h-28 w-28 rounded-full bg-gradient-to-br ${frontFace.inner} shadow-[inset_0_0_24px_rgba(0,0,0,0.22)]`}
          style={{ transform: 'translateZ(16px)', backfaceVisibility: 'hidden' }}
        >
          <div className="relative flex h-full w-full items-center justify-center rounded-full">
            <div className="absolute inset-4 rounded-full border border-white/10 bg-white/5" />
            <div className="absolute inset-8 rounded-full border border-white/15" />
            <div className="relative flex h-full w-full items-center justify-center">
              {frontFace.icon}
            </div>
          </div>
        </div>

        <div
          className={`absolute h-28 w-28 rounded-full bg-gradient-to-br ${backFace.inner} shadow-[inset_0_0_24px_rgba(0,0,0,0.22)]`}
          style={{ transform: 'translateZ(-16px) rotateY(180deg)', backfaceVisibility: 'hidden' }}
        >
          <div className="relative flex h-full w-full items-center justify-center rounded-full">
            <div className="absolute inset-4 rounded-full border border-white/10 bg-white/5" />
            <div className="absolute inset-8 rounded-full border border-white/15" />
            <div className="relative flex h-full w-full items-center justify-center">
              {backFace.icon}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-2 top-2 h-2 rounded-full bg-white/15 blur-md" />
        <div className="pointer-events-none absolute inset-x-2 bottom-2 h-2 rounded-full bg-white/15 blur-md" />
      </motion.div>
    </div>
  );
}
