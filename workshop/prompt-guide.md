# Prompt guide: every prompt, bounded and copy-ready

Why bounded: each agent step costs thinking time, and the minutes of a ticket go into that thinking and into your reading of the result. Asking for "all test cases" produces a long list late; asking for the top five produces a short list you can actually review. Every prompt below is bounded: a count, a named file, or a single flow.

Before every prompt: close other editor tabs (the open file is attached automatically) and, unless the ticket says otherwise, start a **new task** so the right rules load.

## Room tickets

**P1 · TK-1 · test cases from the PRD** (open the PRD first; Panels → Test Cases → Generate test cases → Requirement docs or UI snapshots)

> Please help me create test cases based on the project requirements in the attached PRD (docs/prd/TM-PRD-11-cart-vouchers-checkout.md). Generate only the top 5 test cases for the 11.11 release, prioritised by business risk, as a Markdown table with the columns ID, Title, Preconditions, Steps, Expected result, PRD requirement or AC. Save the table to docs/test-cases/TK-1.md. Do not write automation code yet.

**P2 · TK-1 · explore the running store for a missing flow** (new task; Test Cases → Generate test cases → Explore using Website URL; paste `http://127.0.0.1:3000`)

> Please help me create test cases by exploring the website http://127.0.0.1:3000 (Tindahan Market, running locally). Use the browser: click through the shopper journey (catalogue, cart, voucher field, checkout, payment choices, order confirmation) and take screenshots as you go. Then compare what you saw with the attached PRD (docs/prd/TM-PRD-11-cart-vouchers-checkout.md) and report at most 2 flows that exist in the store but are missing from the PRD. For each gap give: the flow, where you saw it, which PRD section should cover it, and one test case for it. Save the result to docs/test-cases/TK-1-gaps.md. Do not write automation code.

**P3 · TK-2 · automate three test cases** (open `docs/test-cases/TK-1.md` first)

> Convert the cash on delivery and voucher test cases in the attached docs/test-cases/TK-1.md (leave the QR Ph case for later) into Playwright tests in tests/web/specs/tk2.spec.ts, following the workspace rules and the existing Page Objects in tests/web/pages. Then run `npx playwright test tests/web/specs/tk2.spec.ts --retries=0` and `npm run check:rules` and report the results. Do not change any other file and do not install anything.

In rehearsal (timed with the wording "the three test cases about cash on delivery and vouchers") the agent converted all four non-QR cases into 7 tests in 51 seconds, with three approvals (Save, Run Command, Run in background).

After it passes: `npm run defects -- tests/web/specs/tk2.spec.ts` and read the kill matrix. If a hidden variant survives, tell the agent which boundary is missing, for example:

> One hidden store variant survives: nothing tests the subtotal of exactly ₱1,000.00, the minimum spend for SALE1111. Add one test to tests/web/specs/tk2.spec.ts: a cart of banig:1,kendi:1 (₱999.00 + ₱1.00) with SALE1111 must show a discount of ₱200.00 and a total of ₱899.00 (1,000.00 − 200.00 + 99.00). Run the spec again.

**P4 · TK-3 · failure analysis of five CI runs** (branch `lab3-ci-triage`; new task)

> Here are the JUnit reports of the last five CI runs (@ci/reports). Six tests fail. Classify each failing test as stale selector, timing, environment, flaky or genuine app bug, with evidence from the reports. Fix only the stale selectors, one change at a time. For every other failure write a one-line fix plan instead of a change. If a failure is a genuine app bug, draft a bug report and leave the test failing.

## Bonus tickets

**P5 · TK-4 · cloud real browsers** (after the session)

> For this task only, you may add the cloud SDK for this project as a dev dependency, pinned to an exact version. Set up a run of tests/web/specs/tk2.spec.ts on cloud real browsers: Chrome on Windows 11 and Safari (WebKit) on macOS. Read the credentials from environment variables only; never write them to a file. Then run it and give me the build link.

**P6 · TK-5 · accessibility scan**

> Scan http://127.0.0.1:3000/checkout for WCAG 2.1 AA accessibility violations using the base rules that run in a local browser. List the Critical and Serious violations with the element and the rule each one breaks, and propose a fix for the Critical ones only. Do not change any file.

**P7 · TK-6 · visual analysis**

> Compare the catalogue page at http://127.0.0.1:3000/ in English and in Filipino (`?lang=fil`) at a desktop width and a phone width. Report layout differences only: overlapping text, clipped prices, elements pushed off-screen. At most 5 findings, each with the viewport and the element.

**P8 · TK-7 · voucher matrix** (Plan mode; the skill must be switched on)

> /voucher-matrix for the `SALE1111` ₱500 cap and the stacking rules.

**P9 · TK-8 · house rule** (after writing `.test-companionrules/traceability.md`; new task)

> Write `tests/web/specs/checkout.spec.ts`: a cash on delivery checkout of a Barako Coffee cart, once in English and once in Filipino, asserting the order total and payment status.

## What to say when the agent asks

| It asks | You answer |
| --- | --- |
| Save / Approve Always / Reject | **Save**, one at a time. Never Approve Always in the labs. |
| Run Command | Read the command first. Yes to `npx playwright test`, `npm run check:rules`, `npm run typecheck`, `npm run defects`. No to anything that installs or updates. |
| Yes, Allow Access (a secret-named file such as `.env`) | No. Files listed in `.test-companionignore` are blocked without asking; secret-named files ask every time, and the labs never need them. |
| Want me to file it to your issue tracker? | **Not now.** The ship-decision log is today's record. |
| Keep / Undo | The reviewer decides; Undo restores the files, not a command's side effects. |
