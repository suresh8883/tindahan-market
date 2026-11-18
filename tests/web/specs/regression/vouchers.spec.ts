import { expect, test } from '@playwright/test';
import { VOUCHERS } from '../../fixtures/vouchers';
import { CartPage } from '../../pages/cart.page';
import { t } from '../../support/i18n';

test.describe('voucher regression', () => {
  test('an unknown code is rejected with a message', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.open({ banig: 1, kendi: 1 });
    await cart.vouchers.apply('NOTREAL');
    await expect(cart.vouchers.error).toHaveText(t('en', 'voucher.reason.UNKNOWN', { code: 'NOTREAL' }));
    await expect(cart.vouchers.discount).toHaveText('₱0.00');
  });

  test('an expired voucher is rejected', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.open({ banig: 1, kendi: 1 });
    await cart.vouchers.apply(VOUCHERS.expired);
    await expect(cart.vouchers.error).toHaveText(t('en', 'voucher.reason.EXPIRED', { code: VOUCHERS.expired }));
  });

  test('removing an applied voucher restores the full total', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.open({ banig: 1, kendi: 1 });
    await cart.vouchers.apply(VOUCHERS.sale1111);
    await expect(cart.vouchers.total).toHaveText('₱899.00');
    await cart.vouchers.applied(VOUCHERS.sale1111).getByRole('button').click();
    await expect(cart.vouchers.total).toHaveText('₱1,099.00');
  });

  test('the discount shows as soon as the voucher is accepted', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.open({ banig: 1, kendi: 1 });
    await cart.vouchers.codeInput.fill(VOUCHERS.sale1111);
    const [response] = await Promise.all([
      page.waitForResponse('**/api/quote'),
      cart.vouchers.applyButton.click(),
    ]);
    expect((await response.json()).applied).toEqual([VOUCHERS.sale1111]);
    expect(await cart.vouchers.discount.textContent()).toBe('-₱200.00');
  });
});
