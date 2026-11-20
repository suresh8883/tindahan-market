# Would you ship it? The Tindahan Market 11.11 release

**Workshop brief.** Read this before the session; it is the only page you need open besides your ticket.

## The story

It is the evening before 11.11. The release candidate of Tindahan Market, a small Philippine online store, is built. Your manager drops three tickets on your desk and asks one question: **do we ship?**

You have a testing agent inside your IDE (Test Companion), a two-page PRD, a test project that is already installed, and fifteen minutes per ticket. At the end, the room votes: ship, ship with workarounds, or block.

## How the room works

- **Pairs, across companies.** The **driver** types prompts and approves or rejects every action the agent proposes. The **reviewer** judges the output, applies the merge gate to any generated test or fix, and writes the pair's lines in the [ship-decision log](ship-decision-log.md). Swap roles between tickets if both of you brought a laptop.
- **Floor helpers** are in the room for setup and tooling questions. Raise a hand.
- **Fifteen or twenty minutes per ticket.** The agent's thinking time is where the minutes go, so every prompt in the [prompt guide](prompt-guide.md) is bounded: top 5 test cases, at most 2 missing flows, the COD and voucher cases only, 6 failures. Ask for less, get it faster, read it properly.

## Before you arrive

Do the [prerequisites sheet](00-prerequisites.md) at home. Nothing is installed during the session. The first five minutes (Lab 0) are a check, not a setup.

The cards were checked against Test Companion 1.40.8. The extension updates almost daily; if a label reads slightly differently on your screen, the landmarks (the Panels row, the Web/App toggle, the Attach menu) stay the same.

## The tickets

| Ticket | Manager's note | Agent step | Minutes | When |
| --- | --- | --- | --- | --- |
| [TK-1](tickets/TK-1.md) | "The PRD is two pages. Give me the five tests that matter, and tell me what the PRD forgot." | PRD → top-5 test cases → explore the running store for a flow the PRD misses | 15 | In the room |
| [TK-2](tickets/TK-2.md) | "Automate those, then prove to me they would catch a bug." | Test cases → Playwright tests → run → kill matrix against hidden store variants | 15 | In the room |
| [TK-3](tickets/TK-3.md) | "CI is red. Six failures across five runs. Which ones are real?" | Failure analysis → repair only what needs repair → bug report → ship decision | 20 | In the room |
| [TK-4](tickets/TK-4.md) | "Does it hold up on real browsers and real phones?" | Run the TK-2 tests on cloud real browsers, after the session | 15 | Bonus |
| [TK-5](tickets/TK-5.md) | "Can every shopper check out, including with a screen reader?" | Accessibility scan of the checkout page | 10 | Bonus |
| [TK-6](tickets/TK-6.md) | "Marketing changed the 11.11 catalogue copy. Did the layout survive?" | Visual analysis of the catalogue | 10 | Bonus |
| [TK-7](tickets/TK-7.md) | "I want every voucher boundary covered, not just the ones we noticed." | `/voucher-matrix` skill in Plan mode; the held-out variant reveal | 15 | Bonus |
| [TK-8](tickets/TK-8.md) | "Make the agent follow our house rules, and show me what happens when a story carries a hidden instruction." | Traceability rule, rules-off diff, prompt-injected story | 15 | Bonus |
| [TK-9](tickets/TK-9.md) | "The 11.11 vouchers ship in the Android app too." | App PRD → test cases → explore on a cloud real phone → automate one case | 15 | Bonus |

Bonus tickets are for pairs who finish early and for everyone afterwards, with the access provided for the session.

## Rules of the game

1. **One approval at a time.** Never click **Approve Always** during the labs. Each approval is a review decision, and the labs are about those decisions.
2. **The agent installs nothing.** The project is pre-installed and `.test-companionrules/boundaries.md` says so to the agent. If something is missing, stop and raise a hand.
3. **Close other editor tabs** before each prompt. The file open in the editor is attached to the prompt automatically and steers the agent. For TK-1 that is the PRD, and nothing else.
4. **Numbers come from the price list, never from app code.** A test whose expected value is computed the way the store computes it agrees with every bug.
5. **Every finding gets a line in the ship-decision log:** Severity, Call, Classification, evidence. The release manager reads the log, not the chat.
6. **Fixing a real bug in the test is the wrong answer.** A genuine app bug is reported and the test stays red.

## The everyday pains behind the tickets

- Reading a long PRD and picking what matters: TK-1.
- A requirement nobody wrote down, discovered too late: TK-1's exploration step.
- "I'm a manual tester, I don't write automation": TK-2 generates the scripts for the framework already in the project; you review them.
- A red pipeline the night before a release, with no time to read six stack traces: TK-3.

## After the session

Keep the repository: the brief, the eight ticket cards, the PRD and prompt guide, the workspace rules and the `/voucher-matrix` skill, the merge-gate card and the ship-decision log with its rubric are all in it. The bonus tickets work on your own time with the same repository. The [take-home folder](../take-home/) also holds optional templates for teams that want to run a pilot afterwards.

## Where things are

| Path | What |
| --- | --- |
| `docs/prd/TM-PRD-11-cart-vouchers-checkout.md` | The PRD for TK-1 |
| `docs/test-cases/` | Where the agent saves the test cases it writes |
| `tests/web/specs/` | Your generated specs land here; Page Objects are in `tests/web/pages/` |
| `.test-companionrules/` | The workspace rules the agent follows, one topic per file |
| `workshop/tickets/` | One card per ticket |
| `workshop/prompt-guide.md` | Every prompt, bounded and copy-ready |
| `workshop/ship-decision-log.md` | The reviewer's record: findings, the release verdict, and the merge-gate table |
| `docs/bugs/` | Bug reports drafted in TK-3 |
| `take-home/` | The kit you leave with |

The technical reference for the store, the commands and troubleshooting is the repository [README](../README.md).
