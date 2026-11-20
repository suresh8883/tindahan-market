# Tindahan Market Android app: Cart, Vouchers and Checkout

**Product requirements document TM-PRD-12 · version 1.0 · status: approved for the 11.11 release**
Owner: Product, Tindahan Market · Stories: TM-401 catalogue and cart (app) · TM-405 vouchers (app) · TM-411 checkout and payment (app) · TM-420 order confirmation (app)

## 1. Background and goal

Tindahan Market is a small Philippine store priced in pesos. The Android app "Tindahan Market" 1.0 brings the 11.11 campaign vouchers to phones and must let a shopper go from the catalogue to a confirmed order without help. QA treats this document as the single source of requirements for the app release.

## 2. Scope

In scope: the Android app screens Catalogue, Your cart, Checkout, Pay with QR Ph and Order confirmed, including vouchers and payment.

Out of scope: customer accounts and login, order history, returns and refunds, real payments (QR Ph is a mock payment screen), network and server, iOS.

## 3. Users

- **Shopper:** buys one to ten of an item and may hold one or two voucher codes from the 11.11 campaign.
- **Support agent:** reads an order confirmation to answer "what did I pay, and how?".

## 4. Catalogue and cart (TM-401)

| # | Requirement |
| --- | --- |
| 4.1 | The app opens on the catalogue, titled "Tindahan Market". It lists all 7 products, each with its name, price and an "Add" button. Prices are fixed (price list below). |
| 4.2 | Tapping "Add" raises that product's quantity by 1 and shows the toast "<name> added to cart". The "Cart (N)" button at the top right shows the total quantity in the cart. |
| 4.3 | Quantity per product is 1 to 10. At 10, "Add" shows the toast "Maximum 10 per item" and the quantity stays 10. |
| 4.4 | The cart, titled "Your cart", shows each line with name, quantity, "−", "+", line total and "Remove". "−" at quantity 1 removes the line. |
| 4.5 | An empty cart shows "Your cart is empty" and "Continue shopping"; "Checkout" is hidden. |
| 4.6 | The cart summary shows subtotal, discount, shipping and total. Money is shown with the peso sign, thousands comma and two decimals, for example ₱1,250.00. Discount shows as −₱100.00, or ₱0.00 when none. |
| 4.7 | Subtotal = Σ price × quantity. Shipping is ₱99.00 per order (₱0.00 with `LIBRESHIP`, ₱0.00 when the cart is empty). Total = subtotal − discount + shipping. |
| 4.8 | The store clock is fixed at 10 Nov 2026, 8:00 PM (UTC+8), the evening before 11.11. The catalogue shows "Store time: 10 Nov 2026, 8:00 PM" at the bottom. Device time is never used. |
| 4.9 | Everything is held in memory. Closing the app empties the cart. System Back goes to the previous screen. |

**Price list for the 11.11 release**

| Product | Id | Price |
| --- | --- | --- |
| Barong Tagalog | `barong` | ₱2,500.00 |
| Banig Woven Mat | `banig` | ₱999.00 |
| Barako Coffee 250g | `kape` | ₱250.00 |
| Rubber Slippers | `tsinelas` | ₱199.00 |
| Dried Mango Pack | `mangga` | ₱149.00 |
| Walis Tingting | `walis` | ₱49.00 |
| Kendi (1 piece) | `kendi` | ₱1.00 |

## 5. Vouchers (TM-405)

| # | Requirement |
| --- | --- |
| 5.1 | The cart has one "Voucher code" field and an "Apply" button. Codes are not case-sensitive and are trimmed. Success shows "Voucher <CODE> applied"; each applied code is listed with its own "Remove". |
| 5.2 | Empty input shows "Enter a voucher code". An unknown code shows "Unknown voucher code" and changes no amount. Applying a code twice shows "<CODE> is already applied". |
| 5.3 | Only one money-off voucher per order: the first wins, a later one shows "Only one money-off voucher per order". |
| 5.4 | `SALE1111`: money-off, 20% of the subtotal, computed in centavos and rounded half up. Minimum subtotal ₱1,000.00, below it: "SALE1111 needs a subtotal of at least ₱1,000.00". Discount capped at ₱500.00. Valid until 11 Nov 2026 23:59:59 (UTC+8), so it is valid at the fixed store clock. |
| 5.5 | `SALE1111` and `LIBRESHIP` cannot be combined, in either order: "SALE1111 cannot be combined with LIBRESHIP". |
| 5.6 | `PESO100`: money-off, ₱100.00 off, minimum subtotal ₱500.00; below it: "PESO100 needs a subtotal of at least ₱500.00". |
| 5.7 | `LIBRESHIP`: free shipping. May join `PESO100`, not `SALE1111`. |
| 5.8 | `SALE1010`: expired. Entering it shows "This voucher has expired". |
| 5.9 | If a cart change drops the subtotal below an applied voucher's minimum, the voucher is removed with "<CODE> was removed: minimum spend not reached". |
| 5.10 | Removing a voucher restores every amount. |

## 6. Checkout and payment (TM-411)

