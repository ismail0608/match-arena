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
  const isHorizontalRocket =
    tile.special === "rocket-horizontal";

  const isVerticalRocket =
    tile.special === "rocket-vertical";

  const isRocket =
    isHorizontalRocket || isVerticalRocket;

  const isAreaBomb =
    tile.special === "area-bomb";

  const isColorBomb =
    tile.special === "bomb";

  const isSpecial =
    isRocket || isAreaBomb || isColorBomb;

  const iceHealth =
    tile.obstacle?.type === "ice"
      ? tile.obstacle.health
      : 0;

  const hasIce = iceHealth > 0;

  const normalAnimation = {
    opacity: 1,
    y: selected ? -5 : 0,
    scale: selected ? 1.12 : 1,
    rotate:
      animationsEnabled && isRocket
        ? [0, -4, 4, -2, 2, 0]
        : animationsEnabled && isAreaBomb
          ? [0, -8, 8, -5, 5, 0]
          : animationsEnabled && isColorBomb
            ? [0, 8, -8, 5, -5, 0]
            : 0,
    filter: "brightness(1)",
  };

  const explosionAnimation = animationsEnabled
    ? {
        opacity: [1, 1, 0],
        scale: [1, 1.4, 0],
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

  function getIcon() {
    if (isColorBomb) {
      return "🌈";
    }

    if (isAreaBomb) {
      return "💣";
    }

    if (isRocket) {
      return "🚀";
    }

    return tile.ball;
  }

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      layout={animationsEnabled}
      layoutId={animationsEnabled ? tile.id : undefined}
      initial={
        animationsEnabled
          ? {
              opacity: 0,
              y: -40,
              scale: 0.7,
            }
          : false
      }
      animate={exploding ? explosionAnimation : normalAnimation}
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
                  duration: isAreaBomb ? 0.8 : 1.2,
                  repeat: isSpecial ? Infinity : 0,
                  repeatDelay: 0.4,
                },
              }
          : {
              duration: 0,
            }
      }
      className={`
        relative flex h-10 w-10 items-center justify-center
        overflow-hidden rounded-xl border text-2xl shadow-lg
        sm:h-14 sm:w-14 sm:text-3xl

        ${
          selected
            ? "border-yellow-200 bg-yellow-400 shadow-yellow-400/60"
            : isColorBomb
              ? "border-fuchsia-300 bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-yellow-400 shadow-fuchsia-500/60"
              : isAreaBomb
                ? "border-orange-200 bg-gradient-to-br from-orange-300 via-red-600 to-slate-950 shadow-red-500/70"
                : isRocket
                  ? "border-cyan-200 bg-gradient-to-br from-cyan-300 via-blue-600 to-indigo-950 shadow-cyan-400/60"
                  : "border-white/10 bg-gradient-to-br from-slate-700 to-slate-900 hover:border-indigo-300/50"
        }

        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {exploding && animationsEnabled && (
        <motion.span
          className={`pointer-events-none absolute inset-0 rounded-full ${
            isColorBomb
              ? "bg-fuchsia-300"
              : isAreaBomb
                ? "bg-orange-400"
                : isRocket
                  ? "bg-cyan-300"
                  : hasIce
                    ? "bg-cyan-100"
                    : "bg-yellow-300"
          }`}
          initial={{
            opacity: 0.8,
            scale: 0.3,
          }}
          animate={{
            opacity: 0,
            scale: isAreaBomb ? 2.7 : 2.4,
          }}
          transition={{
            duration: 0.3,
          }}
        />
      )}

      {isSpecial && animationsEnabled && !exploding && (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-xl border-2 border-white/70"
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.88, 1.12, 0.88],
          }}
          transition={{
            duration: isAreaBomb ? 0.65 : 0.9,
            repeat: Infinity,
          }}
        />
      )}

      <motion.span
        className="relative z-10 inline-block"
        style={{
          transform: isVerticalRocket
            ? "rotate(-90deg)"
            : "rotate(0deg)",
        }}
      >
        {getIcon()}
      </motion.span>

      {hasIce && (
        <>
          <span className="pointer-events-none absolute inset-0 z-20 rounded-xl border-2 border-cyan-100/90 bg-cyan-200/20 shadow-inner shadow-cyan-100/60" />

          <span className="pointer-events-none absolute left-1 top-1 z-30 h-3 w-px rotate-45 bg-white/90" />
          <span className="pointer-events-none absolute right-2 top-1 z-30 h-4 w-px -rotate-45 bg-white/70" />
          <span className="pointer-events-none absolute bottom-1 left-1/2 z-30 h-3 w-px rotate-12 bg-white/70" />

          <span className="pointer-events-none absolute right-0.5 top-0.5 z-30 rounded-full bg-cyan-100 px-1 text-[8px] font-black leading-4 text-cyan-900 shadow">
            🧊{iceHealth > 1 ? iceHealth : ""}
          </span>
        </>
      )}

      {isHorizontalRocket && (
        <span className="pointer-events-none absolute bottom-0 text-[7px] font-black text-white">
          YATAY
        </span>
      )}

      {isVerticalRocket && (
        <span className="pointer-events-none absolute bottom-0 text-[7px] font-black text-white">
          DİKEY
        </span>
      )}

      {isAreaBomb && (
        <span className="pointer-events-none absolute bottom-0 text-[7px] font-black text-white">
          3×3
        </span>
      )}
    </motion.button>
  );
}