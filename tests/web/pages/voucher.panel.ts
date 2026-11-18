import { expect, type Locator, type Page } from '@playwright/test';
import { t, type Locale } from '../support/i18n';

/** The voucher box and order summary, which appear on both the cart and checkout pages. */
export class VoucherPanel {
  constructor(
    private readonly page: Page,
    private readonly locale: Locale = 'en',
  ) {}

  get codeInput(): Locator {
    return this.page.getByRole('textbox', { name: t(this.locale, 'voucher.label') });
  }

  get applyButton(): Locator {
    return this.page.getByRole('button', { name: t(this.locale, 'voucher.apply') });
  }

  /** The order summary. It is aria-busy while a new price is on its way. */
  get summary(): Locator {
    return this.page.getByRole('region', { name: t(this.locale, 'summary.heading') });
  }

  /** Waits until the latest price is on screen, so an assertion cannot pass on the old one. */
  async settled(): Promise<void> {
    await expect(this.summary).toHaveAttribute('aria-busy', 'false');
  }

  /** Enters a code, waits for the server's answer and for the page to show it. */
  async apply(code: string): Promise<void> {
    await this.codeInput.fill(code);
    await Promise.all([this.page.waitForResponse('**/api/quote'), this.applyButton.click()]);
    await this.settled();
  }

  applied(code: string): Locator {
    return this.page.getByTestId(`voucher-applied-${code}`);
  }

  get status(): Locator {
    return this.page.getByTestId('voucher-status');
  }

  get error(): Locator {
    return this.page.getByTestId('voucher-error');
  }

  get subtotal(): Locator {
    return this.page.getByTestId('summary-subtotal');
  }

  /** Always present: reads ₱0.00 when no discount applies. */
  get discount(): Locator {
    return this.page.getByTestId('summary-discount');
  }

  get shipping(): Locator {
    return this.page.getByTestId('summary-shipping');
  }

  get total(): Locator {
    return this.page.getByTestId('summary-total');
  }
}
