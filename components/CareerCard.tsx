"use client";

import { motion } from "motion/react";
import type { CareerProgress } from "../types/progress";

type CareerCardProps = {
  career: CareerProgress;
  onTournament: () => void;
};

export default function CareerCard({
  career,
  onTournament,
}: CareerCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onTournament}
      className="relative mt-6 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-left shadow-xl backdrop-blur-md"
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.68,
        type: "spring",
        stiffness: 220,
        damping: 22,
      }}
      whileHover={{
        scale: 1.015,
        borderColor: "rgba(250,204,21,0.35)",
      }}
      whileTap={{
        scale: 0.98,
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-yellow-400/10" />

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <motion.div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-red-600 text-2xl shadow-lg"
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
            }}
          >
            🏀
          </motion.div>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-yellow-300">
              Basketbol Ligi
            </p>

            <p className="mt-1 font-black text-white">
              Kariyer ilerlemesi
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-400">
            En iyi skor
          </p>

          <p className="text-xl font-black text-white">
            {career.bestScore}
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
          <p className="text-xs text-slate-400">
            Lig ilerlemesi
          </p>

          <p className="mt-1 text-xl font-black text-yellow-400">
            %{career.basketballProgress}
          </p>
        </div>

        <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/10 p-3 text-right">
          <p className="text-xs text-yellow-200">
            Toplam coin
          </p>

          <p className="mt-1 text-xl font-black text-yellow-400">
            🪙 {career.coins ?? 0}
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-4">
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-950/70">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-orange-400 via-yellow-400 to-amber-500"
            initial={{
              width: 0,
            }}
            animate={{
              width: `${career.basketballProgress}%`,
            }}
            transition={{
              delay: 0.8,
              duration: 0.7,
            }}
          />
        </div>
      </div>

      <div className="relative z-10 mt-4 flex items-center justify-between">
        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black ${
            career.footballUnlocked
              ? "bg-green-400/15 text-green-300"
              : "bg-slate-800/80 text-slate-400"
          }`}
        >
          <span>
            {career.footballUnlocked ? "⚽" : "🔒"}
          </span>

          <span>
            {career.footballUnlocked
              ? "Futbol Ligi açıldı"
              : "Futbol Ligi kilitli"}
          </span>
        </div>

        <span className="text-sm font-black text-yellow-300">
          DETAYLAR →
        </span>
      </div>
    </motion.button>
  );
}