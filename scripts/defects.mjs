#!/usr/bin/env node
// Runs the voucher spec on the clean store and on each hidden store variant, then prints a kill matrix.
//
// A test KILLS a variant only if it passes on clean and, on the variant, fails an assertion on a
// business value. A timeout, a missing element or a visibility check is not a kill.
//
// Usage: npm run defects [-- path/to/spec.ts]
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { cleanEnv, freePort, playwrightCli, ROOT, specPath } from './lib/harness.mjs';

const args = process.argv.slice(2);
// If the `--` before a flag is missing (or Windows PowerShell's npm.ps1 drops it), npm keeps the
// flag for itself and sets an npm_config_* variable instead: honour that too.
const reveal = args.includes('--reveal') || process.env.npm_config_reveal === 'true';
const VARIANTS = reveal ? ['D1', 'D2', 'D3', 'D4'] : ['D1', 'D2', 'D3'];
const spec = specPath(args.find((a) => !a.startsWith('--')) ?? 'tests/web/specs/voucher.start.spec.ts');
const VALUE_MATCHERS =
  /\b(toHaveText|toContainText|toHaveValue|toHaveAttribute|toBe|toEqual|toStrictEqual|toBeCloseTo|toMatch|toContain|toBeGreaterThan|toBeGreaterThanOrEqual|toBeLessThan|toBeLessThanOrEqual)\b/;

const stripAnsi = (text) => text.replace(/\u001b\[[0-9;]*m/g, '');

/** Sorts one test result into pass, kill-worthy failure, or a failure that proves nothing. */
export function classify(result) {
  if (result.status === 'passed') return 'pass';
  if (result.status === 'timedOut') return 'timeout';
  const message = stripAnsi(result.errors?.[0]?.message ?? '');
  const firstLine = message.split('\n').find((line) => line.trim()) ?? '';
  if (/element\(s\) not found/.test(message)) return 'locator';
  if (/strict mode violation/.test(message)) return 'locator';
  if (/^\s*(Error|TimeoutError): (locator|page|frame|browserContext|apiRequest)\b/i.test(firstLine)) return 'locator';
  const matcher = /expect\([^)]*\)\.(?:not\.)?(\w+)/.exec(message)?.[1];
  if (!matcher || !VALUE_MATCHERS.test(matcher)) return 'other';
  const received = /Received(?: string| value)?:\s*(.*)/.exec(message)?.[1]?.trim();
  // An empty string on an element that was found is still a value: a message that never appeared.
  if (received === undefined || received === 'undefined') return 'other';
  return 'value';
}

function runVariant(variant, workDir) {
  return new Promise(async (resolve) => {
    const port = await freePort();
    const jsonFile = path.join(workDir, `${variant ?? 'clean'}.json`);
    const env = cleanEnv({
      TINDAHAN_TEST_PORT: String(port),
      PLAYWRIGHT_JSON_OUTPUT_FILE: jsonFile,
      ...(variant ? { DEFECT: variant } : {}),
    });
    const child = spawn(
      process.execPath,
      [
        playwrightCli(),
        'test',
        spec,
        '--reporter=json',
        '--workers=2',
        `--output=${path.join(workDir, `out-${variant ?? 'clean'}`)}`,
      ],
      { cwd: ROOT, env, stdio: ['ignore', 'ignore', 'pipe'] },
    );
    let stderr = '';
    child.stderr.on('data', (d) => (stderr += d));
    child.on('close', () => {
      if (!existsSync(jsonFile)) return resolve({ variant, error: stderr || 'no report written', tests: new Map() });
      const report = JSON.parse(readFileSync(jsonFile, 'utf8'));
      const tests = new Map();
      const walk = (suite, trail) => {
        for (const s of suite.specs ?? []) {
          const result = s.tests?.[0]?.results?.at(-1) ?? { status: 'skipped' };
          tests.set([...trail, s.title].join(' > '), classify(result));
        }
        for (const child of suite.suites ?? []) walk(child, child.title.endsWith('.ts') ? trail : [...trail, child.title]);
      };
      for (const suite of report.suites ?? []) walk(suite, []);
      const error = report.errors?.length ? stripAnsi(report.errors[0].message ?? '') : undefined;
      resolve({ variant, error, tests });
    });
  });
}

