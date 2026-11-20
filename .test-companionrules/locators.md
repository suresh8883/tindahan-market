# Locator policy for Tindahan Market tests

- Prefer `getByRole()` with an accessible name. Fall back to `getByTestId()`.
- No CSS selectors and no XPath. This includes `page.locator()`, `page.$()`, `css=` and `xpath=`.
- All page interaction goes through the Page Objects in `tests/web/pages/`. No raw locators in specs.
- No fixed sleeps: no `page.waitForTimeout()`, no `setTimeout`. Wait on a web-first assertion or a named network response.

## Locale

The store is localised, so accessible names change with the locale.

- Take every name from the locale catalogue, `src/i18n/catalogue.ts`, through `t(locale, key)` from `tests/web/support/i18n.ts`.
- Never type a UI string such as `'Apply voucher'` into a test or Page Object.
- Page Objects take the locale in their constructor, so one Page Object serves both languages.
