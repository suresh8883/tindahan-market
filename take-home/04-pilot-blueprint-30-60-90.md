# Pilot blueprint: 30-60-90 days

A pilot is designed to produce a go or no-go decision. Pick one product area and one squad, and measure the baseline before day 1.

## Entry criteria (all true before day 1)

- [ ] Client or internal approval for the tool, sub-processors and data location (see `03-ai-usage-policy-template.md`).
- [ ] Licences in place. Free tiers cannot carry a real pilot.
- [ ] One pilot area with an existing automated suite and Page Objects (or equivalent), so the agent has patterns to follow.
- [ ] Merge gates 1–3 runnable in CI; gates 5–6 (secret scan, branch protection) on.
- [ ] Baselines recorded in `02-kpi-scorecard-and-roi.xlsx`: cost per hand-written test (last 2 sprints), flaky rate, time from story to merged test.
- [ ] At least 3 held-out seeded faults (variants) prepared for the pilot area and kept away from the agent and the pilot team.
- [ ] Named owner, named non-coding reviewer, and a stop condition agreed (below).

## Days 1–30: set up and learn

- Write the workspace rules: locators, assertions, test data, secrets, plus one house rule (for example traceability).
- Two engineers use the agent on new stories only; every output goes through gates 1–3 and 6.
- Log every rejection and its reason. Recurring reasons become rules.
- **Exit:** at least 15 merged AI-assisted tests; gate 3 pass rate measured; rejection log reviewed; no gate 5 incident.

## Days 31–60: widen and measure

- Add the whole squad. Add gate 4 (repeat runs with zero retries) for new tests.
- Try CI failure triage on real failures, fixes limited to stale selectors; everything else gets a plan or a bug report.
- Measure the KPIs every sprint against the baseline.
- **Exit:** held-out defect detection measured on the held-out variants; cost per merged test at or below baseline; flaky rate not above baseline.

## Days 61–90: decide

- Run the held-out variants against the full pilot suite. Compare with the hand-written suite.
- Fill in the ROI sheet with real numbers, not the illustrative ones.
- Write a one-page decision: scale, extend the pilot, or stop. Include the rejection log and the KPI trend.
- **Exit (go):** held-out detection ≥ the hand-written suite's; cost per merged test below baseline for 2 sprints in a row; story-to-merged-test time not worse; zero gate 5 incidents; reviewer workload sustainable.

## Stop condition (any one ends or pauses the pilot)

- A secret, personal data or client-restricted data reaches a prompt or a commit.
- AI-assisted tests merged that fail gate 3 (detect nothing) exceed [20]% of merged tests in two consecutive sprints.
- Cost per merged test is above baseline for [3] consecutive sprints with no downward trend.
- The flaky rate rises above baseline + [2] percentage points and stays there for [2] sprints.
- The client withdraws approval.

Record who decides and by when: **[name], within [5] working days of a trigger.**
