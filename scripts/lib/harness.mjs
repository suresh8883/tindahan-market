// Helpers shared by the npm scripts. No dependencies, and no shell, so they work on Windows too.
import { createServer } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SERVER_BUNDLE = path.join(ROOT, 'vendor', 'tindahan-server.cjs');

export function playwrightCli() {
  return path.join(ROOT, 'node_modules', '@playwright', 'test', 'cli.js');
}

/** The caller's environment without any store variant selected. */
export function cleanEnv(extra = {}) {
  const env = { ...process.env };
  delete env.DEFECT;
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
