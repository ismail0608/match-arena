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
const EMPTY_CELL = "⬛";

export function getRandomBall() {
  return balls[Math.floor(Math.random() * balls.length)];
}

function createsStartingMatch(board: string[], index: number, ball: string) {
  const row = Math.floor(index / BOARD_SIZE);
  const col = index % BOARD_SIZE;

  const createsHorizontalMatch =
    col >= 2 &&
    board[index - 1] === ball &&
    board[index - 2] === ball;

  const createsVerticalMatch =
    row >= 2 &&
    board[index - BOARD_SIZE] === ball &&
    board[index - BOARD_SIZE * 2] === ball;

  return createsHorizontalMatch || createsVerticalMatch;
}

export function createBoard() {
  const board: string[] = [];

  for (let index = 0; index < BOARD_SIZE * BOARD_SIZE; index++) {
    let ball = getRandomBall();

    while (createsStartingMatch(board, index, ball)) {
      ball = getRandomBall();
    }

    board.push(ball);
  }

  return board;
}

export function dropBalls(board: string[]) {
  const newBoard = [...board];

  for (let col = 0; col < BOARD_SIZE; col++) {
    const remainingBalls: string[] = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
      const index = row * BOARD_SIZE + col;

      if (newBoard[index] !== EMPTY_CELL) {
        remainingBalls.push(newBoard[index]);
      }
    }

    const emptyCount = BOARD_SIZE - remainingBalls.length;

    const newBalls = Array.from(
      { length: emptyCount },
      () => getRandomBall()
    );

    const completedColumn = [...newBalls, ...remainingBalls];

    for (let row = 0; row < BOARD_SIZE; row++) {
      const index = row * BOARD_SIZE + col;
      newBoard[index] = completedColumn[row];
    }
  }

  return newBoard;
}