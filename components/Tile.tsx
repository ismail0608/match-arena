type TileProps = {
  ball: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
};

export default function Tile({
  ball,
  selected,
  disabled,
  onClick,
}: TileProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-xl border text-2xl shadow-lg transition duration-200 sm:h-14 sm:w-14 sm:text-3xl
      ${
        selected
          ? "scale-110 border-yellow-200 bg-yellow-400 shadow-yellow-400/40"
          : ball === "🏆"
          ? "border-yellow-300 bg-gradient-to-br from-yellow-400 to-amber-700 shadow-yellow-500/40 hover:scale-110"
          : "border-white/10 bg-gradient-to-br from-slate-700 to-slate-900 hover:-translate-y-1 hover:scale-105 hover:border-indigo-300/50"
      }
      ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer"
      }`}
    >
      {ball}
    </button>
  );
}