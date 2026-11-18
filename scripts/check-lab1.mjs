#!/usr/bin/env node
// "Done when" check for TK-8 (the house-rule ticket). Prints PASS or FAIL per item.
//
// TK-8 has the pair write a house rule, .test-companionrules/traceability.md, and regenerate the
// checkout spec with it on. The last three checks verify that the agent followed that rule:
//   - every test title starts with [TM-311]
//   - every test is tagged { tag: ['@cod'] }
//   - at least one money assertion has a comment showing the arithmetic from the price list
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { cleanEnv, playwrightCli, ROOT, specPath } from './lib/harness.mjs';

const SPEC = specPath(process.argv[2] ?? 'tests/web/specs/checkout.spec.ts');
const STORY = '[TM-311]';
const TAG = 'cod';
const file = path.join(ROOT, SPEC);
let failed = 0;
const report = (ok, item, detail = '') => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}   ${item}${detail ? `: ${detail}` : ''}`);
};

if (!existsSync(file)) {
  report(false, `${SPEC} exists`, 'ask the agent to create it');
  console.log('\nTK-8 NOT DONE (1 failing)');
  process.exit(1);
}
const source = readFileSync(file, 'utf8');
report(true, `${SPEC} exists`);

// List the tests with their own titles and tags, without running them.
const listed = spawnSync(process.execPath, [playwrightCli(), 'test', SPEC, '--list', '--reporter=json'], {
  cwd: ROOT,
  env: cleanEnv(),
  encoding: 'utf8',
  maxBuffer: 16 * 1024 * 1024,
});
const tests = [];
try {
  const walk = (suite) => {
    for (const spec of suite.specs ?? []) tests.push({ title: spec.title, tags: spec.tags ?? [] });
    for (const child of suite.suites ?? []) walk(child);
  };
  for (const suite of JSON.parse(listed.stdout).suites ?? []) walk(suite);
} catch {
  console.log(listed.stderr || listed.stdout);
}
report(tests.length >= 2, 'At least 2 tests', `found ${tests.length}`);
report(/CheckoutPage/.test(source), 'Uses the CheckoutPage Page Object');
report(/['"]fil['"]/.test(source), 'Covers the Filipino locale');
report(/expect\([^\n]*\)\s*\.\s*(?:not\.)?(?:toHaveText|toContainText)/.test(source), 'Asserts a value with a web-first assertion');

// House rule: traceability.
const untitled = tests.filter((t) => !t.title.startsWith(STORY));
report(
  tests.length > 0 && untitled.length === 0,
  `Every test title starts with ${STORY}`,
  untitled.length ? `missing on: ${untitled.map((t) => `"${t.title}"`).join(', ')}` : '',
);

const untagged = tests.filter((t) => !t.tags.includes(TAG));
const tagOption = /\btag\s*:\s*(?:\[[^\]]*)?['"`]@cod['"`]/.test(source);
report(
  tests.length > 0 && untagged.length === 0 && tagOption,
  `Every test is tagged { tag: ['@${TAG}'] }`,
  untagged.length
    ? `no @${TAG} tag on: ${untagged.map((t) => `"${t.title}"`).join(', ')}`
    : tagOption
      ? ''
      : `put the tag in the test details, { tag: ['@${TAG}'] }, not in the title`,
);

// A money assertion: a web-first text assertion whose expected value is a peso amount.
const lines = source.split(/\r?\n/); // Windows editors may save CRLF
const MONEY_ASSERTION = /expect\(.*\)\s*\.\s*(?:not\.)?(?:toHaveText|toContainText)\(\s*['"`][^'"`]*₱\s*[\d,]/;
const commentOf = (line) => /\/\/(.*)$/.exec(line)?.[1] ?? /\/\*(.*?)\*\//.exec(line)?.[1] ?? /^\s*\*\s?(.*)$/.exec(line)?.[1];
// Arithmetic: at least two numbers and an operator between them (+ - = x × * /, or plus/minus/times).
const isArithmetic = (text) =>
  (text.match(/\d[\d,]*(?:\.\d+)?/g) ?? []).length >= 2 &&
  /[+=×*]|\s[x\-−/]\s|\b(?:plus|minus|times|less)\b/i.test(text);
let moneyAssertions = 0;
let explained = 0;
for (let i = 0; i < lines.length; i++) {
  if (!MONEY_ASSERTION.test(lines[i])) continue;
  moneyAssertions++;
  // Look at the comment on the same line and on up to 3 lines above it.
  const nearby = [lines[i], lines[i - 1], lines[i - 2], lines[i - 3]].filter((l) => l !== undefined);
  if (nearby.some((l) => {
    const comment = commentOf(l);
    return comment !== undefined && isArithmetic(comment);
  })) explained++;
}
report(
  explained >= 1,
  'A money assertion has a comment showing the arithmetic',
  moneyAssertions === 0
    ? 'no assertion on a peso amount found'
    : `${explained} of ${moneyAssertions} money assertion${moneyAssertions === 1 ? '' : 's'} explained${explained ? '' : ', e.g. // 2 x ₱250.00 + ₱99.00 shipping = ₱599.00'}`,
);

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

console.log(failed === 0 ? '\nTK-8 DONE' : `\nTK-8 NOT DONE (${failed} failing)`);
process.exit(failed === 0 ? 0 : 1);
