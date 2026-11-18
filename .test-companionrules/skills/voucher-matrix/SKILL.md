---
name: voucher-matrix
description: Generate a boundary-value test matrix for a voucher or discount rule, then Playwright tests from it. Use when asked to test vouchers, discounts, minimum spend, caps, expiry, stacking or conflicts.
---

# Voucher boundary matrix

Produce the matrix first, show it for review, and only then write tests.

## 1. Read the rule

Read the rule from `README.md` and `src/server/vouchers/`. Quote the rule you are testing. Do not invent rules.

## 2. Build the matrix

Output one table with the columns:

| ID | Rule | Input (cart, vouchers in order, payment, clock) | Why this value | Expected discount | Expected total | Expected message |

Work out each row like this:

- **Numeric limit:** one row just below the limit, one exactly at it, one just above it, and one far from it. "Just" means the smallest step a real cart can reach, so check the prices in `src/server/products.ts`. A limit on the discount is reached through the cart value that produces it, so derive that cart value first.
- **Date limit:** one row before the limit, one exactly at it and one just after it.
- **Combination rule:** one row for every ordered pair of vouchers. A then B is a different row from B then A.
- **Payment-dependent rule:** one row for each payment method, on both sides of any amount limit.

Work out expected values by hand from the rule, showing the arithmetic. Never take them from running the app.

## 3. Generate the tests

- Add the tests to the spec you were pointed at. Use a data-driven loop when rows share a shape.
- One business assertion per row at minimum: the discount, the total or the rejection message.
- Follow every file in `.test-companionrules/`.

## 4. Prove the tests

Run `npm run check:rules`, then `npm run defects`. Report the output as it is. A test that never fails on any variant is a candidate for rejection, so say which those are.
