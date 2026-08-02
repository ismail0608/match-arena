export type CareerProgress = {
  bestScore: number;
  basketballProgress: number;
  footballUnlocked: boolean;
  coins: number;
  level: number;
  xp: number;
};

export type GameReward = {
  earnedCoins: number;
  earnedXp: number;
  previousLevel: number;
  newLevel: number;
  levelsGained: number;
  levelBonusCoins: number;
  totalCoinsEarned: number;
};

export const BASKETBALL_TARGET_SCORE = 2000;
export const XP_PER_LEVEL = 500;
export const LEVEL_UP_COIN_REWARD = 100;

export const DEFAULT_CAREER_PROGRESS: CareerProgress = {
  bestScore: 0,
  basketballProgress: 0,
  footballUnlocked: false,
  coins: 0,
  level: 1,
  xp: 0,
};

export function calculateEarnedCoins(score: number) {
  return Math.floor(Math.max(0, score) / 10);
}

export function calculateEarnedXp(score: number) {
  return Math.floor(Math.max(0, score) / 5);
}

export function getLevelFromTotalXp(totalXp: number) {
  return Math.floor(Math.max(0, totalXp) / XP_PER_LEVEL) + 1;
}

export function getXpInCurrentLevel(totalXp: number) {
  return Math.max(0, totalXp) % XP_PER_LEVEL;
}

export function getXpProgressPercent(totalXp: number) {
  return Math.min(
    100,
    Math.floor(
      (getXpInCurrentLevel(totalXp) / XP_PER_LEVEL) * 100
    )
  );
}