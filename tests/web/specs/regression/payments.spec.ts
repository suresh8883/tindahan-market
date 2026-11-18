import { expect, test } from '@playwright/test';
import { CUSTOMERS } from '../../fixtures/customers';
import { CartPage } from '../../pages/cart.page';
import { CheckoutPage } from '../../pages/checkout.page';
import { OrderPage } from '../../pages/order.page';
import { MockWalletPage, QrPaymentPage } from '../../pages/payment.pages';
import { t } from '../../support/i18n';
import { walletSandboxToken } from '../../support/wallet-sandbox';

test.describe('payments regression', () => {
  test('e-wallet approval returns to a paid order', async ({ page }) => {
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const wallet = new MockWalletPage(page);
    const order = new OrderPage(page);
    await cart.open({ kape: 1 });
    await cart.proceedToCheckout();
    await checkout.fillCustomer(CUSTOMERS.cebu);
    await checkout.choosePayment('wallet');
    await checkout.placeOrder();
    await expect(wallet.amount).toHaveText('₱349.00');
    await wallet.approve();
    await expect(order.status).toHaveText(t('en', 'order.status.paid'));
    await expect(order.total).toHaveText('₱349.00');
  });

  test('e-wallet cancellation returns to checkout without charging', async ({ page }) => {
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const wallet = new MockWalletPage(page);
    await cart.open({ kape: 1 });
    await cart.proceedToCheckout();
    await checkout.fillCustomer(CUSTOMERS.cebu);
    await checkout.choosePayment('wallet');
    await checkout.placeOrder();
    await wallet.cancel();
    await expect(page.getByTestId('payment-cancelled')).toHaveText(t('en', 'checkout.walletCancelled'));
  });

  test('QR Ph asks for the full order total', async ({ page }) => {
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const qr = new QrPaymentPage(page);
    await cart.open({ walis: 1 });
    await cart.proceedToCheckout();
    await checkout.fillCustomer(CUSTOMERS.quezonCity);
    await checkout.choosePayment('qr');
    await expect(checkout.vouchers.total).toHaveText('₱148.00');
    await checkout.placeOrder();
    await expect(qr.amount).toHaveText('₱148.00');
  });

  test('wallet sandbox pre-authorises a payment', async ({ request }) => {
    const response = await request.post('/api/wallet/sandbox/preauth', {
      headers: { authorization: `Bearer ${walletSandboxToken()}` },
    });
    console.log(`wallet sandbox preauth: HTTP ${response.status()} ${await response.text()}`);
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ status: 'authorised' });
  });
});
