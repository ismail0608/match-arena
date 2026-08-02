import Board from "../components/Board";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8">

      <h1 className="text-5xl font-bold mb-2">
        🏀 MATCH ARENA
      </h1>

      <p className="text-gray-400 mb-8">
        Level 1
      </p>

      <Board />

    </main>
  );
}