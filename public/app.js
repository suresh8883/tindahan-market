/* Tindahan Market browser code. The cart lives in localStorage; the server prices every quote. */
(function () {
  'use strict';

  var boot = window.TINDAHAN;
  var CART_KEY = 'tindahan.cart';
  var ORDER_KEY = 'tindahan.lastOrder';
  var CLOCK_KEY = 'tindahan.now';
  var RENDER_BATCH_MS = 12;
  var LOYALTY_DELAY_MS = 1500;

  function tr(key, params) {
    return boot.messages[key].replace(/\{(\w+)\}/g, function (_, name) {
      return params && params[name] !== undefined ? String(params[name]) : '{' + name + '}';
    });
  }

  function byTestId(id) {
    return document.querySelector('[data-testid="' + id + '"]');
  }

  function peso(centavos) {
    var pesos = Math.floor(centavos / 100).toLocaleString('en-US');
    return '₱' + pesos + '.' + String(centavos % 100).padStart(2, '0');
  }

  function loadCart() {
    try {
      var stored = JSON.parse(localStorage.getItem(CART_KEY));
      if (stored && stored.items) return stored;
    } catch (e) {
      /* fall through to an empty cart */
    }
    return { items: {}, vouchers: [] };
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateHeaderCount(cart);
  }

  function updateHeaderCount(cart) {
    var count = Object.keys(cart.items).reduce(function (sum, id) {
      return sum + cart.items[id];
    }, 0);
    byTestId('header-cart-count').textContent = String(count);
  }

  /* Deep links: /cart?items=banig:1,kendi:2&vouchers=SALE1111&now=<ISO date-time> */
  function applyDeepLink() {
    var params = new URLSearchParams(location.search);
    var changed = false;
    if (params.has('items')) {
      var items = {};
      params
        .get('items')
        .split(',')
        .filter(Boolean)
        .forEach(function (pair) {
          var parts = pair.split(':');
          items[parts[0]] = Number(parts[1] || 1);
        });
      saveCart({ items: items, vouchers: [] });
      changed = true;
    }
    if (params.has('vouchers')) {
      var cart = loadCart();
      cart.vouchers = params.get('vouchers').split(',').filter(Boolean);
      saveCart(cart);
      changed = true;
    }
    if (params.has('now')) {
      sessionStorage.setItem(CLOCK_KEY, params.get('now'));
      changed = true;
    }
    if (changed) {
      ['items', 'vouchers', 'now'].forEach(function (name) {
        params.delete(name);
      });
      var query = params.toString();
      history.replaceState(null, '', location.pathname + (query ? '?' + query : ''));
    }
  }

  function selectedPayment() {
    var radio = document.querySelector('input[name="payment"]:checked');
    return radio ? radio.value : null;
  }

  function requestBody(cart) {
    var body = { items: cart.items, vouchers: cart.vouchers, payment: selectedPayment() };
    var now = sessionStorage.getItem(CLOCK_KEY);
    if (now) body.now = now;
    return body;
  }

  function postJson(url, body) {
    return fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }).then(function (res) {
      return res.json();
    });
  }

  /* ---- quote and summary, shared by cart and checkout ---- */

  var quoteSeq = 0;

  function setBusy(busy) {
    document.querySelectorAll('[data-quote-region]').forEach(function (region) {
      region.setAttribute('aria-busy', busy ? 'true' : 'false');
    });
  }

  function refreshQuote(justEntered) {
    var cart = loadCart();
    var seq = ++quoteSeq;
    setBusy(true);
    return postJson('/api/quote', requestBody(cart)).then(function (quote) {
      if (seq !== quoteSeq) return;
      cart.vouchers = quote.applied;
      saveCart(cart);
      setTimeout(function () {
        if (seq === quoteSeq) renderQuote(quote, justEntered);
      }, Math.random() * RENDER_BATCH_MS);
    });
  }

  function renderQuote(quote, justEntered) {
    byTestId('summary-subtotal').textContent = peso(quote.subtotalCentavos);
    byTestId('summary-discount').textContent =
      quote.discountCentavos > 0 ? '-' + peso(quote.discountCentavos) : peso(0);
    byTestId('summary-shipping').textContent = peso(quote.shippingCentavos);
    byTestId('summary-total').textContent = peso(quote.totalCentavos);
    renderVouchers(quote, justEntered);
    if (boot.page === 'cart') renderLines(quote);
    setBusy(false);
  }

  function renderVouchers(quote, justEntered) {
    var list = byTestId('voucher-applied-list');
    list.textContent = '';
    quote.applied.forEach(function (code) {
      var li = document.createElement('li');
      li.textContent = code + ' ';
      li.setAttribute('data-testid', 'voucher-applied-' + code);
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = tr('voucher.remove', { code: code });
      button.addEventListener('click', function () {
        var cart = loadCart();
        cart.vouchers = cart.vouchers.filter(function (c) {
          return c !== code;
        });
        saveCart(cart);
        byTestId('voucher-status').textContent = '';
        refreshQuote();
      });
      li.appendChild(button);
      list.appendChild(li);
    });
    byTestId('voucher-status').textContent =
      justEntered && quote.applied.indexOf(justEntered) !== -1 ? tr('voucher.applied', { code: justEntered }) : '';
    byTestId('voucher-error').textContent = quote.rejected
      .map(function (r) {
        return tr('voucher.reason.' + r.reason, { code: r.code });
      })
      .join(' ');
  }

  function renderLines(quote) {
    var body = document.querySelector('[data-testid="cart-lines"] tbody');
    body.textContent = '';
    byTestId('cart-empty').hidden = quote.lines.length > 0;
    quote.lines.forEach(function (line) {
      var name = boot.productNames[line.productId];
      var row = document.createElement('tr');
      row.setAttribute('data-testid', 'cart-line-' + line.productId);

      var nameCell = document.createElement('th');
      nameCell.scope = 'row';
      nameCell.textContent = name;

      var qtyCell = document.createElement('td');
      var qty = document.createElement('input');
      qty.type = 'number';
      qty.min = '0';
      qty.value = String(line.quantity);
      qty.setAttribute('aria-label', tr('cart.quantityOf', { name: name }));
      qty.setAttribute('data-testid', 'cart-qty-' + line.productId);
      qty.addEventListener('change', function () {
        var cart = loadCart();
        var value = Math.floor(Number(qty.value));
        if (value > 0) cart.items[line.productId] = value;
        else delete cart.items[line.productId];
        saveCart(cart);
        refreshQuote();
      });
      qtyCell.appendChild(qty);

      var totalCell = document.createElement('td');
      totalCell.textContent = peso(line.lineCentavos);
      totalCell.setAttribute('data-testid', 'cart-line-total-' + line.productId);

      var removeCell = document.createElement('td');
      var remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = tr('cart.removeItem', { name: name });
      remove.addEventListener('click', function () {
        var cart = loadCart();
        delete cart.items[line.productId];
        saveCart(cart);
        refreshQuote();
      });
      removeCell.appendChild(remove);

      row.appendChild(nameCell);
      row.appendChild(qtyCell);
      row.appendChild(totalCell);
      row.appendChild(removeCell);
      body.appendChild(row);
    });
  }

  function wireVoucherForm() {
    var form = document.querySelector('[data-voucher-form]');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = byTestId('voucher-input');
      var code = input.value.trim().toUpperCase();
      if (!code) return;
      var cart = loadCart();
      cart.vouchers.push(code);
      saveCart(cart);
      input.value = '';
      refreshQuote(code);
    });
  }

  /* ---- pages ---- */

  function initCatalogue() {
    document.querySelectorAll('[data-add-to-cart]').forEach(function (button) {
      button.addEventListener('click', function () {
        var id = button.getAttribute('data-add-to-cart');
        var cart = loadCart();
        cart.items[id] = (cart.items[id] || 0) + 1;
        saveCart(cart);
        byTestId('catalogue-status').textContent = tr('product.added', { name: boot.productNames[id] });
      });
    });
  }

  function initCart() {
    wireVoucherForm();
    document.querySelector('[data-clear-cart]').addEventListener('click', function () {
      saveCart({ items: {}, vouchers: [] });
      byTestId('voucher-status').textContent = '';
      refreshQuote();
    });
    refreshQuote();
  }

  function initCheckout() {
    wireVoucherForm();
    document.querySelectorAll('input[name="payment"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        refreshQuote();
      });
    });
    document.querySelector('[data-checkout-form]').addEventListener('submit', function (event) {
      event.preventDefault();
      var form = event.target;
      var payment = selectedPayment();
      if (!form.checkValidity() || !payment) {
        byTestId('checkout-error').textContent = tr('checkout.missingDetails');
        return;
      }
      byTestId('checkout-error').textContent = '';
      var body = requestBody(loadCart());
      body.customer = { name: form.name.value, mobile: form.mobile.value, address: form.address.value };
      postJson('/api/orders', body).then(function (order) {
        localStorage.setItem(
          ORDER_KEY,
          JSON.stringify({ ref: order.ref, payment: order.payment, totalCentavos: order.quote.totalCentavos }),
        );
        location.assign(order.next);
      });
    });
    refreshQuote();
  }

  function initOrder() {
    var order = JSON.parse(localStorage.getItem(ORDER_KEY) || 'null');
    if (!order) return;
    var paid = new URLSearchParams(location.search).get('status') === 'paid';
    byTestId('order-ref').textContent = order.ref;
    byTestId('order-total').textContent = peso(order.totalCentavos);
    byTestId('order-status').textContent = tr(paid ? 'order.status.paid' : 'order.status.cod');
    saveCart({ items: {}, vouchers: [] });
    setTimeout(function () {
      byTestId('loyalty-points').textContent = tr('loyalty.earned', {
        points: Math.floor(order.totalCentavos / 10000),
      });
    }, LOYALTY_DELAY_MS);
  }

  /* ---- start ---- */

  byTestId('locale-switch').addEventListener('change', function (event) {
    var url = new URL(location.href);
    url.searchParams.set('lang', event.target.value);
    location.assign(url.toString());
  });

  applyDeepLink();
  updateHeaderCount(loadCart());

  var starters = { catalogue: initCatalogue, cart: initCart, checkout: initCheckout, order: initOrder };
  if (starters[boot.page]) starters[boot.page]();
})();
