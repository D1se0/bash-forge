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

/** ------------------------------------------------------------------ */
/** Práctica dirigida: pista paralela al camino (IF, FOR, WHILE, CASE). */
/** ------------------------------------------------------------------ */

export interface TrackGroup {
  track: string;
  title: string;
  lessons: LessonMeta[];
}

export interface SplitCatalog {
  /** Lecciones del camino L0→L9 (sin práctica). */
  path: LessonMeta[];
  /** Lecciones con `track`, fuera del camino. */
  practice: LessonMeta[];
}

/** Separa el catálogo entre camino principal y práctica dirigida. */
export function splitPractice(lessons: LessonMeta[]): SplitCatalog {
  const path: LessonMeta[] = [];
  const practice: LessonMeta[] = [];
  for (const l of lessons) {
    if (l.track) practice.push(l);
    else path.push(l);
  }
  return { path, practice };
}

/** Los temas de la pista de práctica, con su etiqueta visible. */
export const TRACKS: { id: string; title: string }[] = [
  { id: "IF", title: "Condicionales if" },
  { id: "FOR", title: "Bucles for" },
  { id: "WHILE", title: "while y until" },
  { id: "CASE", title: "case y menús" },
];

/** Agrupa las lecciones de práctica por su tema (IF, FOR, …), en el orden de TRACKS. */
export function groupByTrack(practice: LessonMeta[]): TrackGroup[] {
  const byTrack = new Map<string, LessonMeta[]>();
  for (const l of practice) {
    const t = l.track as string;
    const arr = byTrack.get(t) ?? [];
    arr.push(l);
    byTrack.set(t, arr);
  }
  // los temas definidos en TRACKS primero; cualquier pista futura detrás
  const known = TRACKS.filter((t) => byTrack.has(t.id));
  const unknown = [...byTrack.keys()].filter((t) => !TRACKS.some((i) => i.id === t));
  return [...known.map((t) => t.id), ...unknown].map((track) => ({
    track,
    title: TRACKS.find((t) => t.id === track)?.title ?? track,
    lessons: (byTrack.get(track) ?? []).sort(
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
