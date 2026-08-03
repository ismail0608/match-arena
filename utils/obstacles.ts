import type { Tile } from "../types/tile";

const ICE_LAYOUTS: Record<
  number,
  Array<{ index: number; health: number }>
> = {
  7: [
    { index: 18, health: 1 },
    { index: 21, health: 1 },
    { index: 42, health: 1 },
    { index: 45, health: 1 },
  ],
  8: [
    { index: 17, health: 1 },
    { index: 18, health: 2 },
    { index: 21, health: 2 },
    { index: 22, health: 1 },
    { index: 41, health: 1 },
    { index: 42, health: 2 },
    { index: 45, health: 2 },
    { index: 46, health: 1 },
  ],
  9: [
    { index: 18, health: 1 },
    { index: 21, health: 1 },
    { index: 42, health: 1 },
    { index: 45, health: 1 },
  ],
  10: [
    { index: 9, health: 1 },
    { index: 14, health: 1 },
    { index: 18, health: 2 },
    { index: 21, health: 2 },
    { index: 27, health: 1 },
    { index: 28, health: 1 },
    { index: 35, health: 1 },
    { index: 36, health: 1 },
    { index: 42, health: 2 },
    { index: 45, health: 2 },
    { index: 49, health: 1 },
    { index: 54, health: 1 },
  ],
};

export function addLevelObstacles(board: Tile[], levelId: number): Tile[] {
  const layout = ICE_LAYOUTS[levelId] ?? [];

  const newBoard = board.map((tile) => ({
    ...tile,
    obstacle: tile.obstacle ? { ...tile.obstacle } : null,
  }));

  layout.forEach(({ index, health }) => {
    const tile = newBoard[index];

    if (!tile) return;

    newBoard[index] = {
      ...tile,
      obstacle: {
        type: "ice",
        health: Math.max(1, health),
      },
    };
  });

  return newBoard;
}

export type DamageResult = {
  board: Tile[];
  clearedCount: number;
  damagedObstacleCount: number;
};

export function damageTiles(
  board: Tile[],
  indices: number[]
): DamageResult {
  const newBoard = board.map((tile) => ({
    ...tile,
    obstacle: tile.obstacle ? { ...tile.obstacle } : null,
  }));

  let clearedCount = 0;
  let damagedObstacleCount = 0;

  [...new Set(indices)].forEach((index) => {
    const tile = newBoard[index];

    if (!tile) return;

    if (tile.obstacle?.type === "ice") {
      damagedObstacleCount++;
      const remainingHealth = tile.obstacle.health - 1;

      newBoard[index] = {
        ...tile,
        obstacle:
          remainingHealth > 0
            ? { type: "ice", health: remainingHealth }
            : null,
      };

      return;
    }

    newBoard[index] = {
      ...tile,
      ball: "⬛",
      special: null,
      obstacle: null,
    };

    clearedCount++;
  });

  return {
    board: newBoard,
    clearedCount,
    damagedObstacleCount,
  };
}