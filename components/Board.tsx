"use client";

import { useEffect, useState } from "react";
import { createBoard, dropBalls } from "../utils/board";
import { findMatches } from "../utils/match";

const STARTING_MOVES = 30;
const POINTS_PER_BALL = 10;

function resolveBoard(startingBoard: string[]) {
  let currentBoard = [...startingBoard];
  let totalMatched = 0;
  let combo = 0;

  while (true) {
    const matches = findMatches(currentBoard);

    if (matches.length === 0) {
      break;
    }

    combo++;

    totalMatched += matches.length * combo;

    matches.forEach((matchedIndex) => {
      currentBoard[matchedIndex] = "⬛";
    });

    currentBoard = dropBalls(currentBoard);
  }

  return {
    board: currentBoard,
    scoreGain: totalMatched * POINTS_PER_BALL,
  };
}

export default function Board() {
  const [board, setBoard] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(STARTING_MOVES);

  useEffect(() => {
    setBoard(createBoard());
  }, []);

  function restartGame() {
    setBoard(createBoard());
    setSelected(null);
    setScore(0);
    setMoves(STARTING_MOVES);
  }

  function handleClick(index: number) {
    if (moves === 0) {
      return;
    }

    if (selected === null) {
      setSelected(index);
      return;
    }

    const first = selected;

    if (first === index) {
      setSelected(null);
      return;
    }

    const row1 = Math.floor(first / 8);
    const col1 = first % 8;

    const row2 = Math.floor(index / 8);
    const col2 = index % 8;

    const isNeighbor =
      Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;

    if (!isNeighbor) {
      setSelected(index);
      return;
    }

    const swappedBoard = [...board];

    [swappedBoard[first], swappedBoard[index]] = [
      swappedBoard[index],
      swappedBoard[first],
    ];

    const firstMatches = findMatches(swappedBoard);

    const createsMatch =
      firstMatches.includes(first) || firstMatches.includes(index);

    if (!createsMatch) {
      setSelected(null);
      return;
    }

    const result = resolveBoard(swappedBoard);

    setBoard(result.board);
    setScore((currentScore) => currentScore + result.scoreGain);
    setMoves((currentMoves) => currentMoves - 1);
    setSelected(null);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-xl items-center justify-between rounded-xl bg-slate-800 px-5 py-3 text-white shadow-lg">
        <div>
          <p className="text-sm text-slate-300">Skor</p>
          <p className="text-2xl font-bold">{score}</p>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-300">Kalan hamle</p>
          <p className="text-2xl font-bold">{moves}</p>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-2 rounded-2xl bg-slate-800 p-4 shadow-xl">
        {board.map((ball, index) => (
          <button
            key={index}
            type="button"
            disabled={moves === 0}
            onClick={() => handleClick(index)}
            className={`flex h-14 w-14 items-center justify-center rounded-xl text-3xl transition ${
              selected === index
                ? "scale-110 bg-yellow-400"
                : "bg-slate-700 hover:scale-110"
            } ${
              moves === 0
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer"
            }`}
          >
            {ball}
          </button>
        ))}
      </div>

      {moves === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl bg-slate-800 px-8 py-5 text-white shadow-lg">
          <p className="text-2xl font-bold">Oyun bitti</p>

          <p>
            Toplam skorun:{" "}
            <span className="font-bold text-yellow-400">{score}</span>
          </p>

          <button
            type="button"
            onClick={restartGame}
            className="rounded-lg bg-yellow-400 px-5 py-2 font-bold text-slate-900 transition hover:scale-105"
          >
            Yeniden başla
          </button>
        </div>
      )}
    </div>
  );
}