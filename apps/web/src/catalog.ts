import type { LessonMeta } from "@bashforge/shared";

import { LESSON_LEVELS } from "@bashforge/shared";
import type { LessonLevel, LessonLevelInfo } from "@bashforge/shared";

export interface LevelGroup {
  info: LessonLevelInfo;
  lessons: LessonMeta[];
}

/**
 * Orden pedagógico dentro de un nivel: primero las lecciones, luego los retos
 * y siempre el Boss al final (es el examen de cierre del nivel).
 */
function pedagogyPos(l: LessonMeta): number {
  if (l.kind === "lesson") return 0;
  if (l.kind === "challenge") return 1;
  return 2; // boss, playground
}

export function groupByLevel(lessons: LessonMeta[]): LevelGroup[] {
  const by = new Map<LessonLevel, LessonMeta[]>();
  for (const l of lessons) {
    const arr = by.get(l.level) ?? [];
    arr.push(l);
    by.set(l.level, arr);
  }
  return LESSON_LEVELS.filter((i) => by.has(i.level)).map((info) => ({
    info,
    lessons: (by.get(info.level) ?? []).sort(
      (a, b) => pedagogyPos(a) - pedagogyPos(b) || a.id.localeCompare(b.id),
    ),
  }));
}

/**
 * Nivel mínimo desbloqueado: la forja se avanza nivel a nivel. Un nivel está
 * desbloqueado si todos los del anterior están completados (el 0 siempre).
 */
export function unlockedLevel(completed: string[], groups: LevelGroup[]): LessonLevel {
  let unlocked: LessonLevel = 0;
  for (const g of groups) {
    const done = g.lessons.every((l) => completed.includes(l.id));
    if (!done) break;
    unlocked = Math.min(g.info.level + 1, 9) as LessonLevel;
  }
  return unlocked;
}

export function isLevelLocked(level: LessonLevel, unlocked: LessonLevel): boolean {
  return level > unlocked;
}
