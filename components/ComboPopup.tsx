"use client";

import { AnimatePresence, motion } from "motion/react";

type ComboPopupProps = {
  actionText: string;
  pointsText: string;
};

export default function ComboPopup({
  actionText,
  pointsText,
}: ComboPopupProps) {
  const isVisible = Boolean(actionText || pointsText);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
          initial={{
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 1.35,
          }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 22,
          }}
        >
          <motion.div
            className="rounded-2xl border border-yellow-300/40 bg-slate-950/95 px-7 py-4 text-center shadow-2xl shadow-yellow-500/30"
            initial={{
              rotate: -6,
              y: 25,
            }}
            animate={{
              rotate: [0, -2, 2, 0],
              y: 0,
            }}
            exit={{
              y: -35,
            }}
            transition={{
              duration: 0.35,
            }}
          >
            <motion.p
              className="text-2xl font-black text-yellow-400 sm:text-3xl"
              animate={{
                textShadow: [
                  "0 0 4px rgba(250,204,21,0.3)",
                  "0 0 18px rgba(250,204,21,1)",
                  "0 0 4px rgba(250,204,21,0.3)",
                ],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
              }}
            >
              {actionText}
            </motion.p>

            {pointsText && (
              <motion.p
                className="mt-1 text-xl font-black text-white sm:text-2xl"
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.1,
                }}
              >
                {pointsText}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}