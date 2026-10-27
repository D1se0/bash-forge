import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { LessonChecker, runAsUser } from "./checker";
import { LessonStore } from "./lessons";

function tmpLessons(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bf-lessons-"));
  const l = path.join(dir, "lvl0-test");
  fs.mkdirSync(l);
  fs.writeFileSync(
    path.join(l, "lesson.yaml"),
    `id: lvl0-test
title: Test
level: 0
kind: lesson
xp: 5
objective: pruebas
validation:
  mode: declarative
  timeout_seconds: 5
  tasks:
    - name: escrito
      message: el fichero existe
      expectFile: prueba.txt
    - name: contiene
      message: dice hola
      cmd: cat prueba.txt
      expectOutput: "^hola$"
`,
  );
  return dir;
}

describe("LessonChecker (declarative)", () => {
  let dir: string;
  beforeAll(() => {
    dir = tmpLessons();
    fs.writeFileSync(path.join(dir, "lvl0-test", "setup.sh"), "exit 0\n");
  });
  afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

  it("aprueba cuando el alumno cumple las tareas", () => {
    const store = new LessonStore(dir);
    const checker = new LessonChecker(store, 5);
    // mock: simula que el home ya tiene el fichero y el cmd lo imprime
    vi.spyOn(checker, "assertTask" as never).mockImplementation((user: string, task: { name: string }) => ({
      pass: task.name !== "never",
      detail: { id: task.name, name: task.name, pass: true, expected: task.name, got: "ok" },
    }));
    const r = checker.runCheck(store.get("lvl0-test")!, "forge_X");
    expect(r.pass).toBe(true);
    expect(r.checks).toHaveLength(2);
    for (const c of r.checks) expect(c.pass).toBe(true);
    vi.restoreAllMocks();
  });

  it("falla (con fichas) cuando no hay nada", () => {
    const store = new LessonStore(dir);
    const checker = new LessonChecker(store, 5);
    const spy = vi
      .spyOn(checker, "assertTask" as never)
      // @ts-expect-error firma simplificada para mockear
      .mockImplementation((user: string, task: { name: string }) => ({
        pass: false,
        detail: { id: task.name, name: task.name, pass: false, expected: task.name, got: "no existe", hint: "revisa" },
      }));
    const r = checker.runCheck(store.get("lvl0-test")!, "forge_Y");
    expect(r.pass).toBe(false);
    expect(r.checks.every((c) => !c.pass && c.hint)).toBe(true);
    spy.mockRestore();
  });

  it.skipIf(process.getuid?.() !== 0)("runAsUser captura exit y salida de un comando trivial", () => {
    const r = runAsUser("echo boom", "root", 3000);
    expect(r.stdout).toContain("boom");
  });
});

describe("LessonStore", () => {
  let dir: string;
  beforeAll(() => {
    dir = tmpLessons();
  });
  afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));
  it("lista y captura metadatos", () => {
    const store = new LessonStore(dir);
    const all = store.list();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe("lvl0-test");
    expect(all[0].validation.tasks).toHaveLength(2);
  });
  it("get de un id inexistente = null", () => {
    const store = new LessonStore(dir);
    expect(store.get("nivel-maximo-oriental")).toBeNull();
  });
});
