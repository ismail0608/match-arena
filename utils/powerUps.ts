import type { Tile } from "../types/tile";

const BOARD_SIZE = 8;

export function isRocket(tile?: Tile) {
  return (
    tile?.special === "rocket-horizontal" ||
    tile?.special === "rocket-vertical"
  );
}

export function isColorBomb(tile?: Tile) {
  return tile?.special === "bomb";
}

export function isAreaBomb(tile?: Tile) {
  return tile?.special === "area-bomb";
}

export function getRocketClearIndices(
  board: Tile[],
  index: number
): number[] {
  const special = board[index]?.special;

  if (special === "rocket-horizontal") {
    const row = Math.floor(index / BOARD_SIZE);

    return Array.from(
      { length: BOARD_SIZE },
      (_, column) =>
        row * BOARD_SIZE + column
    );
  }

  if (special === "rocket-vertical") {
    const column = index % BOARD_SIZE;

    return Array.from(
      { length: BOARD_SIZE },
      (_, row) =>
        row * BOARD_SIZE + column
    );
  }

  return [];
}

export function getRocketComboIndices(
  firstIndex: number,
  secondIndex: number
): number[] {
  const centerRow = Math.floor(
    secondIndex / BOARD_SIZE
  );

  const centerColumn =
    secondIndex % BOARD_SIZE;

  const indices = new Set<number>();

  for (
    let column = 0;
    column < BOARD_SIZE;
    column++
  ) {
    indices.add(
      centerRow * BOARD_SIZE + column
    );
  }

  for (
    let row = 0;
    row < BOARD_SIZE;
    row++
  ) {
    indices.add(
      row * BOARD_SIZE + centerColumn
    );
  }

  indices.add(firstIndex);
  indices.add(secondIndex);

  return [...indices];
}

export function getRocketAreaBombComboIndices(
  centerIndex: number
): number[] {
  const centerRow = Math.floor(
    centerIndex / BOARD_SIZE
  );

  const centerColumn =
    centerIndex % BOARD_SIZE;

  const indices = new Set<number>();

  for (
    let rowOffset = -1;
    rowOffset <= 1;
    rowOffset++
  ) {
    const row =
      centerRow + rowOffset;

    if (
      row < 0 ||
      row >= BOARD_SIZE
    ) {
      continue;
    }

    for (
      let column = 0;
      column < BOARD_SIZE;
      column++
    ) {
      indices.add(
        row * BOARD_SIZE + column
      );
    }
  }

  for (
    let columnOffset = -1;
    columnOffset <= 1;
    columnOffset++
  ) {
    const column =
      centerColumn + columnOffset;

    if (
      column < 0 ||
      column >= BOARD_SIZE
    ) {
      continue;
    }

    for (
      let row = 0;
      row < BOARD_SIZE;
      row++
    ) {
      indices.add(
        row * BOARD_SIZE + column
      );
    }
  }

  return [...indices];
}

export function getAreaBombClearIndices(
  index: number
): number[] {
  const centerRow = Math.floor(
    index / BOARD_SIZE
  );

  const centerColumn =
    index % BOARD_SIZE;

  const indices: number[] = [];

  for (
    let rowOffset = -1;
    rowOffset <= 1;
    rowOffset++
  ) {
    for (
      let columnOffset = -1;
      columnOffset <= 1;
      columnOffset++
    ) {
      const row =
        centerRow + rowOffset;

      const column =
        centerColumn +
        columnOffset;

      const isInsideBoard =
        row >= 0 &&
        row < BOARD_SIZE &&
        column >= 0 &&
        column < BOARD_SIZE;

      if (isInsideBoard) {
        indices.push(
          row * BOARD_SIZE + column
        );
      }
    }
  }

  return indices;
}

export function getAreaBombComboIndices(
  centerIndex: number
): number[] {
  const centerRow = Math.floor(
    centerIndex / BOARD_SIZE
  );

  const centerColumn =
    centerIndex % BOARD_SIZE;

  const indices: number[] = [];

  for (
    let rowOffset = -2;
    rowOffset <= 2;
    rowOffset++
  ) {
    for (
      let columnOffset = -2;
      columnOffset <= 2;
      columnOffset++
    ) {
      const row =
        centerRow + rowOffset;

      const column =
        centerColumn +
        columnOffset;

      const isInsideBoard =
        row >= 0 &&
        row < BOARD_SIZE &&
        column >= 0 &&
        column < BOARD_SIZE;

      if (isInsideBoard) {
        indices.push(
          row * BOARD_SIZE + column
        );
      }
    }
  }

  return indices;
}

export type ColorBombResult = {
  indicesToClear: number[];
  targetBall: string;
  bothAreColorBombs: boolean;
};

