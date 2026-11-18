// Helpers shared by the npm scripts. No dependencies, and no shell, so they work on Windows too.
import { createServer } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SERVER_BUNDLE = path.join(ROOT, 'vendor', 'tindahan-server.cjs');

export function playwrightCli() {
  return path.join(ROOT, 'node_modules', '@playwright', 'test', 'cli.js');
}

/**
 * A spec path the way Playwright needs it: relative to the repo, with forward slashes.
 * Playwright reads path arguments as regular expressions, so a Windows-style
 * `tests\web\specs\x.spec.ts` (where `\w`, `\s` and `\t` are regex escapes) matches nothing.
 */
export function specPath(p) {
  const abs = path.resolve(ROOT, p.replace(/\\/g, '/'));
  return path.relative(ROOT, abs).split(path.sep).join('/');
}

/** The caller's environment without any store variant selected (any casing: Windows keeps `defect`). */
export function cleanEnv(extra = {}) {
  const env = { ...process.env };
  for (const key of Object.keys(env)) if (key.toUpperCase() === 'DEFECT') delete env[key];
  return { ...env, ...extra };
}

export function freePort() {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.on('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

export async function waitForHealth(port, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/health`);
      if (res.ok) return true;
    } catch {
      /* not listening yet */
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return false;
}