| # | Requirement |
| --- | --- |
| 6.1 | "Checkout" opens the Checkout screen with "Full name", "Mobile number" and "Delivery address", and a payment choice: "Cash on delivery" (selected by default) or "QR Ph". |
| 6.2 | The screen shows "Total to pay: ₱X", equal to the cart total. |
| 6.3 | Inline errors stay hidden until "Place order": "Enter your full name", "Enter a mobile number like 09171234567", "Enter your delivery address". A field error blocks the order. |
| 6.4 | A valid mobile number is exactly 11 digits starting with 09. |
| 6.5 | `SALE1111` with cash on delivery when the subtotal is above ₱3,000.00 blocks "Place order" with "SALE1111 cannot be used with cash on delivery above ₱3,000.00". |
| 6.6 | Cash on delivery: "Place order" confirms the order at once. |
| 6.7 | QR Ph: "Place order" opens "Pay with QR Ph" with a QR-style code, "Amount to pay: ₱X", "I have paid" and "Cancel". "I have paid" confirms the order; "Cancel" returns to Checkout and places no order. |
| 6.8 | Every payment method charges exactly the cart total, including shipping, to the centavo. |

## 7. Order confirmation (TM-420)

| # | Requirement |
| --- | --- |
| 7.1 | The "Order confirmed" screen shows the order reference "TM-" followed by 8 uppercase hex characters, "Total: ₱X" and the payment status: "Payment due on delivery" (cash on delivery) or "Paid" (QR Ph). |
| 7.2 | The reference is derived from the order's lines, vouchers, payment method, name, mobile and address. The same order always gets the same reference. Nothing is random. |
| 7.3 | "Start a new order" empties the cart and vouchers and returns to the catalogue. |

## 8. Non-functional

- Native Android app, package `ph.tindahan.market`, version 1.0. Android 7.0 or later.
- Deterministic: no network, no login, no database, no randomness in prices or references, fixed store clock.
- **Testability:** every interactive element has a stable Android resource id, `ph.tindahan.market:id/<id>`. Add, "−", "+" and Remove buttons carry content descriptions with the product or code ("Add <product name>", "Decrease <name>", "Increase <name>", "Remove <name>", "Remove voucher <CODE>").

| Screen | Resource ids |
| --- | --- |
| Catalogue | `cart_button`, `product_name`, `product_price`, `add_button`, `store_time` |
| Your cart | `cart_empty`, `continue_shopping`, `line_name`, `line_qty`, `qty_minus`, `qty_plus`, `line_total`, `line_remove`, `voucher_input`, `voucher_apply`, `voucher_message`, `applied_voucher`, `voucher_remove`, `summary_subtotal`, `summary_discount`, `summary_shipping`, `summary_total`, `checkout_button` |
| Checkout | `input_name`, `input_mobile`, `input_address`, `error_name`, `error_mobile`, `error_address`, `pay_cod`, `pay_qrph`, `checkout_total`, `checkout_message`, `place_order` |
| Pay with QR Ph | `qr_image`, `qr_amount`, `qr_paid`, `qr_cancel` |
| Order confirmed | `order_reference`, `order_total`, `payment_status`, `new_order` |

## 9. Acceptance criteria used by QA

| AC | Check |
| --- | --- |
| AC-1 | A cash-on-delivery order of 1 × Barako Coffee 250g totals ₱349.00 (₱250.00 + ₱99.00 shipping); the confirmation shows "Total: ₱349.00" and "Payment due on delivery". |
| AC-2 | `SALE1111` on 1 × Banig Woven Mat (subtotal ₱999.00) shows "SALE1111 needs a subtotal of at least ₱1,000.00"; discount stays ₱0.00 and the total stays ₱1,098.00. |
| AC-3 | `SALE1111` on 1 × Barong Tagalog (subtotal ₱2,500.00) discounts −₱500.00 (20%, exactly the cap); total ₱2,099.00. |
| AC-4 | `SALE1111` on 1 × Barong Tagalog + 1 × Kendi (subtotal ₱2,501.00) discounts −₱500.00 (the cap), not −₱500.20; total ₱2,100.00. |
| AC-5 | On 1 × Barong Tagalog, `PESO100` then `SALE1111`: the second shows "Only one money-off voucher per order"; discount stays −₱100.00, total ₱2,499.00. |
| AC-6 | `LIBRESHIP` with `PESO100` on 1 × Banig Woven Mat (₱999.00): discount −₱100.00, shipping ₱0.00, total ₱899.00. |
| AC-7 | On 1 × Barong Tagalog, `SALE1111` then `LIBRESHIP` (total stays ₱2,099.00) and `LIBRESHIP` then `SALE1111` (total stays ₱2,500.00): the second code shows "SALE1111 cannot be combined with LIBRESHIP". |
| AC-8 | A QR Ph order of 2 × Rubber Slippers shows "Amount to pay: ₱497.00" (₱398.00 + ₱99.00 shipping), equal to "Total to pay: ₱497.00"; after "I have paid" the confirmation shows "Total: ₱497.00" and "Paid". |
| AC-9 | Tapping "Add" on Walis Tingting 11 times: the 11th shows "Maximum 10 per item"; the cart shows quantity 10, line total ₱490.00, and the button reads "Cart (10)". |
| AC-10 | `SALE1111` on 1 × Banig Woven Mat + 1 × Kendi (₱1,000.00) discounts −₱200.00, total ₱899.00. Removing Kendi shows "SALE1111 was removed: minimum spend not reached"; discount ₱0.00, total ₱1,098.00. |
| AC-11 | "Place order" with all fields empty shows the three inline errors and places no order; mobile 0917123456 (10 digits) or 08171234567 (not 09) shows "Enter a mobile number like 09171234567". |
| AC-12 | The reference is "TM-" plus 8 uppercase hex characters, and placing the same order again (same lines, vouchers, payment, name, mobile, address) gives the same reference. |
