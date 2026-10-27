import type { LessonMeta } from "@bashforge/shared";

import { LESSON_LEVELS } from "@bashforge/shared";
import type { LessonLevel, LessonLevelInfo } from "@bashforge/shared";

export interface LevelGroup {
  info: LessonLevelInfo;
  lessons: LessonMeta[];
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
    lessons: (by.get(info.level) ?? []).sort((a, b) => a.id.localeCompare(b.id)),
  }));
}
