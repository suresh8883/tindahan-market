# TK-5 · Can every shopper check out? (bonus, 10 min)

**Manager's note:** "A customer using a screen reader could not finish checkout last 11.11. Is that still true?"

## Driver

1. The store must be running: `npm start` (http://127.0.0.1:3000).
2. Prompt:

   > Scan http://127.0.0.1:3000/checkout for WCAG 2.1 AA accessibility violations using the base rules that run in a local browser. List the Critical and Serious violations with the element and the rule each one breaks, and propose a fix for the Critical ones only. Do not change any file.

3. The scan opens a browser on your machine. On a laptop with little free memory it can stall; if nothing has happened after two minutes, stop the task and note that in the log instead of waiting.

## Reviewer

- For each Critical or Serious violation decide the Severity (a shopper who cannot complete checkout with a screen reader is Critical; a missing label on a decorative element is Minor) and the Call (Fix it, Ship it with a workaround, or Block the release). Write the line in the ship-decision log with the rule name as evidence; the classification is App bug.
- Fixes are proposals here: the store runs from a prebuilt bundle, so a code change in `src/` does not change what the tests see. The decision is what matters, not the patch.

## Done when

A violation list with severities exists in the chat, and the ship-decision log has at least one line for accessibility.

## Notes

The base-rule scan runs in a browser on your machine and needs no extra plan. An advanced scan that includes AI-detected issues runs in the cloud and needs an accessibility plan; it is not part of this ticket. Accessibility stayed out of the core tickets because the local scanner is the step most likely to struggle on a busy laptop.
