import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.TINDAHAN_TEST_PORT ?? 4310);
const baseURL = `http://127.0.0.1:${port}`;

// webServer.env replaces the environment rather than adding to it, so pass the shell's through.
const inheritedEnv = Object.fromEntries(
  Object.entries(process.env).filter((entry): entry is [string, string] => entry[1] !== undefined),
);

export default defineConfig({
  testDir: './tests/web/specs',
  fullyParallel: true,
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 3_000 },
  outputDir: 'test-results/artifacts',
  reporter: [
    ['list'],
    ['junit', { outputFile: 'reports/junit.xml' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL,
    actionTimeout: 5_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `"${process.execPath}" vendor/tindahan-server.cjs`,
    url: `${baseURL}/api/health`,
    env: { ...inheritedEnv, PORT: String(port) },
    // A leftover server could be running other settings, so every run starts its own.
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 15_000,
  },
});
