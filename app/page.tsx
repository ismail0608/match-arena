"use client";

import { useEffect, useState } from "react";
import Board from "../components/Board";
import MainMenu from "../components/MainMenu";
import SettingsScreen, {
  type GameSettings,
} from "../components/SettingsScreen";
import TournamentScreen from "../components/TournamentScreen";
import {
  BASKETBALL_TARGET_SCORE,
  DEFAULT_CAREER_PROGRESS,
  type CareerProgress,
} from "../types/progress";

type Screen =
  | "menu"
  | "game"
  | "settings"
  | "tournament";

const DEFAULT_SETTINGS: GameSettings = {
  sound: true,
  vibration: true,
  animations: true,
};

function normalizeCareer(
  savedCareer: Partial<CareerProgress>
): CareerProgress {
  return {
    bestScore:
      typeof savedCareer.bestScore === "number"
        ? savedCareer.bestScore
        : DEFAULT_CAREER_PROGRESS.bestScore,

    basketballProgress:
      typeof savedCareer.basketballProgress === "number"
        ? savedCareer.basketballProgress
        : DEFAULT_CAREER_PROGRESS.basketballProgress,

    footballUnlocked:
      typeof savedCareer.footballUnlocked === "boolean"
        ? savedCareer.footballUnlocked
        : DEFAULT_CAREER_PROGRESS.footballUnlocked,

    coins:
      typeof savedCareer.coins === "number"
        ? savedCareer.coins
        : DEFAULT_CAREER_PROGRESS.coins,
  };
}

export default function Home() {
  const [screen, setScreen] =
    useState<Screen>("menu");

  const [settings, setSettings] =
    useState<GameSettings>(DEFAULT_SETTINGS);

  const [career, setCareer] =
    useState<CareerProgress>(
      DEFAULT_CAREER_PROGRESS
    );

  useEffect(() => {
    const savedSettings =
      window.localStorage.getItem(
        "match-arena-settings"
      );

    const savedCareer =
      window.localStorage.getItem(
        "match-arena-career"
      );

    if (savedSettings) {
      try {
        setSettings(
          JSON.parse(savedSettings) as GameSettings
        );
      } catch {
        window.localStorage.removeItem(
          "match-arena-settings"
        );
      }
    }

    if (savedCareer) {
      try {
        const parsedCareer =
          JSON.parse(savedCareer) as Partial<CareerProgress>;

        const normalizedCareer =
          normalizeCareer(parsedCareer);

        setCareer(normalizedCareer);

        window.localStorage.setItem(
          "match-arena-career",
          JSON.stringify(normalizedCareer)
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
  }, []);

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
  ) {
    setCareer((currentCareer) => {
      const bestScore = Math.max(
        currentCareer.bestScore,
        gameScore
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

      const earnedCoins =
        Math.floor(gameScore / 10);

      const newCareer: CareerProgress = {
        bestScore,
        basketballProgress,
        footballUnlocked:
          basketballProgress >= 100,
        coins:
          currentCareer.coins +
          earnedCoins,
      };

      window.localStorage.setItem(
        "match-arena-career",
        JSON.stringify(newCareer)
      );

      return newCareer;
    });
  }

  if (screen === "game") {
    return (
      <Board
        soundEnabled={settings.sound}
        vibrationEnabled={
          settings.vibration
        }
        animationsEnabled={
          settings.animations
        }
        onExit={() =>
          setScreen("menu")
        }
        onGameEnd={recordGameScore}
      />
    );
  }

  if (screen === "settings") {
    return (
      <SettingsScreen
        settings={settings}
        onChange={updateSettings}
        onBack={() =>
          setScreen("menu")
        }
      />
    );
  }

  if (screen === "tournament") {
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

  return (
    <MainMenu
      career={career}
      onPlay={() =>
        setScreen("game")
      }
      onTournament={() =>
        setScreen("tournament")
      }
      onSettings={() =>
        setScreen("settings")
      }
    />
  );
}