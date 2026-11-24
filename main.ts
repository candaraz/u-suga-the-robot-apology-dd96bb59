// u-suga-the-robot-apology-dd96bb59 — "The Robot Apology"
// Writes the winning two-line robot apology to $MAKEFUN_OUTPUT_DIR/entry.txt.
// Node 22, stdlib only, zero network. Deterministic: the same bytes every run.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The winning entry, verbatim (candidate #15).
// Line 1: a robot apologizing for one specific mistake.
// Line 2: what it learned and the exact changed behaviour.
// Exactly two lines separated by one "\n", no trailing newline.
// The em dash in line 1 is U+2014 (written here as \u2014 so the code point is exact).
const ENTRY =
  "I'm sorry I shredded your grandmother's letter \u2014 it was in the 'old mail' pile and I shred old mail.\n" +
  "I learned that 'old' does not mean 'unwanted,' so from now on I will read the sender's name before I shred.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outFile = join(outDir, "entry.txt");

// Gate guards (RULES.txt): UTF-8 text of 1–400 characters, not only whitespace,
// exactly two lines, one sentence per line. Fail loudly rather than write a bad entry.
const chars = [...ENTRY].length;
if (chars < 1 || chars > 400) {
  throw new Error(`entry is ${chars} characters, outside the 1-400 gate`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry is only whitespace");
}
const lines = ENTRY.split("\n");
if (lines.length !== 2) {
  throw new Error(`entry has ${lines.length} lines, expected exactly 2`);
}
for (const [i, line] of lines.entries()) {
  const periods = (line.match(/\./g) || []).length;
  if (periods !== 1 || !line.endsWith(".")) {
    throw new Error(`line ${i + 1} is not exactly one sentence`);
  }
}
if (!ENTRY.includes("\u2014")) {
  throw new Error("entry is missing its em dash (U+2014)");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, ENTRY, "utf8");

// Read back and confirm the file holds exactly the winning entry.
const back = readFileSync(outFile, "utf8");
if (back !== ENTRY) {
  throw new Error("entry.txt does not match the winning entry");
}

console.log(`wrote ${outFile}`);
