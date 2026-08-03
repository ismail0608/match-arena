export const EXPLOSION_DURATION = 320;

export function wait(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export function vibrate(
  pattern: number | number[],
  enabled: boolean
) {
  if (!enabled) {
    return;
  }

  if (
    typeof navigator !== "undefined" &&
    "vibrate" in navigator
  ) {
    navigator.vibrate(pattern);
  }
}