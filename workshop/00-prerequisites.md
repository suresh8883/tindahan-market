# Prerequisites sheet: do this at home, before the workshop (about 20 minutes)

Bring a laptop that already has everything below. Nothing is installed during the session: the Wi-Fi is shared with the whole room, and the agent is told not to install anything (`.test-companionrules/boundaries.md`).

## Drivers (one laptop per pair)

1. Install **Node.js LTS** (22, 24 or 26), **Git**, **Google Chrome** and **VS Code**. The agent opens Chrome on your machine when it explores the store in TK-1.
2. Access is provided for the session. At home, join the workshop organisation with the invitation link from the pre-work email. Use a personal email address that has no account there yet: if a work email already belongs to your company's account there, joining another organisation may affect that access. Then update VS Code, install the **Test Companion** extension and sign in from its panel (the sign-in button, not "Create an account").
3. Clone the repository and set it up:

   ```bash
   git clone https://github.com/suresh8883/tindahan-market.git tindahan-market
   cd tindahan-market
   npm ci
   npx playwright install --only-shell chromium
   npm run doctor
   ```

4. `npm run doctor` must print `DOCTOR PASS`. If it prints `FAIL`, read the line it points to. The README's troubleshooting section covers ports, proxies and Windows.

   **On Windows:** if PowerShell says "running scripts is disabled on this system", run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force` once (no admin needed), or use Command Prompt and make it VS Code's default terminal (Ctrl+Shift+P → "Terminal: Select Default Profile"). Type paths with forward slashes, `tests/web/specs/...`, even on Windows.

   **Clone with git, not "Download ZIP":** TK-3 needs the repository's second branch.
5. Open the folder in VS Code and answer **Yes, I trust the authors** (otherwise VS Code switches the extension off for this folder), then open the Test Companion panel. Check that you are signed in and the **Web** toggle is selected. The **Panels** row (Test Cases, Failure Analysis, Visual Analysis) may only appear after your first task: if you do not see it, click **New** and look again.
6. **Sign in at home, not at the venue.** Many sign-ins from one venue network can trip the tool's security blockers, and corporate VPNs or proxies are the usual culprits. If sign-in fails on the day: switch to a mobile hotspot, turn off the VPN, retry in a fresh browser window, then ask a floor helper.
7. **Understand the store first (a few minutes).** Run `npm start`, open <http://127.0.0.1:3000>, add two items, try a voucher code, and place a cash-on-delivery order. The PRD lands differently once you have seen the screens it describes.

Downloads: about 115 MB (9 MB for `npm ci`, 105 MB for the headless Chromium shell). Disk: about 250 MB.

No laptop setup possible? Open the repository in GitHub Codespaces; `.devcontainer/` installs everything, and you sign in to Test Companion inside the Codespace. This route is offered, not rehearsed: the steps that open a browser on your machine may behave differently there.

## Reviewers

- A laptop or tablet with a browser is enough. Code is read on the driver's screen.
- Driver and reviewer swap between tickets if both of you brought a working laptop.

## On the day: the first five minutes (Lab 0)

- **Driver:** run `npm run doctor` once more. In a second terminal run `npm start`, which serves the store at <http://127.0.0.1:3000> for Ticket 1's exploratory step. Open the Test Companion panel.
- **Reviewer:** open `workshop/ship-decision-log.md` and `take-home/01-merge-gate-card.md`.
- Stuck? Raise a hand and a floor helper comes to you. If a laptop cannot be fixed in five minutes, the pair joins a neighbouring pair as a second reviewer.
