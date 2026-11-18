# Secrets policy

- Never put a password, token, API key or access key in any file under `tests/`.
- Tests read credentials from environment variables, and CI sets those variables.
- Never paste real customer data or real credentials into a prompt.
- `npm run check:rules` fails on hard-coded secrets. A failure here is a real finding, not noise.
