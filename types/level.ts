export type LevelTutorial =
  | "basic-match"
  | "more-balls"
  | "rocket"
  | "rocket-directions"
  | "area-bomb"
  | "color-bomb"
  | "ice"
  | "double-ice"
  | "power-up-combos"
  | "training-final"
  | null;

export type GameLevel = {
  id: number;
  name: string;
  description: string;
  moves: number;
  targetScore: number;
  starScores: [number, number, number];
  balls: string[];
  tutorial: LevelTutorial;
};

export type LevelResult = {
  won: boolean;
  stars: number;
};

export type LevelProgress = {
  unlockedLevel: number;
  starsByLevel: Record<number, number>;
  bestScoresByLevel: Record<number, number>;
};

export const DEFAULT_LEVEL_PROGRESS: LevelProgress = {
  unlockedLevel: 1,
  starsByLevel: {},
  bestScoresByLevel: {},
};