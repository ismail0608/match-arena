export type CareerProgress = {
  bestScore: number;
  basketballProgress: number;
  footballUnlocked: boolean;
};

export const BASKETBALL_TARGET_SCORE = 2000;

export const DEFAULT_CAREER_PROGRESS: CareerProgress = {
  bestScore: 0,
  basketballProgress: 0,
  footballUnlocked: false,
};