"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import type { Tile as TileType } from "../types/tile";
import {
  createBoard,
  createEmptyTile,
  dropBalls,
} from "../utils/board";
import {
  findMatchGroups,
  findMatches,
} from "../utils/match";
import { playGameSound } from "../utils/sound";
import ComboPopup from "./ComboPopup";
import GameOverModal from "./GameOverModal";
import PauseModal from "./PauseModal";
import ScorePanel from "./ScorePanel";
import Tile from "./Tile";

const BOARD_SIZE = 8;
const STARTING_MOVES = 30;
const POINTS_PER_BALL = 10;
const EXPLOSION_DURATION = 320;

type BoardProps = {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  animationsEnabled: boolean;
  onExit: () => void;
  onGameEnd: (score: number) => void;
};

type ResolveResult = {
  board: TileType[];
  scoreGain: number;
  comboCount: number;
};

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function vibrate(
  pattern: number | number[],
  enabled: boolean
) {
  if (!enabled) {
    return;
  }

  if (
    typeof navigator !== "undefined" &&
    "vibrate" in navigator
  ) {
    navigator.vibrate(pattern);
  }
}

function resolveBoard(
  startingBoard: TileType[],
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
        let cupIndex = group.indices[1];

        if (
          isFirstRound &&
          preferredCupIndex !== undefined &&
          group.indices.includes(preferredCupIndex)
        ) {
          cupIndex = preferredCupIndex;
        }

        cupIndices.add(cupIndex);
      }
    });

    let clearedCount = 0;

    matchedIndices.forEach((index) => {
      if (cupIndices.has(index)) {
        currentBoard[index] = {
          ...currentBoard[index],
          special: "cup",
        };

        return;
      }

      currentBoard[index] = createEmptyTile();
      clearedCount++;
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

export default function Board({
  soundEnabled,
  vibrationEnabled,
  animationsEnabled,
  onExit,
  onGameEnd,
}: BoardProps) {
  const [board, setBoard] = useState<TileType[]>([]);
  const [selected, setSelected] =
    useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] =
    useState(STARTING_MOVES);
  const [actionText, setActionText] = useState("");
  const [pointsText, setPointsText] = useState("");
  const [explodingIds, setExplodingIds] =
    useState<Set<string>>(new Set());
  const [isResolving, setIsResolving] =
    useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const messageTimer =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const gameReportedRef = useRef(false);

  useEffect(() => {
    setBoard(createBoard());

    return () => {
      if (messageTimer.current) {
        clearTimeout(messageTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (
      moves === 0 &&
      !gameReportedRef.current
    ) {
      gameReportedRef.current = true;
      onGameEnd(score);
    }
  }, [moves, score, onGameEnd]);

  function showMessage(
    message: string,
    points: number
  ) {
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

  async function playExplosion(
    indices: number[]
  ) {
    const ids = indices
      .map((index) => board[index]?.id)
      .filter(
        (id): id is string => Boolean(id)
      );

    setExplodingIds(new Set(ids));

    if (animationsEnabled) {
      await wait(EXPLOSION_DURATION);
    }

    setExplodingIds(new Set());
  }

  function restartGame() {
    if (messageTimer.current) {
      clearTimeout(messageTimer.current);
    }

    gameReportedRef.current = false;

    setBoard(createBoard());
    setSelected(null);
    setScore(0);
    setMoves(STARTING_MOVES);
    setActionText("");
    setPointsText("");
    setExplodingIds(new Set());
    setIsResolving(false);
    setIsPaused(false);
  }

  async function activateCup(index: number) {
    if (isResolving || isPaused) {
      return;
    }

    setIsResolving(true);

    playGameSound("cup", soundEnabled);
    vibrate(
      [80, 40, 120],
      vibrationEnabled
    );

    const row = Math.floor(
      index / BOARD_SIZE
    );

    const rowIndices = Array.from(
      { length: BOARD_SIZE },
      (_, col) =>
        row * BOARD_SIZE + col
    );

    await playExplosion(rowIndices);

    const newBoard = [...board];

    rowIndices.forEach((rowIndex) => {
      newBoard[rowIndex] =
        createEmptyTile();
    });

    const droppedBoard =
      dropBalls(newBoard);

    const result =
      resolveBoard(droppedBoard);

    const totalPoints =
      BOARD_SIZE *
        POINTS_PER_BALL +
      result.scoreGain;

    setBoard(result.board);

    setScore(
      (currentScore) =>
        currentScore + totalPoints
    );

    setMoves(
      (currentMoves) =>
        currentMoves - 1
    );

    setSelected(null);
    setIsResolving(false);

    showMessage(
      "KUPA ATAĞI! 🏆",
      totalPoints
    );
  }

  async function handleClick(
    index: number
  ) {
    if (
      moves === 0 ||
      isResolving ||
      isPaused
    ) {
      return;
    }

    if (
      board[index]?.special === "cup"
    ) {
      await activateCup(index);
      return;
    }

    if (selected === null) {
      setSelected(index);

      playGameSound(
        "select",
        soundEnabled
      );

      vibrate(
        15,
        vibrationEnabled
      );

      return;
    }

    const first = selected;

    if (first === index) {
      setSelected(null);
      return;
    }

    const row1 = Math.floor(
      first / BOARD_SIZE
    );

    const col1 =
      first % BOARD_SIZE;

    const row2 = Math.floor(
      index / BOARD_SIZE
    );

    const col2 =
      index % BOARD_SIZE;

    const isNeighbor =
      Math.abs(row1 - row2) +
        Math.abs(col1 - col2) ===
      1;

    if (!isNeighbor) {
      setSelected(index);

      playGameSound(
        "select",
        soundEnabled
      );

      vibrate(
        15,
        vibrationEnabled
      );

      return;
    }

    const swappedBoard = [...board];

    [
      swappedBoard[first],
      swappedBoard[index],
    ] = [
      swappedBoard[index],
      swappedBoard[first],
    ];

    const firstMatches =
      findMatches(swappedBoard);

    const createsMatch =
      firstMatches.includes(first) ||
      firstMatches.includes(index);

    if (!createsMatch) {
      setSelected(null);

      playGameSound(
        "invalid",
        soundEnabled
      );

      vibrate(
        [40, 30, 40],
        vibrationEnabled
      );

      showMessage(
        "GEÇERSİZ HAMLE",
        0
      );

      return;
    }

    setIsResolving(true);
    setSelected(null);

    const explodingTileIds =
      firstMatches
        .map(
          (matchedIndex) =>
            swappedBoard[
              matchedIndex
            ]?.id
        )
        .filter(
          (id): id is string =>
            Boolean(id)
        );

    setBoard(swappedBoard);

    setExplodingIds(
      new Set(explodingTileIds)
    );

    vibrate(
      35,
      vibrationEnabled
    );

    if (animationsEnabled) {
      await wait(EXPLOSION_DURATION);
    }

    setExplodingIds(new Set());

    const result = resolveBoard(
      swappedBoard,
      index
    );

    setBoard(result.board);

    setScore(
      (currentScore) =>
        currentScore +
        result.scoreGain
    );

    setMoves(
      (currentMoves) =>
        currentMoves - 1
    );

    setIsResolving(false);

    if (result.comboCount >= 2) {
      playGameSound(
        "combo",
        soundEnabled
      );

      vibrate(
        [40, 30, 70],
        vibrationEnabled
      );
    } else {
      playGameSound(
        "match",
        soundEnabled
      );
    }

    if (result.comboCount >= 4) {
      showMessage(
        `EFSANEVİ COMBO x${result.comboCount}! 🏆`,
        result.scoreGain
      );
    } else if (
      result.comboCount >= 3
    ) {
      showMessage(
        `MÜTHİŞ COMBO x${result.comboCount}! 🔥`,
        result.scoreGain
      );
    } else if (
      result.comboCount === 2
    ) {
      showMessage(
        "COMBO x2! ⚡",
        result.scoreGain
      );
    } else {
      showMessage(
        "GÜZEL HAMLE! ⚡",
        result.scoreGain
      );
    }
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 px-4 py-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
        <div className="mb-5 flex w-full max-w-xl items-start justify-between">
          <div>
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

          <button
            type="button"
            disabled={
              isResolving ||
              moves === 0
            }
            onClick={() => {
              setSelected(null);
              setIsPaused(true);
            }}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-xl text-white shadow-lg transition hover:scale-105 disabled:opacity-40"
          >
            ⏸️
          </button>
        </div>

        <ScorePanel
          score={score}
          moves={moves}
        />

        <div className="relative rounded-[2rem] border border-white/10 bg-slate-900/80 p-3 shadow-2xl shadow-indigo-950/70 backdrop-blur-xl sm:p-5">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-yellow-300 to-transparent" />

          <ComboPopup
            actionText={actionText}
            pointsText={pointsText}
          />

          <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
            {board.map(
              (tile, index) => (
                <Tile
                  key={tile.id}
                  tile={tile}
                  selected={
                    selected === index
                  }
                  disabled={
                    moves === 0 ||
                    isResolving ||
                    isPaused
                  }
                  exploding={
                    explodingIds.has(
                      tile.id
                    )
                  }
                  animationsEnabled={
                    animationsEnabled
                  }
                  onClick={() =>
                    handleClick(index)
                  }
                />
              )
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">
          <span>🏆</span>

          <span>
            Dörtlü eşleşme yap ve kupa saldırısını kullan.
          </span>
        </div>

        {isPaused && (
          <PauseModal
            onResume={() =>
              setIsPaused(false)
            }
            onRestart={restartGame}
            onExit={onExit}
          />
        )}

        {moves === 0 && (
          <GameOverModal
  score={score}
  earnedCoins={Math.floor(score / 10)}
  onRestart={restartGame}
  onExit={onExit}
/>
        )}
      </div>
    </main>
  );
}