import { expect, test } from '@playwright/test';
import { CartPage } from '../../pages/cart.page';
import { t } from '../../support/i18n';

test.describe('cart regression', () => {
  test('changing a quantity reprices the line and the subtotal', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.open({ kape: 1 });
    await cart.setQuantity('kape', 3);
    await expect(cart.lineTotal('kape')).toHaveText('₱750.00');
    await expect(cart.vouchers.subtotal).toHaveText('₱750.00');
  });

  test('removing the only item empties the cart and drops shipping', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.open({ walis: 1 });
    await cart.removeItem('walis');
    await expect(cart.emptyMessage).toHaveText(t('en', 'cart.empty'));
    await expect(cart.vouchers.total).toHaveText('₱0.00');
  });

  test('emptying the cart removes every line', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.open({ kape: 2, walis: 1 });
    await cart.clearCart();
    await expect(cart.vouchers.subtotal).toHaveText('₱0.00');
  });

  test('the header count follows the cart', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.open({ kape: 2, walis: 1 });
    await expect(cart.itemCount).toHaveText('3');
  });
});
