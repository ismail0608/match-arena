"use client";

import {
  useEffect,
  useState,
} from "react";

import Board from "../components/Board";
import DailyRewardModal from "../components/DailyRewardModal";
import MainMenu from "../components/MainMenu";
import MissionsScreen from "../components/MissionsScreen";
import SettingsScreen, {
  type GameSettings,
} from "../components/SettingsScreen";
import TournamentScreen from "../components/TournamentScreen";

import {
  BASKETBALL_TARGET_SCORE,
  DEFAULT_CAREER_PROGRESS,
  LEVEL_UP_COIN_REWARD,
  calculateEarnedCoins,
  calculateEarnedXp,
  getLevelFromTotalXp,
  type CareerProgress,
  type GameReward,
} from "../types/progress";

type Screen =
  | "menu"
  | "game"
  | "settings"
  | "tournament"
  | "missions";

const DEFAULT_SETTINGS: GameSettings = {
  sound: true,
  vibration: true,
  animations: true,
};

const DAILY_REWARD_COINS = 100;

function getTodayKey() {
  const today = new Date();

  const year =
    today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function normalizeCareer(
  savedCareer: Partial<CareerProgress>
): CareerProgress {
  const xp =
    typeof savedCareer.xp ===
    "number"
      ? Math.max(
          0,
          savedCareer.xp
        )
      : DEFAULT_CAREER_PROGRESS.xp;

  return {
    bestScore:
      typeof savedCareer.bestScore ===
      "number"
        ? Math.max(
            0,
            savedCareer.bestScore
          )
        : DEFAULT_CAREER_PROGRESS.bestScore,

    basketballProgress:
      typeof savedCareer.basketballProgress ===
      "number"
        ? Math.min(
            100,
            Math.max(
              0,
              savedCareer.basketballProgress
            )
          )
        : DEFAULT_CAREER_PROGRESS.basketballProgress,

    footballUnlocked:
      typeof savedCareer.footballUnlocked ===
      "boolean"
        ? savedCareer.footballUnlocked
        : DEFAULT_CAREER_PROGRESS.footballUnlocked,

    coins:
      typeof savedCareer.coins ===
      "number"
        ? Math.max(
            0,
            savedCareer.coins
          )
        : DEFAULT_CAREER_PROGRESS.coins,

    level:
      getLevelFromTotalXp(xp),

    xp,

    claimedMissions:
      Array.isArray(
        savedCareer.claimedMissions
      )
        ? savedCareer.claimedMissions.filter(
            (
              missionId
            ): missionId is string =>
              typeof missionId ===
              "string"
          )
        : [],
  };
}

export default function Home() {
  const [screen, setScreen] =
    useState<Screen>("menu");

  const [settings, setSettings] =
    useState<GameSettings>(
      DEFAULT_SETTINGS
    );

  const [career, setCareer] =
    useState<CareerProgress>(
      DEFAULT_CAREER_PROGRESS
    );

  const [
    showDailyReward,
    setShowDailyReward,
  ] = useState(false);

  const [isLoaded, setIsLoaded] =
    useState(false);

  useEffect(() => {
    const savedSettings =
      window.localStorage.getItem(
        "match-arena-settings"
      );

    const savedCareer =
      window.localStorage.getItem(
        "match-arena-career"
      );

    const lastDailyRewardDate =
      window.localStorage.getItem(
        "match-arena-daily-reward-date"
      );

    if (savedSettings) {
      try {
        const parsedSettings =
          JSON.parse(
            savedSettings
          ) as Partial<GameSettings>;

        setSettings({
          sound:
            typeof parsedSettings.sound ===
            "boolean"
              ? parsedSettings.sound
              : DEFAULT_SETTINGS.sound,

          vibration:
            typeof parsedSettings.vibration ===
            "boolean"
              ? parsedSettings.vibration
              : DEFAULT_SETTINGS.vibration,

          animations:
            typeof parsedSettings.animations ===
            "boolean"
              ? parsedSettings.animations
              : DEFAULT_SETTINGS.animations,
        });
      } catch {
        window.localStorage.removeItem(
          "match-arena-settings"
        );
      }
    }

    if (savedCareer) {
      try {
        const parsedCareer =
          JSON.parse(
            savedCareer
          ) as Partial<CareerProgress>;

        const normalizedCareer =
          normalizeCareer(
            parsedCareer
          );

        setCareer(
          normalizedCareer
        );

        window.localStorage.setItem(
          "match-arena-career",
          JSON.stringify(
            normalizedCareer
          )
        );
      } catch {
        window.localStorage.removeItem(
          "match-arena-career"
        );

        setCareer(
          DEFAULT_CAREER_PROGRESS
        );
      }
    }

    if (
      lastDailyRewardDate !==
      getTodayKey()
    ) {
      setShowDailyReward(true);
    }

    setIsLoaded(true);
  }, []);

  function saveCareer(
    newCareer: CareerProgress
  ) {
    setCareer(newCareer);

    window.localStorage.setItem(
      "match-arena-career",
      JSON.stringify(newCareer)
    );
  }

  function claimDailyReward() {
    const newCareer: CareerProgress = {
      ...career,
      coins:
        career.coins +
        DAILY_REWARD_COINS,
    };

    saveCareer(newCareer);

    window.localStorage.setItem(
      "match-arena-daily-reward-date",
      getTodayKey()
    );

    setShowDailyReward(false);
  }

  function claimMission(
    missionId: string,
    reward: number
  ) {
    if (
      career.claimedMissions.includes(
        missionId
      )
    ) {
      return;
    }

    const newCareer: CareerProgress = {
      ...career,

      coins:
        career.coins +
        Math.max(0, reward),

      claimedMissions: [
        ...career.claimedMissions,
        missionId,
      ],
    };

    saveCareer(newCareer);
  }

  function updateSettings(
    newSettings: GameSettings
  ) {
    setSettings(newSettings);

    window.localStorage.setItem(
      "match-arena-settings",
      JSON.stringify(newSettings)
    );
  }

  function recordGameScore(
    gameScore: number
  ): GameReward {
    const safeScore =
      Math.max(0, gameScore);

    const earnedCoins =
      calculateEarnedCoins(
        safeScore
      );

    const earnedXp =
      calculateEarnedXp(
        safeScore
      );

    const previousLevel =
      getLevelFromTotalXp(
        career.xp
      );

    const newTotalXp =
      career.xp +
      earnedXp;

    const newLevel =
      getLevelFromTotalXp(
        newTotalXp
      );

    const levelsGained =
      Math.max(
        0,
        newLevel -
          previousLevel
      );

    const levelBonusCoins =
      levelsGained *
      LEVEL_UP_COIN_REWARD;

    const totalCoinsEarned =
      earnedCoins +
      levelBonusCoins;

    const bestScore =
      Math.max(
        career.bestScore,
        safeScore
      );

    const basketballProgress =
      Math.min(
        100,
        Math.floor(
          (bestScore /
            BASKETBALL_TARGET_SCORE) *
            100
        )
      );

    const newCareer: CareerProgress = {
      ...career,

      bestScore,
      basketballProgress,

      footballUnlocked:
        basketballProgress >= 100,

      coins:
        career.coins +
        totalCoinsEarned,

      level:
        newLevel,

      xp:
        newTotalXp,
    };

    saveCareer(newCareer);

    return {
      earnedCoins,
      earnedXp,
      previousLevel,
      newLevel,
      levelsGained,
      levelBonusCoins,
      totalCoinsEarned,
    };
  }

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="text-5xl">
            🏟️
          </div>

          <p className="mt-4 font-black tracking-widest text-yellow-400">
            MATCH ARENA
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Arena hazırlanıyor...
          </p>
        </div>
      </main>
    );
  }

  if (screen === "game") {
    return (
      <Board
        soundEnabled={
          settings.sound
        }
        vibrationEnabled={
          settings.vibration
        }
        animationsEnabled={
          settings.animations
        }
        onExit={() =>
          setScreen("menu")
        }
        onGameEnd={
          recordGameScore
        }
      />
    );
  }

  if (screen === "settings") {
    return (
      <SettingsScreen
        settings={settings}
        onChange={
          updateSettings
        }
        onBack={() =>
          setScreen("menu")
        }
      />
    );
  }

  if (
    screen === "tournament"
  ) {
    return (
      <TournamentScreen
        career={career}
        onBack={() =>
          setScreen("menu")
        }
        onPlay={() =>
          setScreen("game")
        }
      />
    );
  }

  if (screen === "missions") {
    return (
      <MissionsScreen
        career={career}
        onBack={() =>
          setScreen("menu")
        }
        onClaimMission={
          claimMission
        }
      />
    );
  }

  return (
    <>
      <MainMenu
        career={career}
        onPlay={() =>
          setScreen("game")
        }
        onMissions={() =>
          setScreen("missions")
        }
        onTournament={() =>
          setScreen(
            "tournament"
          )
        }
        onSettings={() =>
          setScreen("settings")
        }
      />

      {showDailyReward && (
        <DailyRewardModal
          rewardCoins={
            DAILY_REWARD_COINS
          }
          onClaim={
            claimDailyReward
          }
          onClose={() =>
            setShowDailyReward(
              false
            )
          }
        />
      )}
    </>
  );
}