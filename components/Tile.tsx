"use client";

import { motion } from "motion/react";
import type { Tile as TileType } from "../types/tile";

type TileProps = {
  tile: TileType;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
};

export default function Tile({
  tile,
  selected,
  disabled,
  onClick,
}: TileProps) {
  const isCup = tile.special === "cup" || tile.ball === "🏆";

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      layout
      layoutId={tile.id}
      initial={{
        opacity: 0,
        y: -35,
        scale: 0.7,
      }}
      animate={{
        opacity: 1,
        y: selected ? -5 : 0,
        scale: selected ? 1.12 : 1,
        rotate: isCup ? [0, -4, 4, -2, 2, 0] : 0,
      }}
      whileHover={
        disabled
          ? undefined
          : {
              y: -4,
              scale: 1.08,
            }
      }
      whileTap={
        disabled
          ? undefined
          : {
              scale: 0.88,
              rotate: -3,
            }
      }
      transition={{
        layout: {
          type: "spring",
          stiffness: 500,
          damping: 32,
        },
        opacity: {
          duration: 0.2,
        },
        y: {
          type: "spring",
          stiffness: 500,
          damping: 24,
        },
        scale: {
          type: "spring",
          stiffness: 500,
          damping: 22,
        },
        rotate: {
          duration: 1.4,
          repeat: isCup ? Infinity : 0,
          repeatDelay: 0.7,
        },
      }}
      className={`
        flex h-10 w-10 items-center justify-center
        rounded-xl border text-2xl shadow-lg
        sm:h-14 sm:w-14 sm:text-3xl

        ${
          selected
            ? "border-yellow-200 bg-yellow-400 shadow-yellow-400/60"
            : isCup
              ? "border-yellow-300 bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-800 shadow-yellow-500/50"
              : "border-white/10 bg-gradient-to-br from-slate-700 to-slate-900 hover:border-indigo-300/50"
        }

        ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
        }
      `}
    >
      <motion.span
        animate={
          isCup
            ? {
                filter: [
                  "drop-shadow(0 0 2px rgba(250,204,21,0.4))",
                  "drop-shadow(0 0 10px rgba(250,204,21,1))",
                  "drop-shadow(0 0 2px rgba(250,204,21,0.4))",
                ],
              }
            : undefined
        }
        transition={{
          duration: 1.2,
          repeat: Infinity,
        }}
      >
        {isCup ? "🏆" : tile.ball}
      </motion.span>
    </motion.button>
  );
}