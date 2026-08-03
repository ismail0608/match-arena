import type { Tile } from "../types/tile";

import {
  createEmptyTile,
  dropBalls,
} from "./board";

import {
  findMatchGroups,
  type MatchGroup,
} from "./match";

import { damageTiles } from "./obstacles";

const POINTS_PER_BALL = 10;

export type ResolveResult = {
  board: Tile[];
  scoreGain: number;
  comboCount: number;
};

type ShapeMatch = {
  intersectionIndex: number;
  groupIndices: number[];
};

function findShapeMatches(
  groups: MatchGroup[]
): ShapeMatch[] {
  const shapeMatches: ShapeMatch[] = [];

  for (
    let horizontalIndex = 0;
    horizontalIndex < groups.length;
    horizontalIndex++
  ) {
    const horizontalGroup = groups[horizontalIndex];

    if (horizontalGroup.direction !== "horizontal") {
      continue;
    }

    for (
      let verticalIndex = 0;
      verticalIndex < groups.length;
      verticalIndex++
    ) {
      const verticalGroup = groups[verticalIndex];

      if (verticalGroup.direction !== "vertical") {
        continue;
      }

      const intersectionIndex =
        horizontalGroup.indices.find((index) =>
          verticalGroup.indices.includes(index)
        );

      if (intersectionIndex === undefined) {
        continue;
      }

      const combinedIndices = new Set<number>([
        ...horizontalGroup.indices,
        ...verticalGroup.indices,
      ]);

      if (combinedIndices.size < 5) {
        continue;
      }

      shapeMatches.push({
        intersectionIndex,
        groupIndices: [
          horizontalIndex,
          verticalIndex,
        ],
      });
    }
  }

  return shapeMatches;
}

export function resolveBoard(
  startingBoard: Tile[],
  preferredSpecialIndex?: number,
  ballPool?: string[]
): ResolveResult {
  let currentBoard = startingBoard.map((tile) => ({
    ...tile,
    obstacle: tile.obstacle ? { ...tile.obstacle } : null,
  }));

  let scoreGain = 0;
  let comboCount = 0;
  let isFirstRound = true;

  while (true) {
    const groups = findMatchGroups(currentBoard);

    if (groups.length === 0) {
      break;
    }

    comboCount++;

    const matchedIndices = new Set<number>();
    const horizontalRocketIndices = new Set<number>();
    const verticalRocketIndices = new Set<number>();
    const areaBombIndices = new Set<number>();
    const colorBombIndices = new Set<number>();
    const consumedGroups = new Set<number>();

    groups.forEach((group) => {
      group.indices.forEach((index) => {
        matchedIndices.add(index);
      });
    });

    const shapeMatches = findShapeMatches(groups);

    shapeMatches.forEach((shapeMatch) => {
      let bombIndex = shapeMatch.intersectionIndex;

      if (
        isFirstRound &&
        preferredSpecialIndex !== undefined &&
        matchedIndices.has(preferredSpecialIndex)
      ) {
        bombIndex = preferredSpecialIndex;
      }

      if (!currentBoard[bombIndex]?.obstacle) {
        areaBombIndices.add(bombIndex);
      }

      shapeMatch.groupIndices.forEach((groupIndex) => {
        consumedGroups.add(groupIndex);
      });
    });

    groups.forEach((group, groupIndex) => {
      if (consumedGroups.has(groupIndex)) {
        return;
      }

      if (group.indices.length >= 5) {
        let colorBombIndex =
          group.indices[Math.floor(group.indices.length / 2)];

        if (
          isFirstRound &&
          preferredSpecialIndex !== undefined &&
          group.indices.includes(preferredSpecialIndex)
        ) {
          colorBombIndex = preferredSpecialIndex;
        }

        if (!currentBoard[colorBombIndex]?.obstacle) {
          colorBombIndices.add(colorBombIndex);
        }

        return;
      }

      if (group.indices.length === 4) {
        let rocketIndex =
          group.indices[Math.floor(group.indices.length / 2)];

        if (
          isFirstRound &&
          preferredSpecialIndex !== undefined &&
          group.indices.includes(preferredSpecialIndex)
        ) {
          rocketIndex = preferredSpecialIndex;
        }

        if (currentBoard[rocketIndex]?.obstacle) {
          return;
        }

        if (group.direction === "horizontal") {
          horizontalRocketIndices.add(rocketIndex);
        } else {
          verticalRocketIndices.add(rocketIndex);
        }
      }
    });

    const specialIndices = new Set<number>([
      ...horizontalRocketIndices,
      ...verticalRocketIndices,
      ...areaBombIndices,
      ...colorBombIndices,
    ]);

    const indicesToDamage = [...matchedIndices].filter(
      (index) => !specialIndices.has(index)
    );

    const damageResult = damageTiles(
      currentBoard,
      indicesToDamage
    );

    currentBoard = damageResult.board;

    areaBombIndices.forEach((index) => {
      currentBoard[index] = {
        ...currentBoard[index],
        special: "area-bomb",
      };
    });

    colorBombIndices.forEach((index) => {
      currentBoard[index] = {
        ...currentBoard[index],
        special: "bomb",
      };
    });

    horizontalRocketIndices.forEach((index) => {
      currentBoard[index] = {
        ...currentBoard[index],
        special: "rocket-horizontal",
      };
    });

    verticalRocketIndices.forEach((index) => {
      currentBoard[index] = {
        ...currentBoard[index],
        special: "rocket-vertical",
      };
    });

    scoreGain +=
      (damageResult.clearedCount * POINTS_PER_BALL +
        damageResult.damagedObstacleCount * 5) *
      comboCount;

    currentBoard = dropBalls(currentBoard, ballPool);

    // Buz bir darbeyi emdiğinde aynı eşleşmenin
    // aynı hamlede ikinci kez çalışmasını engelleriz.
    if (damageResult.damagedObstacleCount > 0) {
      break;
    }

    isFirstRound = false;
  }

  return {
    board: currentBoard,
    scoreGain,
    comboCount,
  };
}