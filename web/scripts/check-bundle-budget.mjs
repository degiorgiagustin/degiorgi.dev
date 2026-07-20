#!/usr/bin/env node
// Bundle regression gate — see docs/adr/005-bundle-budget-regression-baseline.md.
// Measures the same thing, the same way, as the ADR's baseline figure: real
// gzip of .next/build-manifest.json's rootMainFiles. Run after `next build`.

import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const cwd = process.cwd();
const manifest = JSON.parse(
  readFileSync(join(cwd, ".next/build-manifest.json"), "utf8"),
);
const budget = JSON.parse(
  readFileSync(join(cwd, "bundle-budget.json"), "utf8"),
);

const rows = manifest.rootMainFiles.map((file) => {
  const bytes = readFileSync(join(cwd, ".next", file));
  const gzipBytes = gzipSync(bytes, { level: 9 }).length;
  return { file, gzipBytes };
});

const totalGzipBytes = rows.reduce((sum, row) => sum + row.gzipBytes, 0);
const limit = budget.gzipBytes + budget.toleranceBytes;
const delta = totalGzipBytes - budget.gzipBytes;
const overLimit = totalGzipBytes > limit;

const fmt = (n) => `${(n / 1024).toFixed(1)} kB`;

const lines = [
  "## Bundle report (rootMainFiles, gzip)",
  "",
  "| File | gzip |",
  "| --- | --- |",
  ...rows.map((r) => `| \`${r.file}\` | ${fmt(r.gzipBytes)} |`),
  `| **Total** | **${fmt(totalGzipBytes)}** |`,
  "",
  `Baseline: ${fmt(budget.gzipBytes)} (measured ${budget.measuredAt}, next ${budget.next}, react ${budget.react}) + ${fmt(budget.toleranceBytes)} tolerance = ${fmt(limit)} limit.`,
  `Delta from baseline: ${delta >= 0 ? "+" : ""}${fmt(delta)}.`,
  "",
  overLimit
    ? "**FAIL** — bundle regressed past the reviewed baseline. If this growth is deliberate, bump `gzipBytes` in `web/bundle-budget.json` in this PR."
    : "Within budget.",
];

const report = lines.join("\n");
console.log(report);

if (process.env.GITHUB_STEP_SUMMARY) {
  const { appendFileSync } = await import("node:fs");
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${report}\n`);
}

if (overLimit) {
  process.exit(1);
}
