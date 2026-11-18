#!/usr/bin/env node
// "Done when" check for Lab 1. Prints PASS or FAIL per item.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { cleanEnv, playwrightCli, ROOT } from './lib/harness.mjs';

const SPEC = 'tests/web/specs/checkout.spec.ts';
const file = path.join(ROOT, SPEC);
let failed = 0;
const report = (ok, item, detail = '') => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}   ${item}${detail ? `: ${detail}` : ''}`);
};

if (!existsSync(file)) {
  report(false, `${SPEC} exists`, 'ask the agent to create it');
  process.exit(1);
}
const source = readFileSync(file, 'utf8');
report(true, `${SPEC} exists`);

const testCount = (source.match(/^\s*test\(/gm) ?? []).length;
report(testCount >= 2, 'At least 2 tests', `found ${testCount}`);
report(/CheckoutPage/.test(source), 'Uses the CheckoutPage Page Object');
report(/['"]fil['"]/.test(source), 'Covers the Filipino locale');
report(/expect\([^\n]*\)\s*\.\s*(?:not\.)?toHaveText|toContainText/.test(source), 'Asserts a value with a web-first assertion');

const rules = spawnSync(process.execPath, [path.join(ROOT, 'scripts/check-rules.mjs')], { cwd: ROOT, encoding: 'utf8' });
report(rules.status === 0, 'npm run check:rules');
if (rules.status !== 0) console.log(rules.stdout);

const run = spawnSync(process.execPath, [playwrightCli(), 'test', SPEC, '--reporter=line'], {
  cwd: ROOT,
  env: cleanEnv(),
  encoding: 'utf8',
});
report(run.status === 0, 'The spec passes on the clean store', /(\d+) passed/.exec(run.stdout)?.[0] ?? '');
if (run.status !== 0) console.log(run.stdout.split('\n').slice(-30).join('\n'));

console.log(failed === 0 ? '\nLAB 1 DONE' : `\nLAB 1 NOT DONE (${failed} failing)`);
process.exit(failed === 0 ? 0 : 1);
