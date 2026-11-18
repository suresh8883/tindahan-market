import type { Locator } from '@playwright/test';
import type { Cart, ProductId } from '../fixtures/catalogue';
import { BasePage } from './base.page';
import { VoucherPanel } from './voucher.panel';

export interface CartOptions {
  /** Overrides the store clock for this browser session, as an ISO date-time. */
  now?: string;
}

export class CartPage extends BasePage {
  get vouchers(): VoucherPanel {
    return new VoucherPanel(this.page, this.locale);
  }

  async goto(): Promise<void> {
    await this.page.goto(this.withLocale('/cart'));
  }

  /** Opens the cart holding exactly these items and waits for the first quote. */
  async open(cart: Cart, options: CartOptions = {}): Promise<void> {
    const items = Object.entries(cart)
      .map(([id, quantity]) => `${id}:${quantity}`)
      .join(',');
    const params = new URLSearchParams({ items, lang: this.locale });
    if (options.now) params.set('now', options.now);
    await Promise.all([this.page.waitForResponse('**/api/quote'), this.page.goto(`/cart?${params}`)]);
    await this.vouchers.settled();
  }

  lineTotal(id: ProductId): Locator {
    return this.page.getByTestId(`cart-line-total-${id}`);
  }

  get emptyMessage(): Locator {
    return this.page.getByTestId('cart-empty');
  }

  async proceedToCheckout(): Promise<void> {
    await this.page.getByRole('button', { name: this.text('cart.checkout') }).click();
  }
}