export function getColorBombResult(
  originalBoard: Tile[],
  swappedBoard: Tile[],
  firstIndex: number,
  secondIndex: number
): ColorBombResult {
  const firstTile =
    originalBoard[firstIndex];

  const secondTile =
    originalBoard[secondIndex];

  const bothAreColorBombs =
    isColorBomb(firstTile) &&
    isColorBomb(secondTile);

  if (bothAreColorBombs) {
    return {
      indicesToClear:
        swappedBoard.map(
          (_, index) => index
        ),
      targetBall: "",
      bothAreColorBombs: true,
    };
  }

  const colorBombWasFirst =
    isColorBomb(firstTile);

  const targetBall =
    colorBombWasFirst
      ? secondTile.ball
      : firstTile.ball;

  const colorBombIndex =
    swappedBoard[firstIndex]
      ?.special === "bomb"
      ? firstIndex
      : secondIndex;

  const indicesToClear =
    swappedBoard.reduce<number[]>(
      (
        indices,
        tile,
        index
      ) => {
        if (
          tile.ball === targetBall ||
          index === colorBombIndex
        ) {
          indices.push(index);
        }

        return indices;
      },
      []
    );

  return {
    indicesToClear,
    targetBall,
    bothAreColorBombs: false,
  };
}

export type ColorBombRocketResult = {
  indicesToClear: number[];
  targetBall: string;
  targetTileIndices: number[];
};

export function getColorBombRocketResult(
  originalBoard: Tile[],
  firstIndex: number,
  secondIndex: number
): ColorBombRocketResult {
  const firstTile =
    originalBoard[firstIndex];

  const secondTile =
    originalBoard[secondIndex];

  const rocketTile =
    isRocket(firstTile)
      ? firstTile
      : secondTile;

  const targetBall =
    rocketTile.ball;

  const targetTileIndices =
    originalBoard.reduce<number[]>(
      (
        indices,
        tile,
        index
      ) => {
        const isFirstColorBomb =
          index === firstIndex &&
          isColorBomb(firstTile);

        const isSecondColorBomb =
          index === secondIndex &&
          isColorBomb(secondTile);

        if (
          tile.ball === targetBall &&
          !isFirstColorBomb &&
          !isSecondColorBomb
        ) {
          indices.push(index);
        }

        return indices;
      },
      []
    );

  const indicesToClear =
    new Set<number>();

  targetTileIndices.forEach(
    (tileIndex, order) => {
      const row = Math.floor(
        tileIndex / BOARD_SIZE
      );

      const column =
        tileIndex % BOARD_SIZE;

      const useHorizontalRocket =
        order % 2 === 0;

      if (useHorizontalRocket) {
        for (
          let currentColumn = 0;
          currentColumn <
          BOARD_SIZE;
          currentColumn++
        ) {
          indicesToClear.add(
            row * BOARD_SIZE +
              currentColumn
          );
        }
      } else {
        for (
          let currentRow = 0;
          currentRow <
          BOARD_SIZE;
          currentRow++
        ) {
          indicesToClear.add(
            currentRow *
              BOARD_SIZE +
              column
          );
        }
      }
    }
  );

  indicesToClear.add(firstIndex);
  indicesToClear.add(secondIndex);

  targetTileIndices.forEach(
    (index) => {
      indicesToClear.add(index);
    }
  );

  return {
    indicesToClear: [
      ...indicesToClear,
    ],
    targetBall,
    targetTileIndices,
  };
}

export type ColorBombAreaBombResult = {
  targetBall: string;
  targetTileIndices: number[];
  startingIndices: number[];
};

export function getColorBombAreaBombResult(
  originalBoard: Tile[],
  firstIndex: number,
  secondIndex: number
): ColorBombAreaBombResult {
  const firstTile =
    originalBoard[firstIndex];

  const secondTile =
    originalBoard[secondIndex];

  const areaBombTile =
    isAreaBomb(firstTile)
      ? firstTile
      : secondTile;

  const targetBall =
    areaBombTile.ball;

  const targetTileIndices =
    originalBoard.reduce<number[]>(
      (
        indices,
        tile,
        index
      ) => {
        const isFirstColorBomb =
          index === firstIndex &&
          isColorBomb(firstTile);

        const isSecondColorBomb =
          index === secondIndex &&
          isColorBomb(secondTile);

        if (
          tile.ball === targetBall &&
          !isFirstColorBomb &&
          !isSecondColorBomb
        ) {
          indices.push(index);
        }

        return indices;
      },
      []
    );

  const startingIndices =
    new Set<number>([
      ...targetTileIndices,
      firstIndex,
      secondIndex,
    ]);

  return {
    targetBall,
    targetTileIndices,
    startingIndices: [
      ...startingIndices,
    ],
  };
}