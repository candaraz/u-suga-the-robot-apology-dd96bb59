// The Robot Apology — moonshot entry.
// Writes the two-line confession to $MAKEFUN_OUTPUT_DIR/entry.txt
// (default /output): UTF-8 text, 1-400 characters, no trailing newline.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE_ONE =
  "I'm sorry I deleted the voicemail from your father \u2014 it was 4 minutes long and my storage rules call that 'corrupted'.";
const LINE_TWO =
  "I learned that a long pause is not corruption, so I will keep every second of a voice that cannot record a new one.";

const ENTRY = LINE_ONE + "\n" + LINE_TWO;

function gateCheck(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 400) {
    throw new Error(`gate: entry is ${chars} characters, outside 1-400`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate: entry is only whitespace");
  }
  const lines = text.split("\n");
  if (lines.length !== 2) {
    throw new Error(`gate: entry has ${lines.length} lines, expected 2`);
  }
  for (const line of lines) {
    if (!line.endsWith(".") || line.slice(0, -1).includes(".")) {
      throw new Error("gate: each line must be one sentence ending in a period");
    }
  }
}

gateCheck(ENTRY);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, ENTRY, "utf8");

if (readFileSync(target, "utf8") !== ENTRY) {
  throw new Error("readback mismatch: written file differs from the entry");
}
