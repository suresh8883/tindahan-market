# Project boundaries

This project is pre-installed. Everything the tests need is already here.

- Do not install, add, remove or update packages. Do not run `npm install`, `npm update`, `npx playwright install` or any package-manager command.
- Do not create a new project, scaffold a framework or change `package.json`, `package-lock.json` or `playwright.config.ts`.
- If something seems missing, say so in one line and stop; the pair will ask a floor helper. Do not work around it by installing anything.
- Run only the project's own npm scripts (`npm run …`, including `npm run defects -- <spec>`) and `npx playwright test <spec>`. Git commands the user asks for are fine.
- Write test paths with forward slashes, for example `tests/web/specs/tk2.spec.ts`, even on Windows: Playwright reads path arguments as patterns, and backslashes match nothing.
- Do not read or modify `vendor/`, `node_modules/` or the root `reports/` folder (local test output). `ci/reports/` is different: it holds the CI evidence for TK-3, and you may read it.
