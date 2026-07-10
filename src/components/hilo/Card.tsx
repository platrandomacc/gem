import { motion } from 'framer-motion';
import type { CardData } from '../../types/card';

interface HiloCardProps {
  card: CardData | null;
  hidden?: boolean;
  size?: 'small' | 'medium' | 'large';
  animate?: boolean;
}

const suitIcons: Record<CardData['suit'], string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};

// Ranks and most symbols are black; red for hearts and diamonds
const suitColors: Record<CardData['suit'], string> = {
  spades: 'text-black',
  hearts: 'text-[#F87171]',
  diamonds: 'text-[#F87171]',
  clubs: 'text-black',
};

export function HiloCard({ card, hidden = false, size = 'medium', animate = false }: HiloCardProps) {
  const dimensions = size === 'large' ? 'h-52 w-40' : size === 'medium' ? 'h-36 w-28' : 'h-24 w-20';
  const padding = size === 'large' ? 'p-5' : size === 'medium' ? 'p-4' : 'p-2';
  const borderRadius = size === 'large' ? 'rounded-[28px]' : size === 'medium' ? 'rounded-[20px]' : 'rounded-[12px]';

  if (!card) {
    return (
      <div className={`flex items-center justify-center rounded-[28px] border border-slate-200 bg-white text-sm text-[#5A667E] ${dimensions}`}>
        <span className="text-center text-black">Draw a card</span>
      </div>
    );
  }

  return (
    <motion.div
      key={card.id}
      initial={hidden ? { rotateY: 180, opacity: 0 } : { rotateY: 0, opacity: 0 }}
      animate={animate ? { rotateY: 0, opacity: 1, y: [20, 0] } : { opacity: 1 }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      className={`relative overflow-hidden ${borderRadius} border border-slate-200 bg-white shadow-[0_8px_30px_rgba(2,6,23,0.08)] ${dimensions}`}
      style={{ perspective: 1200 }}
    >
      <div className={`relative z-10 flex h-full flex-col justify-between ${padding} text-black`}>
        <div className="flex items-start justify-between">
          <span className={`font-semibold text-black ${size === 'large' ? 'text-lg' : size === 'medium' ? 'text-base' : 'text-sm'}`}>{card.rank}</span>
          <span className={`${suitColors[card.suit]} ${size === 'large' ? 'text-2xl' : size === 'medium' ? 'text-xl' : 'text-lg'}`}>{suitIcons[card.suit]}</span>
        </div>
        <div className={`flex items-center justify-center ${size === 'large' ? 'text-[4rem]' : size === 'medium' ? 'text-[3rem]' : 'text-[2rem]'} leading-none ${suitColors[card.suit]}`}>{suitIcons[card.suit]}</div>
        <div className="flex items-end justify-between">
          <span className={`font-semibold text-black ${size === 'large' ? 'text-lg' : size === 'medium' ? 'text-base' : 'text-sm'}`}>{card.rank}</span>
          <span className={`${suitColors[card.suit]} ${size === 'large' ? 'text-2xl' : size === 'medium' ? 'text-xl' : 'text-lg'}`}>{suitIcons[card.suit]}</span>
        </div>
      </div>
    </motion.div>
  );
}
