# TK-6 · Did the 11.11 copy break the layout? (bonus, 10 min)

**Manager's note:** "Marketing changed the 11.11 catalogue copy an hour ago. Did the catalogue survive, in both languages, on a phone?"

## Driver

1. The store must be running: `npm start` (http://127.0.0.1:3000).
2. The **Visual Analysis** panel in the Panels row is a review surface for a visual-testing project: it shows "No visual reviews yet" until a visual test build exists, and its **Start Visual Analysis** action sets up visual testing for the project from scratch, which installs tooling. That setup is for after the session, with a floor helper, not for the room. Use the chat route below for the bonus.
3. Prompt:

   > Compare the catalogue page at http://127.0.0.1:3000/ in English and in Filipino (`?lang=fil`) at a desktop width and a phone width. Report layout differences only: overlapping text, clipped prices, elements pushed off-screen. At most 5 findings, each with the viewport and the element.

## Reviewer

- A clipped price or an unreadable voucher message is Critical; a misaligned banner is Minor. Write the lines in the ship-decision log with the Call for each.
- Filipino strings are longer than English ones. A difference that appears only in Filipino is an App bug, not an Automation issue.

## Done when

A findings list with viewports exists, and the ship-decision log has at least one line for layout.

## Notes

The panel's empty state was checked on the real product (service, project and build selectors; "Run a visual test on this project and Test Companion pulls the build back here, baseline vs. new, side by side, ready to approve"). The chat prompt above was not rehearsed; treat its result as a screen for a human to look at, not as proof.
