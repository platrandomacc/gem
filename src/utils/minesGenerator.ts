import type { MineTile } from '../types/mines';

export function createMinesBoard(size = 25, mineCount = 3): MineTile[] {
  const totalTiles = Math.max(1, Math.min(size, 25));
  const safeMineCount = Math.min(Math.max(1, mineCount), totalTiles - 1);
  const minePositions = new Set<number>();

  while (minePositions.size < safeMineCount) {
    minePositions.add(Math.floor(Math.random() * totalTiles));
  }

  return Array.from({ length: totalTiles }, (_, index) => ({
    id: index,
    isMine: minePositions.has(index),
    revealed: false,
  }));
}
