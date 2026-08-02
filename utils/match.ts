export function findMatches(board: string[]) {
  const matches = new Set<number>();

  // Yatay eşleşmeler
  for (let row = 0; row < 8; row++) {
    let count = 1;

    for (let col = 1; col < 8; col++) {
      const current = row * 8 + col;
      const previous = row * 8 + col - 1;

      if (
        board[current] === board[previous] &&
        board[current] !== "⬛"
      ) {
        count++;
      } else {
        if (count >= 3) {
          for (let i = 0; i < count; i++) {
            matches.add(previous - i);
          }
        }
        count = 1;
      }
    }

    if (count >= 3) {
      const last = row * 8 + 7;
      for (let i = 0; i < count; i++) {
        matches.add(last - i);
      }
    }
  }

  // Dikey eşleşmeler
  for (let col = 0; col < 8; col++) {
    let count = 1;

    for (let row = 1; row < 8; row++) {
      const current = row * 8 + col;
      const previous = (row - 1) * 8 + col;

      if (
        board[current] === board[previous] &&
        board[current] !== "⬛"
      ) {
        count++;
      } else {
        if (count >= 3) {
          for (let i = 0; i < count; i++) {
            matches.add(previous - i * 8);
          }
        }
        count = 1;
      }
    }

    if (count >= 3) {
      const last = 7 * 8 + col;
      for (let i = 0; i < count; i++) {
        matches.add(last - i * 8);
      }
    }
  }

  return [...matches];
}