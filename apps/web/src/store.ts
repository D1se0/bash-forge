import type { ProgressSnapshot } from "@bashforge/shared";
import { BADGES, LESSON_LEVELS, type LessonLevel } from "@bashforge/shared";

const KEY = "bf.progress.v1";

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

export function loadProgress(forgeId: string): ProgressSnapshot {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as ProgressSnapshot;
      if (p && typeof p.xp === "number") return { ...blankProgress(forgeId), ...p, forgeId };
    }
  } catch {
    /* progreso corrupto: blankear */
  }
  return blankProgress(forgeId);
}

export function saveProgress(p: ProgressSnapshot): void {
  localStorage.setItem(KEY, JSON.stringify(p));
}

/** Racha en días: +1 si la última actividad es ayer, reinicia si es más vieja. */
export function bumpStreak(p: ProgressSnapshot, now = new Date()): number {
  if (p.lastActiveDate) {
    const last = new Date(p.lastActiveDate);
    const dayMs = 86_400_000;
    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const diffDays = Math.round((startOfDay(now) - startOfDay(last)) / dayMs);
    if (diffDays === 0) return p.streak; // hoy ya tuvo actividad
    if (diffDays === 1) return p.streak + 1;
    return 1;
  }
  return 1;
}

/** Recalcula badges, se llama cuando cambia `completed`. */
export function computeBadges(completed: string[], levelOf: (id: string) => LessonLevel | null): string[] {
  const badges = new Set<string>();
  const perLevel = new Map<LessonLevel, number>();
  for (const id of completed) {
    const lvl = levelOf(id);
    if (lvl !== null) perLevel.set(lvl, (perLevel.get(lvl) ?? 0) + 1);
  }
  for (const info of LESSON_LEVELS) {
    if ((perLevel.get(info.level) ?? 0) > 0) {
      if (info.level === 0) badges.add("forge-apprentice");
      if (info.level === 1) badges.add("quote-master");
      if (info.level === 5) badges.add("pipe-dream");
      if (info.level === 6) badges.add("regexpal");
      if (info.level === 7) badges.add("trap-hunter");
    }
  }
  for (const b of BADGES) {
    if (b.id === "forge-master" && perLevel.size === LESSON_LEVELS.length) badges.add(b.id);
  }
  return [...badges];
}
