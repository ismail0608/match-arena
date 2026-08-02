"use client";

import { motion } from "motion/react";

type MainMenuProps = {
  onPlay: () => void;
  onSettings: () => void;
};

export default function MainMenu({
  onPlay,
  onSettings,
}: MainMenuProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 px-4">
      <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-[-180px] left-1/2 h-[360px] w-[650px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />

      <motion.div
        className="pointer-events-none absolute left-[8%] top-[16%] text-5xl opacity-20"
        animate={{
          y: [0, -18, 0],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      >
        🏀
      </motion.div>

      <motion.div
        className="pointer-events-none absolute right-[8%] top-[22%] text-5xl opacity-20"
        animate={{
          y: [0, 18, 0],
          rotate: [0, -8, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
        }}
      >
        ⚽
      </motion.div>

      <motion.div
        className="pointer-events-none absolute bottom-[15%] left-[12%] text-5xl opacity-20"
        animate={{
          y: [0, -14, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
      >
        🎾
      </motion.div>

      <motion.div
        className="pointer-events-none absolute bottom-[12%] right-[12%] text-5xl opacity-20"
        animate={{
          y: [0, 14, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
        }}
      >
        🏐
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center">
        <motion.div
          className="mb-4 text-7xl"
          initial={{
            opacity: 0,
            y: -60,
            scale: 0.5,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: [0, -4, 4, 0],
          }}
          transition={{
            opacity: {
              duration: 0.4,
            },
            y: {
              type: "spring",
              stiffness: 250,
              damping: 16,
            },
            scale: {
              type: "spring",
              stiffness: 260,
              damping: 16,
            },
            rotate: {
              delay: 0.8,
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            },
          }}
        >
          🏟️
        </motion.div>

        <motion.p
          className="text-sm font-black tracking-[0.45em] text-yellow-400"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.25,
          }}
        >
          SPORTS MATCH-3
        </motion.p>

        <motion.h1
          className="mt-3 text-center text-5xl font-black leading-none tracking-tight text-white sm:text-6xl"
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: 0.35,
            type: "spring",
            stiffness: 240,
            damping: 18,
          }}
        >
          MATCH

          <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-600 bg-clip-text text-transparent">
            ARENA
          </span>
        </motion.h1>

        <motion.div
          className="mt-5 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-2 text-center"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.5,
          }}
        >
          <p className="text-xs font-bold tracking-[0.25em] text-yellow-200">
            SEASON ONE
          </p>

          <p className="mt-1 text-sm font-black text-white">
            RISE OF CHAMPIONS
          </p>
        </motion.div>

        <motion.p
          className="mt-5 max-w-sm text-center text-sm leading-6 text-slate-300"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.65,
          }}
        >
          Spor toplarını eşleştir, güçlü kupalar oluştur ve
          şampiyonluk yolunda arenaya hükmet.
        </motion.p>

        <motion.div
          className="mt-9 flex w-full flex-col gap-3"
          initial={{
            opacity: 0,
            y: 35,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.75,
            type: "spring",
            stiffness: 220,
            damping: 20,
          }}
        >
          <motion.button
            type="button"
            onClick={onPlay}
            className="w-full rounded-2xl bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 px-6 py-4 text-lg font-black text-slate-950 shadow-2xl shadow-yellow-500/25"
            whileHover={{
              scale: 1.04,
              y: -2,
            }}
            whileTap={{
              scale: 0.93,
            }}
          >
            ▶ OYNA
          </motion.button>

          <motion.button
            type="button"
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-md"
            whileHover={{
              scale: 1.02,
              backgroundColor: "rgba(255,255,255,0.15)",
            }}
            whileTap={{
              scale: 0.96,
            }}
          >
            🏆 TURNUVA
          </motion.button>

          <motion.button
            type="button"
            onClick={onSettings}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-bold text-slate-300 backdrop-blur-md"
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.96,
            }}
          >
            ⚙️ AYARLAR
          </motion.button>
        </motion.div>

        <motion.div
          className="mt-8 flex items-center gap-3 text-2xl"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1,
          }}
        >
          <span>🏀</span>
          <span>⚽</span>
          <span>🏐</span>
          <span>🎾</span>
          <span>🏆</span>
        </motion.div>

        <p className="mt-6 text-xs text-slate-500">
          Match Arena • Prototype v0.2
        </p>
      </div>
    </main>
  );
}