const CELL = { pass: 'pass', value: 'KILL', timeout: 'fail:timeout', locator: 'fail:locator', other: 'fail:other' };

const started = Date.now();
if (!existsSync(path.join(ROOT, spec))) {
  console.error(`Spec not found: ${spec}`);
  process.exit(2);
}
const workDir = mkdtempSync(path.join(tmpdir(), 'tindahan-defects-'));
let runs;
try {
  runs = await Promise.all([null, ...VARIANTS].map((v) => runVariant(v, workDir)));
} finally {
  try {
    // Antivirus scanners on Windows can hold files briefly; never lose the matrix over a temp folder.
    rmSync(workDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch {
    /* the temp folder stays behind; harmless */
  }
}

const [clean, ...variantRuns] = runs;
const broken = runs.filter((r) => r.error);
if (broken.length) {
  for (const r of broken) console.error(`Run ${r.variant ?? 'clean'} failed to execute:\n${r.error}`);
  process.exit(2);
}

const titles = [...clean.tests.keys()];
const width = Math.max(4, ...titles.map((t) => t.length));
const columns = ['clean', ...VARIANTS];
const cellWidth = 13;

console.log(`Kill matrix for ${spec}\n`);
console.log(`${'test'.padEnd(width)}  ${columns.map((c) => c.padEnd(cellWidth)).join('')}`);
console.log('-'.repeat(width + 2 + cellWidth * columns.length));

const kills = new Map(VARIANTS.map((v) => [v, []]));
// Timeouts and missing elements are not kills, but on a slow laptop they can hide one:
// a test that would have failed on a price never got that far. Count them per variant so the
// summary can say "re-run before concluding" instead of a flat NOT KILLED.
const shaky = new Map(VARIANTS.map((v) => [v, 0]));
for (const title of titles) {
  const onClean = clean.tests.get(title);
  const cells = [onClean === 'pass' ? 'pass' : 'FAILS-CLEAN'];
  for (const run of variantRuns) {
    const outcome = run.tests.get(title) ?? 'other';
    if (onClean !== 'pass') {
      cells.push('n/a');
      continue;
    }
    if (outcome === 'value') kills.get(run.variant).push(title);
    if (outcome === 'timeout' || outcome === 'locator') shaky.set(run.variant, shaky.get(run.variant) + 1);
    cells.push(CELL[outcome]);
  }
  console.log(`${title.padEnd(width)}  ${cells.map((c) => c.padEnd(cellWidth)).join('')}`);
}

console.log('');
const failingClean = titles.filter((t) => clean.tests.get(t) !== 'pass');
if (failingClean.length) {
  console.log(`WARNING: ${failingClean.length} test(s) fail on the clean store and cannot count as kills.\n`);
}
let killed = 0;
for (const variant of VARIANTS) {
  const by = kills.get(variant);
  if (by.length) killed++;
  const shakyCount = shaky.get(variant);
  console.log(
    by.length
      ? `${variant}: KILLED by ${by.length} test${by.length === 1 ? '' : 's'}`
      : shakyCount
        ? `${variant}: NOT KILLED, no test failed on a business value (${shakyCount} timeout or missing-element failure${shakyCount === 1 ? '' : 's'}: re-run before concluding)`
        : `${variant}: NOT KILLED, no test failed on a business value`,
  );
}
const seconds = ((Date.now() - started) / 1000).toFixed(1);
console.log(`\nRESULT: ${killed}/${VARIANTS.length} killed, ${titles.length} tests, ${seconds}s`);
