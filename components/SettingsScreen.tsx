"use client";

import { motion } from "motion/react";

export type GameSettings = {
  sound: boolean;
  vibration: boolean;
  animations: boolean;
};

type SettingsScreenProps = {
  settings: GameSettings;
  onChange: (settings: GameSettings) => void;
  onBack: () => void;
};

type SettingRowProps = {
  icon: string;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
};

function SettingRow({
  icon,
  title,
  description,
  enabled,
  onToggle,
}: SettingRowProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-md"
      whileHover={{
        scale: 1.015,
        backgroundColor: "rgba(255,255,255,0.08)",
      }}
      whileTap={{
        scale: 0.98,
      }}
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-2xl">
          {icon}
        </div>

        <div>
          <p className="font-black text-white">{title}</p>

          <p className="mt-1 text-sm text-slate-400">
            {description}
          </p>
        </div>
      </div>

      <div
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          enabled ? "bg-yellow-400" : "bg-slate-700"
        }`}
      >
        <motion.div
          className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-md"
          animate={{
            x: enabled ? 24 : 4,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
      </div>
    </motion.button>
  );
}

export default function SettingsScreen({
  settings,
  onChange,
  onBack,
}: SettingsScreenProps) {
  function updateSetting(
    key: keyof GameSettings,
    value: boolean
  ) {
    onChange({
      ...settings,
      [key]: value,
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 px-4 py-8">
      <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-lg">
        <motion.button
          type="button"
          onClick={onBack}
          className="mb-8 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-bold text-slate-300"
          whileHover={{
            scale: 1.04,
            x: -3,
          }}
          whileTap={{
            scale: 0.94,
          }}
        >
          ← GERİ
        </motion.button>

        <motion.div
          initial={{
            opacity: 0,
            y: -25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <p className="text-sm font-black tracking-[0.35em] text-yellow-400">
            MATCH ARENA
          </p>

          <h1 className="mt-2 text-4xl font-black text-white">
            AYARLAR
          </h1>

          <p className="mt-2 text-slate-400">
            Arena deneyimini kendi oyun tarzına göre düzenle.
          </p>
        </motion.div>

        <motion.div
          className="mt-8 flex flex-col gap-3"
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
          }}
        >
          <SettingRow
            icon="🔊"
            title="Ses efektleri"
            description="Patlama, combo ve kupa seslerini açar."
            enabled={settings.sound}
            onToggle={() =>
              updateSetting("sound", !settings.sound)
            }
          />

          <SettingRow
            icon="📳"
            title="Titreşim"
            description="Güçlü hamlelerde cihaz titreşimi kullanır."
            enabled={settings.vibration}
            onToggle={() =>
              updateSetting(
                "vibration",
                !settings.vibration
              )
            }
          />

          <SettingRow
            icon="✨"
            title="Animasyonlar"
            description="Taş hareketlerini ve görsel efektleri açar."
            enabled={settings.animations}
            onToggle={() =>
              updateSetting(
                "animations",
                !settings.animations
              )
            }
          />
        </motion.div>

        <motion.div
          className="mt-8 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-5"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.3,
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">🏟️</span>

            <div>
              <p className="font-black text-yellow-300">
                Arena notu
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-300">
                Ses ve titreşim özelliklerini sonraki sprintte
                gerçek efektlerle bağlayacağız. Tercihlerin şimdiden
                kaydediliyor.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}