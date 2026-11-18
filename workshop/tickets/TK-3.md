# TK-3 · CI is red the night before 11.11 (20 min, in the room)

**Manager's note:** "CI is red. Six failures across five runs. Which ones are real, and do we ship?"

**Given:** the branch `lab3-ci-triage`: a regression suite, a GitHub Actions workflow, and the JUnit reports of five CI runs in `ci/reports/run-1` to `run-5`. `npm run ci:summary` shows the pass/fail pattern per test.

## Driver

1. `git switch lab3-ci-triage`. Your TK-1 and TK-2 files stay where they are.
   - If git refuses because a tracked file changed, run `git stash` first, then switch.
   - If git says "invalid reference" (a shallow or single-branch clone, as in Codespaces), run `git fetch origin lab3-ci-triage:lab3-ci-triage`, then switch.
   - Stay on this branch through Room results: your TK-2 spec comes with you, so the held-out run works here. Afterwards, to go back: `git restore tests/` (it keeps your ship-decision log), `git switch main`, then `git stash pop` if you stashed.
2. Close every editor tab and start a **new task**. Prompt **P4**:

   > Here are the JUnit reports of the last five CI runs (@ci/reports). Six tests fail. Classify each failing test as stale selector, timing, environment, flaky or genuine app bug, with evidence from the reports. Fix only the stale selectors, one change at a time. For every other failure write a one-line fix plan instead of a change. If a failure is a genuine app bug, draft a bug report and leave the test failing.

3. **Keep** or **Undo** each proposed change with the reviewer. Then run `npx playwright test tests/web/specs/regression --retries=0`.
4. Save the bug report for anything you classified as a genuine bug in `docs/bugs/`, with the expected and received values.

The speaker demonstrates the alternative route during the segment: **Panels → Failure Analysis → Import an Allure or JUnit report**. That panel uploads a report into a cloud reporting project and labels each failure Product Bug, Automation Bug, Environment Issue, No Defect or To Be Investigated; those map onto this ticket's classes (genuine app bug; stale selector, timing or flaky; environment; no defect; not yet classified). The chat route above needs no cloud project and is the one the pairs use.

## Reviewer

- Reject any change that alters an expected value, adds a retry or a sleep, or skips a test. A genuine bug is reported, never patched in the test.
- Decide **App bug** or **Automation issue** per failure. A problem in the test environment rather than in the store counts as an Automation issue of the environment kind.
- For anything classified as an App bug, decide the Severity and the Call, and write the reasoning: a money problem on a payment path is usually a **Blocker** with **Block the release**, or a **Critical** with **Ship it with a workaround** if the path can be hidden for 11.11. "Change the test to match the app" is never the answer.
- Submit the pair's six classifications to the room poll the facilitator opens at the start of the ticket.

## Done when

- The stale selectors you repaired pass locally. Every other failure keeps its one-line fix plan or bug report and is left as it is (the flaky test may pass on any single run).
- The six classifications are in the room poll, which is scored against the facilitator's key at Room results.
- Every App bug has a line in the ship-decision log with Severity, Call and Classification, and a bug report in `docs/bugs/`.

## Minute budget

Branch switched and P4 sent by 0:03 · classification read by 0:08 · fixes kept or undone by 0:13 · bug report saved by 0:17 · poll and log by 0:19.

## Rehearsed (single run)

87 seconds of agent time. The agent's classifications matched the facilitator's key, it repaired only what needed repair, left the genuine bug failing, and drafted a correct bug report.
