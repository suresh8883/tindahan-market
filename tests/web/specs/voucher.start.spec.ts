import { expect, test } from '@playwright/test';
import { VOUCHERS } from '../fixtures/vouchers';
import { CartPage } from '../pages/cart.page';
import { t } from '../support/i18n';

test.describe('SALE1111 voucher', () => {
  test.describe('minimum spend', () => {
    test('₱999 is below the minimum, so the voucher is rejected', async ({ page }) => {
      const cart = new CartPage(page);
      await cart.open({ banig: 1 });
      await cart.vouchers.apply(VOUCHERS.sale1111);
      await expect(cart.vouchers.discount).toHaveText('₱0.00');
      await expect(cart.vouchers.error).toHaveText(
        t('en', 'voucher.reason.BELOW_MINIMUM', { code: VOUCHERS.sale1111 }),
      );
    });

    test('₱1,000 is exactly the minimum, so 20% comes off', async ({ page }) => {
      const cart = new CartPage(page);
      await cart.open({ banig: 1, kendi: 1 });
      await cart.vouchers.apply(VOUCHERS.sale1111);
      await expect(cart.vouchers.discount).toHaveText('-₱200.00');
      await expect(cart.vouchers.total).toHaveText('₱899.00');
    });

    test('₱1,001 is above the minimum, so 20% comes off', async ({ page }) => {
      const cart = new CartPage(page);
      await cart.open({ banig: 1, kendi: 2 });
      await cart.vouchers.apply(VOUCHERS.sale1111);
      await expect(cart.vouchers.discount).toHaveText('-₱200.20');
      await expect(cart.vouchers.total).toHaveText('₱899.80');
    });
  });

  // TODO: cap tests. The discount is capped at ₱500.

  // TODO: stacking tests. Only one money-off voucher per order; check the free-shipping conflict too.
});
