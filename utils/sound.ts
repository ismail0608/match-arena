export type GameSound =
  | "select"
  | "invalid"
  | "match"
  | "combo"
  | "cup";

let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContext();
  }

  return audioContext;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.08,
  delay = 0
) {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  const startTime = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(
    frequency,
    startTime
  );

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(
    volume,
    startTime + 0.01
  );
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    startTime + duration
  );

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

export function playGameSound(
  sound: GameSound,
  enabled: boolean
) {
  if (!enabled) {
    return;
  }

  const context = getAudioContext();

  if (!context) {
    return;
  }

  if (context.state === "suspended") {
    void context.resume();
  }

  switch (sound) {
    case "select":
      playTone(440, 0.09, "sine", 0.05);
      break;

    case "invalid":
      playTone(180, 0.13, "square", 0.04);
      playTone(140, 0.16, "square", 0.035, 0.08);
      break;

    case "match":
      playTone(520, 0.12, "sine", 0.06);
      playTone(660, 0.14, "sine", 0.06, 0.07);
      break;

    case "combo":
      playTone(520, 0.12, "triangle", 0.07);
      playTone(660, 0.12, "triangle", 0.07, 0.07);
      playTone(820, 0.18, "triangle", 0.08, 0.14);
      break;

    case "cup":
      playTone(392, 0.2, "triangle", 0.08);
      playTone(523, 0.22, "triangle", 0.08, 0.1);
      playTone(659, 0.32, "triangle", 0.09, 0.2);
      break;
  }
}