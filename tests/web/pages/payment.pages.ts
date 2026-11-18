import type { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class MockWalletPage extends BasePage {
  get amount(): Locator {
    return this.page.getByTestId('wallet-amount');
  }

  async approve(): Promise<void> {
    await this.page.getByRole('button', { name: this.text('wallet.approve') }).click();
  }

  async cancel(): Promise<void> {
    await this.page.getByRole('button', { name: this.text('wallet.cancel') }).click();
  }
}

export class QrPaymentPage extends BasePage {
  get amount(): Locator {
    return this.page.getByTestId('qr-amount');
  }

  get code(): Locator {
    return this.page.getByRole('img', { name: this.text('qr.image') });
  }

  async confirmPaid(): Promise<void> {
    await this.page.getByRole('button', { name: this.text('qr.paid') }).click();
  }
}
