"use client";

import { motion } from "motion/react";
import type { Tile as TileType } from "../types/tile";

type TileProps = {
  tile: TileType;
  selected: boolean;
  disabled: boolean;
  exploding: boolean;
  animationsEnabled: boolean;
  onClick: () => void;
};

export default function Tile({
  tile,
  selected,
  disabled,
  exploding,
  animationsEnabled,
  onClick,
}: TileProps) {
  const isCup = tile.special === "cup";

  const normalAnimation = {
    opacity: 1,
    y: selected ? -5 : 0,
    scale: selected ? 1.12 : 1,
    rotate:
      animationsEnabled && isCup
        ? [0, -4, 4, -2, 2, 0]
        : 0,
    filter: "brightness(1)",
  };

  const explosionAnimation = animationsEnabled
    ? {
        opacity: [1, 1, 0],
        scale: [1, 1.35, 0],
        rotate: [0, -12, 12, 0],
        filter: [
          "brightness(1)",
          "brightness(2.5)",
          "brightness(1)",
        ],
      }
    : {
        opacity: 0,
        scale: 0,
      };

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      layout={animationsEnabled}
      layoutId={
        animationsEnabled ? tile.id : undefined
      }
      initial={
        animationsEnabled
          ? {
              opacity: 0,
              y: -40,
              scale: 0.7,
            }
          : false
      }
      animate={
        exploding
          ? explosionAnimation
          : normalAnimation
      }
      whileHover={
        disabled || exploding || !animationsEnabled
          ? undefined
          : {
              y: -4,
              scale: 1.08,
            }
      }
      whileTap={
        disabled || exploding || !animationsEnabled
          ? undefined
          : {
              scale: 0.88,
              rotate: -3,
            }
      }
      transition={
        animationsEnabled
          ? exploding
            ? {
                duration: 0.3,
                ease: "easeOut",
              }
            : {
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
              }
          : {
              duration: 0,
            }
      }
      className={`
        relative flex h-10 w-10 items-center justify-center
        overflow-visible rounded-xl border text-2xl shadow-lg
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
            ? "cursor-not-allowed"
            : "cursor-pointer"
        }
      `}
    >
      {exploding && animationsEnabled && (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-full bg-yellow-300"
          initial={{
            opacity: 0.8,
            scale: 0.3,
          }}
          animate={{
            opacity: 0,
            scale: 2,
          }}
          transition={{
            duration: 0.3,
          }}
        />
      )}

      <motion.span
        className="relative z-10"
        animate={
          animationsEnabled && isCup && !exploding
            ? {
                filter: [
                  "drop-shadow(0 0 2px rgba(250,204,21,0.4))",
                  "drop-shadow(0 0 10px rgba(250,204,21,1))",
                  "drop-shadow(0 0 2px rgba(250,204,21,0.4))",
                ],
              }
            : {
                filter:
                  "drop-shadow(0 0 0 rgba(0,0,0,0))",
              }
        }
        transition={{
          duration: animationsEnabled ? 1.2 : 0,
          repeat:
            animationsEnabled && isCup
              ? Infinity
              : 0,
        }}
      >
        {isCup ? "🏆" : tile.ball}
      </motion.span>
    </motion.button>
  );
}