import type { ProgressSnapshot } from "./lesson";

export function blankProgress(forgeId: string): ProgressSnapshot {
  return {
    forgeId,
    completed: [],
    xp: 0,
    badges: [],
    lastActiveDate: null,
    streak: 0,
    theme: "dark",
    lang: "es",
  };
}

/** Racha en días: +1 si la última actividad fue ayer; reinicia si es más vieja. */
export function bumpStreak(p: ProgressSnapshot, now = new Date()): number {
  if (!p.lastActiveDate) return 1;
  const dayMs = 86_400_000;
  const start = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((start(now) - start(new Date(p.lastActiveDate))) / dayMs);
  if (diffDays === 0) return p.streak;
  if (diffDays === 1) return p.streak + 1;
  return 1;
}

/** Validación tolerante del snapshot que llega por WS (string JSON). */
export function validateProgress(json: string): boolean {
  try {
    const p = JSON.parse(json) as Partial<ProgressSnapshot>;
    return (
      typeof p.xp === "number" &&
      typeof p.completed === "object" &&
      typeof p.badges === "object"
    );
  } catch {
    return false;
  }
}
