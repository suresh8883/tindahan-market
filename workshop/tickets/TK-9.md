# TK-9 · The same release, on a phone (bonus, 15 min)

**Manager's note:** "The 11.11 vouchers ship in the Android app too. Give me the test cases from the app's PRD, check them on a real phone, and show me one as an automated test."

You need the app and its PRD from [`mobile/`](../../mobile/README.md). No phone of your own is needed: the app runs on a cloud real device.

## Driver

1. **Upload the app.** In the Test Companion panel switch **Web** to **App**. If it asks **Start New Task with Context**, approve it. **Select App → Browse file** → `mobile/tindahan-market-1.0.apk`.
2. **Test cases from the PRD.** Open **Panels → Test Cases**. Pick your project (or **Create project**), then **Generate test cases with Test Companion**, and prompt **P9a**:

   > Create the top 5 test cases for the Tindahan Market Android app from the PRD @mobile/docs/prd/TM-PRD-12-android-app.md, prioritised by business risk. Each case cites the acceptance criterion it covers and computes its expected amount from the price list. Do not create or edit any files.

   The cases appear in the Test Cases panel. No project? Use **New ▾ → Generate test cases → Requirement docs or UI snapshots** with the same prompt; the cases come back in the chat.
3. **Edit one case** with the reviewer: fix anything you disagree with before it is automated.
4. **Check it on a real phone.** New task: **New ▾ → Generate test cases → Explore using App**. Replace the prefilled prompt with **P9b**:

   > Please help me create test cases by exploring the following app: add a Barong Tagalog to the cart, apply the voucher SALE1111, and check the cart summary against the PRD @mobile/docs/prd/TM-PRD-12-android-app.md. Give me the top 3 test cases only. Do not save them to a project and do not create or edit any files.

5. **Automate one case.** In the Test Cases panel click **⚡ Automate** on one case (or tick several and click **Automate**). Approve one action at a time; reject any install you did not ask for. Running the script on a cloud real device needs real-device automation in your access. Without it, review the script instead.

## Reviewer

- Every expected amount must come from the PRD's price list, not from the app's screen. Redo one by hand: Barong Tagalog ₱2,500.00 with `SALE1111` is ₱2,500.00 − ₱500.00 + ₱99.00 shipping.
- In the automated script, every locator should be a resource id from PRD section 8 (for example `ph.tindahan.market:id/summary_total`), never a screen position or an XPath index.
- Did the exploration on the phone show anything the PRD does not describe? Log it like a TK-1 gap.

## Done when

Five PRD-based test cases (each citing an AC), one edited by you, one automated script that uses resource ids, and one line in the ship-decision log: does the app ship for 11.11?

## Status

New on 20 Nov 2026. The app's 12 acceptance criteria were checked on an Android 15 emulator; this card's Test Companion steps follow the web flow rehearsed the same day and have not been timed for the app yet.
