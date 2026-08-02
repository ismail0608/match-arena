"use client";

import { motion } from "motion/react";
import type { CareerProgress } from "../types/progress";

type TournamentScreenProps = {
  career: CareerProgress;
  onBack: () => void;
  onPlay: () => void;
};

type League = {
  id: number;
  icon: string;
  name: string;
  subtitle: string;
  color: string;
  unlocked: boolean;
  progress: number;
  buttonText?: string;
};

export default function TournamentScreen({
  career,
  onBack,
  onPlay,
}: TournamentScreenProps) {
  const leagues: League[] = [
    {
      id: 1,
      icon: "🏀",
      name: "Basketbol Ligi",
      subtitle: "Smaçlarla arenaya hükmet.",
      color: "from-orange-400 to-red-600",
      unlocked: true,
      progress: career.basketballProgress,
      buttonText: "🏀 LİGE BAŞLA",
    },
    {
      id: 2,
      icon: "⚽",
      name: "Futbol Ligi",
      subtitle: "Şampiyonluk yolunda goller at.",
      color: "from-emerald-400 to-green-700",
      unlocked: career.footballUnlocked,
      progress: 0,
      buttonText: "⚽ LİGE BAŞLA",
    },
    {
      id: 3,
      icon: "🎾",
      name: "Tenis Masters",
      subtitle: "Ace servislerle rakiplerini geç.",
      color: "from-lime-300 to-green-600",
      unlocked: false,
      progress: 0,
    },
    {
      id: 4,
      icon: "🏐",
      name: "Voleybol Kupası",
      subtitle: "Smaçlarla kupaya uzan.",
      color: "from-blue-400 to-indigo-700",
      unlocked: false,
      progress: 0,
    },
    {
      id: 5,
      icon: "🏆",
      name: "Şampiyonlar Arenası",
      subtitle: "Bütün sporların final mücadelesi.",
      color: "from-yellow-300 to-amber-700",
      unlocked: false,
      progress: 0,
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 px-4 py-8">
      <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-2xl">
        <motion.button
          type="button"
          onClick={onBack}
          className="mb-8 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-bold text-slate-300"
          whileHover={{
            scale: 1.04,
            x: -3,
          }}
          whileTap={{
            scale: 0.94,
          }}
        >
          ← GERİ
        </motion.button>

        <motion.div
          initial={{
            opacity: 0,
            y: -25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <p className="text-sm font-black tracking-[0.35em] text-yellow-400">
            SEASON ONE
          </p>

          <h1 className="mt-2 text-4xl font-black text-white sm:text-5xl">
            TURNUVALAR
          </h1>

          <p className="mt-3 max-w-lg leading-7 text-slate-400">
            Ligleri tamamla, yeni sporların kilidini aç ve
            Şampiyonlar Arenası’na ulaş.
          </p>
        </motion.div>

        <motion.div
          className="mt-6 grid grid-cols-2 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              En yüksek skor
            </p>

            <p className="mt-1 text-2xl font-black text-white">
              {career.bestScore}
            </p>
          </div>

          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-yellow-200">
              Basketbol Ligi
            </p>

            <p className="mt-1 text-2xl font-black text-yellow-400">
              %{career.basketballProgress}
            </p>
          </div>
        </motion.div>

        <div className="mt-6 flex flex-col gap-4">
          {leagues.map((league, index) => (
            <motion.div
              key={league.id}
              className={`relative overflow-hidden rounded-3xl border p-5 ${
                league.unlocked
                  ? "border-white/15 bg-white/10"
                  : "border-white/5 bg-slate-900/70"
              }`}
              initial={{
                opacity: 0,
                x: index % 2 === 0 ? -35 : 35,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: index * 0.09,
                type: "spring",
                stiffness: 240,
                damping: 22,
              }}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${league.color} ${
                  league.unlocked ? "opacity-15" : "opacity-5"
                }`}
              />

              <div className="relative z-10 flex items-center gap-4">
                <motion.div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${league.color} text-4xl shadow-xl ${
                    league.unlocked ? "" : "grayscale"
                  }`}
                  animate={
                    league.unlocked
                      ? {
                          y: [0, -5, 0],
                        }
                      : undefined
                  }
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                  }}
                >
                  {league.unlocked ? league.icon : "🔒"}
                </motion.div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p
                        className={`text-xl font-black ${
                          league.unlocked
                            ? "text-white"
                            : "text-slate-500"
                        }`}
                      >
                        {league.name}
                      </p>

                      <p
                        className={`mt-1 text-sm ${
                          league.unlocked
                            ? "text-slate-300"
                            : "text-slate-600"
                        }`}
                      >
                        {league.subtitle}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        league.unlocked
                          ? "bg-green-400/15 text-green-300"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {league.unlocked ? "AÇIK" : "KİLİTLİ"}
                    </span>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-950/60">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${league.color}`}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${league.progress}%`,
                      }}
                      transition={{
                        delay: 0.4 + index * 0.08,
                        duration: 0.6,
                      }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      İlerleme
                    </span>

                    <span
                      className={
                        league.unlocked
                          ? "font-bold text-white"
                          : "text-slate-600"
                      }
                    >
                      %{league.progress}
                    </span>
                  </div>
                </div>
              </div>

              {league.unlocked && league.buttonText && (
                <motion.button
                  type="button"
                  onClick={onPlay}
                  className="relative z-10 mt-5 w-full rounded-xl bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 px-5 py-3 font-black text-slate-950 shadow-lg shadow-yellow-500/20"
                  whileHover={{
                    scale: 1.025,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                >
                  {league.buttonText}
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-7 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex gap-3">
            <span className="text-2xl">
              {career.footballUnlocked ? "⚽" : "🏆"}
            </span>

            <div>
              <p className="font-black text-yellow-300">
                {career.footballUnlocked
                  ? "Futbol Ligi açıldı!"
                  : "Sezon hedefi"}
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-300">
                {career.footballUnlocked
                  ? "Basketbol hedefini tamamladın. Futbol Ligi artık oynanabilir."
                  : "Tek maçta 2.000 puana ulaşarak Futbol Ligi’nin kilidini aç."}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}