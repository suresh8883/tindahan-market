# Assertion policy

- Every test asserts a business outcome: a price, a voucher state or an order status. "The page loaded" and `toBeVisible()` alone are not outcomes.
- Use web-first assertions such as `await expect(locator).toHaveText(...)`, which retry until the page settles.
- Do not read a value with `textContent()` and then compare it. That checks once, possibly too early.
- Expected money values are literal strings worked out from the rules, for example `'-₱200.00'`. Never compute them with app code, or the test will agree with any bug.
- Expected messages come from the locale catalogue.
- Never change an expected value to match what the app does. If the app disagrees with the rules, report a bug and leave the test failing.
- Do not skip tests, add retries or weaken an assertion to make a run pass.
