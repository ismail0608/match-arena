"use client";

import { motion } from "motion/react";
import type { GameLevel, LevelTutorial } from "../types/level";

type TutorialModalProps = {
  level: GameLevel;
  onStart: () => void;
  onExit: () => void;
};

type TutorialContent = {
  icon: string;
  title: string;
  description: string;
  tips: string[];
};

const TUTORIAL_CONTENT: Record<
  Exclude<LevelTutorial, null>,
  TutorialContent
> = {
  "basic-match": {
    icon: "🔁",
    title: "İlk eşleşmeni yap",
    description:
      "Yan yana duran iki topun yerini değiştir ve en az üç aynı topu sırala.",
    tips: [
      "Yalnızca yan yana veya alt alta duran toplar değiştirilebilir.",
      "Geçerli hamle en az üçlü bir eşleşme oluşturmalıdır.",
    ],
  },
  "more-balls": {
    icon: "🏐",
    title: "Yeni top sahada",
    description:
      "Bu bölümde dördüncü top türü açıldı. Hamlelerini yapmadan önce tahtayı dikkatle incele.",
    tips: [
      "Top çeşidi arttıkça eşleşmeler biraz daha zor bulunur.",
      "Tahtanın alt bölümlerindeki hamleler daha fazla zincir oluşturabilir.",
    ],
  },
  rocket: {
    icon: "🚀",
    title: "Roketi keşfet",
    description:
      "Dört aynı topu düz bir çizgide eşleştirerek roket oluştur.",
    tips: [
      "Yatay dört top yatay roket oluşturur.",
      "Dikey dört top dikey roket oluşturur.",
    ],
  },
  "rocket-directions": {
    icon: "↔️",
    title: "Roket yönleri",
    description:
      "Roketin yönü, temizleyeceği hattı belirler. Doğru roketi doğru zamanda kullan.",
    tips: [
      "Yatay roket bütün satırı temizler.",
      "Dikey roket bütün sütunu temizler.",
    ],
  },
  "area-bomb": {
    icon: "💣",
    title: "Alan bombası",
    description:
      "T veya L biçiminde kesişen eşleşme yaparak 3×3 alan bombası oluştur.",
    tips: [
      "Bombaya iki kez dokunarak patlatabilirsin.",
      "Bomba çevresindeki özel güçleri de zincirleme çalıştırır.",
    ],
  },
  "color-bomb": {
    icon: "🌈",
    title: "Renk bombası",
    description:
      "Beş aynı topu düz bir çizgide eşleştirerek renk bombası oluştur.",
    tips: [
      "Renk bombasını normal topla değiştirirsen o top türünün tamamı temizlenir.",
      "Roket veya bombayla birleştirildiğinde çok güçlü kombolar oluşur.",
    ],
  },
  ice: {
    icon: "🧊",
    title: "Donmuş saha",
    description:
      "Bazı topların üzerinde buz var. Buzlu top eşleştiğinde önce buz kırılır.",
    tips: [
      "Tek kat buz bir darbede kırılır.",
      "Roket ve bombalar da buza hasar verir.",
    ],
  },
  "double-ice": {
    icon: "🧊2",
    title: "Kalın buz",
    description:
      "Çift katlı buzların tamamen kırılması için birden fazla darbe gerekir.",
    tips: [
      "🧊2 ilk darbede 🧊1 seviyesine düşer.",
      "Zincirleme özel güçler kalın buzlara karşı çok etkilidir.",
    ],
  },
  "power-up-combos": {
    icon: "⚡",
    title: "Özel güçleri birleştir",
    description:
      "Yan yana gelen özel güçleri birbirleriyle değiştirerek güçlü kombolar oluştur.",
    tips: [
      "🚀 + 🚀 bir satır ve bir sütunu temizler.",
      "🚀 + 💣 üç satır ve üç sütunu temizler.",
      "💣 + 💣 geniş bir alanı patlatır.",
    ],
  },
  "training-final": {
    icon: "🏆",
    title: "Eğitim finali",
    description:
      "Öğrendiğin tüm eşleşmeleri, özel güçleri ve komboları birlikte kullan.",
    tips: [
      "Önce tahtayı incele, sonra hamleni seç.",
      "Özel güçleri hemen harcamak yerine birleştirmek daha yüksek skor kazandırabilir.",
    ],
  },
};

export default function TutorialModal({
  level,
  onStart,
  onExit,
}: TutorialModalProps) {
  const fallback: TutorialContent = {
    icon: "🏟️",
    title: level.name,
    description: level.description,
    tips: ["Hedef puana hamlelerin bitmeden ulaş."],
  };

  const content = level.tutorial
    ? TUTORIAL_CONTENT[level.tutorial]
    : fallback;

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/90 px-4 py-8 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="w-full max-w-md rounded-3xl border border-yellow-400/30 bg-gradient-to-b from-indigo-950 to-slate-950 p-6 text-white shadow-2xl shadow-indigo-950/80"
        initial={{ opacity: 0, y: 45, scale: 0.82 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 21 }}
      >
        <div className="text-center">
          <motion.div
            className="text-6xl"
            animate={{ y: [0, -7, 0], rotate: [0, -4, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            {content.icon}
          </motion.div>

          <p className="mt-4 text-xs font-black tracking-[0.3em] text-yellow-400">
            BÖLÜM {level.id}
          </p>

          <h2 className="mt-2 text-3xl font-black">{content.title}</h2>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            {content.description}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Hamle
            </p>
            <p className="mt-1 text-xl font-black">{level.moves}</p>
          </div>

          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-yellow-200">
              Hedef
            </p>
            <p className="mt-1 text-xl font-black text-yellow-300">
              {level.targetScore}
            </p>
          </div>

          <div className="rounded-2xl border border-indigo-300/20 bg-indigo-300/10 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">
              Top
            </p>
            <p className="mt-1 text-xl font-black">{level.balls.length}</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-200">
            İpuçları
          </p>

          <div className="mt-3 space-y-3">
            {content.tips.map((tip) => (
              <div key={tip} className="flex gap-3 text-sm text-slate-200">
                <span className="shrink-0 text-yellow-400">●</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <motion.button
            type="button"
            onClick={onStart}
            className="w-full rounded-2xl bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 px-5 py-4 font-black text-slate-950 shadow-xl shadow-yellow-500/20"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.94 }}
          >
            ▶ BÖLÜMÜ BAŞLAT
          </motion.button>

          <motion.button
            type="button"
            onClick={onExit}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-bold text-slate-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
          >
            ← BÖLÜM HARİTASI
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}