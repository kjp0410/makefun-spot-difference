/*
 * main.ts — the hand-in program for Second Glance (program/v1).
 *
 * Copies game/ and screenshots/ from this repository into the output
 * directory and writes dossier.json there with buildDossier. In the
 * grader the repository is read-only at /bot and the output is /output;
 * outside it, MAKEFUN_OUTPUT_DIR stands in for /output. The program is
 * deterministic: the same repository produces the same bytes every run.
 */

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-game.ts";

const here = dirname(fileURLToPath(import.meta.url));
const repoDir = existsSync(join(here, "game")) ? here : "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

mkdirSync(outDir, { recursive: true });
cpSync(join(repoDir, "game"), join(outDir, "game"), { recursive: true });
cpSync(join(repoDir, "screenshots"), join(outDir, "screenshots"), { recursive: true });
writeFileSync(join(outDir, "dossier.json"), buildDossier(repoDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
}));
