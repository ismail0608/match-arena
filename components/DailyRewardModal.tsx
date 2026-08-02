"use client";

import { motion } from "motion/react";

type DailyRewardModalProps = {
  rewardCoins: number;
  onClaim: () => void;
  onClose: () => void;
};

export default function DailyRewardModal({
  rewardCoins,
  onClaim,
  onClose,
}: DailyRewardModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 px-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-yellow-400/30 bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 p-7 text-center text-white shadow-2xl shadow-yellow-500/20"
        initial={{
          opacity: 0,
          y: 60,
          scale: 0.7,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 19,
        }}
      >
        <div className="pointer-events-none absolute left-1/2 top-[-100px] h-56 w-56 -translate-x-1/2 rounded-full bg-yellow-400/20 blur-3xl" />

        <motion.div
          className="relative z-10 text-7xl"
          animate={{
            y: [0, -10, 0],
            rotate: [0, -5, 5, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 1.7,
            repeat: Infinity,
          }}
        >
          🎁
        </motion.div>

        <p className="relative z-10 mt-5 text-xs font-black tracking-[0.35em] text-yellow-400">
          GÜNLÜK ÖDÜL
        </p>

        <h2 className="relative z-10 mt-2 text-3xl font-black">
          Arenaya hoş geldin!
        </h2>

        <p className="relative z-10 mt-3 text-sm leading-6 text-slate-300">
          Bugün giriş yaptığın için günlük şampiyonluk ödülünü
          kazanabilirsin.
        </p>

        <motion.div
          className="relative z-10 mt-6 rounded-2xl border border-yellow-400/25 bg-yellow-400/10 p-5"
          animate={{
            boxShadow: [
              "0 0 0 rgba(250,204,21,0)",
              "0 0 30px rgba(250,204,21,0.2)",
              "0 0 0 rgba(250,204,21,0)",
            ],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
          }}
        >
          <p className="text-sm font-bold text-yellow-200">
            Bugünün ödülü
          </p>

          <motion.p
            className="mt-2 text-4xl font-black text-yellow-400"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.25,
              type: "spring",
              stiffness: 350,
              damping: 16,
            }}
          >
            🪙 +{rewardCoins}
          </motion.p>
        </motion.div>

        <div className="relative z-10 mt-7 flex flex-col gap-3">
          <motion.button
            type="button"
            onClick={onClaim}
            className="w-full rounded-xl bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 px-5 py-3 font-black text-slate-950 shadow-lg shadow-yellow-500/20"
            whileHover={{
              scale: 1.04,
            }}
            whileTap={{
              scale: 0.92,
            }}
          >
            🎁 ÖDÜLÜ AL
          </motion.button>

          <motion.button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold text-slate-400"
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.95,
            }}
          >
            SONRA
          </motion.button>
        </div>

        <p className="relative z-10 mt-5 text-xs text-slate-500">
          Yeni ödül yarın tekrar hazır olacak.
        </p>
      </motion.div>
    </motion.div>
  );
}