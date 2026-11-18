# CI reports

Five consecutive runs of `npx playwright test` on this branch, with zero retries, against the clean store bundle.

- `run-N/junit.xml` is the JUnit report written by Playwright.
- `run-N/console.log` is the console output of that run, including the store's own log lines prefixed `[WebServer]`.

Recorded locally on Node 22 with the same commands as `.github/workflows/ci.yml`. Absolute paths were replaced with `/workspace/tindahan-market`; nothing else was edited.

`npm run ci:summary` prints each test's result across the five runs.
