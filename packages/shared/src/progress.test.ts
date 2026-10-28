import { describe, it, expect } from "vitest";
import { isClientMessage, isServerMessage } from "./protocol";
import { blankProgress } from "./progress";
import { LESSON_LEVELS } from "./lesson";
import { validateProgress } from "./validators";

describe("isClientMessage", () => {
  it("acepta mensajes válidos", () => {
    expect(isClientMessage({ type: "input", termId: "a", data: "ls" })).toBe(true);
    expect(isClientMessage({ type: "exercise:check", lessonId: "lvl0-echo" })).toBe(true);
    expect(isClientMessage({ type: "ping", t: 1 })).toBe(true);
  });
  it("rechaza basura", () => {
    expect(isClientMessage(null)).toBe(false);
    expect(isClientMessage({ type: "input" })).toBe(false);
    expect(isClientMessage({ type: "desconocido" })).toBe(false);
    // lessonId fuera de rango
    expect(isClientMessage({ type: "exercise:check", lessonId: "x".repeat(200) })).toBe(false);
  });
});

describe("isServerMessage", () => {
  it("acepta una sesión", () => {
    expect(
      isServerMessage({
        type: "session",
        homeId: "forge_1",
        user: "forge_1",
        sessionToken: "abc",
        terms: [],
        motd: "",
        maxSessionSeconds: 3600,
      }),
    ).toBe(true);
  });
});

describe("LESSON_LEVELS", () => {
  it("son 9 niveles consecutivos", () => {
    expect(LESSON_LEVELS).toHaveLength(10);
    expect(LESSON_LEVELS.map((l) => l.level)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});

describe("validateProgress", () => {
  it("acepta un snapshot bien formado y rechaza el corrupto", () => {
    const ok = blankProgress("forge_1");
    expect(validateProgress(JSON.stringify(ok))).toBe(true);
    expect(validateProgress('{"xp":{}}')).toBe(false);
    expect(validateProgress("not json")).toBe(false);
  });
});
