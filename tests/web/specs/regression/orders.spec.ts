import { expect, test } from '@playwright/test';
import { CUSTOMERS } from '../../fixtures/customers';
import { CartPage } from '../../pages/cart.page';
import { CheckoutPage } from '../../pages/checkout.page';
import { OrderPage } from '../../pages/order.page';
import { t } from '../../support/i18n';

async function placeCodOrder(page: import('@playwright/test').Page): Promise<OrderPage> {
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);
  await cart.open({ walis: 1 });
  await cart.proceedToCheckout();
  await checkout.fillCustomer(CUSTOMERS.quezonCity);
  await checkout.choosePayment('cod');
  await checkout.placeOrder();
  return new OrderPage(page);
}

test.describe('order confirmation regression', () => {
  test('confirmation shows an order reference', async ({ page }) => {
    const order = await placeCodOrder(page);
    await expect(order.reference).toHaveText(/^TM-[0-9A-F]{8}$/);
    await expect(order.total).toHaveText('₱148.00');
  });

  test('confirmation shows the loyalty points earned', async ({ page }) => {
    const order = await placeCodOrder(page);
    await expect(order.total).toHaveText('₱148.00');
    expect(await order.loyaltyPoints.textContent()).toBe(t('en', 'loyalty.earned', { points: 1 }));
  });
});
