import { TowerDifficulty, difficultyModes, getMultiplierForFloor } from './multipliers';

export interface Tile {
  id: number;
  isTrap: boolean;
}

export interface TowerFloor {
  id: number;
  label: string;
  multiplier: number;
  tiles: Tile[];
  revealedIndex: number | null;
}

function chooseTrapIndexes(tiles: number, trapCount: number) {
  const indexes = new Set<number>();

  while (indexes.size < trapCount) {
    const next = Math.floor(Math.random() * tiles);
    indexes.add(next);
  }

  return Array.from(indexes).sort((a, b) => a - b);
}

export function generateTower(difficulty: TowerDifficulty): TowerFloor[] {
  const mode = difficultyModes.find((item) => item.value === difficulty)!;

  return Array.from({ length: mode.floors }, (_, index) => {
    const tilesCount = (mode as any).tilesPerRow || 1;
    const traps = (mode as any).trapsPerRow || 0;
    const trapIndexes = chooseTrapIndexes(tilesCount, traps);

    const tiles = Array.from({ length: tilesCount }, (_, tIdx) => ({
      id: tIdx,
      isTrap: trapIndexes.includes(tIdx),
    }));

    return {
      id: index,
      label: `Floor ${index + 1}`,
      multiplier: getMultiplierForFloor(index, mode.floors, difficulty),
      tiles,
      revealedIndex: null,
    };
  });
}
