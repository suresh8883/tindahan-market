# TK-2 · Automate it, then prove it catches bugs (15 min, in the room)

**Manager's note:** "Automate those test cases, then prove to me they would catch a bug. Green on its own tells me nothing."

**Given:** the five test cases from TK-1 in `docs/test-cases/TK-1.md` (if the file is missing, open the PRD instead and, in the prompt below, replace "test cases in the attached docs/test-cases/TK-1.md" with "acceptance criteria AC-1 to AC-8 in the attached PRD"), the Page Objects in `tests/web/pages/`, the workspace rules, and a store that can run hidden variants (`npm run defects`).

## Driver

1. Close every editor tab and open `docs/test-cases/TK-1.md`. Start a **new task**. Prompt **P3**:

   > Convert the cash on delivery and voucher test cases in the attached docs/test-cases/TK-1.md (leave the QR Ph case for later) into Playwright tests in tests/web/specs/tk2.spec.ts, following the workspace rules and the existing Page Objects in tests/web/pages. Then run `npx playwright test tests/web/specs/tk2.spec.ts --retries=0` and `npm run check:rules` and report the results. Do not change any other file and do not install anything.

2. Approve the **Save** and the two **Run Command** requests, one at a time. Read each command before approving it; the rules forbid installs, so reject any `npm install`.
3. When the tests pass, run the kill matrix: `npm run defects -- tests/web/specs/tk2.spec.ts`. Read it with the reviewer. A `KILL` means a test passed on the clean store and failed a business assertion on a broken variant. A variant with no `KILL` in its column survived.
4. If a variant survives, name the missing boundary and let the agent add exactly one test (prompt guide, after P3), then run the matrix again.

## Reviewer

- Gate 1: `npm run typecheck` and `npm run check:rules` pass; no fixed sleeps, CSS or XPath locators, hard-coded secrets or skipped tests.
- Gate 2: every test asserts a peso amount, a voucher message or an order status, never only that a page loaded. Every expected amount carries its arithmetic from the price list.
- Gate 3: read the matrix. A test that kills nothing is a weak oracle or a case far from any boundary; log it, and decide whether to improve it or accept it as a regression check.
- Expect the PRD-derived suite to inherit the PRD's blind spots. A suite is only as sharp as the document it came from.
- Ship-decision line: if a variant's behaviour would reach production, what is its Severity and Call? Classification App bug. If the only problem is a missing test, log it as an Automation issue with Call Fix it.

## Done when

- `npx playwright test tests/web/specs/tk2.spec.ts --retries=0` passes on the clean store and `npm run check:rules` prints `check:rules PASS`.
- `npm run defects -- tests/web/specs/tk2.spec.ts` has been read and its result logged; a surviving variant is either killed by one added test or logged with the reason it was left.
- The merge-gate table in the ship-decision log has one line per test case (four or five), not per generated test.
- At Room results, run the kill matrix on your spec once more with the flag the facilitator announces, and report the result.

## Minute budget

P3 sent by 0:02 · tests green by 0:05 · matrix read by 0:07 · boundary prompt by 0:09 · 3 of 3 and the log by 0:14.

## Rehearsed (single run)

P3: 51 seconds of agent time, three approvals (Save, Run Command, Run in background). The agent turned four test cases into 7 tests, all passing, with `check:rules PASS` and its own test review clean. The kill matrix then read **2 of 3 killed**. The surviving variant is the point of the ticket: the PRD never asked for that boundary, so neither did the agent. The follow-up prompt (prompt guide, after P3) took 27 seconds and three approvals: one added test, 8 passing, and the matrix read **3 of 3**.
