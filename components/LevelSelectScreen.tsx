"use client";

import { motion } from "motion/react";

import type {
  LevelProgress,
} from "../types/level";

import {
  LEVELS,
} from "../utils/levels";

type LevelSelectScreenProps = {
  progress: LevelProgress;
  selectedLevelId: number;
  onSelectLevel: (
    levelId: number
  ) => void;
  onBack: () => void;
};

export default function LevelSelectScreen({
  progress,
  selectedLevelId,
  onSelectLevel,
  onBack,
}: LevelSelectScreenProps) {
  const totalStars =
    Object.values(
      progress.starsByLevel
    ).reduce(
      (total, stars) =>
        total + stars,
      0
    );

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 px-4 py-8">
      <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-[-180px] left-1/2 h-[360px] w-[650px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-2xl">
        <div className="flex items-center justify-between gap-4">
          <motion.button
            type="button"
            onClick={onBack}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-xl text-white shadow-lg backdrop-blur-md"
            whileHover={{
              scale: 1.06,
            }}
            whileTap={{
              scale: 0.92,
            }}
          >
            ←
          </motion.button>

          <div className="text-center">
            <p className="text-xs font-black tracking-[0.35em] text-yellow-400">
              MATCH ARENA
            </p>

            <h1 className="mt-1 text-3xl font-black text-white">
              BÖLÜM HARİTASI
            </h1>
          </div>

          <div className="flex h-12 min-w-20 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-400/10 px-3 font-black text-yellow-300">
            ⭐ {totalStars}
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                İlerleme
              </p>

              <p className="mt-1 text-lg font-black text-white">
                Bölüm{" "}
                {
                  progress.unlockedLevel
                }{" "}
                açık
              </p>
            </div>

            <div className="text-4xl">
              🏟️
            </div>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-950">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-yellow-400 transition-all duration-500"
              style={{
                width: `${
                  (progress.unlockedLevel /
                    LEVELS.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        <div className="relative mt-8 space-y-5 pb-10">
          <div className="pointer-events-none absolute bottom-10 left-1/2 top-8 w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-yellow-400 via-indigo-500 to-slate-800" />

          {LEVELS.map(
            (level, index) => {
              const isUnlocked =
                level.id <=
                progress.unlockedLevel;

              const isSelected =
                level.id ===
                selectedLevelId;

              const earnedStars =
                progress.starsByLevel[
                  level.id
                ] ?? 0;

              const bestScore =
                progress
                  .bestScoresByLevel[
                  level.id
                ] ?? 0;

              const isLeft =
                index % 2 === 0;

              return (
                <motion.div
                  key={level.id}
                  className={`relative flex ${
                    isLeft
                      ? "justify-start"
                      : "justify-end"
                  }`}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.06,
                  }}
                >
                  <motion.button
                    type="button"
                    disabled={
                      !isUnlocked
                    }
                    onClick={() =>
                      onSelectLevel(
                        level.id
                      )
                    }
                    className={`
                      relative z-10 w-[82%] rounded-3xl border p-4 text-left shadow-xl backdrop-blur-xl
                      sm:w-[72%]

                      ${
                        !isUnlocked
                          ? "cursor-not-allowed border-white/5 bg-slate-900/80 opacity-60"
                          : isSelected
                            ? "border-yellow-300/60 bg-gradient-to-br from-yellow-400/20 via-indigo-500/20 to-slate-900 shadow-yellow-500/20"
                            : "border-white/10 bg-white/10 hover:border-indigo-300/40 hover:bg-white/15"
                      }
                    `}
                    whileHover={
                      isUnlocked
                        ? {
                            scale: 1.03,
                            y: -3,
                          }
                        : undefined
                    }
                    whileTap={
                      isUnlocked
                        ? {
                            scale: 0.96,
                          }
                        : undefined
                    }
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-black ${
                          isUnlocked
                            ? "bg-gradient-to-br from-yellow-300 to-amber-600 text-slate-950 shadow-lg"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        {isUnlocked
                          ? level.id
                          : "🔒"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-yellow-300">
                              Bölüm{" "}
                              {level.id}
                            </p>

                            <h2 className="mt-1 text-lg font-black text-white">
                              {
                                level.name
                              }
                            </h2>
                          </div>

                          {isSelected &&
                            isUnlocked && (
                              <span className="rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-black text-slate-950">
                                SEÇİLİ
                              </span>
                            )}
                        </div>

                        <p className="mt-2 text-sm text-slate-300">
                          {
                            level.description
                          }
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          <span className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1 font-bold text-slate-300">
                            🎯{" "}
                            {
                              level.targetScore
                            }
                          </span>

                          <span className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1 font-bold text-slate-300">
                            👆{" "}
                            {
                              level.moves
                            }{" "}
                            hamle
                          </span>

                          {bestScore >
                            0 && (
                            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 font-bold text-emerald-300">
                              🏆{" "}
                              {
                                bestScore
                              }
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex items-center gap-1 text-xl">
                          {[
                            1,
                            2,
                            3,
                          ].map(
                            (
                              starNumber
                            ) => (
                              <span
                                key={
                                  starNumber
                                }
                                className={
                                  starNumber <=
                                  earnedStars
                                    ? "drop-shadow-[0_0_7px_rgba(250,204,21,0.9)]"
                                    : "grayscale opacity-25"
                                }
                              >
                                ⭐
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                </motion.div>
              );
            }
          )}
        </div>
      </div>
    </main>
  );
}