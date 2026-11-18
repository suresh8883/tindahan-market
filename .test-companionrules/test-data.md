# Test data policy

- Test data comes from `tests/web/fixtures/`. Add to the fixtures rather than inlining people or voucher codes in a spec.
- Synthetic data only. Never use real names, mobile numbers or addresses.
- Reach a cart state with `CartPage.open({ ... })` rather than clicking through the catalogue, unless the catalogue is what you are testing.
- Prices are in `src/server/products.ts`. Pick quantities that land exactly on the boundary you want.
- The store clock is fixed. To test time-based rules pass `now` to `CartPage.open()`; never depend on today's date.
- Each test sets up its own cart. Tests run in parallel and must not depend on each other.
