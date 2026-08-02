import type { Tile } from "../types/tile";

export const balls = [
  "🏀",
  "⚽",
  "🏐",
  "🎾",
  "⚾",
  "🏈",
  "🏉",
  "🥎",
];

const BOARD_SIZE = 8;
const EMPTY_BALL = "⬛";

function createId() {
  return crypto.randomUUID();
}

export function getRandomBall() {
  return balls[Math.floor(Math.random() * balls.length)];
}

export function createTile(ball = getRandomBall()): Tile {
  return {
    id: createId(),
    ball,
    special: null,
  };
}

function createsStartingMatch(
  board: Tile[],
  index: number,
  ball: string
) {
  const row = Math.floor(index / BOARD_SIZE);
  const col = index % BOARD_SIZE;

  const createsHorizontalMatch =
    col >= 2 &&
    board[index - 1]?.ball === ball &&
    board[index - 2]?.ball === ball;

  const createsVerticalMatch =
    row >= 2 &&
    board[index - BOARD_SIZE]?.ball === ball &&
    board[index - BOARD_SIZE * 2]?.ball === ball;

  return createsHorizontalMatch || createsVerticalMatch;
}

export function createBoard(): Tile[] {
  const board: Tile[] = [];

  for (let index = 0; index < BOARD_SIZE * BOARD_SIZE; index++) {
    let tile = createTile();

    while (createsStartingMatch(board, index, tile.ball)) {
      tile = createTile();
    }

    board.push(tile);
  }

  return board;
}

export function createEmptyTile(): Tile {
  return {
    id: createId(),
    ball: EMPTY_BALL,
    special: null,
  };
}

export function dropBalls(board: Tile[]): Tile[] {
  const newBoard = [...board];

  for (let col = 0; col < BOARD_SIZE; col++) {
    const remainingTiles: Tile[] = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
      const index = row * BOARD_SIZE + col;
      const tile = newBoard[index];

      if (tile.ball !== EMPTY_BALL) {
        remainingTiles.push(tile);
      }
    }

    const emptyCount = BOARD_SIZE - remainingTiles.length;

    const newTiles = Array.from(
      { length: emptyCount },
      () => createTile()
    );

    const completedColumn = [
      ...newTiles,
      ...remainingTiles,
    ];

    for (let row = 0; row < BOARD_SIZE; row++) {
      const index = row * BOARD_SIZE + col;
      newBoard[index] = completedColumn[row];
    }
  }

  return newBoard;
}