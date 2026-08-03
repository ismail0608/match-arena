"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type { GameReward } from "../types/progress";
import type { Tile as TileType } from "../types/tile";

import {
  createBoard,
  dropBalls,
} from "../utils/board";

import {
  expandPowerUpChain,
} from "../utils/chainReaction";

import {
  EXPLOSION_DURATION,
  vibrate,
  wait,
} from "../utils/gameEffects";

import {
  getLevelById,
  getLevelResult,
} from "../utils/levels";

import { findMatches } from "../utils/match";

import {
  getAreaBombClearIndices,
  getAreaBombComboIndices,
  getColorBombAreaBombResult,
  getColorBombResult,
  getColorBombRocketResult,
  getRocketAreaBombComboIndices,
  getRocketClearIndices,
  getRocketComboIndices,
  isAreaBomb,
  isColorBomb,
  isRocket,
} from "../utils/powerUps";

import { damageTiles } from "../utils/obstacles";
import { resolveBoard } from "../utils/resolver";
import { playGameSound } from "../utils/sound";

import ComboPopup from "./ComboPopup";
import GameOverModal from "./GameOverModal";
import PauseModal from "./PauseModal";
import ScorePanel from "./ScorePanel";
import Tile from "./Tile";
import TutorialModal from "./TutorialModal";

const BOARD_SIZE = 8;
const POINTS_PER_BALL = 10;

type BoardProps = {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  animationsEnabled: boolean;
  onExit: () => void;
  levelId: number;
  onGameEnd: (
    score: number
  ) => GameReward;
  onLevelComplete: (
    levelId: number,
    score: number,
    stars: number
  ) => void;
};

