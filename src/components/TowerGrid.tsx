import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';
import { TowerFloor } from '../utils/towerGenerator';

interface TowerGridProps {
  floors: TowerFloor[];
  currentFloor: number;
  status: 'idle' | 'playing' | 'lost' | 'won' | 'cashed';
  soundSrc?: string | null;
  onSelectTile?: (floorId: number, tileId: number) => void;
}

export function TowerGrid({ floors, currentFloor, status, soundSrc, onSelectTile }: TowerGridProps) {
  const reversedFloors = useMemo(() => [...floors].reverse(), [floors]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedSoundRef = useRef<string | null>(null);

  const stopAudio = () => {
    if (audioRef.current) {
      try { audioRef.current.pause(); } catch (e) {}
      try { audioRef.current.currentTime = 0; } catch (e) {}
      audioRef.current = null;
    }
    lastPlayedSoundRef.current = null;
  };

  const playAudio = (src: string) => {
    if (lastPlayedSoundRef.current === src && audioRef.current && !audioRef.current.paused) return;

    stopAudio();

    try {
      const audio = new Audio(src);
      audioRef.current = audio;
      lastPlayedSoundRef.current = src;
      audio.play().catch(() => {});
    } catch (e) {
      // ignore audio errors
    }
  };

  useEffect(() => {
    if (!soundSrc) {
      stopAudio();
      return;
    }
    playAudio(soundSrc);
  }, [soundSrc]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  interface TileCellProps {
    tile: any;
    isRevealed: boolean;
    isTrap: boolean;
    canClick: boolean;
    onClick: () => void;
  }

  function TileCell({ tile, isRevealed, isTrap, canClick, onClick }: TileCellProps) {
    return isRevealed ? (
      <motion.div
        key={`revealed-${tile.id}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
        className="relative flex h-9 w-full items-center justify-center overflow-hidden rounded-sm border border-slate-500/40 bg-blue-900 bg-cover bg-center p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        style={{ backgroundImage: "url('/images/towertile.png')", backgroundSize: 'cover', backgroundPosition: 'center', willChange: 'transform, opacity' }}
      >
        <div className="absolute inset-0 rounded-sm bg-slate-950/10" />
        <motion.img
          src={isTrap ? '/images/losskey.png' : '/images/safekey.png'}
          alt={isTrap ? 'trap' : 'safe'}
          className="relative h-10 w-10 sm:h-11 sm:w-11 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.16)]"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        />
      </motion.div>
    ) : (
      <motion.button
        key={`hidden-${tile.id}`}
        onClick={onClick}
        disabled={!canClick}
        initial={{ opacity: 0.9, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={canClick ? { y: -1, scale: 1.005 } : undefined}
        whileTap={canClick ? { scale: 0.985 } : undefined}
        transition={{ duration: 0.14, ease: 'easeOut' }}
        className={`h-9 sm:h-10 w-full rounded-sm border border-slate-400/30 ${canClick ? 'cursor-pointer' : 'opacity-80'} text-center bg-cover bg-center transform-gpu`}
        style={{ backgroundImage: "url('/images/towertile.png')", backgroundSize: 'cover', backgroundPosition: 'center', willChange: 'transform' }}
      >
        <span className="sr-only">Tile</span>
      </motion.button>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[18px] border border-white/10 p-2 bg-[#071116] shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#6B7C96]">Board</p>
          <p className="text-xs text-[#8DA1C9]">Tap a tile to choose</p>
        </div>
      </div>

      <div className="space-y-1">
        {reversedFloors.map((floor) => {
          const shouldRevealAll = status !== 'playing';
          const visible = floor.id <= currentFloor || shouldRevealAll;
          const nextIndex = currentFloor + 1;
          const isNext = floor.id === nextIndex;

          return (
            <div key={floor.id} className="w-full">
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${floor.tiles.length}, minmax(0, 1fr))` }}>
                {floor.tiles.map((tile) => {
                  const isRevealed = shouldRevealAll || (visible && floor.revealedIndex === tile.id);
                  const canClick = status === 'playing' && isNext && floor.revealedIndex === null;
                  const isTrapForReveal = isRevealed ? !!floor.tiles.find((t) => t.id === tile.id)?.isTrap : !!tile.isTrap;

                  return (
                    <TileCell
                      key={tile.id}
                      tile={tile}
                      isRevealed={isRevealed}
                      isTrap={isTrapForReveal}
                      canClick={canClick}
                      onClick={() => canClick && onSelectTile?.(floor.id, tile.id)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
