# Ship-decision log (the reviewer's record)

Pair: ______________ (driver) / ______________ (reviewer) · Companies: ______________ / ______________

One line per finding. The release manager reads this, not the chat transcript. Label every ticket you close: a ticket counts only when both the Severity and the Call are defensible, and the reasoning matters as much as the label.

**Severity** (how serious): Blocker (stops the release) · Critical (serious, needs fixing before ship) · Major (a real problem, but survivable) · Minor (small, cosmetic).
**Call** (what should happen): Fix it · Ship it with a workaround · Block the release until it is resolved.
**Classification** (what kind of problem): App bug (the store is wrong) · Automation issue (something wrong with how it was tested, not the app) · Documentation gap (the PRD is wrong or silent).
**Evidence** (one or more): a test or run name, a kill-matrix line, a screenshot, a cloud session link, or a short written note.

| Ticket | Finding (one sentence) | Severity | Call | Classification | Evidence | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| TK-1 | | | | | | |
| TK-1 | | | | | | |
| TK-2 | | | | | | |
| TK-2 | | | | | | |
| TK-3 | | | | | | |
| TK-3 | | | | | | |
| TK-3 | | | | | | |

## Release verdict for 11.11 (filled at Room results)

Ship · Ship with workarounds · Block, because: ______________________________________________

## Merge-gate decisions on generated tests and fixes

One line per test case or fix (four or five in TK-2), not per generated test. Gate 1 builds and conforms (`npm run typecheck`, `npm run check:rules`, workspace rules) · Gate 2 at least one business assertion (a price, a voucher state, an order status) · Gate 3 defect sensitivity (fails a hidden variant on a business assertion; a timeout does not count).

| Ticket | Test or fix | Gate 1 | Gate 2 | Gate 3 | Accept / Reject | Reason (one line) |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |
