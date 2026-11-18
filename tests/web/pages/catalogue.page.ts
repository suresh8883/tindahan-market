import type { Locator } from '@playwright/test';
import { productName, type ProductId } from '../fixtures/catalogue';
import { BasePage } from './base.page';

export class CataloguePage extends BasePage {
  async goto(): Promise<void> {
    await this.page.goto(this.withLocale('/'));
  }

  price(id: ProductId): Locator {
    return this.page.getByTestId(`product-price-${id}`);
  }

  addButton(id: ProductId): Locator {
    return this.page.getByRole('button', {
      name: this.text('product.addToCart', { name: productName(id, this.locale) }),
    });
  }

  async add(id: ProductId, times = 1): Promise<void> {
    for (let i = 0; i < times; i++) await this.addButton(id).click();
  }

  async openCart(): Promise<void> {
    await this.page.getByRole('link', { name: this.text('nav.cart') }).click();
  }
}
