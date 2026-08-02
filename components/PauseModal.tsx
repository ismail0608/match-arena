"use client";

import { motion } from "motion/react";

type PauseModalProps = {
  onResume: () => void;
  onRestart: () => void;
  onExit: () => void;
};

export default function PauseModal({
  onResume,
  onRestart,
  onExit,
}: PauseModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-gradient-to-b from-slate-800 to-slate-950 p-7 text-center text-white shadow-2xl"
        initial={{
          opacity: 0,
          scale: 0.75,
          y: 50,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
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
            y: [0, -7, 0],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
          }}
        >
          ⏸️
        </motion.div>

        <p className="mt-4 text-sm font-black tracking-[0.3em] text-yellow-400">
          MAÇ DURAKLATILDI
        </p>

        <h2 className="mt-2 text-3xl font-black">
          Arenaya dönmeye hazır mısın?
        </h2>

        <div className="mt-7 flex flex-col gap-3">
          <motion.button
            type="button"
            onClick={onResume}
            className="w-full rounded-xl bg-yellow-400 px-5 py-3 font-black text-slate-950"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
          >
            ▶ DEVAM ET
          </motion.button>

          <motion.button
            type="button"
            onClick={onRestart}
            className="w-full rounded-xl border border-white/10 bg-white/10 px-5 py-3 font-bold text-white"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 YENİDEN BAŞLAT
          </motion.button>

          <motion.button
            type="button"
            onClick={onExit}
            className="w-full rounded-xl border border-red-400/20 bg-red-500/10 px-5 py-3 font-bold text-red-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
          >
            🏠 ANA MENÜ
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}