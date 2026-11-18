#!/usr/bin/env node
// Summarises the JUnit reports in ci/reports/run-*/junit.xml: one line per test, its result in each run.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib/harness.mjs';

const dir = path.join(ROOT, 'ci', 'reports');
const runs = readdirSync(dir)
  .filter((name) => /^run-\d+$/.test(name) && existsSync(path.join(dir, name, 'junit.xml')))
  .sort((a, b) => Number(a.slice(4)) - Number(b.slice(4)));

const unescape = (s) => s.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const results = new Map();
for (const [index, run] of runs.entries()) {
  const xml = readFileSync(path.join(dir, run, 'junit.xml'), 'utf8');
  for (const match of xml.matchAll(/<testcase name="([^"]*)" classname="([^"]*)"[^>]*?(\/>|>([\s\S]*?)<\/testcase>)/g)) {
    const key = `${match[2]} › ${unescape(match[1])}`;
    const body = match[4] ?? '';
    const outcome = /<(failure|error)\b/.test(body) ? 'F' : /<skipped/.test(body) ? 'S' : '.';
    if (!results.has(key)) results.set(key, Array(runs.length).fill('-'));
    results.get(key)[index] = outcome;
  }
}

console.log(`${runs.length} runs: ${runs.join(', ')}   (. pass, F failure or error)\n`);
const width = Math.max(...[...results.keys()].map((k) => k.length));
let everFailed = 0;
for (const [key, outcomes] of [...results.entries()].sort()) {
  const fails = outcomes.filter((o) => o === 'F').length;
  if (fails) everFailed++;
  console.log(`${key.padEnd(width)}  ${outcomes.join(' ')}  ${fails ? `failed ${fails}/${runs.length}` : ''}`);
}
console.log(`\n${results.size} tests, ${everFailed} failed in at least one run`);
