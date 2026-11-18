# TK-7 · Voucher maths, exhaustively (bonus, 15 min)

**Manager's note:** "I want every voucher boundary covered, not only the ones we happened to notice."

`tests/web/specs/voucher.start.spec.ts` tests the minimum spend and leaves TODOs. The store has hidden variants; make the suite catch every one.

## Driver

1. `npm run defects` and read the kill matrix for the starting suite.
2. Switch on the repo skill if you have not yet: **+ (Attach) > Rules & Skills > Skills**, toggle **voucher-matrix** on (a skill shipped in a repo starts disabled).
3. Open `tests/web/specs/voucher.start.spec.ts`, close other tabs, and switch the interaction mode from **Agent** to **Plan**. Plan mode makes the agent propose a plan before any action; the skill alone asks for a pause but cannot enforce one.
4. Invoke the skill:

   > /voucher-matrix for the `SALE1111` ₱500 cap and the stacking rules.

   The reviewer approves the boundary matrix before any test is written.
5. Let the agent add the tests, then `npm run check:rules` and `npm run defects`. Repeat until every variant is killed.
6. Stretch: expiry at the end of 11.11 (store time, UTC+8) and the COD limit above ₱3,000.

## Reviewer

- Approve the matrix first: every boundary on both sides, both voucher orders, arithmetic from the price list.
- Apply gates 2 and 3 to each new test. A test that never shows `KILL` and adds no new boundary is a candidate for rejection; log the reason.
- A boundary the matrix lists but no variant exercises is logged for the facilitator, not deleted.

## Done when

`npm run defects` prints `RESULT: 3/3 killed` and `npm run check:rules` prints `check:rules PASS`. Then run the held-out check with the flag the facilitator announces at Room results. A suite tuned to the three variants it could see often misses a boundary of the same kind on another voucher; held-out detection is the real KPI.

## Rehearsed

129 seconds of agent time, from 1 of 3 variants killed to 3 of 3, 13 tests, `check:rules PASS`. The agent made a cart-arithmetic error on the way, saw its own tests fail, and corrected it. The reference solution scores 3 of 4 with the held-out variant.
