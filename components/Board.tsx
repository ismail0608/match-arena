"use client";

import { useEffect, useRef, useState } from "react";
import { createBoard, dropBalls } from "../utils/board";
import {
  findMatchGroups,
  findMatches,
} from "../utils/match";
import ScorePanel from "./ScorePanel";
import Tile from "./Tile";

const STARTING_MOVES = 30;
const POINTS_PER_BALL = 10;
const EMPTY_CELL = "⬛";
const CUP_TILE = "🏆";

type ResolveResult = {
  board: string[];
  scoreGain: number;
  comboCount: number;
};

function resolveBoard(
  startingBoard: string[],
  preferredCupIndex?: number
): ResolveResult {
  let currentBoard = [...startingBoard];
  let scoreGain = 0;
  let combo = 0;
  let isFirstRound = true;

  while (true) {
    const groups = findMatchGroups(currentBoard);

    if (groups.length === 0) {
      break;
    }

    combo++;

    const matchedIndices = new Set<number>();
    const cupIndices = new Set<number>();

    groups.forEach((group) => {
      group.indices.forEach((index) => {
        matchedIndices.add(index);
      });

      if (group.indices.length === 4) {
        let cupIndex: number;

        const preferredIsInGroup =
          isFirstRound &&
          preferredCupIndex !== undefined &&
          group.indices.includes(preferredCupIndex);

        if (preferredIsInGroup) {
          cupIndex = preferredCupIndex;
        } else {
          cupIndex = group.indices[1];
        }

        cupIndices.add(cupIndex);
      }
    });

    let clearedCount = 0;

    matchedIndices.forEach((index) => {
      if (!cupIndices.has(index)) {
        currentBoard[index] = EMPTY_CELL;
        clearedCount++;
      }
    });

    cupIndices.forEach((index) => {
      currentBoard[index] = CUP_TILE;
    });

    scoreGain +=
      clearedCount * POINTS_PER_BALL * combo;

    currentBoard = dropBalls(currentBoard);
    isFirstRound = false;
  }

  return {
    board: currentBoard,
    scoreGain,
    comboCount: combo,
  };
}

export default function Board() {
  const [board, setBoard] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(STARTING_MOVES);
  const [actionText, setActionText] = useState("");
  const [pointsText, setPointsText] = useState("");

  const messageTimer =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setBoard(createBoard());

    return () => {
      if (messageTimer.current) {
        clearTimeout(messageTimer.current);
      }
    };
  }, []);

  function showMessage(message: string, points: number) {
    if (messageTimer.current) {
      clearTimeout(messageTimer.current);
    }

    setActionText(message);
    setPointsText(points > 0 ? `+${points}` : "");

    messageTimer.current = setTimeout(() => {
      setActionText("");
      setPointsText("");
    }, 1200);
  }

  function restartGame() {
    if (messageTimer.current) {
      clearTimeout(messageTimer.current);
    }

    setBoard(createBoard());
    setSelected(null);
    setScore(0);
    setMoves(STARTING_MOVES);
    setActionText("");
    setPointsText("");
  }

  function activateCup(index: number) {
    const row = Math.floor(index / 8);
    const newBoard = [...board];

    for (let col = 0; col < 8; col++) {
      newBoard[row * 8 + col] = EMPTY_CELL;
    }

    const droppedBoard = dropBalls(newBoard);
    const result = resolveBoard(droppedBoard);
    const totalPoints = 80 + result.scoreGain;

    setBoard(result.board);
    setScore((currentScore) => currentScore + totalPoints);
    setMoves((currentMoves) => currentMoves - 1);
    setSelected(null);

    showMessage("KUPA ATAĞI! 🏆", totalPoints);
  }

  function handleClick(index: number) {
    if (moves === 0) {
      return;
    }

    if (board[index] === CUP_TILE) {
      activateCup(index);
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
      firstMatches.includes(first) ||
      firstMatches.includes(index);

    if (!createsMatch) {
      setSelected(null);
      showMessage("GEÇERSİZ HAMLE", 0);
      return;
    }

    const result = resolveBoard(swappedBoard, index);

    setBoard(result.board);
    setScore(
      (currentScore) => currentScore + result.scoreGain
    );
    setMoves((currentMoves) => currentMoves - 1);
    setSelected(null);

    if (result.comboCount >= 2) {
      showMessage(
        `COMBO x${result.comboCount}! 🔥`,
        result.scoreGain
      );
    } else {
      showMessage("GÜZEL HAMLE! ⚡", result.scoreGain);
    }
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 px-4 py-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
        <div className="mb-5 text-center">
          <p className="text-sm font-bold tracking-[0.35em] text-yellow-400">
            SPORTS MATCH-3
          </p>

          <h1 className="mt-1 text-4xl font-black tracking-tight text-white">
            MATCH ARENA
          </h1>

          <p className="mt-2 text-sm text-slate-300">
            Topları eşleştir, kupaları kazan ve arenaya hükmet.
          </p>
        </div>

        <ScorePanel score={score} moves={moves} />

        <div className="relative rounded-[2rem] border border-white/10 bg-slate-900/80 p-3 shadow-2xl shadow-indigo-950/70 backdrop-blur-xl sm:p-5">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-yellow-300 to-transparent" />

          {(actionText || pointsText) && (
            <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
              <div className="animate-bounce rounded-2xl border border-yellow-300/40 bg-slate-950/95 px-7 py-4 text-center shadow-2xl shadow-yellow-500/20">
                <p className="text-2xl font-black text-yellow-400">
                  {actionText}
                </p>

                {pointsText && (
                  <p className="mt-1 text-xl font-black text-white">
                    {pointsText}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
            {board.map((ball, index) => (
              <Tile
                key={index}
                ball={ball}
                selected={selected === index}
                disabled={moves === 0}
                onClick={() => handleClick(index)}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">
          <span>🏆</span>
          <span>
            Dörtlü eşleşme yap ve kupa saldırısını kullan.
          </span>
        </div>

        {moves === 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-md">
            <div className="w-full max-w-sm rounded-3xl border border-yellow-400/30 bg-gradient-to-b from-slate-800 to-slate-950 p-8 text-center text-white shadow-2xl">
              <div className="text-6xl">🏆</div>

              <p className="mt-4 text-sm font-bold tracking-[0.3em] text-yellow-400">
                MAÇ SONU
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Arena tamamlandı!
              </h2>

              <p className="mt-5 text-slate-300">
                Toplam skorun
              </p>

              <p className="mt-1 text-5xl font-black text-yellow-400">
                {score}
              </p>

              <button
                type="button"
                onClick={restartGame}
                className="mt-7 w-full rounded-xl bg-yellow-400 px-5 py-3 font-black text-slate-950 shadow-lg transition hover:scale-105 hover:bg-yellow-300"
              >
                YENİDEN OYNA
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}