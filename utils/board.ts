import type { Tile } from "../types/tile";
import { addLevelObstacles } from "./obstacles";

export const DEFAULT_BALLS = ["🏀", "⚽", "🎾"];

const BOARD_SIZE = 8;
const EMPTY_BALL = "⬛";

function createId() {
  return crypto.randomUUID();
}

function getSafeBalls(ballPool?: string[]) {
  return ballPool && ballPool.length >= 3 ? ballPool : DEFAULT_BALLS;
}

export function getRandomBall(ballPool: string[] = DEFAULT_BALLS) {
  const safeBalls = getSafeBalls(ballPool);
  return safeBalls[Math.floor(Math.random() * safeBalls.length)];
}

export function createTile(
  ball = getRandomBall(),
  ballPool: string[] = DEFAULT_BALLS
): Tile {
  return {
    id: createId(),
    ball: ball || getRandomBall(ballPool),
    special: null,
    obstacle: null,
  };
}

function createsStartingMatch(
  board: Tile[],
  index: number,
  ball: string
) {
  const row = Math.floor(index / BOARD_SIZE);
  const column = index % BOARD_SIZE;

  const createsHorizontalMatch =
    column >= 2 &&
    board[index - 1]?.ball === ball &&
    board[index - 2]?.ball === ball;

  const createsVerticalMatch =
    row >= 2 &&
    board[index - BOARD_SIZE]?.ball === ball &&
    board[index - BOARD_SIZE * 2]?.ball === ball;

  return createsHorizontalMatch || createsVerticalMatch;
}

export function createBoard(
  levelId = 1,
  ballPool: string[] = DEFAULT_BALLS
): Tile[] {
  const safeBalls = getSafeBalls(ballPool);
  const board: Tile[] = [];

  for (let index = 0; index < BOARD_SIZE * BOARD_SIZE; index++) {
    let ball = getRandomBall(safeBalls);

    while (createsStartingMatch(board, index, ball)) {
      ball = getRandomBall(safeBalls);
    }

    board.push(createTile(ball, safeBalls));
  }

  return addLevelObstacles(board, levelId);
}

export function createEmptyTile(): Tile {
  return {
    id: createId(),
    ball: EMPTY_BALL,
    special: null,
    obstacle: null,
  };
}

export function dropBalls(
  board: Tile[],
  ballPool: string[] = DEFAULT_BALLS
): Tile[] {
  const safeBalls = getSafeBalls(ballPool);
  const newBoard = board.map((tile) => ({
    ...tile,
    obstacle: tile.obstacle ? { ...tile.obstacle } : null,
  }));

  for (let column = 0; column < BOARD_SIZE; column++) {
    const remainingTiles: Tile[] = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
      const index = row * BOARD_SIZE + column;
      const tile = newBoard[index];

      if (tile.ball !== EMPTY_BALL) {
        remainingTiles.push(tile);
      }
    }

    const emptyCount = BOARD_SIZE - remainingTiles.length;

    const newTiles = Array.from({ length: emptyCount }, () =>
      createTile(getRandomBall(safeBalls), safeBalls)
    );

    const completedColumn = [...newTiles, ...remainingTiles];

    for (let row = 0; row < BOARD_SIZE; row++) {
      const index = row * BOARD_SIZE + column;
      newBoard[index] = completedColumn[row];
    }
  }

  return newBoard;
}