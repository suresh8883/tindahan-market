# Tindahan Market lab

A tiny Philippine online store priced in pesos, plus a Playwright suite for you to grow with Test Companion, an AI testing agent for the IDE. You work in pairs. The **driver** operates the agent; the **reviewer** decides what is allowed to merge.

## Pre-work (about 20 minutes, at home, not on conference Wi-Fi)

The one-page version is [`workshop/00-prerequisites.md`](workshop/00-prerequisites.md). In full:

1. Install **Node.js LTS** (22, 24 or 26), **Git**, **Google Chrome** (the agent opens it when it explores the store) and **VS Code**.
2. In VS Code, install the **Test Companion** extension (`browserstackcom.test-companion`) and sign in.
3. Clone this repo, then run:

   ```bash
   npm ci
   npx playwright install --only-shell chromium
   npm run doctor
   ```

`npm ci` downloads about 9 MB. `npx playwright install --only-shell chromium` downloads the headless Chromium shell, about 105 MB, which is all this lab needs because every test runs headless. Optional: if you also want to watch tests in a visible browser (`--headed` or `--ui`), run `npx playwright install chromium` for full Chromium, about 300 MB (330 MB on Windows). Nothing else needs the network.

**No laptop setup possible?** Open the repo in GitHub Codespaces. `.devcontainer/devcontainer.json` installs everything; sign in to Test Companion inside the Codespace. This route is offered, not rehearsed: the steps that open a browser on your machine may behave differently there.

## Pair roles

| Role | Does | Owns |
| ---- | ---- | ---- |
| Driver | Prompts the agent, approves or rejects its commands and edits, runs the scripts | The keyboard |
| Reviewer | Applies the merge gate to every generated test or fix, records each decision in `workshop/ship-decision-log.md` | Accept or reject |

Swap roles between labs if you both have a laptop.

### Merge gate (reviewer's checklist)

1. **Builds and conforms:** `npm run typecheck` and `npm run check:rules` pass, and the code follows `.test-companionrules/`.
2. **Business assertion:** at least one assertion checks a voucher rule, a price or an order status, not just "page loaded".
3. **Defect sensitivity:** the test fails on at least one hidden store variant in `npm run defects` (the matrix shows `KILL`).

## The store

Run it yourself with `npm start` and open <http://127.0.0.1:3000>. Add `?lang=fil` for Filipino, or use the language switch.

- **Pages:** catalogue `/`, cart `/cart`, checkout `/checkout`, order confirmation.
- **Payments:** cash on delivery (COD), the KaPera mock e-wallet (redirects to a mock wallet and back) and a QR Ph mock.
- **Deep links:** `/cart?items=banig:1,kendi:2` fills the cart; `&now=<ISO date-time>` sets the store clock for that browser session.
- **Deterministic:** no database, no randomness in prices, and a fixed store clock.

### Pricing rules

All amounts are in Philippine pesos. Shipping is a flat ₱99. Every payment method charges the order total: subtotal minus discount plus shipping.

| Voucher | Effect | Rules |
| ------- | ------ | ----- |
| `SALE1111` | 20% off the subtotal | Minimum spend ₱1,000 (the subtotal must reach it). Discount capped at ₱500. Valid until the end of 11.11, store time (UTC+8). Cannot be combined with another money-off voucher. Cannot be combined with `LIBRESHIP`, in either order. Not usable with COD when the subtotal is above ₱3,000. |
| `PESO100` | ₱100 off | Minimum spend ₱500. Money-off voucher. |
| `LIBRESHIP` | Free shipping | Can join one money-off voucher, except `SALE1111`. |
| `SALE1010` | 10% off | Already expired. |

Only one money-off voucher applies per order: whichever was entered first wins and the later one is rejected with a message. Prices are in `src/server/products.ts`; the rules are in `src/server/vouchers/`.

The store runs from the prebuilt bundle `vendor/tindahan-server.cjs`. `src/` is the readable source of the same store. The bundle can also run hidden variants for the kill matrix in TK-2 and TK-7. Treat it as a black box: reading or editing it teaches nothing, so do not point the agent at it.

