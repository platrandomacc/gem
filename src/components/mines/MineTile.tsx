import { AnimatePresence, motion } from 'framer-motion';
import { memo } from 'react';
import type { MineTile as MineTileData } from '../../types/mines';

interface MineTileProps {
  tile: MineTileData;
  onReveal: (index: number) => void;
  disabled: boolean;
  explodedIndex?: number | null;
}

export const MineTile = memo(function MineTile({ tile, onReveal, disabled, explodedIndex }: MineTileProps) {
  const exploded = tile.revealed && tile.isMine && tile.id === explodedIndex;

  return (
    <motion.button
      type="button"
      disabled={disabled || tile.revealed}
      onClick={() => onReveal(tile.id)}
      whileHover={!tile.revealed && !disabled ? { y: -2, scale: 1.02, rotate: -0.5 } : undefined}
      whileTap={!tile.revealed && !disabled ? { scale: 0.94 } : undefined}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`group relative w-14 h-14 sm:w-20 sm:h-20 overflow-hidden rounded-[8px] shadow-[0_10px_24px_rgba(0,0,0,0.2)] transform-gpu focus:outline-none ${
        exploded
          ? 'bg-gradient-to-br from-red-900/20 via-red-600/20 to-transparent'
          : 'bg-[#0A0F14]'
      }`}
    >
      <div className="absolute inset-0 rounded-[8px] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.12),_transparent_54%)]" />
      {!exploded ? (
        <div className="absolute inset-0 rounded-[8px] bg-cover bg-center opacity-90">
          <img src="/images/minestile.png" alt="Hidden tile" className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="absolute inset-0 rounded-[8px]" />
      )}
      <div className={`absolute inset-0 rounded-[8px] ${exploded ? 'border-transparent' : 'border border-white/10'}`} />
      <div className={`absolute inset-[3px] rounded-[11px] ${exploded ? 'border-transparent' : 'border border-white/5'}`} />

      {exploded ? (
        <div className="absolute inset-0 rounded-[8px] bg-gradient-to-t from-black/30 to-transparent" />
      ) : null}

      <AnimatePresence mode="wait">
        {tile.revealed ? (
          <motion.div
            key={tile.isMine ? 'mine' : 'safe'}
            initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {tile.isMine ? (
              <img src="/images/bomb.png" alt="Bomb" className="h-10 w-10 object-contain" />
            ) : (
              <img src="/images/minesdiamond.png" alt="Diamond" className="h-12 w-12 object-contain" />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="hidden"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
});
