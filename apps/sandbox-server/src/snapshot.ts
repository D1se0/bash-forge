import { spawnSync } from "node:child_process";

/** Empaqueta el home del alumno como tar.gz base64 (descarga de scripts). */
export function homeSnapshot(user: string): { name: string; base64: string } | null {
  const home = `/home/${user}`;
  const r = spawnSync(
    "tar",
    ["--exclude", "workspace/.progress.json", "-czf", "-", "-C", home, "."],
    { encoding: "buffer", timeout: 20_000 },
  );
  if (r.status !== 0 || !r.stdout) return null;
  return {
    name: `bashforge-${user}.tar.gz`,
    base64: Buffer.from(r.stdout as Buffer).toString("base64"),
  };
}
