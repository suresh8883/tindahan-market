import type { Locator, Page } from '@playwright/test';
import { t, type Locale, type MessageKey } from '../support/i18n';

export abstract class BasePage {
  constructor(
    protected readonly page: Page,
    protected readonly locale: Locale = 'en',
  ) {}

  protected text(key: MessageKey, params?: Record<string, string | number>): string {
    return t(this.locale, key, params);
  }

  protected withLocale(path: string): string {
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}lang=${this.locale}`;
  }

  get localeSwitch(): Locator {
    return this.page.getByTestId('locale-switch');
  }

  get cartCount(): Locator {
    return this.page.getByTestId('cart-item-count');
  }

  get heading(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }
}
