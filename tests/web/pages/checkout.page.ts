import type { Customer } from '../fixtures/customers';
import { BasePage } from './base.page';
import { VoucherPanel } from './voucher.panel';

export type PaymentOption = 'cod' | 'wallet' | 'qr';

export class CheckoutPage extends BasePage {
  get vouchers(): VoucherPanel {
    return new VoucherPanel(this.page, this.locale);
  }

  async goto(): Promise<void> {
    await Promise.all([this.page.waitForResponse('**/api/quote'), this.page.goto(this.withLocale('/checkout'))]);
    await this.vouchers.settled();
  }

  async fillCustomer(customer: Customer): Promise<void> {
    await this.page.getByRole('textbox', { name: this.text('checkout.name') }).fill(customer.name);
    await this.page.getByRole('textbox', { name: this.text('checkout.mobile') }).fill(customer.mobile);
    await this.page.getByRole('textbox', { name: this.text('checkout.address') }).fill(customer.address);
  }

  /** Selecting a method re-prices the order, because some vouchers depend on it. */
  async choosePayment(option: PaymentOption): Promise<void> {
    await Promise.all([
      this.page.waitForResponse('**/api/quote'),
      this.page.getByRole('radio', { name: this.text(`payment.${option}`) }).check(),
    ]);
    await this.vouchers.settled();
  }

  async placeOrder(): Promise<void> {
    await this.page.getByRole('button', { name: this.text('checkout.placeOrder') }).click();
  }
}
