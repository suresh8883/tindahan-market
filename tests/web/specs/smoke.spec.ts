import { expect, test } from '@playwright/test';
import { CUSTOMERS } from '../fixtures/customers';
import { CartPage } from '../pages/cart.page';
import { CataloguePage } from '../pages/catalogue.page';
import { CheckoutPage } from '../pages/checkout.page';
import { OrderPage } from '../pages/order.page';
import { t } from '../support/i18n';

test.describe('smoke', () => {
  test('catalogue lists a product at its peso price', async ({ page }) => {
    const catalogue = new CataloguePage(page);
    await catalogue.goto();
    await expect(catalogue.price('banig')).toHaveText('₱999.00');
    await expect(catalogue.price('barong')).toHaveText('₱2,500.00');
  });

  test('adding to the cart prices the order with shipping', async ({ page }) => {
    const catalogue = new CataloguePage(page);
    const cart = new CartPage(page);
    await catalogue.goto();
    await catalogue.add('kape', 2);
    await expect(catalogue.cartCount).toHaveText('2');
    await catalogue.openCart();
    await expect(cart.lineTotal('kape')).toHaveText('₱500.00');
    await expect(cart.vouchers.subtotal).toHaveText('₱500.00');
    await expect(cart.vouchers.shipping).toHaveText('₱99.00');
    await expect(cart.vouchers.total).toHaveText('₱599.00');
  });

  test('cash on delivery order is confirmed with its total', async ({ page }) => {
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const order = new OrderPage(page);
    await cart.open({ walis: 1 });
    await cart.proceedToCheckout();
    await checkout.fillCustomer(CUSTOMERS.quezonCity);
    await checkout.choosePayment('cod');
    await checkout.placeOrder();
    await expect(order.total).toHaveText('₱148.00');
    await expect(order.status).toHaveText(t('en', 'order.status.cod'));
  });

  test('the Filipino locale switch translates the store', async ({ page }) => {
    const english = new CataloguePage(page, 'en');
    await english.goto();
    await english.localeSwitch.selectOption('fil');
    const filipino = new CataloguePage(page, 'fil');
    await expect(filipino.heading).toHaveText(t('fil', 'catalogue.heading'));
    await expect(filipino.addButton('banig')).toBeVisible();
  });
});
