"use client";

import { motion } from "motion/react";

import type {
  GameLevel,
} from "../types/level";

import type {
  GameReward,
} from "../types/progress";

import {
  getLevelResult,
} from "../utils/levels";

type GameOverModalProps = {
  score: number;
  level: GameLevel;
  reward: GameReward | null;
  onRestart: () => void;
  onExit: () => void;
};

export default function GameOverModal({
  score,
  level,
  reward,
  onRestart,
  onExit,
}: GameOverModalProps) {
  const {
    won,
    stars,
  } = getLevelResult(
    score,
    level
  );

  const earnedCoins =
    reward?.earnedCoins ??
    Math.floor(score / 10);

  const earnedXp =
    reward?.earnedXp ??
    Math.floor(score / 5);

  const levelBonusCoins =
    reward?.levelBonusCoins ??
    0;

  const levelsGained =
    reward?.levelsGained ?? 0;

  const newLevel =
    reward?.newLevel ?? 1;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/85 px-4 py-8 backdrop-blur-md"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.25,
      }}
    >
      <motion.div
        className={`w-full max-w-md rounded-3xl border p-7 text-center text-white shadow-2xl ${
          won
            ? "border-yellow-400/30 bg-gradient-to-b from-slate-800 to-slate-950"
            : "border-red-400/30 bg-gradient-to-b from-red-950/90 to-slate-950"
        }`}
        initial={{
          opacity: 0,
          y: 60,
          scale: 0.75,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 20,
        }}
      >
        <motion.div
          className="text-6xl"
          animate={
            won
              ? {
                  y: [
                    0,
                    -10,
                    0,
                  ],
                  rotate: [
                    0,
                    -5,
                    5,
                    0,
                  ],
                }
              : {
                  rotate: [
                    0,
                    -5,
                    5,
                    0,
                  ],
                }
          }
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        >
          {won
            ? "🏆"
            : "⏱️"}
        </motion.div>

        <p
          className={`mt-4 text-sm font-bold tracking-[0.3em] ${
            won
              ? "text-yellow-400"
              : "text-red-300"
          }`}
        >
          BÖLÜM {level.id}
        </p>

        <h2 className="mt-2 text-3xl font-black">
          {won
            ? "Bölüm tamamlandı!"
            : "Hamlelerin bitti!"}
        </h2>

        <p className="mt-2 text-sm text-slate-300">
          {won
            ? `${level.name} başarıyla tamamlandı.`
            : `Bölümü geçmek için ${level.targetScore} puana ulaşmalısın.`}
        </p>

        <div className="mt-5 flex items-center justify-center gap-3 text-4xl">
          {[1, 2, 3].map(
            (starNumber) => (
              <motion.span
                key={
                  starNumber
                }
                className={
                  starNumber <=
                  stars
                    ? "drop-shadow-[0_0_12px_rgba(250,204,21,1)]"
                    : "grayscale opacity-25"
                }
                initial={{
                  scale: 0,
                  rotate: -90,
                }}
                animate={{
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  delay:
                    starNumber *
                    0.18,
                  type: "spring",
                  stiffness: 350,
                  damping: 16,
                }}
              >
                ⭐
              </motion.span>
            )
          )}
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">
              Bölüm hedefi
            </span>

            <span className="font-black text-white">
              {level.targetScore}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-slate-400">
              Senin skorun
            </span>

            <span
              className={`font-black ${
                won
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {score}
            </span>
          </div>
        </div>

        {won &&
          levelsGained >
            0 && (
            <motion.div
              className="mt-5 rounded-2xl border border-purple-400/30 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-4"
              initial={{
                opacity: 0,
                scale: 0.7,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: 0.25,
                type: "spring",
                stiffness: 300,
                damping: 18,
              }}
            >
              <motion.div
                className="text-4xl"
                animate={{
                  scale: [
                    1,
                    1.2,
                    1,
                  ],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              >
                ⭐
              </motion.div>

              <p className="mt-2 text-xs font-black tracking-[0.25em] text-purple-300">
                SEVİYE ATLADIN
              </p>

              <p className="mt-1 text-3xl font-black text-white">
                LEVEL {newLevel}
              </p>

              <p className="mt-2 text-sm font-bold text-yellow-300">
                🪙 +
                {levelBonusCoins}{" "}
                seviye bonusu
              </p>
            </motion.div>
          )}

        {won && (
          <>
            <div className="mt-6 grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Skor
                </p>

                <p className="mt-1 text-2xl font-black text-white">
                  {score}
                </p>
              </div>

              <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-yellow-200">
                  Coin
                </p>

                <p className="mt-1 text-xl font-black text-yellow-400">
                  🪙 +
                  {earnedCoins}
                </p>
              </div>

              <div className="rounded-2xl border border-purple-400/20 bg-purple-400/10 p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-purple-200">
                  XP
                </p>

                <p className="mt-1 text-xl font-black text-purple-300">
                  ⭐ +
                  {earnedXp}
                </p>
              </div>
            </div>

            {levelBonusCoins >
              0 && (
              <div className="mt-3 rounded-xl border border-yellow-400/20 bg-yellow-400/5 px-4 py-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">
                    Toplam coin ödülü
                  </span>

                  <span className="font-black text-yellow-400">
                    🪙 +
                    {earnedCoins +
                      levelBonusCoins}
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        <div className="mt-7 flex flex-col gap-3">
          <motion.button
            type="button"
            onClick={onRestart}
            className={`w-full rounded-xl px-5 py-3 font-black shadow-lg ${
              won
                ? "bg-yellow-400 text-slate-950 hover:bg-yellow-300"
                : "bg-red-500 text-white hover:bg-red-400"
            }`}
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.92,
            }}
          >
            {won
              ? "🔄 TEKRAR OYNA"
              : "💪 TEKRAR DENE"}
          </motion.button>

          <motion.button
            type="button"
            onClick={onExit}
            className="w-full rounded-xl border border-white/10 bg-white/10 px-5 py-3 font-bold text-white"
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.94,
            }}
          >
            🏠 ANA MENÜ
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}