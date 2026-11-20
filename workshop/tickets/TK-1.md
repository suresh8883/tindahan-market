# TK-1 · The PRD is two pages and something is missing (15 min, in the room)

**Manager's note:** "The PRD is two pages. Give me the five tests that matter for 11.11, and tell me what the PRD forgot."

**Given:** the PRD `docs/prd/TM-PRD-11-cart-vouchers-checkout.md`, and the store running at <http://127.0.0.1:3000> (`npm start` from Lab 0).

## Driver

1. Close every editor tab, then open the PRD. The open file is attached to your prompt automatically; nothing else should be.
2. In the **Panels** row choose **Test Cases**, then **Generate test cases with Test Companion**, then **Requirement docs or UI snapshots**. Pick the PRD if a file picker opens. Replace the suggested sentence with prompt **P1** from the [prompt guide](../prompt-guide.md):

   > Please help me create test cases based on the project requirements in the attached PRD (docs/prd/TM-PRD-11-cart-vouchers-checkout.md). Generate only the top 5 test cases for the 11.11 release, prioritised by business risk, as a Markdown table with the columns ID, Title, Preconditions, Steps, Expected result, PRD requirement or AC. Save the table to docs/test-cases/TK-1.md. Do not write automation code yet.

3. Approve the **Save**. Read the five cases together for two minutes before moving on.
4. Start a **new task**. **Test Cases → Generate test cases → Explore using Website URL**, paste `http://127.0.0.1:3000`, and replace the suggested sentence with prompt **P2**:

   > Please help me create test cases by exploring the website http://127.0.0.1:3000 (Tindahan Market, running locally). Use the browser: click through the shopper journey (catalogue, cart, voucher field, checkout, payment choices, order confirmation) and take screenshots as you go. Then compare what you saw with the attached PRD (docs/prd/TM-PRD-11-cart-vouchers-checkout.md) and report at most 2 flows that exist in the store but are missing from the PRD. For each gap give: the flow, where you saw it, which PRD section should cover it, and one test case for it. Save the result to docs/test-cases/TK-1-gaps.md. Do not write automation code.

5. Approve the **Save**. If the agent offers to file a finding to an issue tracker, choose **Not now**: today the ship-decision log is the record.

## Reviewer

- Every test case cites a PRD section or an AC, and every expected amount is computed from the price list, with the arithmetic visible. Reject "verify the page loads".
- Ask one question of the set: does every payment method have a case that checks the amount charged? If not, say so in the log.
- For each gap the agent reports: Classification **Documentation gap**; Severity **Major** for a missing flow, **Minor** for a missing message; Call **Fix it** (update the PRD before 11.11). If the exploration surfaced an app bug instead, classify it as **App bug** and decide the Call.
- Write one line per finding in the [ship-decision log](../ship-decision-log.md).

## Done when

- `docs/test-cases/TK-1.md` holds five test cases with PRD or AC references.
- `docs/test-cases/TK-1-gaps.md` names at least one real gap. The facilitator confirms how many there are at Room results.
- The ship-decision log has a line per finding.

## Minute budget

P1 sent by 0:02 · cases read by 0:06 · P2 sent by 0:07 · gaps read and logged by 0:14.

## Rehearsed (single runs on one machine)

- P1: 27 seconds of agent time, one approval. The five cases covered the ₱2,501 cap boundary, both stacking orders, minimum spend, the COD primary path and the QR Ph amount, each with its AC.
- P2: 123 seconds of agent time, one approval. The agent walked the store in a real browser with screenshots, placed a test order, and reported two gaps with complete test cases. In an earlier run without a working browser it fell back to reading code and live pages, found two gaps, and also flagged one finding it labelled "not a PRD gap" and offered to file.

## Stretch

Push the five cases to a test-management project from the Test Cases panel (**Sync test cases**), or use **Export CSV**, if your pair has a project to push to.