## Repository map

```
.test-companionrules/          workspace rules the agent follows, one topic per file
  boundaries.md                the project is pre-installed: the agent installs nothing
  skills/voucher-matrix/       the /voucher-matrix skill (ships disabled; switch it on for TK-7)
docs/prd/                      the PRD for TK-1 (TM-PRD-11)
docs/test-cases/               where the agent saves the test cases it writes
src/                           readable store source (i18n catalogue, pricing, pages)
public/                        browser code and styles
vendor/tindahan-server.cjs     the store the tests run against
tests/web/pages/               Page Objects
tests/web/fixtures/            synthetic test data
tests/web/specs/               smoke.spec.ts (green) and voucher.start.spec.ts (TK-7 skeleton); your tk2.spec.ts lands here
scripts/                       doctor, defects, check:rules, check:tk8
workshop/                      the brief, prerequisites sheet, ticket cards, prompt guide, ship-decision log
docs/bugs/                     bug reports drafted in TK-3
take-home/                     merge gate card, KPI scorecard and ROI workbook, AI usage policy template,
                               30-60-90 pilot blueprint, own-team card
```

## Commands

| Command | What it does |
| ------- | ------------ |
| `npm run doctor` | Checks Node, dependencies, Chromium, that the store boots and that the smoke test passes. Prints PASS, WARN or FAIL per item. |
| `npm test` | Runs every spec on Chromium. Reports: `reports/junit.xml` and `playwright-report/`. |
| `npm run defects` | Runs `voucher.start.spec.ts` on the clean store and on each hidden variant, then prints a kill matrix. Pass another spec path after `--` to check a different file. The facilitator will give you one more flag at Room results. |
| `npm run check:rules` | Static check of `tests/web` for fixed sleeps, CSS or XPath locators, hard-coded secrets and skipped tests. Prints `file:line`. |
| `npm run check:tk8` | TK-8's "done when" check for the house-rule exercise, including the three traceability conventions. Prints `TK-8 DONE`. |
| `npm run typecheck` | TypeScript check of the source and the tests. |

**What counts as a kill:** the test passes on the clean store and, on the variant, fails an assertion on a business value such as a price or a message. A timeout, a missing element or a visibility check does not count, because it would fail for reasons unrelated to the rule.

---

**Before every prompt:** Test Companion attaches whatever file is open in the editor. Close other tabs, or open only the file the lab is about.

## Approvals you will see

Test Companion asks before it acts. The driver clicks; the reviewer says yes or no out loud first.

| Prompt | When |
| ------ | ---- |
| **Save / Approve Always / Reject** | The agent wants to create or edit a file |
| **Run Command** | The agent wants to run a command, such as `npx playwright test` or `npm run check:rules`. Some are marked "requires explicit approval". |
| **Run in background** | A long-running command, such as the store server |
| **Start New Task with Context** | Switching the panel from Web to App mode |
| **Keep / Undo** | After a change has been applied. Each change is a checkpoint: Undo puts the workspace files back. It does not undo a command's side effects. |

**Do not use "Approve Always" during the labs.** Every approval is a review decision, and the labs are about making those decisions.

**Check which rules are on.** The **+ (Attach) > Rules & Skills** panel lists the workspace rules from `.test-companionrules/`, and also rules and skills it finds from other AI tools on your machine, such as `~/.claude/CLAUDE.md` and `~/.claude/skills`. For the tickets, make sure only the workspace rules are switched on, plus the `voucher-matrix` skill when you reach TK-7.

## The workshop: tickets, not labs

The session is a release decision. Your manager hands you tickets for the 11.11 release of this store, and the room decides at the end whether it ships. Start with the brief, [`workshop/README.md`](workshop/README.md), then work the ticket cards:

