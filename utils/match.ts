import type { Tile } from "../types/tile";

export type MatchDirection =
  | "horizontal"
  | "vertical";

export type MatchGroup = {
  indices: number[];
  direction: MatchDirection;
};

const BOARD_SIZE = 8;
const EMPTY_BALL = "⬛";

function isMatchableTile(
  tile: Tile | undefined
) {
  return (
    Boolean(tile) &&
    tile?.ball !== EMPTY_BALL &&
    tile?.special === null
  );
}

export function findMatchGroups(
  board: Tile[]
): MatchGroup[] {
  const groups: MatchGroup[] = [];

  // Yatay eşleşmeler
  for (
    let row = 0;
    row < BOARD_SIZE;
    row++
  ) {
    let startColumn = 0;

    while (
      startColumn < BOARD_SIZE
    ) {
      const startIndex =
        row * BOARD_SIZE +
        startColumn;

      const startTile =
        board[startIndex];

      if (
        !isMatchableTile(startTile)
      ) {
        startColumn++;
        continue;
      }

      const ball = startTile.ball;

      let endColumn =
        startColumn + 1;

      while (
        endColumn < BOARD_SIZE
      ) {
        const currentIndex =
          row * BOARD_SIZE +
          endColumn;

        const currentTile =
          board[currentIndex];

        if (
          !isMatchableTile(
            currentTile
          ) ||
          currentTile.ball !== ball
        ) {
          break;
        }

        endColumn++;
      }

      const matchLength =
        endColumn - startColumn;

      if (matchLength >= 3) {
        const indices: number[] =
          [];

        for (
          let column =
            startColumn;
          column < endColumn;
          column++
        ) {
          indices.push(
            row * BOARD_SIZE +
              column
          );
        }

        groups.push({
          indices,
          direction:
            "horizontal",
        });
      }

      startColumn =
        endColumn;
    }
  }

  // Dikey eşleşmeler
  for (
    let column = 0;
    column < BOARD_SIZE;
    column++
  ) {
    let startRow = 0;

    while (
      startRow < BOARD_SIZE
    ) {
      const startIndex =
        startRow * BOARD_SIZE +
        column;

      const startTile =
        board[startIndex];

      if (
        !isMatchableTile(startTile)
      ) {
        startRow++;
        continue;
      }

      const ball = startTile.ball;

      let endRow =
        startRow + 1;

      while (
        endRow < BOARD_SIZE
      ) {
        const currentIndex =
          endRow *
            BOARD_SIZE +
          column;

        const currentTile =
          board[currentIndex];

        if (
          !isMatchableTile(
            currentTile
          ) ||
          currentTile.ball !== ball
        ) {
          break;
        }

        endRow++;
      }

      const matchLength =
        endRow - startRow;

      if (matchLength >= 3) {
        const indices: number[] =
          [];

        for (
          let row = startRow;
          row < endRow;
          row++
        ) {
          indices.push(
            row * BOARD_SIZE +
              column
          );
        }

        groups.push({
          indices,
          direction:
            "vertical",
        });
      }

      startRow = endRow;
    }
  }

  return groups;
}

export function findMatches(
  board: Tile[]
): number[] {
  const groups =
    findMatchGroups(board);

  const matches =
    new Set<number>();

  groups.forEach((group) => {
    group.indices.forEach(
      (index) => {
        matches.add(index);
      }
    );
  });

  return [...matches];
}