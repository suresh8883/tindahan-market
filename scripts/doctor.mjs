#!/usr/bin/env node
// Pre-work check. Prints PASS, WARN or FAIL per item and needs no network.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { cleanEnv, freePort, playwrightCli, ROOT, SERVER_BUNDLE, waitForHealth } from './lib/harness.mjs';

const started = Date.now();
const SUPPORTED_NODE = [22, 24, 26];
const results = [];

function report(status, item, detail, seconds) {
  results.push(status);
  const time = seconds === undefined ? '' : ` (${seconds.toFixed(1)}s)`;
  console.log(`${status.padEnd(6)} ${item}${detail ? `: ${detail}` : ''}${time}`);
}

async function timed(fn) {
  const t0 = Date.now();
  const value = await fn();
  return { value, seconds: (Date.now() - t0) / 1000 };
}

function checkNode() {
  const major = Number(process.versions.node.split('.')[0]);
  if (SUPPORTED_NODE.includes(major)) report('PASS', 'Node version', process.version);
  else report('WARN', 'Node version', `${process.version} is untested here; use Node ${SUPPORTED_NODE.join(', ')}`);
}

function checkDependencies() {
  const pkg = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const wanted = Object.entries(pkg.devDependencies);
  const problems = [];
  for (const [name, version] of wanted) {
    const file = path.join(ROOT, 'node_modules', name, 'package.json');
    if (!existsSync(file)) problems.push(`${name} missing`);
    else if (JSON.parse(readFileSync(file, 'utf8')).version !== version) problems.push(`${name} is not ${version}`);
  }
  if (problems.length) {
    report('FAIL', 'Dependencies', `${problems.join(', ')}. Run: npm ci`);
    return false;
  }
  report('PASS', 'Dependencies', `${wanted.length} installed at the locked versions`);
  return true;
}

function checkChromium() {
  const probe = `
    const { chromium } = require('@playwright/test');
    chromium.launch().then((b) => { console.log(b.version()); return b.close(); })
      .catch((e) => { console.error(e.message.split('\\n')[0]); process.exit(1); });`;
  const t0 = Date.now();
  const run = spawnSync(process.execPath, ['-e', probe], { cwd: ROOT, env: cleanEnv(), encoding: 'utf8', timeout: 15_000 });
  const seconds = (Date.now() - t0) / 1000;
  if (run.status === 0) {
    report('PASS', 'Chromium', `launched version ${run.stdout.trim()}`, seconds);
    return true;
  }
  report('FAIL', 'Chromium', 'could not launch. Run: npx playwright install chromium', seconds);
  return false;
}

async function checkAppBoots() {
  const port = await freePort();
  const server = spawn(process.execPath, [SERVER_BUNDLE], {
    cwd: ROOT,
    env: { ...cleanEnv(), PORT: String(port) },
    stdio: 'ignore',
  });
  try {
    const { value: healthy, seconds } = await timed(async () => {
      if (!(await waitForHealth(port, 5_000))) return false;
      const home = await fetch(`http://127.0.0.1:${port}/`);
      return home.ok && (await home.text()).includes('data-testid="product-card-banig"');
    });
    if (healthy) report('PASS', 'App boots', 'catalogue served by the store bundle', seconds);
    else report('FAIL', 'App boots', `no healthy response from vendor/tindahan-server.cjs on port ${port}`, seconds);
    return healthy;
  } finally {
    server.kill();
  }
}

async function checkSmoke() {
  const port = await freePort();
  const { value: run, seconds } = await timed(
    () =>
      new Promise((resolve) => {
        const child = spawn(
          process.execPath,
          [playwrightCli(), 'test', 'tests/web/specs/smoke.spec.ts', '--reporter=line', '--output=test-results/doctor'],
          { cwd: ROOT, env: { ...cleanEnv(), TINDAHAN_TEST_PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] },
        );
        let output = '';
        child.stdout.on('data', (d) => (output += d));
        child.stderr.on('data', (d) => (output += d));
        child.on('close', (code) => resolve({ code, output }));
      }),
  );
  const passed = /(\d+) passed/.exec(run.output)?.[1];
  if (run.code === 0) {
    report('PASS', 'Smoke test', `${passed} tests passed`, seconds);
    return true;
  }
  report('FAIL', 'Smoke test', 'see the output below', seconds);
  console.log(run.output.split('\n').slice(-25).join('\n'));
  return false;
}

console.log('Tindahan Market doctor\n');
checkNode();
const depsOk = checkDependencies();
const browserOk = depsOk ? checkChromium() : (report('FAIL', 'Chromium', 'skipped, dependencies are missing'), false);
const appOk = await checkAppBoots();
if (depsOk && browserOk && appOk) await checkSmoke();
else report('FAIL', 'Smoke test', 'skipped, fix the failures above first');

console.log('CHECK  Test Companion sign-in: look at the extension panel in VS Code and confirm you are signed in.');
console.log('       This script cannot see it. If you cannot sign in, join a neighbouring pair as a second reviewer.');

const failed = results.filter((r) => r === 'FAIL').length;
const total = ((Date.now() - started) / 1000).toFixed(1);
console.log(`\n${failed === 0 ? 'DOCTOR PASS' : `DOCTOR FAIL (${failed} item${failed === 1 ? '' : 's'})`} in ${total}s`);
process.exit(failed === 0 ? 0 : 1);

