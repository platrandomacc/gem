import { memo } from 'react';
import type { MineTile as MineTileData, MinesGameStatus } from '../../types/mines';
import { MineTile } from './MineTile';

interface MineBoardProps {
  board: MineTileData[];
  onReveal: (index: number) => void;
  disabled: boolean;
  status: MinesGameStatus;
  explodedIndex?: number | null;
}

export const MineBoard = memo(function MineBoard({ board, onReveal, disabled, status, explodedIndex }: MineBoardProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
      {board.map((tile) => (
        <MineTile key={tile.id} tile={tile} onReveal={onReveal} disabled={disabled || status !== 'playing'} explodedIndex={explodedIndex ?? null} />
      ))}
    </div>
  );
});
