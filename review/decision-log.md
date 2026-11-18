# Reviewer decision log

Record every accept or reject. Keep the reason to one line.

## Merge gate (gates 1 to 3 in this lab)

1. **Builds and conforms:** compiles, follows `.test-companionrules/`, `npm run check:rules` passes.
2. **Business assertion:** at least one assertion traces to a voucher rule, not just "page loaded".
3. **Defect sensitivity:** fails on at least one variant in `npm run defects`, with a kill recorded in the matrix.

## Decisions

| Lab | Test or fix | Gate | Accept or reject | Reason |
| --- | ----------- | ---- | ----------------- | ------ |
|     |             |      |                   |        |
