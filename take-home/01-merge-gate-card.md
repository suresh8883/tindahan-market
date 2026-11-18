# Merge gate card: AI-generated tests

Every AI-generated test or fix passes all six gates before it merges. Gates 1–3 are the ones you used in the labs; gates 4–6 are covered in the talk, and you add them in your own pipeline.

| # | Gate | Passes when | Owner | Enforced by |
| - | ---- | ----------- | ----- | ----------- |
| 1 | **Builds and conforms** | Typecheck and the static rules check pass; the code follows the workspace rules (locators, no sleeps, Page Objects, test data). | Engineer | CI job (`npm run typecheck`, `npm run check:rules`) as a required status check; workspace rules steer the agent |
| 2 | **Business assertion** | At least one assertion checks a business outcome: a price, a voucher state, an order status. "Page loaded" or `toBeVisible()` alone fails. | Non-coding reviewer (QA lead, BA, product owner) | Review checklist on every PR; the reviewer can read it without reading code |
| 3 | **Defect sensitivity** | The test passes on the clean build **and** fails a targeted variant (seeded fault) on a business assertion. A timeout, missing element or visibility failure does not count: it fails for reasons unrelated to the rule. | Reviewer judges; CI runs the variants | Variant run (`npm run defects` in the lab; mutation testing at unit level) with the kill result posted on the PR |
| 4 | **Stability** | Repeat runs with **zero retries** show no failure. Treat this as a screen, not proof: zero failures in 10 runs still passes a 10%-flaky test 35% of the time (a 5%-flaky one 60% of the time). | Engineer | CI job running new or changed tests N times with `--retries=0`; flaky-rate KPI tracked over time |
| 5 | **No secrets, synthetic data only** | No credential, token or key in code, config or prompts; test data is synthetic, never real customer data. | Engineer; CI blocks | Secret scan in CI (for example gitleaks) as a required check, plus a pre-commit hook; data policy in the workspace rules |
| 6 | **Independent review** | Someone other than the author (and other than the agent's operator) approves. | Non-coding reviewer or second engineer | Branch protection: required approving review, no self-approval, no direct pushes to main |

## Reject on sight

- A changed expected price or message that makes a failing test pass.
- An added retry, sleep or `test.skip`.
- A "fix" to a test that is actually detecting an app bug: report the bug and leave the test failing.
- An unpinned dependency or install script the agent added without being asked (for example a `postinstall` that runs `npm update`).
