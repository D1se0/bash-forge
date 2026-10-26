import type { LessonContent } from "@bashforge/shared";

/** Una lección cargada en la UI, agrupada con su nivel. */
export interface LoadedLesson extends LessonContent {}

import { LESSON_LEVELS } from "@bashforge/shared";
import type { LessonLevel, LessonLevelInfo } from "@bashforge/shared";

export interface LevelGroup {
  info: LessonLevelInfo;
  lessons: LoadedLesson[];
}

export function groupByLevel(lessons: LoadedLesson[]): LevelGroup[] {
  const by = new Map<LessonLevel, LoadedLesson[]>();
  for (const l of lessons) {
    const arr = by.get(l.level) ?? [];
    arr.push(l);
    by.set(l.level, arr);
  }
  return LESSON_LEVELS.filter((i) => by.has(i.level)).map((info) => ({
    info,
    lessons: (by.get(info.level) ?? []).sort((a, b) => a.id.localeCompare(b.id)),
  }));
}
