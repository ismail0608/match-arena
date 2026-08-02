export type MatchDirection = "horizontal" | "vertical";

export type MatchGroup = {
  indices: number[];
  direction: MatchDirection;
};

const BOARD_SIZE = 8;
const EMPTY_CELL = "⬛";

export function findMatchGroups(board: string[]): MatchGroup[] {
  const groups: MatchGroup[] = [];

  // Yatay eşleşmeler
  for (let row = 0; row < BOARD_SIZE; row++) {
    let startCol = 0;

    while (startCol < BOARD_SIZE) {
      const startIndex = row * BOARD_SIZE + startCol;
      const ball = board[startIndex];

      let endCol = startCol + 1;

      while (
        endCol < BOARD_SIZE &&
        ball !== EMPTY_CELL &&
        board[row * BOARD_SIZE + endCol] === ball
      ) {
        endCol++;
      }

      const length = endCol - startCol;

      if (ball !== EMPTY_CELL && length >= 3) {
        const indices: number[] = [];

        for (let col = startCol; col < endCol; col++) {
          indices.push(row * BOARD_SIZE + col);
        }

        groups.push({
          indices,
          direction: "horizontal",
        });
      }

      startCol = endCol;
    }
  }

  // Dikey eşleşmeler
  for (let col = 0; col < BOARD_SIZE; col++) {
    let startRow = 0;

    while (startRow < BOARD_SIZE) {
      const startIndex = startRow * BOARD_SIZE + col;
      const ball = board[startIndex];

      let endRow = startRow + 1;

      while (
        endRow < BOARD_SIZE &&
        ball !== EMPTY_CELL &&
        board[endRow * BOARD_SIZE + col] === ball
      ) {
        endRow++;
      }

      const length = endRow - startRow;

      if (ball !== EMPTY_CELL && length >= 3) {
        const indices: number[] = [];

        for (let row = startRow; row < endRow; row++) {
          indices.push(row * BOARD_SIZE + col);
        }

        groups.push({
          indices,
          direction: "vertical",
        });
      }

      startRow = endRow;
    }
  }

  return groups;
}

export function findMatches(board: string[]) {
  const groups = findMatchGroups(board);
  const matches = new Set<number>();

  groups.forEach((group) => {
    group.indices.forEach((index) => {
      matches.add(index);
    });
  });

  return [...matches];
}