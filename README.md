# Tindahan Market lab

A tiny Philippine online store priced in pesos, plus a Playwright suite for you to grow with Test Companion, BrowserStack's AI testing agent for the IDE. You work in pairs. The **driver** operates the agent; the **reviewer** decides what is allowed to merge.

## Pre-work (about 20 minutes, at home, not on conference Wi-Fi)

1. Install **Node.js LTS** (22 or 24; 26 also works), **Git** and **VS Code**.
2. In VS Code, install the **Test Companion** extension (`browserstackcom.test-companion`) and sign in.
3. Clone this repo, then run:

   ```bash
   npm ci
   npx playwright install chromium
   npm run doctor
   ```

`npm ci` downloads about 10 MB. The Chromium step downloads about 250 MB; see [Measured setup cost](#measured-setup-cost). Nothing else needs the network.

**No laptop setup possible?** Open the repo in GitHub Codespaces. `.devcontainer/devcontainer.json` installs everything; sign in to Test Companion inside the Codespace.

## Pair roles

| Role | Does | Owns |
| ---- | ---- | ---- |
| Driver | Prompts the agent, approves or rejects its commands and edits, runs the scripts | The keyboard |
| Reviewer | Applies the merge gate to every generated test or fix, records each decision in `review/decision-log.md` | Accept or reject |

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

The store runs from the prebuilt bundle `vendor/tindahan-server.cjs`. `src/` is the readable source of the same store. The bundle can also run hidden variants for Lab 2. Treat it as a black box: reading or editing it teaches nothing, so do not point the agent at it.

## Repository map

```
.test-companionrules/          workspace rules the agent follows, one topic per file
  skills/voucher-matrix/       the /voucher-matrix skill
src/                           readable store source (i18n catalogue, pricing, pages)
public/                        browser code and styles
vendor/tindahan-server.cjs     the store the tests run against
tests/web/pages/               Page Objects
tests/web/fixtures/            synthetic test data
tests/web/specs/               smoke.spec.ts (green) and voucher.start.spec.ts (Lab 2 skeleton)
scripts/                       doctor, defects, check:rules, check:lab1
review/decision-log.md         the reviewer's log
```

## Commands

| Command | What it does |
| ------- | ------------ |
| `npm run doctor` | Checks Node, dependencies, Chromium, that the store boots and that the smoke test passes. Prints PASS, WARN or FAIL per item. |
| `npm test` | Runs every spec on Chromium. Reports: `reports/junit.xml` and `playwright-report/`. |
| `npm run defects` | Runs `voucher.start.spec.ts` on the clean store and on each hidden variant, then prints a kill matrix. Pass another spec path after `--` to check a different file. |
| `npm run check:rules` | Static check of `tests/web` for fixed sleeps, CSS or XPath locators, hard-coded secrets and skipped tests. Prints `file:line`. |
| `npm run check:lab1` | The Lab 1 "done when" check. |
| `npm run typecheck` | TypeScript check of the source and the tests. |

**What counts as a kill:** the test passes on the clean store and, on the variant, fails an assertion on a business value such as a price or a message. A timeout, a missing element or a visibility check does not count, because it would fail for reasons unrelated to the rule.

---

## Lab 0: Setup check

- **Driver:** run `npm run doctor`, then look at the Test Companion panel to confirm you are signed in.
- **Reviewer:** open `review/decision-log.md`.
- **Done when:** the doctor prints `DOCTOR PASS` and the extension shows you signed in. If sign-in fails, join a neighbouring pair as a second reviewer.

## Lab 1: Context engineering

Steer the agent with workspace rules and compare the output with and without them.

1. **Driver:** read the four files in `.test-companionrules/`. In Test Companion, switch the workspace rules off and ask:

   > Write `tests/web/specs/checkout.spec.ts`: a cash on delivery checkout of a Barako Coffee cart, once in English and once in Filipino, asserting the order total and payment status.

2. Save that output aside, switch the rules on, start a new chat, and ask the same prompt again.
3. Diff the two versions. Keep the version that follows the rules as `tests/web/specs/checkout.spec.ts`.

- **Reviewer:** check the diff against gate 1. Note every rule the agent ignored.
- **Done when:** `npm run check:lab1` prints `LAB 1 DONE` (spec exists, at least 2 tests, Page Objects, a Filipino locale test, web-first value assertions, rules check, passes on the clean store), and the reviewer can explain each difference in the diff.

## Lab 2: Prove the tests catch bugs

`tests/web/specs/voucher.start.spec.ts` tests the minimum spend and leaves TODOs. The store has hidden variants, and your job is to make the suite catch every one.

1. **Driver:** run `npm run defects` and read the kill matrix for the starting suite.
2. Invoke the skill: `/voucher-matrix` for the `SALE1111` cap and the stacking rules. Review the matrix before letting it write tests.
3. Let it add the tests to `voucher.start.spec.ts`, then run `npm run check:rules` and `npm run defects`.
4. Repeat until every variant is killed. Stretch: expiry and the COD limit.

- **Reviewer:** apply gates 2 and 3 to each new test. A test that never shows `KILL` and adds no new boundary is a candidate for rejection. Log each rejection with a reason.
- **Done when:** `npm run defects` prints `RESULT: 3/3 killed` and `npm run check:rules` prints `check:rules PASS`.

## Lab 3: AI-assisted CI triage

```bash
git switch lab3-ci-triage
```

That branch adds a regression suite, a GitHub Actions workflow and the JUnit reports of five CI runs in `ci/reports/run-1` to `run-5`. Six tests fail across those runs.

1. **Driver:** give Test Companion the reports (`@ci/reports`) and ask it to classify each failing test as one of: **stale selector**, **timing**, **environment**, **flaky** or **genuine app bug**, with evidence.
2. Let it fix **only the stale selectors**, each behind a checkpoint. For every other failure, write a one-line fix plan instead of a change.
3. A genuine app bug is reported, never patched in the test. Draft the bug report.

- **Reviewer:** approve or reject each proposed fix. Reject any change that alters an expected price, adds a retry or a sleep, or skips a test.
- **Done when:** the fixed tests pass locally (`npx playwright test tests/web/specs/regression`), and your pair's classification of all six failures is submitted to the room poll, which is scored against the facilitator's answer key.

---

## Measured setup cost

Measured from a fresh clone on macOS (Apple silicon) on a home connection. Your timings will vary.

| Step | Time | Download |
| ---- | ---- | -------- |
| `npm ci` | MEASURE_NPM_TIME | MEASURE_NPM_SIZE |
| `npx playwright install chromium` | MEASURE_PW_TIME | MEASURE_PW_SIZE |
| `npm run doctor` | MEASURE_DOCTOR_TIME | none |

## Troubleshooting

- **Port in use:** tests use port 4310 and `npm start` uses 3000. Set `TINDAHAN_TEST_PORT` or `PORT` to change them.
- **Behind a proxy:** set `HTTPS_PROXY` before `npx playwright install chromium`.
- **Unexpected failures in `npm test`:** make sure `DEFECT` is not set in your shell. `npm run defects` and `npm run doctor` clear it for you.
- **Windows:** every script is plain Node, so it runs in PowerShell or cmd.
