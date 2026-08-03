import type {
  GameLevel,
  LevelProgress,
  LevelResult,
} from "../types/level";

const THREE_BALLS = ["🏀", "⚽", "🎾"];
const FOUR_BALLS = ["🏀", "⚽", "🎾", "🏐"];
const FIVE_BALLS = ["🏀", "⚽", "🎾", "🏐", "⚾"];
const SIX_BALLS = ["🏀", "⚽", "🎾", "🏐", "⚾", "🏈"];

export const LEVELS: GameLevel[] = [
  {
    id: 1,
    name: "İlk Eşleşme",
    description: "Üç top türüyle temel eşleşmeyi öğren.",
    moves: 8,
    targetScore: 350,
    starScores: [350, 550, 800],
    balls: THREE_BALLS,
    tutorial: "basic-match",
  },
  {
    id: 2,
    name: "Yeni Top",
    description: "Dördüncü top türüyle daha dikkatli hamle yap.",
    moves: 10,
    targetScore: 500,
    starScores: [500, 750, 1050],
    balls: FOUR_BALLS,
    tutorial: "more-balls",
  },
  {
    id: 3,
    name: "Roketi Keşfet",
    description: "Dört aynı topu eşleştirerek roket oluştur.",
    moves: 12,
    targetScore: 750,
    starScores: [750, 1100, 1500],
    balls: FOUR_BALLS,
    tutorial: "rocket",
  },
  {
    id: 4,
    name: "Roket Yönleri",
    description: "Yatay ve dikey roketlerin farkını öğren.",
    moves: 13,
    targetScore: 950,
    starScores: [950, 1350, 1850],
    balls: FOUR_BALLS,
    tutorial: "rocket-directions",
  },
  {
    id: 5,
    name: "Alan Bombası",
    description: "T veya L eşleşmesiyle alan bombası oluştur.",
    moves: 14,
    targetScore: 1250,
    starScores: [1250, 1750, 2350],
    balls: FIVE_BALLS,
    tutorial: "area-bomb",
  },
  {
    id: 6,
    name: "Renk Gücü",
    description: "Beşli eşleşmeyle renk bombasını keşfet.",
    moves: 15,
    targetScore: 1550,
    starScores: [1550, 2150, 2850],
    balls: FIVE_BALLS,
    tutorial: "color-bomb",
  },
  {
    id: 7,
    name: "Donmuş Saha",
    description: "Tek katlı buzları kırarak sahayı temizle.",
    moves: 16,
    targetScore: 1850,
    starScores: [1850, 2550, 3350],
    balls: FIVE_BALLS,
    tutorial: "ice",
  },
  {
    id: 8,
    name: "Kalın Buz",
    description: "Çift katlı buzlara birden fazla kez vur.",
    moves: 17,
    targetScore: 2250,
    starScores: [2250, 3050, 3950],
    balls: FIVE_BALLS,
    tutorial: "double-ice",
  },
  {
    id: 9,
    name: "Çifte Güç",
    description: "Özel güçleri yan yana getirip birleştir.",
    moves: 18,
    targetScore: 2900,
    starScores: [2900, 3900, 5100],
    balls: SIX_BALLS,
    tutorial: "power-up-combos",
  },
  {
    id: 10,
    name: "Eğitim Finali",
    description: "Öğrendiğin tüm sistemleri birlikte kullan.",
    moves: 20,
    targetScore: 3800,
    starScores: [3800, 5000, 6500],
    balls: SIX_BALLS,
    tutorial: "training-final",
  },
];

export const FIRST_LEVEL = LEVELS[0];

export function getLevelById(levelId: number): GameLevel {
  return LEVELS.find((level) => level.id === levelId) ?? FIRST_LEVEL;
}

export function getLevelStars(score: number, level: GameLevel): number {
  const [first, second, third] = level.starScores;

  if (score >= third) return 3;
  if (score >= second) return 2;
  if (score >= first) return 1;
  return 0;
}

export function getLevelResult(
  score: number,
  level: GameLevel
): LevelResult {
  return {
    won: score >= level.targetScore,
    stars: getLevelStars(score, level),
  };
}

export function getNextStarScore(
  score: number,
  level: GameLevel
): number | null {
  return level.starScores.find((target) => score < target) ?? null;
}

export function normalizeLevelProgress(
  savedProgress: Partial<LevelProgress>
): LevelProgress {
  const unlockedLevel =
    typeof savedProgress.unlockedLevel === "number"
      ? Math.min(
          LEVELS.length,
          Math.max(1, Math.floor(savedProgress.unlockedLevel))
        )
      : 1;

  const starsByLevel: Record<number, number> = {};

  if (
    savedProgress.starsByLevel &&
    typeof savedProgress.starsByLevel === "object"
  ) {
    Object.entries(savedProgress.starsByLevel).forEach(
      ([levelId, stars]) => {
        const numericLevelId = Number(levelId);

        if (Number.isInteger(numericLevelId) && typeof stars === "number") {
          starsByLevel[numericLevelId] = Math.min(
            3,
            Math.max(0, Math.floor(stars))
          );
        }
      }
    );
  }

  const bestScoresByLevel: Record<number, number> = {};

  if (
    savedProgress.bestScoresByLevel &&
    typeof savedProgress.bestScoresByLevel === "object"
  ) {
    Object.entries(savedProgress.bestScoresByLevel).forEach(
      ([levelId, score]) => {
        const numericLevelId = Number(levelId);

        if (Number.isInteger(numericLevelId) && typeof score === "number") {
          bestScoresByLevel[numericLevelId] = Math.max(
            0,
            Math.floor(score)
          );
        }
      }
    );
  }

  return {
    unlockedLevel,
    starsByLevel,
    bestScoresByLevel,
  };
}