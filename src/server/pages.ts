import { LOCALES, MESSAGES, t, type Locale, type MessageKey } from '../i18n/catalogue';
import { formatPeso } from '../shared/money';
import { PRODUCTS } from './products';
import type { PaymentMethod } from './vouchers/engine';

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

type PageName = 'catalogue' | 'cart' | 'checkout' | 'wallet' | 'qr' | 'order';

function layout(locale: Locale, page: PageName, title: string, main: string): string {
  const tr = (key: MessageKey) => esc(t(locale, key));
  const productNames = Object.fromEntries(PRODUCTS.map((p) => [p.id, p.name[locale]]));
  const boot = JSON.stringify({ locale, page, messages: MESSAGES[locale], productNames }).replace(/</g, '\\u003c');
  const options = LOCALES.map(
    (l) => `<option value="${l}"${l === locale ? ' selected' : ''}>${tr(`locale.${l}` as MessageKey)}</option>`,
  ).join('');
  return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · ${tr('store.name')}</title>
<link rel="stylesheet" href="/static/styles.css">
</head>
<body>
<header class="site-header">
  <a class="brand" href="/" data-testid="store-brand">${tr('store.name')}</a>
  <nav aria-label="${tr('nav.label')}">
    <a href="/">${tr('nav.catalogue')}</a>
    <a href="/cart">${tr('nav.cart')} <span data-testid="cart-item-count">0</span></a>
  </nav>
  <label class="locale">${tr('locale.label')}
    <select data-testid="locale-switch">${options}</select>
  </label>
</header>
<main>
${main}
</main>
<script>window.TINDAHAN = ${boot};</script>
<script src="/static/app.js"></script>
</body>
</html>`;
}

export function cataloguePage(locale: Locale): string {
  const cards = PRODUCTS.map((p) => {
    const name = p.name[locale];
    return `<li class="card" data-testid="product-card-${p.id}">
  <h2>${esc(name)}</h2>
  <p>${esc(t(locale, 'catalogue.price'))}: <strong data-testid="product-price-${p.id}">${formatPeso(p.priceCentavos)}</strong></p>
  <button type="button" data-add-to-cart="${p.id}" data-testid="add-to-cart-${p.id}">${esc(t(locale, 'product.addToCart', { name }))}</button>
</li>`;
  }).join('\n');
  return layout(
    locale,
    'catalogue',
    t(locale, 'catalogue.heading'),
    `<h1>${esc(t(locale, 'catalogue.heading'))}</h1>
<p role="status" data-testid="catalogue-status"></p>
<ul class="grid" aria-label="${esc(t(locale, 'catalogue.heading'))}">
${cards}
</ul>`,
  );
}

function summaryBlock(locale: Locale): string {
  const row = (key: MessageKey, id: string) =>
    `<div class="row"><dt>${esc(t(locale, key))}</dt><dd data-testid="${id}">${formatPeso(0)}</dd></div>`;
  return `<section aria-labelledby="summary-heading" class="panel" data-quote-region aria-busy="true">
  <h2 id="summary-heading">${esc(t(locale, 'summary.heading'))}</h2>
  <dl>
    ${row('summary.subtotal', 'summary-subtotal')}
    ${row('summary.discount', 'summary-discount')}
    ${row('summary.shipping', 'summary-shipping')}
    ${row('summary.total', 'summary-total')}
  </dl>
</section>`;
}

function voucherBlock(locale: Locale): string {
  return `<section aria-labelledby="voucher-heading" class="panel" data-quote-region aria-busy="true">
  <h2 id="voucher-heading">${esc(t(locale, 'voucher.heading'))}</h2>
  <form data-voucher-form>
    <label for="voucher-code">${esc(t(locale, 'voucher.label'))}</label>
    <input id="voucher-code" data-testid="voucher-input" autocomplete="off">
    <button type="submit" data-testid="voucher-apply">${esc(t(locale, 'voucher.apply'))}</button>
  </form>
  <ul data-testid="voucher-applied-list" aria-label="${esc(t(locale, 'voucher.heading'))}"></ul>
  <p role="status" data-testid="voucher-status"></p>
  <p role="alert" data-testid="voucher-error"></p>
</section>`;
}

export function cartPage(locale: Locale): string {
  return layout(
    locale,
    'cart',
    t(locale, 'cart.heading'),
    `<h1>${esc(t(locale, 'cart.heading'))}</h1>
<p data-testid="cart-empty" hidden>${esc(t(locale, 'cart.empty'))}</p>
<table data-testid="cart-lines">
  <caption class="visually-hidden">${esc(t(locale, 'cart.heading'))}</caption>
  <thead><tr>
    <th scope="col">${esc(t(locale, 'cart.item'))}</th>
    <th scope="col">${esc(t(locale, 'cart.quantity'))}</th>
    <th scope="col">${esc(t(locale, 'cart.lineTotal'))}</th>
    <th scope="col"><span class="visually-hidden">${esc(t(locale, 'cart.removeItem', { name: '' }))}</span></th>
  </tr></thead>
  <tbody></tbody>
</table>
<button type="button" data-clear-cart data-testid="cart-clear">${esc(t(locale, 'cart.clear'))}</button>
${voucherBlock(locale)}
${summaryBlock(locale)}
<a class="cta" href="/checkout" role="button" data-testid="proceed-to-checkout">${esc(t(locale, 'cart.checkout'))}</a>`,
  );
}

export function checkoutPage(locale: Locale, walletCancelled: boolean): string {
  const payments: PaymentMethod[] = ['cod', 'wallet', 'qr'];
  const radios = payments
    .map(
      (m) => `<label><input type="radio" name="payment" value="${m}" data-testid="payment-${m}"> ${esc(
        t(locale, `payment.${m}` as MessageKey),
      )}</label>`,
    )
    .join('\n    ');
  const field = (id: string, key: MessageKey, type = 'text') =>
    `<label for="${id}">${esc(t(locale, key))}</label><input id="${id}" name="${id}" type="${type}" data-testid="checkout-${id}" required>`;
  return layout(
    locale,
    'checkout',
    t(locale, 'checkout.heading'),
    `<h1>${esc(t(locale, 'checkout.heading'))}</h1>
${walletCancelled ? `<p role="alert" data-testid="payment-cancelled">${esc(t(locale, 'checkout.walletCancelled'))}</p>` : ''}
<form data-checkout-form novalidate class="panel">
  ${field('name', 'checkout.name')}
  ${field('mobile', 'checkout.mobile', 'tel')}
  ${field('address', 'checkout.address')}
  <fieldset data-testid="payment-options">
    <legend>${esc(t(locale, 'checkout.paymentLegend'))}</legend>
    ${radios}
  </fieldset>
  <p role="alert" data-testid="checkout-error"></p>
  <button type="submit" data-testid="place-order">${esc(t(locale, 'checkout.placeOrder'))}</button>
</form>
${voucherBlock(locale)}
${summaryBlock(locale)}`,
  );
}

export function walletPage(locale: Locale, ref: string, amount: number, signature: string): string {
  const callback = (status: string) =>
    `/api/pay/wallet/callback?${new URLSearchParams({ ref, status, sig: signature })}`;
  return layout(
    locale,
    'wallet',
    t(locale, 'wallet.heading'),
    `<h1>${esc(t(locale, 'wallet.heading'))}</h1>
<p>${esc(t(locale, 'wallet.amount'))}: <strong data-testid="wallet-amount">${formatPeso(amount)}</strong></p>
<p><a role="button" class="cta" href="${esc(callback('approved'))}" data-testid="wallet-approve">${esc(t(locale, 'wallet.approve'))}</a>
<a role="button" class="cta secondary" href="${esc(callback('cancelled'))}" data-testid="wallet-cancel">${esc(t(locale, 'wallet.cancel'))}</a></p>`,
  );
}

export function qrPage(locale: Locale, ref: string, amount: number): string {
  const params = new URLSearchParams({ ref, status: 'paid' });
  return layout(
    locale,
    'qr',
    t(locale, 'qr.heading'),
    `<h1>${esc(t(locale, 'qr.heading'))}</h1>
<svg role="img" aria-label="${esc(t(locale, 'qr.image'))}" data-testid="qr-image" viewBox="0 0 8 8" width="160" height="160">
  <rect width="8" height="8" fill="#fff"/><path d="M1 1h2v2H1zM5 1h2v2H5zM1 5h2v2H1zM4 4h1v1H4zM5 5h2v1H5zM6 6h1v1H6z"/>
</svg>
<p>${esc(t(locale, 'qr.amount'))}: <strong data-testid="qr-amount">${formatPeso(amount)}</strong></p>
<a role="button" class="cta" href="/order/confirmation?${esc(params.toString())}" data-testid="qr-paid">${esc(t(locale, 'qr.paid'))}</a>`,
  );
}

export function confirmationPage(locale: Locale): string {
  const row = (key: MessageKey, id: string) =>
    `<div class="row"><dt>${esc(t(locale, key))}</dt><dd data-testid="${id}"></dd></div>`;
  return layout(
    locale,
    'order',
    t(locale, 'order.heading'),
    `<h1>${esc(t(locale, 'order.heading'))}</h1>
<dl class="panel">
  ${row('order.ref', 'order-ref')}
  ${row('order.total', 'order-total')}
  ${row('order.status', 'order-status')}
</dl>
<p role="status" data-testid="loyalty-points">${esc(t(locale, 'loyalty.pending'))}</p>`,
  );
}