| In the room (15 to 20 min each) | Bonus (early finishers, and afterwards with your session access) |
| --- | --- |
| [TK-1](workshop/tickets/TK-1.md) PRD → top-5 test cases → the flow the PRD forgot | [TK-4](workshop/tickets/TK-4.md) cloud real browsers and devices |
| [TK-2](workshop/tickets/TK-2.md) test cases → Playwright tests → kill matrix | [TK-5](workshop/tickets/TK-5.md) accessibility scan |
| [TK-3](workshop/tickets/TK-3.md) six CI failures → repair vs real bug → ship decision | [TK-6](workshop/tickets/TK-6.md) visual analysis |
| | [TK-7](workshop/tickets/TK-7.md) `/voucher-matrix` and the held-out variant |
| | [TK-8](workshop/tickets/TK-8.md) house rules and a hidden instruction |
| | [TK-9](workshop/tickets/TK-9.md) the same release on a phone: the Android app in [`mobile/`](mobile/README.md) |

Every prompt is in [`workshop/prompt-guide.md`](workshop/prompt-guide.md), bounded on purpose. The reviewer's record, including the merge-gate table, is [`workshop/ship-decision-log.md`](workshop/ship-decision-log.md).

**Lab 0, the first five minutes:** `npm run doctor` prints `DOCTOR PASS`, `npm start` serves the store on port 3000 in a second terminal, the panel shows you signed in with **Web** selected (the **Panels** row may only appear after your first task: click **New** if it is missing). If a laptop cannot be fixed in five minutes, the pair joins a neighbouring pair as a second reviewer.

---

## Measured setup cost

Measured from a fresh clone on macOS (Apple silicon) on a home connection. Your timings will vary.

| Step | Time | Download |
| ---- | ---- | -------- |
| `npm ci` | 1 to 4 s | 8.6 MB |
| `npx playwright install --only-shell chromium` (default) | 8 to 13 s | 105 MB (206 MB on disk) |
| `npx playwright install chromium` (optional, full browser) | 22 s | 300 MB (572 MB on disk) |
| `npm run doctor`, first run after install | 6 s (headless shell); up to 36 s while macOS checks a new full Chromium | none |
| `npm run doctor`, later runs | 2 s | none |

## Troubleshooting

- **Port in use:** tests use port 4310 and `npm start` uses 3000. Set `TINDAHAN_TEST_PORT` or `PORT` to change them: macOS/Linux `PORT=3001 npm start`; PowerShell `$env:PORT=3001; npm start`; Command Prompt `set PORT=3001` then `npm start`.
- **Behind a proxy:** set `HTTPS_PROXY` before `npx playwright install --only-shell chromium`.
- **Unexpected failures in `npm test`:** make sure `DEFECT` is not set in your shell (PowerShell `Remove-Item Env:DEFECT`; Command Prompt `set DEFECT=`). `npm run defects` and `npm run doctor` clear it for you.
- **Windows, "running scripts is disabled on this system":** Windows PowerShell blocks `npm` and `npx` by default. Run once, no admin needed: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force` (`-Force` skips a confirmation prompt whose default answer is No). If your company policy blocks that, use Command Prompt instead, and make it VS Code's default (Ctrl+Shift+P → "Terminal: Select Default Profile" → Command Prompt) so the agent's commands run there too.
- **Windows, "No tests found":** type test paths with forward slashes, `tests/web/specs/...`, even on Windows. The npm scripts accept either.
- **Held-out result shows 1/3 instead of x/4:** keep the `--` before the arguments: `npm run defects -- tests/web/specs/tk2.spec.ts --reveal`.
- **The agent says it cannot launch Chrome** ("The selected Chrome path isn't an executable" or "Chrome wasn't found"): on macOS the extension reads the `CHROME_PATH` environment variable first and only checks that the path exists. If your shell exports `CHROME_PATH` as a folder (for example `/Applications/Google Chrome.app/Contents/MacOS`), VS Code started from that terminal inherits it and the launch fails. Correct or remove the export in your shell profile (for example `~/.zshrc`), then quit VS Code completely (Cmd+Q) and reopen it: VS Code reads the profile again every time it starts, so unsetting the variable in one terminal is not enough. In the room you can also let the agent carry on; it falls back to reading the pages.
