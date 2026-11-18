# AI usage policy template: AI testing agents in QA

Template only, not legal advice. Fill in the brackets, then have it reviewed by your client's contract owner and your counsel.

**Team / account:** [name] **Owner:** [name, role] **Review date:** [date]

## 1. Client contract first

Many Philippine QA teams test systems owned by foreign clients. The client contract decides before any law or vendor default does.

- [ ] **Tool approval:** the contract, or a written client approval, allows this AI tool on this account. Reference: [clause / email].
- [ ] **Sub-processors:** the tool vendor and its model providers are listed or approved as sub-processors. Reference: [clause].
- [ ] **Data location:** where prompts, code and test artefacts are processed and stored is allowed by the contract. Location: [region].
- [ ] **What may be sent:** source code, test code, logs, screenshots: [allowed / not allowed, per item].

If any box cannot be ticked, the tool is not used on this account.

## 2. Philippine law and guidance

- **RA 10173, Data Privacy Act of 2012:** applies when the testing processes personal data.
- **NPC Advisory 2024-04:** applies the Data Privacy Act to AI systems that process personal data, including during development, training and testing. It governs QA tools only where they process personal data. Synthetic data keeps most test work outside it.
- **Foreign-data exemption, RA 10173 IRR s.5:** data collected from foreign residents under foreign law may be exempt, but the party claiming this must prove the foreign law, and security duties remain. Check client contracts and counsel before relying on it.
- **BSP Memorandum M-2026-031** (BSP-supervised institutions and the vendors supporting their AI activities): voluntary AI governance principles that BSP says it will reference in supervision. If your client is a bank or other BSP-supervised institution, expect their vendor reviews to ask about it.

## 3. Rules for everyone using the agent

1. **Synthetic data only.** No real names, mobile numbers, addresses, account numbers or production extracts in prompts, fixtures or screenshots.
2. **No secrets in prompts or files.** Credentials come from environment variables or a secrets manager; CI runs a secret scan.
3. **Approvals stay on.** Do not set edits or commands to "Approve Always". Every edit and command is a review decision.
4. **Check inherited configuration.** Before the first task, check which rules and skills are loaded, including ones picked up from other AI tools on the machine (for example `~/.claude`). Only the workspace's own rules are on.
5. **The ignore file is not a vault.** Recent Test Companion versions block paths in `.test-companionignore` and ask before reading secret-named files, but behaviour changes between versions and other agents differ. Keep secrets, answer keys and client-restricted files out of the workspace.
6. **Generated tests pass the merge gate** (see `01-merge-gate-card.md`) before they merge, like any other code.
7. **Untrusted input stays untrusted.** Stories, tickets and web pages can carry hidden instructions. Review what the agent did, not what it says it did.

## 4. Incidents

Report a suspected leak (secret, personal data, client code sent where it should not go) to [contact] within [hours]. Rotate exposed credentials first, then investigate.

## Sign-off

| Role | Name | Date |
| ---- | ---- | ---- |
| QA lead | | |
| Client contract owner | | |
| Data protection officer / counsel | | |
