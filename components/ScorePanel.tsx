import type {
  GameLevel,
} from "../types/level";

import {
  getLevelStars,
  getNextStarScore,
} from "../utils/levels";

type ScorePanelProps = {
  score: number;
  moves: number;
  level: GameLevel;
};

export default function ScorePanel({
  score,
  moves,
  level,
}: ScorePanelProps) {
  const stars = getLevelStars(
    score,
    level
  );

  const nextStarScore =
    getNextStarScore(
      score,
      level
    );

  const progressTarget =
    level.starScores[2];

  const progressPercent =
    Math.min(
      100,
      Math.max(
        0,
        (score /
          progressTarget) *
          100
      )
    );

  return (
    <div className="mb-4 w-full max-w-xl">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center shadow-xl backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Skor
          </p>

          <p className="mt-1 text-2xl font-black text-white">
            {score}
          </p>
        </div>

        <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 px-3 py-3 text-center shadow-xl backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-yellow-200">
            Bölüm {level.id}
          </p>

          <div className="mt-1 flex items-center justify-center gap-1 text-xl">
            {[1, 2, 3].map(
              (starNumber) => (
                <span
                  key={
                    starNumber
                  }
                  className={
                    starNumber <=
                    stars
                      ? "drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]"
                      : "grayscale opacity-30"
                  }
                >
                  ⭐
                </span>
              )
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center shadow-xl backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Hamle
          </p>

          <p
            className={`mt-1 text-2xl font-black ${
              moves <= 5
                ? "text-red-400"
                : "text-white"
            }`}
          >
            {moves}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-white/10 bg-slate-900/80 p-3 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="font-bold text-slate-300">
            🎯 Hedef:{" "}
            {level.targetScore}
          </span>

          <span
            className={
              score >=
              level.targetScore
                ? "font-black text-emerald-400"
                : "font-semibold text-yellow-300"
            }
          >
            {score >=
            level.targetScore
              ? "HEDEF TAMAM!"
              : nextStarScore
                ? `Sonraki ⭐: ${nextStarScore}`
                : "3 yıldız tamam!"}
          </span>
        </div>

        <div className="relative mt-3 h-4 overflow-hidden rounded-full border border-white/10 bg-slate-950">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-yellow-400 transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
            }}
          />

          {level.starScores.map(
            (
              starScore,
              index
            ) => {
              const markerPosition =
                Math.min(
                  100,
                  (starScore /
                    progressTarget) *
                    100
                );

              return (
                <div
                  key={
                    starScore
                  }
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs"
                  style={{
                    left: `${markerPosition}%`,
                  }}
                >
                  <span
                    className={
                      score >=
                      starScore
                        ? "drop-shadow-[0_0_6px_rgba(250,204,21,1)]"
                        : "grayscale opacity-60"
                    }
                  >
                    ⭐
                  </span>

                  <span className="sr-only">
                    {index +
                      1}{" "}
                    yıldız
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}