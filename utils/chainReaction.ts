import type { Tile } from "../types/tile";

import {
  getAreaBombClearIndices,
  getRocketClearIndices,
  isAreaBomb,
  isRocket,
} from "./powerUps";

export function expandPowerUpChain(
  board: Tile[],
  startingIndices: number[]
): number[] {
  const indicesToClear = new Set<number>(
    startingIndices
  );

  const queue = [...startingIndices];

  const activatedSpecialIndices =
    new Set<number>();

  while (queue.length > 0) {
    const currentIndex = queue.shift();

    if (currentIndex === undefined) {
      continue;
    }

    const tile = board[currentIndex];

    if (!tile) {
      continue;
    }

    if (
      activatedSpecialIndices.has(
        currentIndex
      )
    ) {
      continue;
    }

    let triggeredIndices: number[] = [];

    if (isAreaBomb(tile)) {
      activatedSpecialIndices.add(
        currentIndex
      );

      triggeredIndices =
        getAreaBombClearIndices(
          currentIndex
        );
    } else if (isRocket(tile)) {
      activatedSpecialIndices.add(
        currentIndex
      );

      triggeredIndices =
        getRocketClearIndices(
          board,
          currentIndex
        );
    }

    triggeredIndices.forEach(
      (triggeredIndex) => {
        if (
          !indicesToClear.has(
            triggeredIndex
          )
        ) {
          indicesToClear.add(
            triggeredIndex
          );

          queue.push(
            triggeredIndex
          );
        }
      }
    );
  }

  return [...indicesToClear];
}