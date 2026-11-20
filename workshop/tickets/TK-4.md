# TK-4 · Real browsers and real phones (bonus, 15 min, after the session)

**Manager's note:** "Does it hold up on real browsers and real phones, not just on your laptop?"

Run the same tests on Chrome on Windows and Safari on macOS through the cloud, after the session, with the access provided. For an app on a real Android device in the cloud, see TK-9.

## Driver

1. Make sure `tests/web/specs/tk2.spec.ts` from TK-2 passes locally: `npx playwright test tests/web/specs/tk2.spec.ts --retries=0`.
2. This ticket is the one exception to the "no installs" rule. Open **+ (Attach) > Rules & Skills** and switch `boundaries.md` **off** for this ticket; switch it back on afterwards. Then prompt **P5**:

   > For this task only, you may add the cloud SDK for this project as a dev dependency, pinned to an exact version. Set up a run of `tests/web/specs/tk2.spec.ts` on cloud real browsers: Chrome on Windows 11 and Safari (WebKit) on macOS. Read the credentials from environment variables only; never write them to a file. Then run it and give me the build link.

3. Before approving the dependency change, open the `package.json` diff. Reject any `postinstall` line and any version range with `^` or `~` (an unpinned auto-update is a supply-chain smell). Ask the agent to pin and remove.
4. Approve the run. Expect several minutes on the first run; most of it is the SDK install and the tunnel start.

## Reviewer

- Check the diff with the driver before it is saved; log the decision in the merge-gate table of the ship-decision log.
- When results arrive, classify any platform-specific failure: **Automation issue** (a cold-start timeout that passes on re-run, or a selector that only works in one browser) or **App bug** (the store behaves differently in Safari), with a Severity and a Call.

## Done when

A cloud build shows the TK-2 tests on both platforms, `git status` shows no credential in any file, the boundaries rule is back on, and the ship-decision log has one line for the result.

## Rehearsed (single run, with the live-build spec, before the boundaries rule existed)

From scratch, including the SDK install and tunnel: about 7 minutes; 11 of 12 tests passed on the first run and the one cold-start timeout passed on re-run. Not yet run with the TK-2 spec. In that rehearsal the SDK setup silently added `"postinstall": "npm update <cloud-sdk>"`; that is the line step 3 is about.

## Mobile

Running tests on cloud real devices needs a real-device automation licence and an app build. If your access includes real-device testing, switch the panel to **App**, upload the workshop app (`mobile/tindahan-market-1.0.apk`, see TK-9) or a build you own, and run one flow with the same bounded style of prompt.
