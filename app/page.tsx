"use client";

import { useEffect, useState } from "react";
import Board from "../components/Board";
import MainMenu from "../components/MainMenu";
import SettingsScreen, {
  type GameSettings,
} from "../components/SettingsScreen";

type Screen = "menu" | "game" | "settings";

const DEFAULT_SETTINGS: GameSettings = {
  sound: true,
  vibration: true,
  animations: true,
};

export default function Home() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [settings, setSettings] =
    useState<GameSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const savedSettings =
      window.localStorage.getItem("match-arena-settings");

    if (!savedSettings) {
      return;
    }

    try {
      const parsedSettings = JSON.parse(
        savedSettings
      ) as GameSettings;

      setSettings(parsedSettings);
    } catch {
      window.localStorage.removeItem(
        "match-arena-settings"
      );
    }
  }, []);

  function updateSettings(newSettings: GameSettings) {
    setSettings(newSettings);

    window.localStorage.setItem(
      "match-arena-settings",
      JSON.stringify(newSettings)
    );
  }

  if (screen === "game") {
    return <Board />;
  }

  if (screen === "settings") {
    return (
      <SettingsScreen
        settings={settings}
        onChange={updateSettings}
        onBack={() => setScreen("menu")}
      />
    );
  }

  return (
    <MainMenu
      onPlay={() => setScreen("game")}
      onSettings={() => setScreen("settings")}
    />
  );
}