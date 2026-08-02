type ScorePanelProps = {
  score: number;
  moves: number;
};

export default function ScorePanel({
  score,
  moves,
}: ScorePanelProps) {
  return (
    <div className="mb-4 grid w-full max-w-xl grid-cols-3 gap-3">
      <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center shadow-xl backdrop-blur-md">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Skor
        </p>

        <p className="mt-1 text-2xl font-black text-white">
          {score}
        </p>
      </div>

      <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-3 text-center shadow-xl backdrop-blur-md">
        <p className="text-xs font-semibold uppercase tracking-wider text-yellow-200">
          Arena
        </p>

        <p className="mt-1 text-2xl">🏟️</p>
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
  );
}