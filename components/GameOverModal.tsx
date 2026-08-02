"use client";

import { motion } from "motion/react";

type GameOverModalProps = {
  score: number;
  onRestart: () => void;
};

export default function GameOverModal({
  score,
  onRestart,
}: GameOverModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="w-full max-w-sm rounded-3xl border border-yellow-400/30 bg-gradient-to-b from-slate-800 to-slate-950 p-8 text-center text-white shadow-2xl"
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
          animate={{
            y: [0, -10, 0],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        >
          🏆
        </motion.div>

        <p className="mt-4 text-sm font-bold tracking-[0.3em] text-yellow-400">
          MAÇ SONU
        </p>

        <h2 className="mt-2 text-3xl font-black">
          Arena tamamlandı!
        </h2>

        <p className="mt-5 text-slate-300">
          Toplam skorun
        </p>

        <motion.p
          className="mt-1 text-5xl font-black text-yellow-400"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.25,
            type: "spring",
            stiffness: 350,
            damping: 16,
          }}
        >
          {score}
        </motion.p>

        <motion.button
          type="button"
          onClick={onRestart}
          className="mt-7 w-full rounded-xl bg-yellow-400 px-5 py-3 font-black text-slate-950 shadow-lg hover:bg-yellow-300"
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.92,
          }}
        >
          YENİDEN OYNA
        </motion.button>
      </motion.div>
    </motion.div>
  );
}