export default function Board({
  soundEnabled,
  vibrationEnabled,
  levelId,
  animationsEnabled,
  onExit,
  onGameEnd,
  onLevelComplete,
}: BoardProps) {
  const currentLevel =
    getLevelById(levelId);
  const [board, setBoard] =
    useState<TileType[]>([]);

  const [selected, setSelected] =
    useState<number | null>(null);

  const [score, setScore] =
    useState(0);

  const [moves, setMoves] =
    useState(currentLevel.moves);

  const [actionText, setActionText] =
    useState("");

  const [pointsText, setPointsText] =
    useState("");

  const [
    explodingIds,
    setExplodingIds,
  ] = useState<Set<string>>(
    new Set()
  );

  const [
    isResolving,
    setIsResolving,
  ] = useState(false);

  const [isPaused, setIsPaused] =
    useState(false);

  const [showTutorial, setShowTutorial] =
    useState(true);

  const [
    gameReward,
    setGameReward,
  ] = useState<GameReward | null>(
    null
  );

  const messageTimer =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  const gameReportedRef =
    useRef(false);

  useEffect(() => {
    setBoard(createBoard(levelId, currentLevel.balls));

    return () => {
      if (messageTimer.current) {
        clearTimeout(
          messageTimer.current
        );
      }
    };
  }, []);

  useEffect(() => {
    gameReportedRef.current = false;
    setBoard(createBoard(levelId, currentLevel.balls));
    setSelected(null);
    setScore(0);
    setMoves(currentLevel.moves);
    setActionText("");
    setPointsText("");
    setExplodingIds(new Set());
    setIsResolving(false);
    setIsPaused(false);
    setShowTutorial(true);
    setGameReward(null);
  }, [levelId, currentLevel.moves]);

  useEffect(() => {
    if (
      moves !== 0 ||
      gameReportedRef.current
    ) {
      return;
    }

    gameReportedRef.current = true;

    const levelResult =
      getLevelResult(
        score,
        currentLevel
      );

    if (levelResult.won) {
      onLevelComplete(
        levelId,
        score,
        levelResult.stars
      );

      const reward =
        onGameEnd(score);

      setGameReward(reward);
    } else {
      setGameReward(null);
    }
  }, [
    moves,
    score,
    onGameEnd,
    onLevelComplete,
    levelId,
    currentLevel,
  ]);

  function showMessage(
    message: string,
    points: number
  ) {
    if (messageTimer.current) {
      clearTimeout(
        messageTimer.current
      );
    }

    setActionText(message);

    setPointsText(
      points > 0
        ? `+${points}`
        : ""
    );

    messageTimer.current =
      setTimeout(() => {
        setActionText("");
        setPointsText("");
      }, 1200);
  }

  async function animateExplosion(
    sourceBoard: TileType[],
    indices: number[]
  ) {
    const uniqueIndices = [
      ...new Set(indices),
    ];

    const ids = uniqueIndices
      .map(
        (index) =>
          sourceBoard[index]?.id
      )
      .filter(
        (id): id is string =>
          Boolean(id)
      );

    setExplodingIds(
      new Set(ids)
    );

    if (animationsEnabled) {
      await wait(
        EXPLOSION_DURATION
      );
    }

    setExplodingIds(new Set());
  }

  function finishPowerUp(
    resultBoard: TileType[],
    points: number
  ) {
    setBoard(resultBoard);

    setScore(
      (currentScore) =>
        currentScore + points
    );

    setMoves(
      (currentMoves) =>
        Math.max(
          0,
          currentMoves - 1
        )
    );

    setSelected(null);
    setIsResolving(false);
  }

  function restartGame() {
    if (messageTimer.current) {
      clearTimeout(
        messageTimer.current
      );
    }

    gameReportedRef.current =
      false;

    setBoard(createBoard(levelId, currentLevel.balls));
    setSelected(null);
    setScore(0);
    setMoves(
      currentLevel.moves
    );
    setActionText("");
    setPointsText("");
    setExplodingIds(new Set());
    setIsResolving(false);
    setIsPaused(false);
    setShowTutorial(true);
    setGameReward(null);
  }

  async function clearPowerUpArea(
    sourceBoard: TileType[],
    startingIndices: number[],
    pointMultiplier = 1
  ) {
    const chainedIndices =
      expandPowerUpChain(
        sourceBoard,
        startingIndices
      );

    await animateExplosion(
      sourceBoard,
      chainedIndices
    );

    const damageResult =
      damageTiles(
        sourceBoard,
        chainedIndices
      );

    const result =
      resolveBoard(
        dropBalls(
          damageResult.board,
          currentLevel.balls
        ),
        undefined,
        currentLevel.balls
      );

    const powerUpPoints =
      (damageResult.clearedCount *
        POINTS_PER_BALL +
        damageResult.damagedObstacleCount *
          5) *
      pointMultiplier;

    return {
      board: result.board,
      points:
        powerUpPoints +
        result.scoreGain,
      clearedCount:
        damageResult.clearedCount,
      damagedObstacleCount:
        damageResult.damagedObstacleCount,
    };
  }

  async function activateRocket(
    index: number
  ) {
    const rocketTile =
      board[index];

    if (
      isResolving ||
      isPaused ||
      !isRocket(rocketTile)
    ) {
      return;
    }

    const indicesToClear =
      getRocketClearIndices(
        board,
        index
      );

    if (
      indicesToClear.length === 0
    ) {
      return;
    }

    setIsResolving(true);
    setSelected(null);

    playGameSound(
      "cup",
      soundEnabled
    );

    vibrate(
      [70, 30, 110],
      vibrationEnabled
    );

    const result =
      await clearPowerUpArea(
        board,
        indicesToClear
      );

    finishPowerUp(
      result.board,
      result.points
    );

    showMessage(
      rocketTile.special ===
        "rocket-horizontal"
        ? "YATAY ROKET! 🚀"
        : "DİKEY ROKET! 🚀",
      result.points
    );
  }

  async function activateRocketCombo(
    firstIndex: number,
    secondIndex: number,
    swappedBoard: TileType[]
  ) {
    const indicesToClear =
      getRocketComboIndices(
        firstIndex,
        secondIndex
      );

    setIsResolving(true);
    setSelected(null);
    setBoard(swappedBoard);

    playGameSound(
      "combo",
      soundEnabled
    );

    vibrate(
      [
        80,
        30,
        100,
        30,
        150,
      ],
      vibrationEnabled
    );

    const result =
      await clearPowerUpArea(
        swappedBoard,
        indicesToClear,
        2
      );

    finishPowerUp(
      result.board,
      result.points
    );

    showMessage(
      "ÇİFTE ROKET! 🚀🚀",
      result.points
    );
  }

  async function activateRocketAreaBombCombo(
    centerIndex: number,
    swappedBoard: TileType[]
  ) {
    const indicesToClear =
      getRocketAreaBombComboIndices(
        centerIndex
      );

    setIsResolving(true);
    setSelected(null);
    setBoard(swappedBoard);

    playGameSound(
      "combo",
      soundEnabled
    );

    vibrate(
      [
        100,
        30,
        120,
        30,
        180,
      ],
      vibrationEnabled
    );

    const result =
      await clearPowerUpArea(
        swappedBoard,
        indicesToClear,
        3
      );

    finishPowerUp(
      result.board,
      result.points
    );

    showMessage(
      "ROKET BOMBASI! 🚀💣",
      result.points
    );
  }

  async function activateAreaBomb(
    index: number
  ) {
    const bombTile =
      board[index];

    if (
      isResolving ||
      isPaused ||
      !isAreaBomb(bombTile)
    ) {
      return;
    }

    const indicesToClear =
      getAreaBombClearIndices(
        index
      );

    setIsResolving(true);
    setSelected(null);

    playGameSound(
      "combo",
      soundEnabled
    );

    vibrate(
      [90, 40, 160],
      vibrationEnabled
    );

    const result =
      await clearPowerUpArea(
        board,
        indicesToClear,
        2
      );

    finishPowerUp(
      result.board,
      result.points
    );

    showMessage(
      result.clearedCount > 9
        ? "ZİNCİRLEME BOMBA! 💣💥"
        : "ALAN BOMBASI! 💣",
      result.points
    );
  }

  async function activateAreaBombCombo(
    centerIndex: number,
    swappedBoard: TileType[]
  ) {
    const indicesToClear =
      getAreaBombComboIndices(
        centerIndex
      );

    setIsResolving(true);
    setSelected(null);
    setBoard(swappedBoard);

    playGameSound(
      "combo",
      soundEnabled
    );

    vibrate(
      [
        120,
        40,
        160,
        40,
        220,
      ],
      vibrationEnabled
    );

    const result =
      await clearPowerUpArea(
        swappedBoard,
        indicesToClear,
        4
      );

    finishPowerUp(
      result.board,
      result.points
    );

    showMessage(
      "MEGA BOMBA! 💣💣",
      result.points
    );
  }

  async function activateColorBombRocketCombo(
    firstIndex: number,
    secondIndex: number,
    swappedBoard: TileType[]
  ) {
    const {
      indicesToClear,
      targetBall,
      targetTileIndices,
    } = getColorBombRocketResult(
      board,
      firstIndex,
      secondIndex
    );

    setIsResolving(true);
    setSelected(null);

    const previewBoard =
      swappedBoard.map(
        (tile) => ({ ...tile })
      );

    targetTileIndices.forEach(
      (tileIndex, order) => {
        previewBoard[tileIndex] = {
          ...previewBoard[tileIndex],
          special:
            order % 2 === 0
              ? "rocket-horizontal"
              : "rocket-vertical",
        };
      }
    );

    setBoard(previewBoard);

    playGameSound(
      "combo",
      soundEnabled
    );

    vibrate(
      [
        80,
        30,
        100,
        30,
        120,
        30,
        180,
      ],
      vibrationEnabled
    );

    if (animationsEnabled) {
      await wait(450);
    }

    const result =
      await clearPowerUpArea(
        previewBoard,
        indicesToClear,
        4
      );

    finishPowerUp(
      result.board,
      result.points
    );

    showMessage(
      `${targetBall} ROKET YAĞMURU! 🌈🚀`,
      result.points
    );
  }

  async function activateColorBombAreaBombCombo(
    firstIndex: number,
    secondIndex: number,
    swappedBoard: TileType[]
  ) {
    const {
      targetBall,
      targetTileIndices,
      startingIndices,
    } = getColorBombAreaBombResult(
      board,
      firstIndex,
      secondIndex
    );

    setIsResolving(true);
    setSelected(null);

    const previewBoard =
      swappedBoard.map(
        (tile) => ({ ...tile })
      );

    targetTileIndices.forEach(
      (tileIndex) => {
        previewBoard[tileIndex] = {
          ...previewBoard[tileIndex],
          special: "area-bomb",
        };
      }
    );

    setBoard(previewBoard);

    playGameSound(
      "combo",
      soundEnabled
    );

    vibrate(
      [
        100,
        30,
        120,
        30,
        160,
        30,
        220,
      ],
      vibrationEnabled
    );

    if (animationsEnabled) {
      await wait(500);
    }

    const result =
      await clearPowerUpArea(
        previewBoard,
        startingIndices,
        5
      );

    finishPowerUp(
      result.board,
      result.points
    );

    showMessage(
      `${targetBall} BOMBA YAĞMURU! 🌈💣`,
      result.points
    );
  }

  async function activateColorBomb(
    firstIndex: number,
    secondIndex: number,
    swappedBoard: TileType[]
  ) {
    const {
      indicesToClear,
      targetBall,
      bothAreColorBombs,
    } = getColorBombResult(
      board,
      swappedBoard,
      firstIndex,
      secondIndex
    );

    setIsResolving(true);
    setSelected(null);
    setBoard(swappedBoard);

    playGameSound(
      "combo",
      soundEnabled
    );

    vibrate(
      [
        80,
        30,
        80,
        30,
        140,
      ],
      vibrationEnabled
    );

    const result =
      await clearPowerUpArea(
        swappedBoard,
        indicesToClear,
        2
      );

    finishPowerUp(
      result.board,
      result.points
    );

    if (
      bothAreColorBombs
    ) {
      showMessage(
        "MEGA RENK PATLAMASI! 🌈🌈",
        result.points
      );

      return;
    }

    showMessage(
      `${targetBall} TOPLAR TEMİZLENDİ! 🌈`,
      result.points
    );
  }

  async function handleRegularMatch(
    swappedBoard: TileType[],
    preferredIndex: number,
    matchedIndices: number[]
  ) {
    setIsResolving(true);
    setSelected(null);
    setBoard(swappedBoard);

    vibrate(
      35,
      vibrationEnabled
    );

    await animateExplosion(
      swappedBoard,
      matchedIndices
    );

    const result =
      resolveBoard(
        swappedBoard,
        preferredIndex,
        currentLevel.balls
      );

    setBoard(result.board);

    setScore(
      (currentScore) =>
        currentScore +
        result.scoreGain
    );

    setMoves(
      (currentMoves) =>
        Math.max(
          0,
          currentMoves - 1
        )
    );

    setIsResolving(false);

    if (
      result.comboCount >= 2
    ) {
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

    if (
      result.comboCount >= 4
    ) {
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

    const firstIndex =
      selected;

    if (
      firstIndex === index
    ) {
      const selectedTile =
        board[firstIndex];

      if (
        isRocket(selectedTile)
      ) {
        await activateRocket(
          firstIndex
        );

        return;
      }

      if (
        isAreaBomb(selectedTile)
      ) {
        await activateAreaBomb(
          firstIndex
        );

        return;
      }

      setSelected(null);
      return;
    }

    const firstRow =
      Math.floor(
        firstIndex /
          BOARD_SIZE
      );

    const firstColumn =
      firstIndex %
      BOARD_SIZE;

    const secondRow =
      Math.floor(
        index /
          BOARD_SIZE
      );

    const secondColumn =
      index %
      BOARD_SIZE;

    const isNeighbor =
      Math.abs(
        firstRow -
          secondRow
      ) +
        Math.abs(
          firstColumn -
            secondColumn
        ) ===
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

    const swappedBoard = [
      ...board,
    ];

    [
      swappedBoard[firstIndex],
      swappedBoard[index],
    ] = [
      swappedBoard[index],
      swappedBoard[firstIndex],
    ];

    const firstTile =
      board[firstIndex];

    const secondTile =
      board[index];

    const bothAreRockets =
      isRocket(firstTile) &&
      isRocket(secondTile);

    if (bothAreRockets) {
      await activateRocketCombo(
        firstIndex,
        index,
        swappedBoard
      );

      return;
    }

    const bothAreAreaBombs =
      isAreaBomb(firstTile) &&
      isAreaBomb(secondTile);

    if (bothAreAreaBombs) {
      await activateAreaBombCombo(
        index,
        swappedBoard
      );

      return;
    }

    const isRocketAreaBombCombo =
      (
        isRocket(firstTile) &&
        isAreaBomb(secondTile)
      ) ||
      (
        isAreaBomb(firstTile) &&
        isRocket(secondTile)
      );

    if (
      isRocketAreaBombCombo
    ) {
      await activateRocketAreaBombCombo(
        index,
        swappedBoard
      );

      return;
    }

    const isColorBombRocketCombo =
      (
        isColorBomb(firstTile) &&
        isRocket(secondTile)
      ) ||
      (
        isRocket(firstTile) &&
        isColorBomb(secondTile)
      );

    if (
      isColorBombRocketCombo
    ) {
      await activateColorBombRocketCombo(
        firstIndex,
        index,
        swappedBoard
      );

      return;
    }

    const isColorBombAreaBombCombo =
      (
        isColorBomb(firstTile) &&
        isAreaBomb(secondTile)
      ) ||
      (
        isAreaBomb(firstTile) &&
        isColorBomb(secondTile)
      );

    if (
      isColorBombAreaBombCombo
    ) {
      await activateColorBombAreaBombCombo(
        firstIndex,
        index,
        swappedBoard
      );

      return;
    }

    const includesColorBomb =
      isColorBomb(firstTile) ||
      isColorBomb(secondTile);

    if (includesColorBomb) {
      await activateColorBomb(
        firstIndex,
        index,
        swappedBoard
      );

      return;
    }

    const matchedIndices =
      findMatches(
        swappedBoard
      );

    const createsMatch =
      matchedIndices.includes(
        firstIndex
      ) ||
      matchedIndices.includes(
        index
      );

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

    await handleRegularMatch(
      swappedBoard,
      index,
      matchedIndices
    );
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 px-4 py-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
        <div className="mb-5 flex w-full max-w-xl items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold tracking-[0.35em] text-yellow-400">
              SPORTS MATCH-3
            </p>

            <h1 className="mt-1 text-4xl font-black tracking-tight text-white">
              MATCH ARENA
            </h1>

            <p className="mt-2 text-sm text-slate-300">
              {currentLevel.name}
            </p>
          </div>

          <button
            type="button"
            disabled={
              isResolving ||
              moves === 0 ||
              showTutorial
            }
            onClick={() => {
              setSelected(null);
              setIsPaused(true);
            }}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-xl text-white shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ⏸️
          </button>
        </div>

        <ScorePanel
          score={score}
          moves={moves}
          level={currentLevel}
        />

        <div className="relative rounded-[2rem] border border-white/10 bg-slate-900/80 p-3 shadow-2xl shadow-indigo-950/70 backdrop-blur-xl sm:p-5">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-yellow-300 to-transparent" />

          <ComboPopup
            actionText={actionText}
            pointsText={pointsText}
          />

          <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
            {board.map(
              (
                tile,
                tileIndex
              ) => (
                <Tile
                  key={tile.id}
                  tile={tile}
                  selected={
                    selected ===
                    tileIndex
                  }
                  disabled={
                    moves === 0 ||
                    isResolving ||
                    isPaused ||
                    showTutorial
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
                    handleClick(
                      tileIndex
                    )
                  }
                />
              )
            )}
          </div>
        </div>

        <div className="mt-4 flex max-w-xl flex-wrap items-center justify-center gap-2">
          <div className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-xs font-bold text-yellow-100">
            🎯 Hedef:{" "}
            {currentLevel.targetScore}
          </div>

          <div className="rounded-full border border-indigo-300/20 bg-indigo-300/10 px-4 py-2 text-xs font-bold text-indigo-100">
            Toplar: {currentLevel.balls.join(" ")}
          </div>

          {levelId >= 7 && (
            <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold text-cyan-100">
              🧊 Buz: Darbe aldıkça katmanı azalır.
            </div>
          )}

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300">
            ⭐ {currentLevel.starScores[0]}
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300">
            ⭐⭐ {currentLevel.starScores[1]}
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300">
            ⭐⭐⭐ {currentLevel.starScores[2]}
          </div>
        </div>

        {showTutorial && (
          <TutorialModal
            level={currentLevel}
            onStart={() =>
              setShowTutorial(false)
            }
            onExit={onExit}
          />
        )}

        {isPaused && (
          <PauseModal
            onResume={() =>
              setIsPaused(false)
            }
            onRestart={
              restartGame
            }
            onExit={onExit}
          />
        )}

        {moves === 0 && (
          <GameOverModal
            score={score}
            level={currentLevel}
            reward={gameReward}
            onRestart={
              restartGame
            }
            onExit={onExit}
          />
        )}
      </div>
    </main>
  );
}