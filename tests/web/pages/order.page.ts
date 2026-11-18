import type { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class OrderPage extends BasePage {
  get reference(): Locator {
    return this.page.getByTestId('order-ref');
  }

  get total(): Locator {
    return this.page.getByTestId('order-total');
  }

  get status(): Locator {
    return this.page.getByTestId('order-status');
  }

  get loyaltyPoints(): Locator {
    return this.page.getByTestId('loyalty-points');
  }
}
