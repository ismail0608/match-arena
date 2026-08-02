"use client";

import { motion } from "motion/react";
import type { CareerProgress } from "../types/progress";

type MissionsScreenProps = {
  career: CareerProgress;
  onBack: () => void;
};

type Mission = {
  id: string;
  icon: string;
  title: string;
  description: string;
  current: number;
  target: number;
  reward: number;
};

export default function MissionsScreen({
  career,
  onBack,
}: MissionsScreenProps) {
  const missions: Mission[] = [
    {
      id: "score-1000",
      icon: "🎯",
      title: "Skor Avcısı",
      description: "Tek maçta 1.000 puana ulaş.",
      current: Math.min(career.bestScore, 1000),
      target: 1000,
      reward: 100,
    },
    {
      id: "level-2",
      icon: "⭐",
      title: "Yükselen Şampiyon",
      description: "Oyuncu seviyeni 2 yap.",
      current: Math.min(career.level, 2),
      target: 2,
      reward: 150,
    },
    {
      id: "football-unlock",
      icon: "⚽",
      title: "Yeni Lig",
      description: "Futbol Ligi’nin kilidini aç.",
      current: career.footballUnlocked ? 1 : 0,
      target: 1,
      reward: 250,
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 px-4 py-8">
      <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-xl">
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
            MATCH ARENA
          </p>

          <h1 className="mt-2 text-4xl font-black text-white sm:text-5xl">
            GÖREVLER
          </h1>

          <p className="mt-3 leading-7 text-slate-400">
            Arena hedeflerini tamamla ve coin ödüllerini kazan.
          </p>
        </motion.div>

        <motion.div
          className="mt-6 flex items-center justify-between rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4"
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: 0.15,
          }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-yellow-200">
              Toplam coin
            </p>

            <p className="mt-1 text-2xl font-black text-yellow-400">
              🪙 {career.coins}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-400">
              Oyuncu seviyesi
            </p>

            <p className="mt-1 text-2xl font-black text-white">
              Level {career.level}
            </p>
          </div>
        </motion.div>

        <div className="mt-6 flex flex-col gap-4">
          {missions.map((mission, index) => {
            const completed =
              mission.current >= mission.target;

            const progress = Math.min(
              100,
              Math.floor(
                (mission.current / mission.target) * 100
              )
            );

            return (
              <motion.div
                key={mission.id}
                className={`relative overflow-hidden rounded-3xl border p-5 ${
                  completed
                    ? "border-green-400/25 bg-green-400/10"
                    : "border-white/10 bg-white/5"
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
                  delay: 0.2 + index * 0.1,
                  type: "spring",
                  stiffness: 240,
                  damping: 22,
                }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl ${
                      completed
                        ? "bg-green-400/20"
                        : "bg-slate-800"
                    }`}
                    animate={
                      completed
                        ? {
                            scale: [1, 1.08, 1],
                          }
                        : undefined
                    }
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    {completed ? "✅" : mission.icon}
                  </motion.div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-black text-white">
                          {mission.title}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          {mission.description}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${
                          completed
                            ? "bg-green-400/15 text-green-300"
                            : "bg-yellow-400/10 text-yellow-300"
                        }`}
                      >
                        {completed
                          ? "TAMAMLANDI"
                          : `🪙 ${mission.reward}`}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          İlerleme
                        </span>

                        <span
                          className={
                            completed
                              ? "font-black text-green-300"
                              : "font-bold text-white"
                          }
                        >
                          {mission.current} / {mission.target}
                        </span>
                      </div>

                      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-950/70">
                        <motion.div
                          className={`h-full rounded-full ${
                            completed
                              ? "bg-gradient-to-r from-green-400 to-emerald-500"
                              : "bg-gradient-to-r from-purple-400 via-fuchsia-400 to-yellow-400"
                          }`}
                          initial={{
                            width: 0,
                          }}
                          animate={{
                            width: `${progress}%`,
                          }}
                          transition={{
                            delay: 0.35 + index * 0.1,
                            duration: 0.7,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-7 rounded-2xl border border-purple-400/20 bg-purple-400/10 p-5"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.6,
          }}
        >
          <div className="flex gap-3">
            <span className="text-2xl">🎁</span>

            <div>
              <p className="font-black text-purple-300">
                Görev ödülleri
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-300">
                Bu aşamada ilerlemeler görüntüleniyor. Sonraki
                adımda tamamlanan görevlerin coin ödüllerini alma
                butonunu aktif edeceğiz.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}